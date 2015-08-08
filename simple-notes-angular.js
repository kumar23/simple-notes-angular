Tags = new Mongo.Collection('tags')
Notes = new Mongo.Collection('notes')

if (Meteor.isClient) {
  // This code only runs on the client
  angular.module('notes-app',['angular-meteor']);
  angular.module('notes-app').controller('notesAppController', ['$scope', '$meteor', 
    function ($scope, $meteor) {
      $scope.notes = $meteor.collection(Notes);
      $scope.note_tags = $meteor.collection(Tags);
    }]);

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
