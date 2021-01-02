import {
  getCookie,
  setCookie,
  delCookie,
  fakeEmail,
  inputChanged,
  checkToken,
} from "../../components/util_funcs.js";
import { useState, useEffect } from "react";
import { api_url, base_api_url, BASE } from "../../components/constants.js";
import { Field } from "../../components/comps.js";
import Head from "next/head";
import Router from "next/router";
import Link from "next/link";
import styles from "../../styles/Auth.module.css";

function signin(username, password, setError) {
  fetch(api_url + "/login", {
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
          Router.push(BASE + "/todo");
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

export default function SignIn() {
  useEffect(() => {
    Router.prefetch(BASE + "/todo");
    checkToken(getCookie("token")).then((valid) => {
      if (valid) Router.push(BASE + "/todo");
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
        <title>Welcome back</title>
      </Head>
      <h1 className={styles.header}>Welcome back</h1>
      <div className={styles.subtitle}>
        Don't have an account? <Link href="/">Sign Up</Link>
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
          signin(username, password, setError);
        }}
      >
        Sign In
      </button>
      <div className={styles.error}>{error}</div>
    </div>
  );
}
