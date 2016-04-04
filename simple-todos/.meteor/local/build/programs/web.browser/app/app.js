var require = meteorInstall({"client":{"main.html":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// client/template.main.js                                                                        //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
                                                                                                  // 1
Template.body.addContent((function() {                                                            // 2
  var view = this;                                                                                // 3
  return HTML.Raw('<div id="render-target"></div>');                                              // 4
}));                                                                                              // 5
Meteor.startup(Template.body.renderToDocument);                                                   // 6
                                                                                                  // 7
////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.jsx":["react","meteor/meteor","react-dom","../imports/startup/accounts-config.js","../imports/ui/App.jsx",function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// client/main.jsx                                                                                //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
var _react = require('react');                                                                    // 1
                                                                                                  //
var _react2 = _interopRequireDefault(_react);                                                     //
                                                                                                  //
var _meteor = require('meteor/meteor');                                                           // 2
                                                                                                  //
var _reactDom = require('react-dom');                                                             // 3
                                                                                                  //
require('../imports/startup/accounts-config.js');                                                 // 5
                                                                                                  //
var _App = require('../imports/ui/App.jsx');                                                      // 6
                                                                                                  //
var _App2 = _interopRequireDefault(_App);                                                         //
                                                                                                  //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
                                                                                                  //
_meteor.Meteor.startup(function () {                                                              // 8
  (0, _reactDom.render)(_react2['default'].createElement(_App2['default'], null), document.getElementById('render-target'));
});                                                                                               //
////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"imports":{"api":{"tasks.js":["meteor/meteor","meteor/mongo","meteor/check",function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// imports/api/tasks.js                                                                           //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
exports.__esModule = true;                                                                        //
exports.Tasks = undefined;                                                                        //
                                                                                                  //
var _meteor = require('meteor/meteor');                                                           // 1
                                                                                                  //
var _mongo = require('meteor/mongo');                                                             // 2
                                                                                                  //
var _check = require('meteor/check');                                                             // 3
                                                                                                  //
var Tasks = exports.Tasks = new _mongo.Mongo.Collection('tasks');                                 // 5
                                                                                                  //
if (_meteor.Meteor.isServer) {                                                                    // 7
  // This code only runs on the server                                                            //
  // Only publish tasks that are public or belong to the current user                             //
  _meteor.Meteor.publish('tasks', function () {                                                   // 10
    function tasksPublication() {                                                                 // 10
      return Tasks.find();                                                                        // 11
      return Tasks.find({                                                                         // 12
        $or: [{ 'private': { $ne: true } }, { owner: this.userId }]                               // 13
      });                                                                                         //
    }                                                                                             //
                                                                                                  //
    return tasksPublication;                                                                      //
  }());                                                                                           //
}                                                                                                 //
                                                                                                  //
_meteor.Meteor.methods({                                                                          // 21
  'tasks.insert': function () {                                                                   // 22
    function tasksInsert(text) {                                                                  //
      (0, _check.check)(text, String);                                                            // 23
                                                                                                  //
      // Make sure the user is logged in before inserting a task                                  //
      if (!_meteor.Meteor.userId()) {                                                             // 22
        throw new _meteor.Meteor.Error('not-authorized');                                         // 27
      }                                                                                           //
                                                                                                  //
      Tasks.insert({                                                                              // 30
        text: text,                                                                               // 31
        createdAt: new Date(),                                                                    // 32
        owner: _meteor.Meteor.userId(),                                                           // 33
        username: _meteor.Meteor.user().username                                                  // 34
      });                                                                                         //
    }                                                                                             //
                                                                                                  //
    return tasksInsert;                                                                           //
  }(),                                                                                            //
  'tasks.remove': function () {                                                                   // 37
    function tasksRemove(taskId) {                                                                //
      (0, _check.check)(taskId, String);                                                          // 38
                                                                                                  //
      var task = Tasks.findOne(taskId);                                                           // 40
      if (task['private'] && task.owner !== _meteor.Meteor.userId()) {                            // 41
        // If the task is private, make sure only the owner can delete it                         //
        throw new _meteor.Meteor.Error('not-authorized');                                         // 43
      }                                                                                           //
                                                                                                  //
      Tasks.remove(taskId);                                                                       // 46
    }                                                                                             //
                                                                                                  //
    return tasksRemove;                                                                           //
  }(),                                                                                            //
  'tasks.setChecked': function () {                                                               // 48
    function tasksSetChecked(taskId, setChecked) {                                                //
      (0, _check.check)(taskId, String);                                                          // 49
      (0, _check.check)(setChecked, Boolean);                                                     // 50
                                                                                                  //
      var task = Tasks.findOne(taskId);                                                           // 52
      if (task['private'] && task.owner !== _meteor.Meteor.userId()) {                            // 53
        // If the task is private, make sure only the owner can check it off                      //
        throw new _meteor.Meteor.Error('not-authorized');                                         // 55
      }                                                                                           //
                                                                                                  //
      Tasks.update(taskId, { $set: { checked: setChecked } });                                    // 58
    }                                                                                             //
                                                                                                  //
    return tasksSetChecked;                                                                       //
  }(),                                                                                            //
  'tasks.setPrivate': function () {                                                               // 60
    function tasksSetPrivate(taskId, setToPrivate) {                                              //
      (0, _check.check)(taskId, String);                                                          // 61
      (0, _check.check)(setToPrivate, Boolean);                                                   // 62
                                                                                                  //
      var task = Tasks.findOne(taskId);                                                           // 64
                                                                                                  //
      // Make sure only the task owner can make a task private                                    //
      if (task.owner !== _meteor.Meteor.userId()) {                                               // 60
        throw new _meteor.Meteor.Error('not-authorized');                                         // 68
      }                                                                                           //
                                                                                                  //
      Tasks.update(taskId, { $set: { 'private': setToPrivate } });                                // 71
    }                                                                                             //
                                                                                                  //
    return tasksSetPrivate;                                                                       //
  }()                                                                                             //
});                                                                                               //
////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"startup":{"accounts-config.js":["meteor/accounts-base",function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// imports/startup/accounts-config.js                                                             //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
var _accountsBase = require('meteor/accounts-base');                                              // 1
                                                                                                  //
_accountsBase.Accounts.ui.config({                                                                // 3
  passwordSignupFields: 'USERNAME_ONLY'                                                           // 4
});                                                                                               //
////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"ui":{"AccountsUIWrapper.jsx":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits","react","react-dom","meteor/templating","meteor/blaze",function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// imports/ui/AccountsUIWrapper.jsx                                                               //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
exports.__esModule = true;                                                                        //
                                                                                                  //
var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');                           //
                                                                                                  //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                  //
                                                                                                  //
var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');     //
                                                                                                  //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);            //
                                                                                                  //
var _inherits2 = require('babel-runtime/helpers/inherits');                                       //
                                                                                                  //
var _inherits3 = _interopRequireDefault(_inherits2);                                              //
                                                                                                  //
var _react = require('react');                                                                    // 1
                                                                                                  //
var _react2 = _interopRequireDefault(_react);                                                     //
                                                                                                  //
var _reactDom = require('react-dom');                                                             // 2
                                                                                                  //
var _reactDom2 = _interopRequireDefault(_reactDom);                                               //
                                                                                                  //
var _templating = require('meteor/templating');                                                   // 3
                                                                                                  //
var _blaze = require('meteor/blaze');                                                             // 4
                                                                                                  //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
                                                                                                  //
var AccountsUIWrapper = function (_Component) {                                                   //
  (0, _inherits3['default'])(AccountsUIWrapper, _Component);                                      //
                                                                                                  //
  function AccountsUIWrapper() {                                                                  //
    (0, _classCallCheck3['default'])(this, AccountsUIWrapper);                                    //
    return (0, _possibleConstructorReturn3['default'])(this, _Component.apply(this, arguments));  //
  }                                                                                               //
                                                                                                  //
  AccountsUIWrapper.prototype.componentDidMount = function () {                                   //
    function componentDidMount() {                                                                //
      // Use Meteor Blaze to render login buttons                                                 //
      this.view = _blaze.Blaze.render(_templating.Template.loginButtons, _reactDom2['default'].findDOMNode(this.refs.container));
    }                                                                                             //
                                                                                                  //
    return componentDidMount;                                                                     //
  }();                                                                                            //
                                                                                                  //
  AccountsUIWrapper.prototype.componentWillUnmount = function () {                                // 6
    function componentWillUnmount() {                                                             //
      // Clean up Blaze view                                                                      //
      _blaze.Blaze.remove(this.view);                                                             // 14
    }                                                                                             //
                                                                                                  //
    return componentWillUnmount;                                                                  //
  }();                                                                                            //
                                                                                                  //
  AccountsUIWrapper.prototype.render = function () {                                              // 6
    function render() {                                                                           //
      // Just render a placeholder container that will be filled in                               //
      return _react2['default'].createElement('span', { ref: 'container' });                      // 18
    }                                                                                             //
                                                                                                  //
    return render;                                                                                //
  }();                                                                                            //
                                                                                                  //
  return AccountsUIWrapper;                                                                       //
}(_react.Component);                                                                              //
                                                                                                  //
exports['default'] = AccountsUIWrapper;                                                           //
////////////////////////////////////////////////////////////////////////////////////////////////////

}],"App.jsx":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits","react","react-dom","meteor/meteor","meteor/react-meteor-data","../api/tasks.js","./Task.jsx","./AccountsUIWrapper.jsx",function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// imports/ui/App.jsx                                                                             //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
exports.__esModule = true;                                                                        //
                                                                                                  //
var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');                           //
                                                                                                  //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                  //
                                                                                                  //
var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');     //
                                                                                                  //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);            //
                                                                                                  //
var _inherits2 = require('babel-runtime/helpers/inherits');                                       //
                                                                                                  //
var _inherits3 = _interopRequireDefault(_inherits2);                                              //
                                                                                                  //
var _react = require('react');                                                                    // 1
                                                                                                  //
var _react2 = _interopRequireDefault(_react);                                                     //
                                                                                                  //
var _reactDom = require('react-dom');                                                             // 2
                                                                                                  //
var _reactDom2 = _interopRequireDefault(_reactDom);                                               //
                                                                                                  //
var _meteor = require('meteor/meteor');                                                           // 3
                                                                                                  //
var _reactMeteorData = require('meteor/react-meteor-data');                                       // 4
                                                                                                  //
var _tasks = require('../api/tasks.js');                                                          // 6
                                                                                                  //
var _Task = require('./Task.jsx');                                                                // 8
                                                                                                  //
var _Task2 = _interopRequireDefault(_Task);                                                       //
                                                                                                  //
var _AccountsUIWrapper = require('./AccountsUIWrapper.jsx');                                      // 9
                                                                                                  //
var _AccountsUIWrapper2 = _interopRequireDefault(_AccountsUIWrapper);                             //
                                                                                                  //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
                                                                                                  //
// App component - represents the whole app                                                       //
                                                                                                  //
var App = function (_Component) {                                                                 //
  (0, _inherits3['default'])(App, _Component);                                                    //
                                                                                                  //
  function App(props) {                                                                           // 13
    (0, _classCallCheck3['default'])(this, App);                                                  //
                                                                                                  //
    var _this = (0, _possibleConstructorReturn3['default'])(this, _Component.call(this, props));  //
                                                                                                  //
    _this.state = {                                                                               // 16
      hideCompleted: false                                                                        // 17
    };                                                                                            //
    return _this;                                                                                 //
  }                                                                                               //
                                                                                                  //
  App.prototype.handleSubmit = function () {                                                      // 12
    function handleSubmit(event) {                                                                //
      event.preventDefault();                                                                     // 21
                                                                                                  //
      // Find the text field via the React ref                                                    //
      var text = _reactDom2['default'].findDOMNode(this.refs.textInput).value.trim();             // 20
                                                                                                  //
      _tasks.Tasks.insert({                                                                       // 26
        text: text,                                                                               // 27
        createdAt: new Date(), // current time                                                    // 28
        owner: _meteor.Meteor.userId(), // _id of logged in user                                  // 29
        username: _meteor.Meteor.user().username });                                              // 30
                                                                                                  //
      // username of logged in user                                                               //
      _meteor.Meteor.call('tasks.insert', text);                                                  // 33
                                                                                                  //
      // Clear form                                                                               //
      _reactDom2['default'].findDOMNode(this.refs.textInput).value = '';                          // 20
    }                                                                                             //
                                                                                                  //
    return handleSubmit;                                                                          //
  }();                                                                                            //
                                                                                                  //
  App.prototype.toggleHideCompleted = function () {                                               // 12
    function toggleHideCompleted() {                                                              //
      this.setState({                                                                             // 40
        hideCompleted: !this.state.hideCompleted                                                  // 41
      });                                                                                         //
    }                                                                                             //
                                                                                                  //
    return toggleHideCompleted;                                                                   //
  }();                                                                                            //
                                                                                                  //
  App.prototype.renderTasks = function () {                                                       // 12
    function renderTasks() {                                                                      //
      var _this2 = this;                                                                          //
                                                                                                  //
      var filteredTasks = this.props.tasks;                                                       // 46
      if (this.state.hideCompleted) {                                                             // 47
        filteredTasks = filteredTasks.filter(function (task) {                                    // 48
          return !task.checked;                                                                   //
        });                                                                                       //
      }                                                                                           //
      return filteredTasks.map(function (task) {                                                  // 50
        var currentUserId = _this2.props.currentUser && _this2.props.currentUser._id;             // 51
        var showPrivateButton = task.owner === currentUserId;                                     // 52
                                                                                                  //
        return _react2['default'].createElement(_Task2['default'], {                              // 54
          key: task._id,                                                                          // 56
          task: task,                                                                             // 57
          showPrivateButton: showPrivateButton                                                    // 58
        });                                                                                       //
      });                                                                                         //
    }                                                                                             //
                                                                                                  //
    return renderTasks;                                                                           //
  }();                                                                                            //
                                                                                                  //
  App.prototype.render = function () {                                                            // 12
    function render() {                                                                           //
                                                                                                  //
      return _react2['default'].createElement(                                                    // 66
        'div',                                                                                    //
        { className: 'container' },                                                               //
        _react2['default'].createElement(                                                         //
          'header',                                                                               //
          null,                                                                                   //
          _react2['default'].createElement(                                                       //
            'h1',                                                                                 //
            null,                                                                                 //
            'Todo List (',                                                                        //
            this.props.incompleteCount,                                                           //
            ')'                                                                                   //
          ),                                                                                      //
          _react2['default'].createElement(                                                       //
            'label',                                                                              //
            { className: 'hide-completed' },                                                      //
            _react2['default'].createElement('input', {                                           //
              type: 'checkbox',                                                                   // 73
              readOnly: true,                                                                     // 74
              checked: this.state.hideCompleted,                                                  // 75
              onClick: this.toggleHideCompleted.bind(this)                                        // 76
            }),                                                                                   //
            'Hide Completed Tasks'                                                                //
          ),                                                                                      //
          _react2['default'].createElement(_AccountsUIWrapper2['default'], null),                 //
          this.props.currentUser ? _react2['default'].createElement(                              //
            'form',                                                                               //
            { className: 'new-task', onSubmit: this.handleSubmit.bind(this) },                    //
            _react2['default'].createElement('input', {                                           //
              type: 'text',                                                                       // 86
              ref: 'textInput',                                                                   // 87
              placeholder: 'Type to add new tasks'                                                // 88
            })                                                                                    //
          ) : ''                                                                                  //
        ),                                                                                        //
        _react2['default'].createElement(                                                         //
          'ul',                                                                                   //
          null,                                                                                   //
          this.renderTasks()                                                                      //
        )                                                                                         //
      );                                                                                          //
    }                                                                                             //
                                                                                                  //
    return render;                                                                                //
  }();                                                                                            //
                                                                                                  //
  return App;                                                                                     //
}(_react.Component);                                                                              //
                                                                                                  //
App.propTypes = {                                                                                 // 102
  tasks: _react.PropTypes.array.isRequired,                                                       // 103
  incompleteCount: _react.PropTypes.number.isRequired,                                            // 104
  currentUser: _react.PropTypes.object                                                            // 105
                                                                                                  //
};                                                                                                //
                                                                                                  //
exports['default'] = (0, _reactMeteorData.createContainer)(function () {                          //
  _meteor.Meteor.subscribe('tasks');                                                              // 110
                                                                                                  //
  return {                                                                                        // 112
    tasks: _tasks.Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),                            // 113
    incompleteCount: _tasks.Tasks.find({ checked: { $ne: true } }).count(),                       // 114
    currentUser: _meteor.Meteor.user()                                                            // 115
  };                                                                                              //
}, App);                                                                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////

}],"Task.jsx":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits","react","meteor/meteor","../api/tasks.js","classnames",function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// imports/ui/Task.jsx                                                                            //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
exports.__esModule = true;                                                                        //
                                                                                                  //
var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');                           //
                                                                                                  //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                  //
                                                                                                  //
var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');     //
                                                                                                  //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);            //
                                                                                                  //
var _inherits2 = require('babel-runtime/helpers/inherits');                                       //
                                                                                                  //
var _inherits3 = _interopRequireDefault(_inherits2);                                              //
                                                                                                  //
var _react = require('react');                                                                    // 1
                                                                                                  //
var _react2 = _interopRequireDefault(_react);                                                     //
                                                                                                  //
var _meteor = require('meteor/meteor');                                                           // 2
                                                                                                  //
var _tasks = require('../api/tasks.js');                                                          // 3
                                                                                                  //
var _classnames = require('classnames');                                                          // 4
                                                                                                  //
var _classnames2 = _interopRequireDefault(_classnames);                                           //
                                                                                                  //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
                                                                                                  //
// Task component - represents a single todo item                                                 //
                                                                                                  //
var Task = function (_Component) {                                                                //
  (0, _inherits3['default'])(Task, _Component);                                                   //
                                                                                                  //
  function Task() {                                                                               //
    (0, _classCallCheck3['default'])(this, Task);                                                 //
    return (0, _possibleConstructorReturn3['default'])(this, _Component.apply(this, arguments));  //
  }                                                                                               //
                                                                                                  //
  Task.prototype.toggleChecked = function () {                                                    //
    function toggleChecked() {                                                                    //
      // Set the checked property to the opposite of its current value                            //
      _tasks.Tasks.update(this.props.task._id, {                                                  // 11
        $set: { checked: !this.props.task.checked }                                               // 12
      });                                                                                         //
      _meteor.Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);     // 14
    }                                                                                             //
                                                                                                  //
    return toggleChecked;                                                                         //
  }();                                                                                            //
                                                                                                  //
  Task.prototype.deleteThisTask = function () {                                                   // 8
    function deleteThisTask() {                                                                   //
      _tasks.Tasks.remove(this.props.task._id);                                                   // 18
      _meteor.Meteor.call('tasks.remove', this.props.task._id);                                   // 19
    }                                                                                             //
                                                                                                  //
    return deleteThisTask;                                                                        //
  }();                                                                                            //
                                                                                                  //
  Task.prototype.togglePrivate = function () {                                                    // 8
    function togglePrivate() {                                                                    //
      _meteor.Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task['private']);  // 23
    }                                                                                             //
                                                                                                  //
    return togglePrivate;                                                                         //
  }();                                                                                            //
                                                                                                  //
  Task.prototype.render = function () {                                                           // 8
    function render() {                                                                           //
      // Give tasks a different className when they are checked off,                              //
      // so that we can style them nicely in CSS                                                  //
      //const taskClassName = this.props.task.checked ? 'checked' : '';                           //
      var taskClassName = (0, _classnames2['default'])({                                          // 31
        checked: this.props.task.checked,                                                         // 32
        'private': this.props.task['private']                                                     // 33
      });                                                                                         //
                                                                                                  //
      return _react2['default'].createElement(                                                    // 36
        'li',                                                                                     //
        { className: taskClassName },                                                             //
        _react2['default'].createElement(                                                         //
          'button',                                                                               //
          { className: 'delete', onClick: this.deleteThisTask.bind(this) },                       //
          '×'                                                                                     //
        ),                                                                                        //
        _react2['default'].createElement('input', {                                               //
          type: 'checkbox',                                                                       // 42
          readOnly: true,                                                                         // 43
          checked: this.props.task.checked,                                                       // 44
          onClick: this.toggleChecked.bind(this)                                                  // 45
        }),                                                                                       //
        this.props.showPrivateButton ? _react2['default'].createElement(                          //
          'button',                                                                               //
          { className: 'toggle-private', onClick: this.togglePrivate.bind(this) },                //
          this.props.task['private'] ? 'Private' : 'Public'                                       //
        ) : '',                                                                                   //
        _react2['default'].createElement(                                                         //
          'span',                                                                                 //
          { className: 'text' },                                                                  //
          _react2['default'].createElement(                                                       //
            'strong',                                                                             //
            null,                                                                                 //
            this.props.task.username                                                              //
          ),                                                                                      //
          ': ',                                                                                   //
          this.props.task.text                                                                    //
        )                                                                                         //
      );                                                                                          //
    }                                                                                             //
                                                                                                  //
    return render;                                                                                //
  }();                                                                                            //
                                                                                                  //
  return Task;                                                                                    //
}(_react.Component);                                                                              //
                                                                                                  //
exports['default'] = Task;                                                                        //
                                                                                                  //
                                                                                                  //
Task.propTypes = {                                                                                // 62
  // This component gets the task to display through a React prop.                                //
  // We can use propTypes to indicate it is required                                              //
  task: _react.PropTypes.object.isRequired,                                                       // 65
  showPrivateButton: _react2['default'].PropTypes.bool.isRequired                                 // 66
};                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

}]}}},{"extensions":[".js",".json",".html",".jsx",".css"]});
require("./client/main.html");
require("./client/main.jsx");