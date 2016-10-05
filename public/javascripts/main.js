/**
 * Initializing messaging module
 */
var app = angular.module('messaging', ['ngSanitize', 'toastr', 'ui.router', 'ngFileUpload']);

app.config(["$stateProvider", "$urlRouterProvider", '$sceProvider', function ($stateProvider, $urlRouterProvider, $sceProvider) {

    /** Routes configuration */
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

    $sceProvider.enabled(false); // disable secure url check
}]);

app.controller('homeController', ['$scope', '$sce', '$timeout', 'toastr', '$http', '$state', function ($scope, $sce, $timeout, toastr, $http, $state) {
    $scope.socket = io.connect("http://messaging.labs.webmpires.net"); // init socket
    var audio = new Audio('sounds/alert.mp3');

    $scope.socket.on("deletedRoom", function (data) {
        $scope.getRooms();
    });

    /** Create room and redirect iser to created room upon success */
    $scope.createRoom = function () {
        if ($scope.roomname) {
            $http.post("/users/createRoom", { name: $scope.roomname }).then(function (res) {
                $state.go("room", { "roomId": res.data.id, "name": res.data.name });
                console.log(res.data);
            });
        }
    };

    /** Get list of all rooms */
    $scope.getRooms = function () {
        $http.get("/users/rooms").then(function (res) {
            $scope.roomList = res.data;
            console.log(res.data);
        });
    };
    
    $scope.getRooms();
}]);