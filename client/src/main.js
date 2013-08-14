var app = angular.module('app', ['ngResource'], function($routeProvider, $locationProvider){
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/login', {
      templateUrl: '/partials/login.html',
      controller: 'LoginCtrl'
    })
    .when('/user/:userId', {
      templateUrl: '/partials/user.html',
      controller: 'UserCtrl'
    })
    .otherwise({redirectTo: '/'});
});

app.factory('AuthService', function(User, $http){
  return {
    login: function(username, password, next){

      $http.post('/login', {username: username, password: password})
        .success(function(data, status, headers, config){
          console.log('DATA',data);
          console.log('USERID:::', data.id);
          User.isLoggedIn = data.isLoggedIn;
          next(data);
        });
    },
    logout: function(){
      User.isLoggedIn = false;
      console.log('LOGGED OUT!');
    }
  }
});

app.factory('User', function(){
  return {
    isLoggedIn: false,
    username: null,
    firstName: null,
    lastName: null,
    email: null,
    phone: null,
    userId: null,
    update: function(data){
      //this.isLoggedIn = data.isLoggedIn;
      this.username = data.username;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.email = data.email;
      this.phone = data.phone;
      this.userId = data.id;
    }
  }
});

function MainCtrl($scope, $location, User, AuthService){
  $scope.User = User;
  $scope.logout = AuthService.logout;
  $scope.showLogin = function(){
    $location.path('/login');
  }
}

function LoginCtrl($scope, $location, User, AuthService){
  $scope.User = User;

  if($scope.User.isLoggedIn){
    //redirect to home page
    $location.path('/user/' + $scope.User.username);
  }

  $scope.handleLogin = function(){
    console.log('HANDLE LOGIN');
    AuthService.login($scope.LoginModel.username, $scope.LoginModel.password, function(data){
      //clear login form after login success
      User.update(data);

      if(data.isLoggedIn){
        $scope.LoginModel.username = '';
        $scope.LoginModel.password = '';
        $location.path('/user/' + User.username);
      }
      else {
        // show error message
        $scope.errorMessage = data.errorMessage;
      }
    });
  }
}

function UserCtrl($scope, $http, User, $location){

  $scope.User = User;

  if(!$scope.User.isLoggedIn || $location.path().indexOf($scope.User.username) < 0){
    //redirect to home page
    $location.path('/');
  }

  $scope.handleSaveUser = function(){
    $http.put('/user/' + User.username, User)
      .success(function(data){
        $scope.saveSuccessful = data.success;
        console.log('SAVED! ', data);
      });
  }
}

