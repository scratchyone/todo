import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
  Link,
  Redirect,
  withRouter,
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
let api_url = 'https://vps.scratchyone.com/todo/todo';
if (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
)
  api_url = 'http://localhost/todo';
function getCookie(name) {
  // Split cookie string and get all individual name=value pairs in an array
  var cookieArr = document.cookie.split(';');

  // Loop through the array elements
  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split('=');

    /* Removing whitespace at the beginning of the cookie name
      and compare it with the given string */
    if (name === cookiePair[0].trim()) {
      // Decode the cookie value and return
      return decodeURIComponent(cookiePair[1]);
    }
  }

  // Return null if not found
  return null;
}
function setCookie(name, value, daysToLive) {
  // Encode value in order to escape semicolons, commas, and whitespace
  var cookie = name + '=' + encodeURIComponent(value);

  if (typeof daysToLive === 'number') {
    /* Sets the max-age attribute so that the cookie expires
      after the specified number of days */
    cookie += '; max-age=' + daysToLive * 24 * 60 * 60;

    document.cookie = cookie;
  }
}
function fakeEmail() {
  let prefixes = [
    'Example',
    'Person',
    'Name',
    'User',
    'Guy',
    'Username',
    'Cat',
    'Dog',
  ];
  let postfixes = [
    'Man',
    '24',
    '65',
    'Cool',
    'Neat',
    '27',
    '99',
    '102',
    'Dude',
  ];
  //let tlds = ['com', 'org', 'net', 'xyz', 'biz'];

  return (
    prefixes[Math.floor(Math.random() * prefixes.length)] +
    postfixes[Math.floor(Math.random() * postfixes.length)]
  );

  //+
  //    '.' +
  //    tlds[Math.floor(Math.random() * tlds.length)]
}
let Swal = window.Swal;
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      first: true,
      loaded: false,
      uid: false,
      runagain: true,
      online: false,
    };
  }
  updateTodos(action, id, text, done) {
    fetch(api_url + '/update', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Basic Og==',
      },
      body: JSON.stringify({
        username: getCookie('username'),
        token: getCookie('token'),
        action: action,
        id: id,
        text: text,
        done: done,
      }),
    })
      .then((response) => {})
      .catch((err) => {
        console.log(err);
      });
  }
  componentDidMount() {
    this.loadTodos(true);
    window.setInterval(() => {
      this.setState({ runagain: true });
      this.loadTodos(false);
    }, 5000);
  }
  loadTodos(go) {
    if ((getCookie('username') !== '' && getCookie('token') !== '') || go) {
      fetch(api_url + '/me', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          username: getCookie('username'),
          token: getCookie('token'),
        }),
      })
        .then((response) => {
          response.json().then((response) => {
            if (!response.error) {
              this.setState({
                todos: response.response.user.todos,
                uid: true,
              });
              console.log(response);
            } else {
              this.setState({ uid: false });
              setCookie('username', '', 100);
              setCookie('token', '', 100);
              console.log(response);
            }
            if (this.state.offline) {
              window.location.reload();
            }
          });
        })
        .catch((err) => {
          console.log(err);
          if (!this.state.offline) {
            Swal.fire({
              title: 'Server Error!',
              text:
                'We are currently experiencing a problem with our server. Please come back later.',
              type: 'error',
              showConfirmButton: false,
              allowEscapeKey: false,
              allowOutsideClick: false,
            });
            this.setState({ offline: true });
          }
        });
    }
  }
  strikethrough(i) {
    let newtodos = this.state.todos;
    newtodos[i].done = !newtodos[i].done;
    this.setState({ todos: newtodos });
    this.updateTodos('done', newtodos[i].id, '', newtodos[i].done);
  }
  remove(i) {
    let newtodos = this.state.todos;
    let id = newtodos[i].id;
    newtodos.splice(i, 1);
    this.setState({ todos: newtodos });
    this.updateTodos('remove', id, '', false);
  }
  moveup(i) {
    if (Number(i) !== 0) {
      let newtodos = this.state.todos;
      var element = newtodos[Number(i)];
      newtodos.splice(Number(i), 1);
      newtodos.splice(Number(i) - 1, 0, element);
      this.setState({ todos: newtodos });
      //this.updateTodos(newtodos);
    }
  }
  movedown(i) {
    if (Number(i) !== this.state.todos.length - 1) {
      let newtodos = this.state.todos;
      var element = newtodos[Number(i)];
      newtodos.splice(Number(i), 1);
      newtodos.splice(Number(i) + 1, 0, element);
      this.setState({ todos: newtodos });
      //this.updateTodos(newtodos);
    }
  }
  add(text) {
    let newtodos = this.state.todos;
    let id = uuidv1();
    newtodos.push({
      text: text,
      done: false,
      id: id,
    });
    this.setState({ todos: newtodos, first: false });
    this.updateTodos('add', id, text, false);
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
                    add={(text) => {
                      this.add(text);
                    }}
                    remove={(i) => {
                      this.remove(i);
                    }}
                    moveup={(i) => {
                      this.moveup(i);
                    }}
                    movedown={(i) => {
                      this.movedown(i);
                    }}
                    strikethrough={(i) => {
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
                  return (
                    <SignUp
                      loadTodos={() => this.loadTodos()}
                      uid={this.state.uid}
                    />
                  );
                }}
              />
              <Route
                exact
                path="/login"
                render={() => {
                  return (
                    <SignIn
                      loadTodos={() => this.loadTodos()}
                      uid={this.state.uid}
                    />
                  );
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
      'Wow, great job finishing your tasks!',
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
                ' is supported.',
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
            __html: converter.makeHtml(this.props.item.text),
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
      forceAddHover: false,
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
          onChange={(event) => {
            this.setState({ addvalue: event.target.value });
          }}
          onKeyDown={(event) => {
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
    fetch(api_url + '/logout', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Basic Og==',
      },
      body: JSON.stringify({
        username: getCookie('username'),
        token: getCookie('token'),
      }),
    })
      .then((response) => {
        response.json().then((response) => {
          console.log(response);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  changePassword() {
    Swal.fire({
      title: 'Enter new password',
      input: 'text',
      inputValue: '',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
      },
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          title: 'Enter password again',
          input: 'text',
          inputValue: '',
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'You need to write something!';
            }
          },
        }).then((result2) => {
          if (result2.value === result.value) {
            console.log(result.value);
            fetch(api_url + '/change_password', {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
                authorization: 'Basic Og==',
              },
              body: JSON.stringify({
                username: getCookie('username'),
                token: getCookie('token'),
                password: result.value,
              }),
            })
              .then((response) => {
                response.json().then((response) => {
                  console.log(response);

                  if (!response.error) {
                    Swal.fire(
                      'Changed!',
                      'Your password has been changed',
                      'success'
                    );
                  } else {
                    Swal.fire('Error!', response.error_message, 'error');
                  }
                });
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            Swal.fire(
              "Passwords don't match",
              "Your passwords don't match!",
              'error'
            );
          }
        });
        //Swal.fire(
        //  'Currently not available',
        //  'Due to a change in the backend of this service, the "email my todos" feature is currently unavailable.',
        //  'error'
        //);
      }
    });
  }
  emailTodos() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to be sent your todos?',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, send them!',
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          title: 'Input email address',
          input: 'email',
          inputPlaceholder: 'Enter your email address',
        }).then((result) => {
          if (result) {
            console.log(result.value);
            Swal.fire(`Entered email: ${result.value}`);
            fetch(api_url + '/email', {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
                authorization: 'Basic Og==',
              },
              body: JSON.stringify({
                username: getCookie('username'),
                token: getCookie('token'),
                email: result.value,
              }),
            })
              .then((response) => {
                response.json().then((response) => {
                  console.log(response);

                  if (!response.error) {
                    Swal.fire('Sent!', 'The email has been sent.', 'success');
                  } else {
                    Swal.fire('Error!', response.error_message, 'error');
                  }
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
        //Swal.fire(
        //  'Currently not available',
        //  'Due to a change in the backend of this service, the "email my todos" feature is currently unavailable.',
        //  'error'
        //);
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
          strikethrough={(i) => {
            this.props.strikethrough(i);
          }}
          remove={(i) => {
            this.props.remove(i);
          }}
          items={this.props.todos}
          first={this.props.first}
          editing={this.state.editing}
          movedown={(i) => {
            this.props.movedown(i);
          }}
          moveup={(i) => {
            this.props.moveup(i);
          }}
        />
        <ItemInput
          add={(text) => {
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
              this.changePassword();
            }}
          >
            Change my password
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
      fakePassword: '•'.repeat(Math.floor(Math.random() * (9 - 5 + 1) + 5)),
    };
  }
  signup(evt) {
    evt.target.blur();
    console.log({
      username: this.state.username,
      password: this.state.password,
    });
    fetch(api_url + '/signup', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Basic Og==',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
      .then((response) => {
        response.json().then((response) => {
          console.log(response);
          this.setState({ error: response.error_message || '' });
          if (!response.error) {
            setCookie('username', this.state.username, 100);
            setCookie('token', response.response.token, 100);
            this.props.loadTodos();
          }
        });
      })
      .catch((err) => {
        console.log(err);
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
          onChange={(evt) => {
            this.setState({
              username: evt.target.value,
            });
          }}
          placeholder={this.state.fakeEmail}
          className="username-password-input"
          type="text"
          value={this.state.username}
        />
        <input
          onChange={(evt) => {
            this.setState({
              password: evt.target.value,
            });
          }}
          placeholder={this.state.fakePassword}
          className="username-password-input"
          type="password"
          value={this.state.password}
        />
        <button
          className="simple-button"
          onClick={(evt) => {
            this.signup(evt);
          }}
        >
          Sign Up
        </button>
        <div className="mt-1 text-red-600">{this.state.error}</div>
        <div className="mt-1 text-gray-900 mr-10">
          Existing user?
          <Link className="ml-1 text-blue-600 no-underline" to="/login">
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
      fakePassword: '•'.repeat(Math.floor(Math.random() * (9 - 5 + 1) + 5)),
    };
  }
  signin(evt) {
    evt.target.blur();
    fetch(api_url + '/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Basic Og==',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
      .then((response) => {
        response.json().then((response) => {
          console.log(response);
          this.setState({ error: response.error_message || '' });
          if (!response.error) {
            setCookie('username', this.state.username, 100);
            setCookie('token', response.response.token, 100);
            this.props.loadTodos();
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <div>
        {this.props.uid ? <Redirect to="/todo/" /> : ''}
        <Helmet>
          <title>Sign In</title>
        </Helmet>
        <h1 className="header mb-2">Sign In</h1>
        <input
          placeholder={this.state.fakeEmail}
          value={this.state.username}
          className="username-password-input"
          type="text"
          onChange={(evt) => {
            this.setState({
              username: evt.target.value,
            });
          }}
        />
        <input
          placeholder={this.state.fakePassword}
          value={this.state.password}
          className="username-password-input"
          type="password"
          onChange={(evt) => {
            this.setState({
              password: evt.target.value,
            });
          }}
        />
        <button
          className="simple-button"
          onClick={(evt) => {
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
