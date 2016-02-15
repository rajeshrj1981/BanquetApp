// Ionic Starter App
var fb = new Firebase("https://portfolio-manger.firebaseio.com/");
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var imageApp = angular.module('starter', ['ionic','ngCordova','firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state("firebase", {
            url: "/firebase",
            templateUrl: "templates/firebase.html",
            controller: "FirebaseController",
            cache: false
        })
        .state("secure", {
            url: "/secure",
            templateUrl: "templates/secure.html",
            controller: "SecureController"
        });
    $urlRouterProvider.otherwise('/firebase');
});

imageApp.controller("FirebaseController", function($scope, $state, $firebaseAuth) {

    var fbAuth = $firebaseAuth(fb);

    $scope.login = function(username, password) {
        fbAuth.$authWithPassword({
            email: username,
            password: password
        }).then(function(authData) {
            $state.go("secure");
        }).catch(function(error) {
            //console.error("ERROR: " + error);
			alert("ERROR: " + error);
        });
    }

    $scope.register = function(username, password) {
        fbAuth.$createUser({email: username, password: password}).then(function(userData) {
            return fbAuth.$authWithPassword({
                email: username,
                password: password
            });
        }).then(function(authData) {
            $state.go("secure");
        }).catch(function(error) {
            //console.error("ERROR: " + error);
			alert("ERROR: " + error);
        });
    }

});

imageApp.controller("SecureController", function($scope, $ionicHistory, $firebaseArray, $cordovaCamera) {

    $ionicHistory.clearHistory();
    $scope.images = [];
$scope.userData = {};
    var fbAuth = fb.getAuth();
    if(fbAuth) {
        var userReference = fb.child("users/" + fbAuth.uid);
        var syncArray = $firebaseArray(userReference.child("images"));
        $scope.images = syncArray;
    } else {
        $state.go("firebase");
    }
	$scope.save = function(){
		//var selectedImage = $firebaseArray(userReference.child("images/"));
		alert("saved");
	}
    $scope.upload = function(language) {
        var options = {
            quality : 75,
            destinationType : Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            targetWidth: 500,
            targetHeight: 500,
            saveToPhotoAlbum: false
        };
        $cordovaCamera.getPicture(options).then(function(imageData) {
            syncArray.$add({image: imageData,
			language:$scope.userData.language,
			mealPref:$scope.userData.meal,
			age:$scope.userData.age,
			allergies:$scope.userData.allergies,
			winePair:$scope.userData.winePair,
			physician:$scope.userData.physician,
			}).then(function() {
                alert("Banquet Card Details has been uploaded");
            });
        }, function(error) {
            console.error(error);
        });
    }


});
