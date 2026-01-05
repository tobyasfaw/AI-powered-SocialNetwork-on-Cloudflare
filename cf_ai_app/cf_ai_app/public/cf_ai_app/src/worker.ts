export interface Env {
  AI: Ai;
  CHAT_SESSION: DurableObjectNamespace;
  ASSETS: Fetcher;
}

interface ChatRequest {
  message: string;
  sessionId?: string;
}

const DEFAULT_SESSION = "default";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      const body = (await request.json()) as ChatRequest;
      const sessionId = body.sessionId?.trim() || DEFAULT_SESSION;
      const id = env.CHAT_SESSION.idFromName(sessionId);
      const stub = env.CHAT_SESSION.get(id);

      return stub.fetch("https://chat.session/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: body.message })
      });
    }

    if (url.pathname === "/api/reset" && request.method === "POST") {
      const body = (await request.json()) as { sessionId?: string };
      const sessionId = body.sessionId?.trim() || DEFAULT_SESSION;
      const id = env.CHAT_SESSION.idFromName(sessionId);
      const stub = env.CHAT_SESSION.get(id);

      return stub.fetch("https://chat.session/reset", { method: "POST" });
    }

    return env.ASSETS.fetch(request);
  }
};

export class ChatSession {
  private state: DurableObjectState;
  private env: Env;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/chat" && request.method === "POST") {
      const body = (await request.json()) as { message: string };
      const history = (await this.state.storage.get<ChatMessage[]>("history")) ?? [];
      const userMessage: ChatMessage = { role: "user", content: body.message };
      const messages: ChatMessage[] = [
        {
          role: "system",
          content:
            "You are a friendly assistant for the SocialNetwork Qt app. Help users with profile ideas, privacy settings, searching, and friend suggestions. Keep responses concise and suggest next steps."
        },
        ...history,
        userMessage
      ];

      const aiResponse = await this.env.AI.run("@cf/meta/llama-3.3-70b-instruct", {
        messages
      });

      const reply = typeof aiResponse === "string" ? aiResponse : aiResponse.response;
      const assistantMessage: ChatMessage = { role: "assistant", content: reply };

      const updatedHistory = [...history, userMessage, assistantMessage].slice(-20);
      await this.state.storage.put("history", updatedHistory);

      return Response.json({ reply, history: updatedHistory });
    }

    if (url.pathname === "/reset" && request.method === "POST") {
      await this.state.storage.delete("history");
      return Response.json({ ok: true });
    }

    if (url.pathname === "/history" && request.method === "GET") {
      const history = (await this.state.storage.get<ChatMessage[]>("history")) ?? [];
      return Response.json({ history });
    }

    return new Response("Not found", { status: 404 });
  }
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}
