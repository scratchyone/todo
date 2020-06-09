import { useState, useEffect } from 'react';
import {
  add,
  remove,
  strikethrough,
  bold,
  inputChanged,
  getCookie,
  signOut,
} from './util_funcs.js';
import { BASE } from './constants.js';
import Link from 'next/link';

export function Bar() {
  const [username, setUsername] = useState('');
  useEffect(() => setUsername(getCookie('username')), []);
  return (
    <div className="w-full bg-gray-800 absolute top-0 left-0 flex flex-row flex-start items-center">
      <Link href={BASE + '/todo'}>
        <a className="m-1 ml-2 text-white text-2xl">To-Do</a>
      </Link>
      <a
        href="../../todo_admin"
        className={
          'm-1 ml-10 text-white text-lg' +
          (username === 'admin' ? '' : ' hidden')
        }
      >
        Admin Panel
      </a>
      <Link href="/account">
        <a className="m-1 ml-10 text-white text-lg">Account</a>
      </Link>
    </div>
  );
}

function addItemInput(value, setValue, todos, setTodos) {
  if (value !== '') {
    add(value, todos, setTodos);
    setValue('');
  }
}

export function ItemInput(props) {
  const [value, setValue] = useState('');
  return (
    <div className={'todo-input-holder'}>
      <input
        value={value}
        onChange={(event) => {
          inputChanged(event, setValue);
        }}
        onKeyDown={(event) => {
          if (event.keyCode === 13) {
            addItemInput(value, setValue);
          }
        }}
        className="todo-input"
        type="text"
      />
      <button
        onClick={() => {
          this.add(value, setValue, props.todos, props.setTodos);
        }}
        className="todo-add-button"
      >
        <i className="fas fa-plus" />
      </button>
    </div>
  );
}

export function SignOut() {
  return (
    <div className="text-center mt-1">
      <button
        onClick={() => {
          signOut();
        }}
        className="simple-button"
      >
        Sign Out
      </button>
    </div>
  );
}

export function TodoItem(props) {
  return (
    <div className="todo">
      <button
        className="mr-2 ml-1"
        onClick={() => {
          bold(props.i, props.todos, props.setTodos);
        }}
        style={{ display: props.editing ? '' : 'none' }}
      >
        <i className="fas fa-bold" />
      </button>
      <button
        className={'todo-remove-button fas fa-times '}
        onClick={() => {
          remove(props.i, props.todos, props.setTodos);
        }}
      />
      <button
        onClick={() => {
          strikethrough(props.i, props.todos, props.setTodos);
        }}
        className={
          'todo-text ' +
          (props.item.done ? 'done ' : '') +
          (props.item.bold ? 'font-bold' : '')
        }
        //dangerouslySetInnerHTML={{
        //  __html: converter.makeHtml(this.props.item.text),
        //}}
      >
        {props.item.text}
      </button>
    </div>
  );
}
