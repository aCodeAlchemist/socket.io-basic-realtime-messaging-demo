var db = require("../database/database.js");

module.exports = function (app, io) {
    var users = [],
        existingContent, rooms = {};
    io.on('connection', function (socket) {


        console.log("user connected...");

        socket.on("addUser", function (data) {

            socket.name = data.name;
            socket.roomId = data.roomId;
            socket.join(data.roomId);

            rooms[socket.roomId] = rooms[socket.roomId] || [];
            rooms[socket.roomId].push(data);

            // io.emit('userAdded', { joined: data.name, allUsers: users });
            io.to(socket.roomId).emit('userAdded', { joined: data.name, allUsers: rooms[socket.roomId] });
        });

        // socket.emit("addExistingContent", { data: existingContent, allUsers: users });

        socket.on("addedMessage", function (data) {
            data.sent = false;
            socket.broadcast.to(socket.roomId).emit('changedValue', data);
        });

        socket.on('disconnect', function () {
            if (rooms[socket.roomId] && rooms[socket.roomId].length) {

                for (var i = 0; i < rooms[socket.roomId].length; i++) {
                    if (rooms[socket.roomId][i].name == socket.name) {
                        rooms[socket.roomId].splice(i, 1);
                    }
                }
                console.log(users);
                socket.broadcast.to(socket.roomId).emit('userLeft', { left: socket.name, allUsers: rooms[socket.roomId] });
            }else{
                db.Room.remove({_id:  socket.roomId});
            }
        });

    });
};