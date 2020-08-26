import {
  getCookie,
  setCookie,
  delCookie,
  fakeEmail,
  inputChanged,
  checkToken,
} from '../components/util_funcs.js';
import { useState, useEffect } from 'react';
import { api_url, base_api_url, BASE } from '../components/constants.js';
import Head from 'next/head';
import Router from 'next/router';
import Link from 'next/link';

function signup(username, password, setError) {
  console.log({
    username: username,
    password: password,
  });
  fetch(api_url + '/signup', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: 'Basic Og==',
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then((response) => {
      response.json().then((response) => {
        console.log(response);
        setError(response.error_message || '');
        if (!response.error) {
          setCookie('username', username, 100);
          setCookie('token', response.response.token, 100);
          Router.push(BASE + '/todo');
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

export default function SignUp() {
  useEffect(() => {
    Router.prefetch(BASE + '/todo');
    checkToken(getCookie('token')).then((valid) => {
      if (valid) Router.push(BASE + '/todo');
    });
  }, []);
  const [fakeEmailGen] = useState(fakeEmail());
  const [fakePassword] = useState(
    '•'.repeat(Math.floor(Math.random() * (9 - 5 + 1) + 5))
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  return (
    <div className="app p-6 pt-2 top_border">
      <Head>
        <title>Sign Up</title>
      </Head>
      <h1 className="text-5xl font-medium text-gray-800 text-center mb-2">
        Sign Up
      </h1>
      <input
        onChange={(evt) => {
          inputChanged(evt, setUsername);
        }}
        placeholder={fakeEmailGen}
        className="username-password-input"
        type="text"
        value={username}
      />
      <input
        onChange={(evt) => {
          inputChanged(evt, setPassword);
        }}
        placeholder={fakePassword}
        className="username-password-input"
        type="password"
        value={password}
      />
      <button
        className="simple-button"
        onClick={(evt) => {
          signup(username, password, setError);
        }}
      >
        Sign Up
      </button>
      <div className="mt-1 text-red-600">{error}</div>
      <div className="mt-1 text-gray-900 mr-10">
        Existing user?
        <Link href="/login">
          <a className="ml-1 no-underline">Sign In</a>
        </Link>
      </div>
    </div>
  );
}
