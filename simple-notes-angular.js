Tags = new Mongo.Collection('tags')
Notes = new Mongo.Collection('notes')

if (Meteor.isClient) {
  // This code only runs on the client
  angular.module('notes-app',['angular-meteor']);
  angular.module('notes-app').controller('notesAppController', ['$scope', '$meteor', 
    function ($scope, $meteor) {
      $scope.notes = $meteor.collection(Notes);
      $scope.note_tags = $meteor.collection(Tags);
      $scope.searchText = '';
      $scope.searchEnabled = false;
      $scope.selectedTag = '';
      $scope.submitted = false;
      $scope.filterByTag = function(tagName) {
        if(tagName){
          $scope.searchEnabled = true;
          $scope.selectedTag = $meteor.object(Tags, {name: tagName});

          $scope.notes = $meteor.collection(function(){
            return Notes.find({tags: tagName});
          });
        }else{
          $scope.searchEnabled = false;
          $scope.notes = $meteor.collection(Notes);
        }

      }
      $scope.addNote = function (newNote, isValid) {
        if(isValid){
          var tagsForNewNote = [];
          angular.forEach(newNote.tags, function(value, key) {
           var tagExisting = Tags.findOne({name:value});
           if(!tagExisting){
             $meteor.call("addNewTag", value);
           }
           $meteor.call('incrementCount', value);
           tagExisting = Tags.findOne({name:value});
           tagsForNewNote.push(tagExisting.name);
         });
          if(tagsForNewNote.length == 0){
            var untagged = Tags.findOne({name:'untagged'});
            if(!untagged){
              $meteor.call("addNewTag", 'untagged');
            }
            $meteor.call('incrementCount', 'untagged');
            tagsForNewNote.push('untagged');
          }
          $meteor.call("addNewNote", newNote.title, newNote.content, tagsForNewNote);
          newNote.content = '';
          newNote.tags = '';
          newNote.title = '';
          submitted = false;
        }else{
          $scope.submitted = true;
        }

      }
    }]);

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});
}

Meteor.methods({
  addNewTag: function(tag_name){
    return Tags.insert({
      name: tag_name,
      count: 0,
      createdAt: new Date()
    }
    );
  },
  incrementCount: function(name){
    return Tags.update({name: name},
      {$inc: {count: 1}});
  },
  findTagById: function(tag_id){
    return Tags.findOne({_id:tag_id});
  },
  addNewNote: function(title, content, tags){
    return Notes.insert({
      title: title,
      content: content,
      tags: tags,
      createdAt: new Date()
    });
  }
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
