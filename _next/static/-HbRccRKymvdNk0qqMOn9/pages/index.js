(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{RNiq:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return f}));var o=n("q1tI"),a=n.n(o),s=n("xKtT"),c=n("zxdi"),i=n("8Kt/"),u=n.n(i),r=n("nOHt"),l=n.n(r),p=n("YFqc"),d=n.n(p),m=a.a.createElement;function f(){Object(o.useEffect)((function(){l.a.prefetch(c.a+"/todo"),Object(s.d)(Object(s.f)("token")).then((function(e){e&&l.a.push(c.a+"/todo")}))}),[]);var e=Object(o.useState)(Object(s.e)())[0],t=Object(o.useState)("\u2022".repeat(Math.floor(5*Math.random()+5)))[0],n=Object(o.useState)(""),a=n[0],i=n[1],r=Object(o.useState)(""),p=r[0],f=r[1],b=Object(o.useState)(""),h=b[0],g=b[1];return m("div",{className:"app p-6 pt-2 top_border"},m(u.a,null,m("title",null,"Sign Up")),m("h1",{className:"text-5xl font-medium text-gray-800 text-center mb-2"},"Sign Up"),m("input",{onChange:function(e){Object(s.g)(e,i)},placeholder:e,className:"username-password-input",type:"text",value:a}),m("input",{onChange:function(e){Object(s.g)(e,f)},placeholder:t,className:"username-password-input",type:"password",value:p}),m("button",{className:"simple-button",onClick:function(e){!function(e,t,n){console.log({username:e,password:t}),fetch(c.b+"/signup",{method:"POST",headers:{"content-type":"application/json",authorization:"Basic Og=="},body:JSON.stringify({username:e,password:t})}).then((function(t){t.json().then((function(t){console.log(t),n(t.error_message||""),t.error||(Object(s.i)("username",e,100),Object(s.i)("token",t.response.token,100),l.a.push(c.a+"/todo"))}))})).catch((function(e){console.log(e)}))}(a,p,g)}},"Sign Up"),m("div",{className:"mt-1 text-red-600"},h),m("div",{className:"mt-1 text-gray-900 mr-10"},"Existing user?",m(d.a,{href:"/login"},m("a",{className:"ml-1 no-underline"},"Sign In"))))}},vlRD:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n("RNiq")}])}},[["vlRD",0,2,1,3]]]);