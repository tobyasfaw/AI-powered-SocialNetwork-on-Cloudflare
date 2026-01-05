#include <QApplication>
#include "window.h"
#include "network.h"

int main(int argc, char *argv[]) {
    QApplication app(argc, argv);

    //Network network;  // Create a Network instance
    //network.readUsers("users.txt");  // Load users from file

    SocialNetworkWindow window;  // Pass network to window (assuming it takes a pointer)
    window.setWindowTitle("Social Network Login");
    window.resize(300, 200);
    window.show();

    return app.exec();
}
