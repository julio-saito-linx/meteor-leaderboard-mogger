Players = new Mongo.Collection("players");

enableMogger();

Meteor.startup(function () {
  if (Players.find().count() === 0) {
    var names = ["Mario",
                 "Joyce",
                 "Marie"];
    for (var i = 0; i < names.length; i++)
      Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
  }
});