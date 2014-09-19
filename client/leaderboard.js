// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

/**
 * A MongoDB collection which holds the players and their current scores.
 */
Players = new Mongo.Collection("players");


// ////////////////////////
// Templates

// Template helper functions to get the data out of JavaScript and into the
// template. They're in leaderboard.js and they're called "players" (the
// database query that gets the players), "selected_name" (the name of the
// currently selected player), and "selected" (evaluates to "selected" if a
// particular player is the selected one, and the empty string otherwise —
// this is what sets the CSS to highlight the current player.)
Template.leaderboard.players = function () {
  return Players.find({}, {sort: {score: -1, name: 1}});
};

Template.leaderboard.selected_name = function () {
  var player = Players.findOne(Session.get("selected_player"));
  return player && player.name;
};


// ////////////////////////
// Session

// A Session variable, "selected_player", that holds the Mongo document id of
// the currently selected player, if any. Search  leaderboard.js for
// "selected_player" to see the four places it is used, 3 reads and 1 write.
Template.player.selected = function () {
  return Session.equals("selected_player", this._id) ? "selected" : '';
};


// ////////////////////////
// EVENTS
//"give points" button
Template.leaderboard.events({
  'click input.inc': function () {
    Players.update(Session.get("selected_player"), {$inc: {score: 5}});
  }
});

//set the current player
Template.player.events({
  'click': function () {
    Session.set("selected_player", this._id);
  }
});

enableMogger();