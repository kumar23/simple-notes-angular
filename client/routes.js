//Confif for URL routing
angular.module('notes-app').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function($urlRouterProvider, $stateProvider, $locationProvider){
    $locationProvider.html5Mode(true);
    $stateProvider
      .state('notes', {
        url: '/notes',
        templateUrl: 'client/notes/views/notes-list.ng.html',
        controller: 'notesAppController'
    })
    $urlRouterProvider.otherwise('/notes');
}]);