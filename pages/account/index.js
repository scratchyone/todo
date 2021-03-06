import {
  getCookie,
  setCookie,
  checkToken,
  changePassword,
} from "../../components/util_funcs.js";
import { useState, useEffect } from "react";
import { api_url, base_api_url } from "../../components/constants.js";
import { SignOut, Bar } from "../../components/comps.js";
import Head from "next/head";
import Router from "next/router";
import Link from "next/link";

export default function Account() {
  useEffect(() => {
    Router.prefetch("/");
    checkToken(getCookie("token")).then((valid) => {
      if (!valid) Router.push("/");
    });
  }, []);
  return (
    <div className="app p-6 pt-2 top_border">
      <Bar />
      <h1 className="header">
        <span>My Account</span>
      </h1>
      <span className=" text-center">
        <div className="flex">
          <span className="w-1/2 text-left">Username</span>
          <span className="w-1/2 font-bold text-left">
            {getCookie("username")}
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
