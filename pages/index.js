import {
  getCookie,
  setCookie,
  fakeEmail,
  inputChanged,
  checkToken,
} from "../components/util_funcs.js";
import { useState, useEffect } from "react";
import { api_url } from "../components/constants.js";
import { Field } from "../components/comps.js";
import Head from "next/head";
import Router from "next/router";
import Link from "next/link";
import styles from "../styles/Auth.module.css";
function signup(username, password, setError) {
  console.log({
    username: username,
    password: password,
  });
  fetch(api_url + "/signup", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: "Basic Og==",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then((response) => {
      response.json().then((response) => {
        console.log(response);
        setError(response.error_message || "");
        if (!response.error) {
          setCookie("username", username, 100);
          setCookie("token", response.response.token, 100);
          Router.push("/todo");
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

export default function SignUp() {
  useEffect(() => {
    Router.prefetch("/todo");
    checkToken(getCookie("token")).then((valid) => {
      if (valid) Router.push("/todo");
    });
  }, []);
  const [fakeEmailGen] = useState(fakeEmail());
  const [fakePassword] = useState(
    "•".repeat(Math.floor(Math.random() * (9 - 5 + 1) + 5))
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  return (
    <div className={styles.app}>
      <Head>
        <title>Create an account</title>
      </Head>
      <h1 className={styles.header}>Create an account</h1>
      <div className={styles.subtitle}>
        Already have an account? <Link href="/login">Sign In</Link>
      </div>
      <Field
        value={username}
        setValue={setUsername}
        type="text"
        name="Username"
        className={styles.input}
      />
      <Field
        value={password}
        setValue={setPassword}
        type="password"
        name="Password"
        className={styles.input}
      />
      <button
        className={styles.button}
        onClick={(evt) => {
          signup(username, password, setError);
        }}
      >
        Sign Up
      </button>
      <div className={styles.error}>{error}</div>
    </div>
  );
}
