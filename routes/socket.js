module.exports = function (app, io) {
    var db = require("../database/database.js");
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
            if(socket.roomId) {
                console.log("USERS IN ROOM >>>> ", rooms[socket.roomId]);
                if (rooms[socket.roomId] && rooms[socket.roomId].length) {

                    for (var i = 0; i < rooms[socket.roomId].length; i++) {
                        if (rooms[socket.roomId][i].name == socket.name) {
                            rooms[socket.roomId].splice(i, 1);
                        }
                    }
                    if(rooms[socket.roomId].length === 0) {
                        console.log("ROOM ID >>>> ", socket.roomId);
                        db.Room.remove({_id:  socket.roomId}, function (err, res) {
                            console.log(res);
                        });
                        delete rooms[socket.roomId];
                        io.emit("deletedRoom", {id: socket.roomId});
                    } else {
                        socket.broadcast.to(socket.roomId).emit('userLeft', { left: socket.name, allUsers: rooms[socket.roomId] });
                    }
                }
            }
        });
    });
};