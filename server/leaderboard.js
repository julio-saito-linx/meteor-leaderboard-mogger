Players = new Mongo.Collection("players");


Meteor.methods({
  removeAll: function () {
    Players.remove({});
  },
  createRandomPlayers: function () {
    var names = ["Abram", "Joyce", "Marie", "Tim"];
    for (var i = 0; i < names.length; i++){
      var name = names[i];

      Meteor.call('createPlayerRandomScore', name);
    }
  },
  createPlayerRandomScore: function (name) {
    var score = Math.floor(Random.fraction()*10)*5;
    Players.insert({name: name, score: score});
  }
});

enableMogger();

Meteor.startup(function () {
  if (Players.find().count() === 0) {
    Meteor.call('createRandomPlayers');
  }
});