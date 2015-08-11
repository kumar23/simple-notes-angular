  Meteor.startup(function () {
    if (Tags.find().count() === 0){
      Tags.insert({
        name: 'untagged',
        count: 0,
        createdAt: new Date()
      });
    }
  });