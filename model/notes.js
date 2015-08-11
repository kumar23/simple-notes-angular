Notes = new Mongo.Collection('notes');
Notes.allow({
  insert: function () {},
  update: function () {},
  remove: function () {}
});
