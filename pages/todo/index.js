import {
  getCookie,
  setCookie,
  delCookie,
  fakeEmail,
  inputChanged,
  checkToken,
} from "../../components/util_funcs.js";
import { ItemInput, SignOut, TodoItem, Bar } from "../../components/comps.js";
import { useState, useEffect } from "react";
import { api_url, base_api_url } from "../../components/constants.js";
import Head from "next/head";
import Router from "next/router";
import Link from "next/link";

function loadTodos(setTodos) {
  fetch(api_url + "/me", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      username: getCookie("username"),
      token: getCookie("token"),
    }),
  }).then((response) => {
    response.json().then((response) => {
      if (!response.error) {
        setTodos(response.response.user.todos);
        console.log(response);
      } else {
        console.log(response);
      }
    });
  });
}

export default function TodosPage() {
  const [editing, setEditing] = useState("");
  const [validToken, setValidToken] = useState(false);
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    Router.prefetch("/");
    loadTodos(setTodos);
    checkToken(getCookie("token")).then((valid) => {
      if (!valid) {
        Router.push("/");
      } else {
        setValidToken(true);
      }
    });
  }, []);
  return (
    <div
      className="app p-6 pt-2 top_border"
      style={{ visibility: validToken ? "" : "hidden" }}
    >
      <Bar />
      <Head>
        <title>My Todos</title>
      </Head>
      <h1 className="text-5xl font-medium text-gray-800 text-center mb-2">
        <span>To-Do</span>
        <span>
          <button
            onClick={() => {
              setEditing(!editing);
            }}
          >
            <i className="ml-2 text-base far fa-caret-square-down" />
          </button>
        </span>
      </h1>
      <TodosList todos={todos} setTodos={setTodos} editing={editing} />
      <ItemInput todos={todos} setTodos={setTodos} />
      <SignOut />
    </div>
  );
}

function TodosList(props) {
  let todos = [];
  for (let i in props.todos) {
    todos.push(
      <TodoItem
        todos={props.todos}
        setTodos={props.setTodos}
        item={props.todos[i]}
        i={i}
        key={props.todos[i].key}
        editing={props.editing}
      />
    );
  }
  if (props.todos.length === 0) {
    todos.push(
      <div
        className={(props.first ? "" : "todo-empty") + " text-center"}
        key={0}
      >
        {[
          "Add items with the box below!",
          <br key={Math.random()} />,
          <a
            className="color-transition"
            href="https://www.markdownguide.org/cheat-sheet/"
            key={Math.random()}
          >
            Markdown
          </a>,
          " is supported.",
        ]}
      </div>
    );
  }
  return <div className="todo-holder">{todos}</div>;
}
