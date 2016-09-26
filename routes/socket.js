module.exports = function(app, io) {
    var users = [],
        existingContent;
    io.on('connection', function(socket) {

        console.log("user connected...");

        socket.on("addUser", function(data) {
            users.push(data);
            socket.name = data.name;
            socket.roomId = data.roomId;
            socket.join(data.roomId);
            // io.emit('userAdded', { joined: data.name, allUsers: users });
            io.to(socket.roomId).emit('userAdded', { joined: data.name, allUsers: users });
        });

        // socket.emit("addExistingContent", { data: existingContent, allUsers: users });

        socket.on("addedMessage", function(data) {
            data.sent = false;
            socket.broadcast.emit('changedValue', data);
        });

        socket.on('disconnect', function() {
            for (var i = 0; i < users.length; i++) {
                if (users[i].name == socket.name) {
                    users.splice(i, 1);
                }
            }
            console.log(users);
            socket.broadcast.emit('userLeft', { left: socket.name, allUsers: users });
        });

    });
};