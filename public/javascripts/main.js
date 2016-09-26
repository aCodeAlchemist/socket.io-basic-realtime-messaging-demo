/**
 *  Module
 *
 * Description
 */
var app = angular.module('messaging', ['ngSanitize', 'toastr', 'ui.router']);

app.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'views/home.html',
        controller: 'homeController'
    }).state('room', {
        url: '/room/:roomId/:name',
        templateUrl: 'views/room.html',
        controller: 'roomController'
    });

    $urlRouterProvider.otherwise('/');
}]);

app.controller('homeController', ['$scope', '$sce', '$timeout', 'toastr', '$http', '$state', function ($scope, $sce, $timeout, toastr, $http, $state) {
    // var socket = io.connect("http://10.10.5.149:3000");
    // var socket = io.connect("http://messaging.labs.webmpires.net");
    var socket = io.connect("http://10.10.6.110:3000");
    var audio = new Audio('sounds/alert.mp3');

    $scope.createRoom = function () {
        if ($scope.roomname) {
            var data = { name: $scope.roomname };
            $http.get("/users/createRoom", { params: data }).then(function (res) {
                $state.go("room", { "roomId": res.data.id, "name": res.data.name });
                console.log(res.data);
            });
        }
    };

    $scope.getRooms = function () {
        $http.get("/users/rooms").then(function (res) {
            $scope.roomList = res.data;
            console.log(res.data);
        });
    };
    
    $scope.getRooms();
}]);