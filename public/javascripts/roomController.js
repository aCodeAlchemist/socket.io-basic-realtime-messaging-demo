app.controller('roomController', ['$scope', '$sce', '$timeout', 'toastr', '$stateParams', 'Factory', 'Upload', function($scope, $sce, $timeout, toastr, $stateParams, Factory, Upload) {

    var roomId = $stateParams.roomId;
    $scope.roomName = $stateParams.name;

    // var socket = io.connect("http://10.10.5.149:3000");
    //  var socket = io.connect("http://messaging.labs.webmpires.net");
    var socket = io.connect("http://10.10.6.123:3000");
    var audio = new Audio('sounds/alert.mp3');

    $scope.messages = [];
    $scope.data = [];
    $scope.formData = {};
    $scope.flags = {};
    $scope.typingTimerLength = 5000;
    $scope.rc = {usersTyping: []};

    socket.on("changedValue", function(data) {
        $scope.$evalAsync(function(scope) {
            audio.play();
            scope.messages.unshift(data);
        });
    });

    socket.on("userAdded", function(data) {
        $scope.$evalAsync(function(scope) {
            if (data.joined !== $scope.formData.userName) {
                toastr.success(data.joined + " has joined.");
            }
            scope.allUsers = data.allUsers;
        });
    });

    socket.on("startedTyping", function (data) {
        $scope.$evalAsync(function(scope) {
            $scope.rc.usersTyping.push(data.name);
            $scope.rc.whoIsTyping = $scope.rc.usersTyping.join(', ');
        });
    });

    socket.on("stoppedTyping", function (data) {
        $scope.$evalAsync(function(scope) {
            var idx = $scope.rc.usersTyping.indexOf(data.name);
            $scope.rc.usersTyping.splice(idx, 1);
            $scope.rc.whoIsTyping = $scope.rc.usersTyping.join(', ');
        });
    });

    socket.on("userLeft", function(data) {
        if (data.left) {
            toastr.warning(data.left + " has left.");
        }
        $scope.$evalAsync(function(scope) {
            $timeout(function() {
                scope.allUsers = data.allUsers;
            }, 1000);
        });
        //   console.log(data);
    });

    socket.on("addExistingContent", function(data) {
        $scope.$evalAsync(function(scope) {
            scope.allUsers = data.allUsers;
        });
    });

    $scope.onKeyUp = function() {
        if (!$scope.flags.typing) {
            $scope.flags.typing = true;
            socket.emit('typing', {
                name: $scope.formData.userName
            });
        }
        
        $scope.flags.lastTypingTime = (new Date()).getTime();

        $timeout(function() {
            var typingTimer = (new Date()).getTime();
            var timeDiff = typingTimer - $scope.flags.lastTypingTime;
            if (timeDiff >= $scope.typingTimerLength && $scope.flags.typing) {
                socket.emit('typingStopped', {
                    name: $scope.formData.userName
                });
                $scope.flags.typing = false;
            }
        }, $scope.typingTimerLength);
    };

    $scope.addMe = function() {
        if (!$scope.formData.userName || !$scope.formData.email) {
            return;
        }

        Factory.addUser($scope.formData).then(function(response) {
            $scope.formData.userId = response.data.id;
            socket.emit("addUser", {
                name: $scope.formData.userName,
                id: response.data.id,
                roomId: roomId
            });
            $scope.isUserAdded = true;
        }, function() {
            alert("Error when adding user.");
        });

    };

    $scope.upload = function(file, type) {
        if (file) {
            Upload.upload({
                url: '/users/media',
                data: { file: file }
            }).then(function(resp) {
                console.log(resp);
                $scope.messages.unshift({ text: resp.data.url, sent: true, user: $scope.formData.userName, type: type });
                socket.emit("addedMessage", {
                    type: type,
                    text: resp.data.url,
                    user: $scope.formData.userName
                });
            }, function(resp) {
                alert("Error when uploading image.");
            });
        }
    };

    $scope.send = function(text) {
        $scope.messages.unshift({ text: $scope.data.message, sent: true, user: $scope.formData.userName, type: "text" });
        socket.emit("addedMessage", {
            type: "text",
            text: $scope.data.message,
            user: $scope.formData.userName
        });
        $scope.data.message = '';
    }
}]);
