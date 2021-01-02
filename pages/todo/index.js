import { getCookie, checkToken } from "../../components/util_funcs.js";
import { ItemInput, SignOut, TodoItem, Bar } from "../../components/comps.js";
import { useState, useEffect } from "react";
import { api_url } from "../../components/constants.js";
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
import styles from "../../styles/Todos.module.css";
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
      className={styles.app}
      style={{ visibility: validToken ? "" : "hidden" }}
    >
      <Bar />
      <Head>
        <title>My Todos</title>
      </Head>
      <div className={styles.header}>To-Do List</div>
      <TodosList todos={todos} setTodos={setTodos} editing={editing} />
      <ItemInput todos={todos} setTodos={setTodos} />
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
    todos.push(<div key={0}>You don't have any todos.</div>);
  }
  return <div className={styles.todoHolder}>{todos}</div>;
}
