// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Mongo.Collection("players");


if (Meteor.isClient) {

  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });

  enableMogger();
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {


  /**
   * MOGGER on Server
   * ---------------------------------------
   * FIXME: send this code to Mogger itself
   * TODO: colors on the server
   */
  var multiplyChar = function multiplyChar(char, times) {
      var finalStr = [];
      for (var i = 0; i < times; i++) {
          finalStr.push(char);
      }
      return finalStr.join('');
  };

  var transforByType = function transforByType(parameter) {
      if(_.isString(parameter)){
          return '\'' + parameter + '\'';
      }
      else if(_.isArray(parameter)){
          if(parameter.length === 0){
              return '[]';
          }

          var finalArray = [];
          finalArray.push('[');

          for (var i = 0; i < parameter.length; i++) {
              finalArray.push(transforByType(parameter[i]));
              if(i !== parameter.length - 1){
                  finalArray.push(', ');
              }
          }

          finalArray.push(']');
          return finalArray.join('');
      }
      else if(_.isObject(parameter)){
          var padding = '\n' + multiplyChar(' ', GLOBAL_PADDING_SIZE);
          return JSON.stringify(parameter, ' ', 4).replace(/\n/gi, padding);
      }
      else if(_.isFunction(parameter)){
          return parameter + '()';
      }
      else{
          return parameter;
      }
  };

  var interceptParameters = function(info) {
      if(info.args.length === 0){
          return info.method + '()';
      }

      var finalString = [];
      finalString.push(info.method);
      finalString.push('(');

      for (var i = 0; i < info.args.length; i++) {
          var arg = info.args[i];
          finalString.push(transforByType(arg));
          if(i !== info.args.length-1){
              finalString.push(', ');
          }
      }

      finalString.push(')');

      return finalString.join('');
  };
  var Mogger = Meteor.npmRequire('mogger');
  mogger = new Mogger({
      surrogateTargets: [
          { title: 'Players', target: Players },
      ],
      globalBeforeConfig: {
          size: 9
      },
      globalInterceptors: [
          {
              filterRegex: /./,
              callback: interceptParameters
          }
      ],
      showPause: false
  });
  mogger.traceObj({
      before: { message: 'Players:' }, targetTitle: 'Players'
  });


  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
    }
  });
}
