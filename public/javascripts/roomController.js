app.controller('roomController', ['$scope', '$sce', '$timeout', 'toastr', '$stateParams', 'Factory', 'Upload', function ($scope, $sce, $timeout, toastr, $stateParams, Factory, Upload) {

    var roomId = $stateParams.roomId;
    $scope.roomName = $stateParams.name;

    // var socket = io.connect("http://10.10.5.149:3000");
    //  var socket = io.connect("http://messaging.labs.webmpires.net");
    var socket = io.connect("http://10.10.6.123:3000");
    var audio = new Audio('sounds/alert.mp3');

    $scope.messages = [];
    $scope.data = [];
    $scope.formData = {};

    socket.on("changedValue", function (data) {
        $scope.$evalAsync(function (scope) {
            audio.play();
            scope.messages.unshift(data);
        });
    });

    socket.on("userAdded", function (data) {
        $scope.$evalAsync(function (scope) {
            if (data.joined !== $scope.formData.userName) {
                toastr.success(data.joined + " has joined.");
            }
            scope.allUsers = data.allUsers;
        });
    });

    socket.on("userLeft", function (data) {
        if (data.left) {
            toastr.warning(data.left + " has left.");
        }
        $scope.$evalAsync(function (scope) {
            $timeout(function () {
                scope.allUsers = data.allUsers;
            }, 1000);
        });
      //   console.log(data);
    });

    socket.on("addExistingContent", function (data) {
        $scope.$evalAsync(function (scope) {
            scope.allUsers = data.allUsers;
        });
    });

    $scope.addMe = function () {
        if (!$scope.formData.userName || !$scope.formData.email) {
            return;
        }
        
        Factory.addUser($scope.formData).then(function (response) {
            socket.emit("addUser", {
                name: $scope.formData.userName,
                id: response.data.id,
                roomId: roomId
            });
            $scope.isUserAdded = true;
        }, function () {
            alert("Error when adding user.");
        });
        
    };

    $scope.upload = function (file, type) {
        if(file) {
            Upload.upload({
                url: '/users/media',
                data: { file: file }
            }).then(function(resp) {
                console.log(resp);
                $scope.messages.unshift({ text: resp.data.url, sent: true, user: $scope.formData.userName, type: type});
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

    $scope.send = function (text) {
        $scope.messages.unshift({ text: $scope.data.message, sent: true, user: $scope.formData.userName, type: "text" });
        socket.emit("addedMessage", {
            type: "text",
            text: $scope.data.message,
            user: $scope.formData.userName
        });
        $scope.data.message = '';
    }
}]);