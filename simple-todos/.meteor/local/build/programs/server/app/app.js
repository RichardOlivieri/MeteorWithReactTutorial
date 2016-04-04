var require = meteorInstall({"imports":{"api":{"tasks.js":["meteor/meteor","meteor/mongo","meteor/check",function(require,exports){

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
// imports/api/tasks.js                                                      //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////
                                                                             //
exports.__esModule = true;                                                   //
exports.Tasks = undefined;                                                   //
                                                                             //
var _meteor = require('meteor/meteor');                                      // 1
                                                                             //
var _mongo = require('meteor/mongo');                                        // 2
                                                                             //
var _check = require('meteor/check');                                        // 3
                                                                             //
var Tasks = exports.Tasks = new _mongo.Mongo.Collection('tasks');            // 5
                                                                             //
if (_meteor.Meteor.isServer) {                                               // 7
  // This code only runs on the server                                       //
  // Only publish tasks that are public or belong to the current user        //
  _meteor.Meteor.publish('tasks', function () {                              // 10
    function tasksPublication() {                                            // 10
      return Tasks.find();                                                   // 11
      return Tasks.find({                                                    // 12
        $or: [{ 'private': { $ne: true } }, { owner: this.userId }]          // 13
      });                                                                    //
    }                                                                        //
                                                                             //
    return tasksPublication;                                                 //
  }());                                                                      //
}                                                                            //
                                                                             //
_meteor.Meteor.methods({                                                     // 21
  'tasks.insert': function () {                                              // 22
    function tasksInsert(text) {                                             //
      (0, _check.check)(text, String);                                       // 23
                                                                             //
      // Make sure the user is logged in before inserting a task             //
      if (!_meteor.Meteor.userId()) {                                        // 22
        throw new _meteor.Meteor.Error('not-authorized');                    // 27
      }                                                                      //
                                                                             //
      Tasks.insert({                                                         // 30
        text: text,                                                          // 31
        createdAt: new Date(),                                               // 32
        owner: _meteor.Meteor.userId(),                                      // 33
        username: _meteor.Meteor.user().username                             // 34
      });                                                                    //
    }                                                                        //
                                                                             //
    return tasksInsert;                                                      //
  }(),                                                                       //
  'tasks.remove': function () {                                              // 37
    function tasksRemove(taskId) {                                           //
      (0, _check.check)(taskId, String);                                     // 38
                                                                             //
      var task = Tasks.findOne(taskId);                                      // 40
      if (task['private'] && task.owner !== _meteor.Meteor.userId()) {       // 41
        // If the task is private, make sure only the owner can delete it    //
        throw new _meteor.Meteor.Error('not-authorized');                    // 43
      }                                                                      //
                                                                             //
      Tasks.remove(taskId);                                                  // 46
    }                                                                        //
                                                                             //
    return tasksRemove;                                                      //
  }(),                                                                       //
  'tasks.setChecked': function () {                                          // 48
    function tasksSetChecked(taskId, setChecked) {                           //
      (0, _check.check)(taskId, String);                                     // 49
      (0, _check.check)(setChecked, Boolean);                                // 50
                                                                             //
      var task = Tasks.findOne(taskId);                                      // 52
      if (task['private'] && task.owner !== _meteor.Meteor.userId()) {       // 53
        // If the task is private, make sure only the owner can check it off
        throw new _meteor.Meteor.Error('not-authorized');                    // 55
      }                                                                      //
                                                                             //
      Tasks.update(taskId, { $set: { checked: setChecked } });               // 58
    }                                                                        //
                                                                             //
    return tasksSetChecked;                                                  //
  }(),                                                                       //
  'tasks.setPrivate': function () {                                          // 60
    function tasksSetPrivate(taskId, setToPrivate) {                         //
      (0, _check.check)(taskId, String);                                     // 61
      (0, _check.check)(setToPrivate, Boolean);                              // 62
                                                                             //
      var task = Tasks.findOne(taskId);                                      // 64
                                                                             //
      // Make sure only the task owner can make a task private               //
      if (task.owner !== _meteor.Meteor.userId()) {                          // 60
        throw new _meteor.Meteor.Error('not-authorized');                    // 68
      }                                                                      //
                                                                             //
      Tasks.update(taskId, { $set: { 'private': setToPrivate } });           // 71
    }                                                                        //
                                                                             //
    return tasksSetPrivate;                                                  //
  }()                                                                        //
});                                                                          //
///////////////////////////////////////////////////////////////////////////////

}]}},"server":{"main.js":["../imports/api/tasks.js",function(require){

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
// server/main.js                                                            //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////
                                                                             //
require('../imports/api/tasks.js');                                          // 1
///////////////////////////////////////////////////////////////////////////////

}]}},{"extensions":[".js",".json",".jsx"]});
require("./server/main.js");
//# sourceMappingURL=app.js.map
