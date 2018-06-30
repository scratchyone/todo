import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './output.css';
import './index.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      keycount: 0
    };
  }
  crossout(i) {
    let newtodos = this.state.todos;
    newtodos[i].done = !newtodos[i].done;
    this.setState({ todos: newtodos });
  }

  remove(i) {
    let newtodos = this.state.todos;
    newtodos.splice(i, 1);
    this.setState({ todos: newtodos });
  }

  add(text) {
    let newtodos = this.state.todos;
    newtodos.push({ text: text, done: false, key: this.state.keycount });
    this.setState({ todos: newtodos, keycount: this.state.keycount + 1 });
  }
  render() {
    return (
      <div className="holder">
        <div>
          <div className="box">
            <Switch>
              <Route
                exact
                path="/todo"
                render={() => (
                  <ToDoContainer
                    keycount={this.state.keycount}
                    todos={this.state.todos}
                    add={text => {
                      this.add(text);
                    }}
                    remove={i => {
                      this.remove(i);
                    }}
                    crossout={i => {
                      this.crossout(i);
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
            </Switch>
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
      todos.push(
        <Todo
          crossout={() => {
            this.props.crossout(i);
          }}
          remove={() => {
            this.props.remove(i);
          }}
          item={this.props.items[i]}
          key={this.props.items[i].key}
        />
      );
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
          className="remove-button fas fa-times"
          onClick={() => {
            this.props.remove();
          }}
        />
        <button
          onClick={() => {
            this.props.crossout();
          }}
          className={'list-item '}
          style={{
            color: this.props.item.done ? '#606f7b' : '',
            textDecorationColor: this.props.item.done ? 'black' : 'transparent'
          }}
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
      addvalue: ''
    };
  }
  add() {
    if (this.state.addvalue !== '') {
      this.props.add(this.state.addvalue);
      this.setState({ addvalue: '' });
    }
  }
  render() {
    return (
      <div className="item-input">
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
          className="add-button"
        >
          <i className="fas fa-plus" />
        </button>
      </div>
    );
  }
}
class ToDoContainer extends React.Component {
  render() {
    return (
      <div>
        <h1 className="header">To-Do</h1>
        <Todos
          crossout={i => {
            this.props.crossout(i);
          }}
          remove={i => {
            this.props.remove(i);
          }}
          items={this.props.todos}
          first={this.props.keycount === 0}
        />
        <ItemInput
          add={text => {
            this.props.add(text);
          }}
        />
      </div>
    );
  }
}
class SignUp extends React.Component {
  render() {
    return (
      <div>
        <h1>Hi!</h1>
      </div>
    );
  }
}
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
