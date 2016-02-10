// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var wikiHereApp = angular.module('wikiHere', ['ionic','ngCordova','uiGmapgoogle-maps']);


wikiHereApp.config(function($stateProvider, $urlRouterProvider,uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    //    key: 'your api key',
    v: '3.20', //defaults to latest 3.X anyhow
    libraries: 'geometry,places'
  });

  $stateProvider
      .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "menu.html"
      })

      .state('app.main',{
        url:"/main",
        views:{
          'content':{
            templateUrl:'main.html',
            controller:'MainController'
          }
        }
      })

      .state('app.console',{
        url:"/console",
        views:{
         content:{
           templateUrl:'console.html',
           controller:'ConsoleController'
         }
        }
      })

      .state('app.settings',{
        url:"/settings",
        views:{
          'content':{
            templateUrl:'settings.html',
            controller:'SettingsController'
          }
        }
      });
  $urlRouterProvider.otherwise('/app/main');
});

wikiHereApp
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }


  });
});
