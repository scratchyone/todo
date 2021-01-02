import { useState, useEffect } from "react";
import {
  add,
  remove,
  strikethrough,
  bold,
  inputChanged,
  getCookie,
  signOut,
} from "./util_funcs.js";
import Link from "next/link";

export function Bar() {
  const [username, setUsername] = useState("");
  useEffect(() => setUsername(getCookie("username")), []);
  return (
    <div className="w-full bg-gray-800 absolute top-0 left-0 flex flex-row flex-start items-center">
      <Link href={"/todo"}>
        <a className="m-1 ml-2 text-white text-2xl">To-Do</a>
      </Link>
      <a
        href="../../todo_admin"
        className={
          "m-1 ml-10 text-white text-lg" +
          (username === "admin" ? "" : " hidden")
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
  if (value !== "") {
    add(value, todos, setTodos);
    setValue("");
  }
}
import iiStyles from "../styles/ItemInput.module.css";
export function ItemInput(props) {
  const [value, setValue] = useState("");
  return (
    <div className={iiStyles.inputWrapper}>
      <input
        value={value}
        onChange={(event) => {
          inputChanged(event, setValue);
        }}
        onKeyDown={(event) => {
          if (event.keyCode === 13) {
            addItemInput(value, setValue, props.todos, props.setTodos);
          }
        }}
        className={iiStyles.input}
        type="text"
        placeholder="Write a new task"
      />
      <button
        onClick={() => {
          addItemInput(value, setValue, props.todos, props.setTodos);
        }}
        className={iiStyles.button}
      >
        Add
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
import tiStyles from "../styles/TodoItem.module.css";
import XSVG from "../public/x.svg";
export function TodoItem(props) {
  return (
    <div className={tiStyles.todo}>
      <div
        onClick={() => {
          strikethrough(props.i, props.todos, props.setTodos);
        }}
        className={tiStyles.todoLeft}
      >
        <TodoStatus finished={props.item.done} />
        {props.item.text}
      </div>
      <div
        className={tiStyles.todoRight}
        onClick={() => {
          remove(props.i, props.todos, props.setTodos);
        }}
      >
        <XSVG className={tiStyles.todoX} />
      </div>
    </div>
  );
}
import classnames from "classnames";
import CheckSVG from "../public/check.svg";
function TodoStatus(props) {
  return (
    <div
      className={classnames(
        tiStyles.status,
        props.finished && tiStyles.statusDone
      )}
    >
      {props.finished && <CheckSVG />}
    </div>
  );
}
import fieldStyles from "../styles/Field.module.css";
export function Field(props) {
  return (
    <div className={fieldStyles.wrapper + " " + props.className}>
      <div className={fieldStyles.name}>{props.name}</div>
      <input
        onChange={(e) => inputChanged(e, props.setValue)}
        type={props.type}
        value={props.value}
        className={fieldStyles.input}
      ></input>
    </div>
  );
}
