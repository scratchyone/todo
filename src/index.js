import React, { useState, useEffect } from 'react';
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
//var showdown = require('showdown'),
//converter = new showdown.Converter();
let api_url =
  'https://vps.scratchyone.com/todo/todo'; /*
if (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
)
  api_url = 'http://localhost:99/todo';*/

let base_api_url = 'https://vps.scratchyone.com/todo';
if (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
)
  base_api_url = 'http://localhost:99';
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
  var cookie = name + '=' + encodeURIComponent(value) + '; path=/;';

  document.cookie = cookie;
}
function delCookie(name) {
  document.cookie =
    name + '= ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
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

function updateTodos(action, id, text, done) {
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

function check_message(message, setMessage) {
  fetch(base_api_url + '/message/messages').then((response) => {
    response.json().then((response) => {
      console.log(response);
      if (response.messages.length > 0) {
        if (response.messages[0].block) {
          Swal.fire({
            title: 'Alert',
            text: response.messages[0].text,
            type: 'error',
            showConfirmButton: false,
            allowEscapeKey: false,
            allowOutsideClick: false,
          });
          setMessage(true);
        } else if (getCookie(response.messages[0].uuid) !== 'true') {
          Swal.fire({
            title: 'Information',
            text: response.messages[0].text,
            type: 'info',
            showConfirmButton: true,
            allowEscapeKey: true,
            allowOutsideClick: true,
          });
          setCookie(response.messages[0].uuid, true);
        }
      }
    });
  });
}

function loadTodos(go, setTodos, setUid) {
  if ((getCookie('username') !== null && getCookie('token') !== null) || go) {
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
            setTodos(response.response.user.todos);
            setUid(true);
            console.log(response);
          } else {
            setUid(false);
            console.log(response);
          }
        });
      })
      .catch((err) => {
        console.log(err);
        delCookie('username');
        delCookie('token');
        if (!this.state.offline && !this.state.message) {
          Swal.fire({
            title: 'Server Error!',
            text:
              'We are currently experiencing a problem with our server. Please come back later.',
            type: 'error',
            showConfirmButton: false,
            allowEscapeKey: false,
            allowOutsideClick: false,
          });
        }
      });
  }
}
function strikethrough(i, todos, setTodos) {
  let newtodos = this.state.todos;
  newtodos[i].done = !newtodos[i].done;
  setTodos(newtodos);
  updateTodos('done', newtodos[i].id, '', newtodos[i].done);
}

function remove(i, todos, setTodos) {
  let newtodos = this.state.todos;
  let id = newtodos[i].id;
  newtodos.splice(i, 1);
  setTodos(newtodos);
  this.updateTodos('remove', id, '', false);
}

function moveup(i, setTodos) {
  if (Number(i) !== 0) {
    let newtodos = this.state.todos;
    var element = newtodos[Number(i)];
    newtodos.splice(Number(i), 1);
    newtodos.splice(Number(i) - 1, 0, element);
    setTodos(newtodos);
    //this.updateTodos(newtodos);
  }
}
function bold(i, todos, setTodos) {
  let newtodos = this.state.todos;
  let id = newtodos[i].id;
  newtodos[i].bold = !newtodos[i].bold;
  setTodos(newtodos);
  this.updateTodos('bold', id, '', newtodos[i].bold);
}
function movedown(i, setTodos) {
  if (Number(i) !== this.state.todos.length - 1) {
    let newtodos = this.state.todos;
    var element = newtodos[Number(i)];
    newtodos.splice(Number(i), 1);
    newtodos.splice(Number(i) + 1, 0, element);
    setTodos(newtodos);
    //this.updateTodos(newtodos);
  }
}
function add(text, todos, setTodos) {
  let id = uuidv1();
  setTodos([
    ...todos,
    {
      text: text,
      done: false,
      id: id,
      bold: false,
    },
  ]);
  updateTodos('add', id, text, false);
}

function App() {
  const [todos, setTodos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [uid, setUid] = useState(false);
  const [runagain, setRunagain] = useState(true);
  const [online, setOnline] = useState(false);
  const [message, setMessage] = useState(false);

  useEffect(() => {
    check_message(message, setMessage);
    loadTodos(true, setTodos, setUid);
    window.setInterval(() => {
      setRunagain(true);
      loadTodos(false, setTodos, setUid);
    }, 5000);
  }, []);

  return (
    <div className="display" style={{ overflow: 'hidden' }}>
      <div
        className={
          'w-full bg-gray-800 absolute top-0 left-0 flex flex-row flex-start items-center' +
          (uid ? '' : ' hidden')
        }
      >
        <Link to="todo" className="m-1 ml-2 text-white text-2xl">
          To-Do
        </Link>
        <a
          href="../../todo_admin"
          className={
            'm-1 ml-10 text-white text-lg' +
            (getCookie('username') === 'admin' ? '' : ' hidden')
          }
        >
          Admin Panel
        </a>
        <Link to="account" className="m-1 ml-10 text-white text-lg">
          Account
        </Link>
      </div>
      <div className="app">
        <Online>
          <Switch>
            <Route
              exact
              path="/todo"
              render={() => (
                <ToDoContainer todos={todos} setTodos={setTodos} uid={uid} />
              )}
            />
            <Route
              exact
              path="/"
              render={() => {
                return <SignUp setTodos={setTodos} uid={uid} />;
              }}
            />
            <Route
              exact
              path="/account"
              render={() => {
                return <Account uid={uid} />;
              }}
            />
            <Route
              exact
              path="/login"
              render={() => {
                return <SignIn setTodos={setTodos} uid={uid} />;
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
          todos={this.props.todos}
          setTodos={this.props.setTodos}
          item={this.props.items[i]}
          key={this.props.items[i].key}
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

class Account extends React.Component {
  render() {
    return (
      <div>
        <h1 className="header">
          <span>My Account</span>
        </h1>
        <span className={(this.props.uid ? 'hidden' : '') + ' text-center'}>
          No account logged in!
          <div className="text-center mt-1">
            <Link to="/">
              <button className="simple-button">Go to homepage</button>
            </Link>
          </div>
        </span>
        <span className={(this.props.uid ? '' : 'hidden') + ' text-center'}>
          <div className="flex">
            <span className="w-1/2 text-left">Username</span>
            <span className="w-1/2 font-bold text-left">
              {getCookie('username')}
            </span>
          </div>
          <div className="text-center mt-1">
            <button onClick={changePassword} className="simple-button">
              Change Password
            </button>
          </div>
          <SignOut />
        </span>
      </div>
    );
  }
}

class Todo extends React.Component {
  render() {
    return (
      <div className="todo">
        <button
          className="mr-2 ml-1"
          onClick={() => {
            this.props.bold();
          }}
          style={{ display: this.props.editing ? '' : 'none' }}
        >
          <i className="fas fa-bold" />
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
          className={
            'todo-text ' +
            (this.props.item.done ? 'done ' : '') +
            (this.props.item.bold ? 'font-bold' : '')
          }
          //dangerouslySetInnerHTML={{
          //  __html: converter.makeHtml(this.props.item.text),
          //}}
        >
          {this.props.item.text}
        </button>
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
      add(this.state.addvalue, this.props.todos, this.props.setTodos);
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
class SignOut extends React.Component {
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
  render() {
    return (
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
    );
  }
}
function changePassword() {
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
                    'Your password has been changed, and you have been logged out on all devices.',
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
          setTodos={this.props.setTodos}
          items={this.props.todos}
          editing={this.state.editing}
        />
        <ItemInput setTodos={this.props.setTodos} todos={this.props.todos} />
        <SignOut />
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
            loadTodos(this.props.setTodos);
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
            loadTodos(this.props.setTodos);
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
