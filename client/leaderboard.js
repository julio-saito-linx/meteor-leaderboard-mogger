// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

/**
 * A MongoDB collection which holds the players and their current scores.
 */
Players = new Mongo.Collection("players");

if(!Session.get("selected_sort")){
  Session.set("selected_sort", {sort: [["score", "desc"], ["name", "asc"]]});
}

var isSortingBy = function() {
    var selectedSort = Session.get("selected_sort");
    if(selectedSort.sort[0][0] === 'score'){
      return 'score';
    }
    else{
      return 'name';
    }
};

// ////////////////////////
// Templates

// Template helper functions to get the data out of JavaScript and into the
// template. They're in leaderboard.js and they're called "players" (the
// database query that gets the players), "selected_name" (the name of the
// currently selected player), and "selected" (evaluates to "selected" if a
// particular player is the selected one, and the empty string otherwise —
// this is what sets the CSS to highlight the current player.)
Template.leaderboard.players = function () {
  return Players.find({}, Session.get("selected_sort"));
};
Template.leaderboard.selected_name = function () {
  var player = Players.findOne(Session.get("selected_player"));
  return player && player.name;
};
Template.leaderboard.isSortingBy = function () {
  return isSortingBy();
};

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
    // ////////////////////////
    // Session

    // A Session variable, "selected_player", that holds the Mongo document id of
    // the currently selected player, if any. Search  leaderboard.js for
    // "selected_player" to see the four places it is used, 3 reads and 1 write.
    Session.set("selected_player", this._id);
  }
});

Template.player.events({
  'click [data-hook=remove-player] ': function () {
    Players.remove(this._id);
  }
});

Template.leaderboard.events({
  'click input[data-hook=change_sort]': function () {

    var jQueryEvent = arguments[0];
    var element = $(jQueryEvent.target);

    //toggle sort
    if(isSortingBy() === 'score'){
      Session.set("selected_sort", {sort: [["name", "asc"],   ["score", "desc"]]});
      element.val('change: sort by score');
    }
    else{
      Session.set("selected_sort", {sort: [["score", "desc"], ["name", "asc"]]});
      element.val('change: sort by name');
    }
  }
});

Template.leaderboard.events({
  'click input[data-hook=reset]': function () {
    //toggle sort
    Meteor.call('removeAll');
    Meteor.call('createRandomPlayers');
  }
});

Template.leaderboard.events({
  'click input[data-hook=add-new-player-button]': function () {
    var new_player_name = $('input[data-hook=add-new-player-text]').val();
    Meteor.call('createPlayerRandomScore', new_player_name);
  }
});

enableMogger();
