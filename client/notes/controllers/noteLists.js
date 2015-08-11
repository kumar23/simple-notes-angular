angular.module('notes-app',['angular-meteor', 'ui.router', 'selectize']);
angular.module('notes-app').controller('notesAppController', ['$scope', '$meteor', '$timeout',
  function ($scope, $meteor,$timeout) {
    $scope.notes = $meteor.collection(function(){
      return (Notes.find({},{sort: {createdAt : -1}}));
    });
    $scope.note_tags = $meteor.collection(Tags);
    $scope.searchText = '';
    $scope.searchEnabled = false;
    $scope.selectedTag = '';
    $scope.submitted = false;
    $scope.tags = [];

    //Binding control to note_tags
    $scope.tagsConfig = {
      create: true
    }

    $timeout(function(){
      $scope.tags = [];
      angular.forEach($scope.note_tags, function(tag,key){
        $scope.tags.push({value: tag.name, text: tag.name});
      });
    }, 1000)

    //Filter notes by tag
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


    //Code to add new note
    $scope.addNote = function (newNote, isValid) {
      if(isValid){
        var tagsForNewNote = [];
        angular.forEach(newNote.tags, function(value, key) {
          var tagExisting = Tags.findOne({name:value});
          if(!tagExisting){
            $meteor.call("addNewTag", value);
          }
          $meteor.call('incrementCount', value);
          tagsForNewNote.push(value);
        });
        //Adding tag 'untagged' by default
        if(tagsForNewNote.length == 0){
          var untagged = Tags.findOne({name:'untagged'});
          if(!untagged){
            $meteor.call("addNewTag", 'untagged');
          }
          $meteor.call('incrementCount', 'untagged');
          tagsForNewNote.push('untagged');
        }
        $meteor.call("addNewNote", newNote.title, newNote.content, tagsForNewNote, newNote.owner);
        newNote.content = '';
        newNote.tags = '';
        newNote.title = '';
        $scope.submitted = false;
      }else{
        $scope.submitted = true;
      }
    }

    //Code to remove a note
    $scope.removeNote = function(note_id){
      var currentNote = Notes.findOne({_id: note_id});
      angular.forEach(currentNote.tags, function(value, key) {
        $meteor.call('decrementCount', value);
      });
      $meteor.call('removeNote', note_id);
    }
  }]);