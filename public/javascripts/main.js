/**
 *  Module
 *
 * Description
 */
var app = angular.module('messaging', ['ngSanitize', 'toastr']);

app.controller('textEditorCtrl', ['$scope', '$sce', '$timeout', 'toastr', '$http', function ($scope, $sce, $timeout, toastr, $http) {
    // var socket = io.connect("http://10.10.5.149:3000");
    // var socket = io.connect("http://messaging.labs.webmpires.net");
    var socket = io.connect("http://10.10.6.110:3000");
    var audio = new Audio('sounds/alert.mp3');

    $scope.messages = [];
    $scope.data = [];

    socket.on("changedValue", function (data) {
        $scope.$evalAsync(function (scope) {
            audio.play();
            scope.messages.unshift(data);
        });
    });

    socket.on("userAdded", function (data) {
        $scope.$evalAsync(function (scope) {
            if (data.joined !== $scope.userName) {
                toastr.success(data.joined + " has joined.");
            }
            scope.allUsers = data.allUsers;
        });
    });

    socket.on("userLeft", function (data) {
        angular.forEach($scope.allUsers, function (user, idx) {
            $scope.discIdx = user.name == data.left ? idx : '';
        });
        console.log($scope.discIdx);
        if (data.left) {
            toastr.warning(data.left + " has left.");
        }
        $scope.$evalAsync(function (scope) {
            $timeout(function () {
                scope.allUsers = data.allUsers;
            }, 1000);
        });
        console.log(data);
    });

    socket.on("addExistingContent", function (data) {
        $scope.$evalAsync(function (scope) {
            scope.allUsers = data.allUsers;
        });
    });

    $scope.addMe = function () {
        if (!$scope.userName) {
            return;
        }
        socket.emit("addUser", {
            name: $scope.userName
        });
        $scope.isUserAdded = true;
    };

    $scope.send = function (text) {
        $scope.messages.unshift({ text: $scope.data.message, sent: true, user: $scope.userName });
        socket.emit("addedMessage", {
            text: $scope.data.message,
            user: $scope.userName
        });
        $scope.data.message = '';
    };
    
    $scope.createRoom = function () {
        if ($scope.roomname) {
            var data = {name : $scope.roomname};
            $http.get("/users/createRoom", {params :data}).then(function(res){
                console.log(res.data);
            });
        }
    };
}]);