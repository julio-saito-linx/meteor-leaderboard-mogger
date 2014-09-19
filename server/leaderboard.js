Players = new Mongo.Collection("players");


Meteor.methods({
	bar: function () {
	  // .. do other stuff ..
	  return "baz";
	}
});

enableMogger();

Meteor.startup(function () {

  Meteor.call('bar');

  //console.log(Meteor)

  if (Players.find().count() === 0) {
    // !!! only on the first time ever !!!
    var names = ["Mario",
                 "Joyce",
                 "Marie"];
    for (var i = 0; i < names.length; i++)
      Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
  }


});