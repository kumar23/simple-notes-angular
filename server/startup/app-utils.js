//All write operations will be performed only by the server
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
  decrementCount: function(name){
    return Tags.update({name: name},
      {$inc: {count: -1}});
  },
  removeNote: function(note_id){
    return Notes.remove({_id: note_id});
  },
  addNewNote: function(title, content, tags, userId){
    return Notes.insert({
      title: title,
      content: content,
      tags: tags,
      owner: userId,
      createdAt: new Date()
    });
  }
});