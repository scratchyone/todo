import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import { Helmet } from 'react-helmet';
//import './output.css';
import './css/index.scss';
import uuidv1 from './uuid.js';
import ReactDOM from 'react-dom';
import { Offline, Online } from 'react-detect-offline';
import registerServiceWorker from './registerServiceWorker';
var showdown = require('showdown'),
  converter = new showdown.Converter();
const firebase = window.firebase;
var firebaseConfig = {
  apiKey: 'AIzaSyBxYWnOE-ZiFR1yoc9TQMv96OwPb8fIPzk',
  authDomain: 'scratchyonetodoapp.firebaseapp.com',
  databaseURL: 'https://scratchyonetodoapp.firebaseio.com',
  projectId: 'scratchyonetodoapp',
  storageBucket: 'scratchyonetodoapp.appspot.com',
  messagingSenderId: '1087180250922',
  appId: '1:1087180250922:web:90ba6f88e2007a7c'
};
function fakeEmail() {
  let prefixes = ['example', 'person', 'name', 'user', 'guy', 'username'];
  let postfixes = [
    'example',
    'gmail',
    'outlook',
    'aol',
    'website',
    'email',
    'company',
    'school',
    'buisness'
  ];
  let tlds = ['com', 'org', 'net', 'xyz', 'biz'];
  return (
    prefixes[Math.floor(Math.random() * prefixes.length)] +
    '@' +
    postfixes[Math.floor(Math.random() * postfixes.length)] +
    '.' +
    tlds[Math.floor(Math.random() * tlds.length)]
  );
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let Swal = window.Swal;
const db = firebase.firestore();
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      first: true,
      uid: null,
      loaded: false
    };
  }
  updateTodos(todos) {
    //NEEDED: Instead of replacing array, add todos using firebase api
    db.collection('users')
      .doc(this.state.uid)
      .update({
        todos: todos
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error('Error updating document: ', error);
      });
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        db.collection('users')
          .doc(user.uid)
          .onSnapshot(doc => {
            if (doc.data()) {
              this.setState({ todos: doc.data().todos, uid: user.uid });
            }
          });
        // ...
      } else {
        // User is signed out.
        this.setState({ uid: false });
      }
    });
  }

  strikethrough(i) {
    let newtodos = this.state.todos;
    newtodos[i].done = !newtodos[i].done;
    this.setState({ todos: newtodos });
    this.updateTodos(newtodos);
  }

  remove(i) {
    let newtodos = this.state.todos;
    newtodos.splice(i, 1);
    this.setState({ todos: newtodos });
    this.updateTodos(newtodos);
  }
  moveup(i) {
    if (Number(i) !== 0) {
      let newtodos = this.state.todos;
      var element = newtodos[Number(i)];
      newtodos.splice(Number(i), 1);
      newtodos.splice(Number(i) - 1, 0, element);
      this.setState({ todos: newtodos });
      this.updateTodos(newtodos);
    }
  }
  movedown(i) {
    if (Number(i) !== this.state.todos.length - 1) {
      let newtodos = this.state.todos;
      var element = newtodos[Number(i)];
      newtodos.splice(Number(i), 1);
      newtodos.splice(Number(i) + 1, 0, element);
      this.setState({ todos: newtodos });
      this.updateTodos(newtodos);
    }
  }
  add(text) {
    let newtodos = this.state.todos;
    newtodos.push({
      text: text,
      done: false,
      key: uuidv1()
    });
    this.setState({ todos: newtodos, first: false });
    this.updateTodos(newtodos);
  }
  render() {
    return (
      <div className="display" style={{ overflow: 'hidden' }}>
        <div className="app">
          <Online>
            <Switch>
              <Route
                exact
                path="/todo"
                render={() => (
                  <ToDoContainer
                    first={this.state.first}
                    todos={this.state.todos}
                    add={text => {
                      this.add(text);
                    }}
                    remove={i => {
                      this.remove(i);
                    }}
                    moveup={i => {
                      this.moveup(i);
                    }}
                    movedown={i => {
                      this.movedown(i);
                    }}
                    strikethrough={i => {
                      this.strikethrough(i);
                    }}
                    uid={this.state.uid}
                  />
                )}
              />
              <Route
                exact
                path="/"
                render={() => {
                  return <SignUp uid={this.state.uid} />;
                }}
              />
              <Route
                exact
                path="/signin"
                render={() => {
                  return <SignIn uid={this.state.uid} />;
                }}
              />
              <Route render={() => <Redirect to="/" />} />
            </Switch>
          </Online>
          <Offline>
            You are currently offline. To prevent loss of data, this app only
            works online.
          </Offline>
        </div>
      </div>
    );
  }
}

class Todos extends React.Component {
  render() {
    let congrats = [
      'Nothing to do! Great job!',
      'You finished your tasks! Why not try a refreshing Coca-Cola?',
      'This congratulations was made possible by Coca-Cola.',
      'Wow, great job finishing your tasks!'
    ];
    let todos = [];
    for (let i in this.props.items) {
      todos.push(
        <Todo
          strikethrough={() => {
            this.props.strikethrough(i);
          }}
          moveup={() => {
            this.props.moveup(i);
          }}
          movedown={() => {
            this.props.movedown(i);
          }}
          remove={() => {
            this.props.remove(i);
          }}
          item={this.props.items[i]}
          key={this.props.items[i].key}
          first={this.props.first}
          editing={this.props.editing}
        />
      );
    }
    if (this.props.items.length === 0) {
      todos.push(
        <div
          className={(this.props.first ? '' : 'todo-empty') + ' text-center'}
          key={0}
        >
          {this.props.first
            ? [
                'Add items with the box below!',
                <br key={Math.random()} />,
                <a
                  className="text-blue-600 hover:text-blue-700 color-transition"
                  href="https://www.markdownguide.org/cheat-sheet/"
                  key={Math.random()}
                >
                  Markdown
                </a>,
                ' is supported.'
              ]
            : congrats[Math.floor(Math.random() * congrats.length)]}
        </div>
      );
    }
    return <div className="todo-holder">{todos}</div>;
  }
}

class Todo extends React.Component {
  render() {
    return (
      <div className="todo">
        <button
          onClick={() => {
            this.props.moveup();
          }}
          style={{ display: this.props.editing ? '' : 'none' }}
        >
          <i className="fas fa-angle-up" />
        </button>
        <button
          className="mr-2 ml-1"
          onClick={() => {
            this.props.movedown();
          }}
          style={{ display: this.props.editing ? '' : 'none' }}
        >
          <i className="fas fa-angle-down" />
        </button>
        <button
          className={'todo-remove-button fas fa-times '}
          onClick={() => {
            this.props.remove();
          }}
        />
        <button
          onClick={() => {
            this.props.strikethrough();
          }}
          className={'todo-text ' + (this.props.item.done ? 'done' : '')}
          dangerouslySetInnerHTML={{
            __html: converter.makeHtml(this.props.item.text)
          }}
        />
      </div>
    );
  }
}

class ItemInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addvalue: '',
      isMounted: false,
      forceAddHover: false
    };
  }
  componentDidMount() {
    this.setState({ isMounted: true });
  }
  componentWillUnmount() {
    this.setState({ isMounted: false });
  }
  add() {
    if (this.state.addvalue !== '') {
      this.props.add(this.state.addvalue);
      this.setState({ addvalue: '' });
    }
  }
  render() {
    return (
      <div className={'todo-input-holder'}>
        <input
          value={this.state.addvalue}
          onChange={event => {
            this.setState({ addvalue: event.target.value });
          }}
          onKeyDown={event => {
            if (event.keyCode === 13) {
              this.add();
            }
          }}
          className="todo-input"
          type="text"
        />
        <button
          onClick={() => {
            this.add();
          }}
          className={
            'todo-add-button ' +
            (this.state.forceAddHover ? 'forceTouchHover' : '')
          }
          onMouseDown={() => {
            //alert('mouseup');
            this.setState({ forceAddHover: true });
          }}
          onMouseUp={() => {
            //this.setState({ forceAddHover: false });
            window.setTimeout(() => {
              if (this.state.isMounted) this.setState({ forceAddHover: false });
            }, 200);
          }}
        >
          <i className="fas fa-plus" />
        </button>
      </div>
    );
  }
}
class ToDoContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editing: false };
  }
  signout() {
    firebase.auth().signOut();
  }
  emailTodos() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to be sent your todos?',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, send them!'
    }).then(result => {
      if (result.value) {
        Swal.fire('Sent!', 'The email has been sent.', 'success');
        firebase.functions().httpsCallable('sendTodos')();
      }
    });
  }
  render() {
    return (
      <div style={{ visibility: this.props.uid ? '' : 'hidden' }}>
        <Helmet>
          <title>My Todos</title>
        </Helmet>
        {this.props.uid === false ? <Redirect to="/" /> : ''}
        <h1 className="header">
          <span>To-Do</span>
          <span>
            <button
              onClick={() => {
                this.setState({ editing: !this.state.editing });
              }}
            >
              <i className="ml-2 text-base far fa-caret-square-down" />
            </button>
          </span>
        </h1>
        <Todos
          strikethrough={i => {
            this.props.strikethrough(i);
          }}
          remove={i => {
            this.props.remove(i);
          }}
          items={this.props.todos}
          first={this.props.first}
          editing={this.state.editing}
          movedown={i => {
            this.props.movedown(i);
          }}
          moveup={i => {
            this.props.moveup(i);
          }}
        />
        <ItemInput
          add={text => {
            this.props.add(text);
          }}
        />
        <div className="text-center mt-1">
          <button
            onClick={() => {
              this.signout();
            }}
            className="simple-button"
          >
            Sign Out
          </button>
        </div>
        <div className="text-center mt-1">
          <button
            className="text-blue-900 hover:text-blue-800 color-transition"
            onClick={() => {
              this.emailTodos();
            }}
          >
            Email me my todos
          </button>
        </div>
      </div>
    );
  }
}
class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      username: '',
      password: '',
      fakeEmail: fakeEmail(),
      fakePassword: '•'.repeat(Math.floor(Math.random() * (9 - 5 + 1) + 5))
    };
  }
  signup(evt) {
    evt.target.blur();
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.username, this.state.password)
      .catch(error => {
        // Handle Errors here.
        var errorMessage = error.message;
        console.log(errorMessage);
        this.setState({ error: errorMessage });
      });
  }
  render() {
    return (
      <div className="">
        {this.props.uid ? <Redirect to="/todo" /> : ''}
        <Helmet>
          <title>Sign Up</title>
        </Helmet>
        <h1 className="header mb-2">Sign Up</h1>
        <input
          onChange={evt => {
            this.setState({
              username: evt.target.value
            });
          }}
          placeholder={this.state.fakeEmail}
          className="username-password-input"
          type="text"
          value={this.state.username}
        />
        <input
          onChange={evt => {
            this.setState({
              password: evt.target.value
            });
          }}
          placeholder={this.state.fakePassword}
          className="username-password-input"
          type="password"
          value={this.state.password}
        />
        <button
          className="simple-button"
          onClick={evt => {
            this.signup(evt);
          }}
        >
          Sign Up
        </button>
        <div className="mt-1 text-red-600">{this.state.error}</div>
        <div className="mt-1 text-gray-900 mr-10">
          Existing user?
          <Link className="ml-1 text-blue-600 no-underline" to="/signin">
            Sign In
          </Link>
        </div>
      </div>
    );
  }
}

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      username: '',
      password: '',
      fakeEmail: fakeEmail(),
      fakePassword: '•'.repeat(Math.floor(Math.random() * (9 - 5 + 1) + 5))
    };
  }
  signin(evt) {
    evt.target.blur();
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.username, this.state.password)
      .catch(error => {
        // Handle Errors here.
        var errorMessage = error.message;
        console.log(errorMessage);
        this.setState({ error: errorMessage });
      });
  }
  render() {
    return (
      <div>
        {this.props.uid ? <Redirect to="/todo" /> : ''}
        <Helmet>
          <title>Sign In</title>
        </Helmet>
        <h1 className="header mb-2">Sign In</h1>
        <input
          placeholder={this.state.fakeEmail}
          value={this.state.username}
          className="username-password-input"
          type="text"
          onChange={evt => {
            this.setState({
              username: evt.target.value
            });
          }}
        />
        <input
          placeholder={this.state.fakePassword}
          value={this.state.password}
          className="username-password-input"
          type="password"
          onChange={evt => {
            this.setState({
              password: evt.target.value
            });
          }}
        />
        <button
          className="simple-button"
          onClick={evt => {
            this.signin(evt);
          }}
        >
          Sign In
        </button>
        <div className="mt-1 text-red-600">{this.state.error}</div>
        <div className="mt-1 text-grey-900">
          Don't have an account?
          <Link className="ml-1 text-blue-600 no-underline" to="/">
            Sign Up
          </Link>
        </div>
      </div>
    );
  }
}
App = withRouter(App);
ReactDOM.render(
  <BrowserRouter basename="/todo">
    <div>
      <App />
    </div>
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
