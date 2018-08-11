import React from 'react';
import { BrowserRouter, Route, Switch, Link, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './output.css';
import './index.css';
import uuidv1 from './uuid.js';
import ReactDOM from 'react-dom';
import { Offline, Online } from 'react-detect-offline';
import registerServiceWorker from './registerServiceWorker';
let api = 'https://vps.scratchyone.com/todo';
if (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
)
  api = 'http://localhost:3000';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      first: true,
      fetchTodos: null
    };
  }
  updateTodos(todos) {
    fetch(api + '/settodos?', {
      method: 'post',
      credentials: 'include',
      body: JSON.stringify({ todos: todos }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        return response.json();
      })
      .then(doc => {})
      .catch(function(err) {
        // Error :(
      });
  }
  fetchTodos() {
    fetch(api + '/info', {
      method: 'get',
      credentials: 'include'
    })
      .then(response => {
        return response.json();
      })
      .then(doc => {
        if (doc.authorized) {
          this.setState({
            todos: doc.todos
          });
        }
      })
      .catch(function(err) {
        // Error :(
      });
  }
  componentDidMount() {
    this.fetchTodos();
    let fetchTodos = window.setInterval(() => {
      this.fetchTodos();
    }, 1000);
    this.setState({ fetchTodos: fetchTodos });
  }
  componentWillUnmount() {
    clearInterval(this.state.fetchTodos);
  }

  strikethrough(i) {
    let newtodos = this.state.todos;
    newtodos[i].done = !newtodos[i].done;
    this.setState({ todos: newtodos });
    this.updateTodos(newtodos);
  }

  remove(i) {
    let newtodos = this.state.todos;
    newtodos[i].hidden = true;
    this.setState({ todos: newtodos });
    this.updateTodos(newtodos);
  }

  add(text) {
    let newtodos = this.state.todos;
    newtodos.push({ text: text, done: false, key: uuidv1() });
    this.setState({ todos: newtodos, first: false });
    this.updateTodos(newtodos);
  }
  render() {
    return (
      <div className="h-screen max-h-screen overflow-hidden">
        <div className="absolute w-full h-10 bg-black" />
        <div className="holder max-h-full">
          <div className="box-holder">
            <div className="box">
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
                        strikethrough={i => {
                          this.strikethrough(i);
                        }}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/"
                    render={() => {
                      return <SignUp />;
                    }}
                  />
                  <Route
                    exact
                    path="/signin"
                    render={() => {
                      return <SignIn />;
                    }}
                  />
                  <Route render={() => <Redirect to="/" />} />
                </Switch>
              </Online>
              <Offline>
                You are currently offline. To prevent loss of data, this app
                only works online.
              </Offline>
            </div>
          </div>
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
      if (!this.props.items[i].hidden) {
        todos.push(
          <Todo
            strikethrough={() => {
              this.props.strikethrough(i);
            }}
            remove={() => {
              this.props.remove(i);
            }}
            item={this.props.items[i]}
            key={this.props.items[i].key}
            first={this.props.first}
          />
        );
      }
    }
    if (this.props.items.length === 0) {
      todos.push(
        <div className={this.props.first ? '' : 'no-tasks'} key={0}>
          {this.props.first
            ? 'Add items with the box below!'
            : congrats[Math.floor(Math.random() * congrats.length)]}
        </div>
      );
    }
    return <div className="todos">{todos}</div>;
  }
}

class Todo extends React.Component {
  render() {
    return (
      <div className="todo">
        <button
          className={'remove-button fas fa-times '}
          onClick={() => {
            this.props.remove();
          }}
        />
        <button
          onClick={() => {
            this.props.strikethrough();
          }}
          className={'list-item '}
          style={{
            color: this.props.item.done ? '#606f7b' : '',
            textDecorationColor: this.props.item.done ? 'black' : 'transparent',
            WebkitTextDecorationColor: this.props.item.done
              ? '#000000'
              : 'transparent'
          }}
        >
          {this.props.item.text}
        </button>
        <i className="float-right text-sm ml-2 fas fa-ellipsis-v" />
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
      <div className={'item-input'}>
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
          className="add-input"
          type="text"
        />
        <button
          onClick={() => {
            this.add();
          }}
          className={
            'add-button ' + (this.state.forceAddHover ? 'forceTouchHover' : '')
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
    this.state = {
      redirect: ''
    };
  }
  componentDidMount() {
    fetch(api + '/info', {
      method: 'get',
      credentials: 'include'
    })
      .then(response => {
        return response.json();
      })
      .then(doc => {
        if (!doc.authorized) {
          this.setState({ redirect: <Redirect to="/" /> });
        }
      })
      .catch(function(err) {
        // Error :(
      });
  }
  signout() {
    fetch(api + '/signout?', {
      method: 'post',
      credentials: 'include'
    })
      .then(response => {
        return response.json();
      })
      .then(doc => {
        this.setState({ redirect: <Redirect to="/" /> });
      })
      .catch(function(err) {
        // Error :(
      });
  }
  render() {
    return (
      <div>
        <Helmet>
          <title>My Todos</title>
        </Helmet>
        {this.state.redirect}
        <h1 className="header">To-Do</h1>
        <Todos
          strikethrough={i => {
            this.props.strikethrough(i);
          }}
          remove={i => {
            this.props.remove(i);
          }}
          items={this.props.todos}
          first={this.props.first}
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
            className="sign"
          >
            Sign Out
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
      redirect: '',
      visible: 'hidden',
      error: '',
      username: '',
      password: ''
    };
  }
  signup(evt) {
    evt.target.blur();
    fetch(api + '/signup?', {
      method: 'post',
      credentials: 'include',
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        return response.json();
      })
      .then(doc => {
        if (doc.success) {
          this.setState({ redirect: <Redirect to="/todo" /> });
        } else {
          this.setState({ error: doc.error });
        }
      })
      .catch(function(err) {
        // Error :(
      });
  }
  componentDidMount() {
    fetch(api + '/info', {
      method: 'get',
      credentials: 'include'
    })
      .then(response => {
        return response.json();
      })
      .then(doc => {
        if (doc.authorized) {
          this.setState({ redirect: <Redirect to="/todo" /> });
        } else {
          this.setState({ visible: '' });
        }
      })
      .catch(function(err) {
        // Error :(
      });
  }
  render() {
    return (
      <div style={{ visibility: this.state.visible }}>
        {this.state.redirect}
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
          placeholder="Username"
          className="easy-input"
          type="text"
          value={this.state.username}
        />
        <input
          onChange={evt => {
            this.setState({
              password: evt.target.value
            });
          }}
          placeholder="Password"
          className="easy-input"
          type="password"
          value={this.state.password}
        />
        <button
          className="sign"
          onClick={evt => {
            this.signup(evt);
          }}
        >
          Sign Up
        </button>
        <div className="mt-1 text-red">{this.state.error}</div>
        <div className="mt-1 text-grey-darkest">
          Existing user?
          <Link className="ml-1 text-blue-dark no-underline" to="/signin">
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
      redirect: '',
      visible: 'hidden',
      error: '',
      username: '',
      password: ''
    };
  }
  signin(evt) {
    evt.target.blur();
    fetch(api + '/signin?', {
      method: 'post',
      credentials: 'include',
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        return response.json();
      })
      .then(doc => {
        if (doc.success) {
          this.setState({ redirect: <Redirect to="/todo" /> });
        } else {
          this.setState({ error: doc.error });
        }
      })
      .catch(function(err) {
        // Error :(
      });
  }
  componentDidMount() {
    fetch(api + '/info', {
      method: 'get',
      credentials: 'include'
    })
      .then(response => {
        return response.json();
      })
      .then(doc => {
        if (doc.authorized) {
          this.setState({ redirect: <Redirect to="/todo" /> });
        } else {
          this.setState({ visible: '' });
        }
      })
      .catch(function(err) {
        // Error :(
      });
  }
  render() {
    return (
      <div style={{ visiblility: this.state.visible }}>
        {this.state.redirect}
        <Helmet>
          <title>Sign In</title>
        </Helmet>
        <h1 className="header mb-2">Sign In</h1>
        <input
          placeholder="Username"
          value={this.state.username}
          className="easy-input"
          type="text"
          onChange={evt => {
            this.setState({
              username: evt.target.value
            });
          }}
        />
        <input
          placeholder="Password"
          value={this.state.password}
          className="easy-input"
          type="password"
          onChange={evt => {
            this.setState({
              password: evt.target.value
            });
          }}
        />
        <button
          className="sign"
          onClick={evt => {
            this.signin(evt);
          }}
        >
          Sign In
        </button>
        <div className="mt-1 text-red">{this.state.error}</div>
        <div className="mt-1 text-grey-darkest">
          Don't have an account?
          <Link className="ml-1 text-blue-dark no-underline" to="/">
            Sign Up
          </Link>
        </div>
      </div>
    );
  }
}
ReactDOM.render(
  <BrowserRouter basename="/todo">
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
