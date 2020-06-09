import { api_url, base_api_url } from './constants.js';
import { v1 as uuidv1 } from 'uuid';
import Swal from 'sweetalert2';
export function getCookie(name) {
  if (typeof window !== 'undefined') {
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(';');

    // Loop through the array elements
    for (var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split('=');

      /* Removing whitespace at the beginning of the cookie name
      and compare it with the given string */
      if (name === cookiePair[0].trim()) {
        // Decode the cookie value and return
        return decodeURIComponent(cookiePair[1]);
      }
    }

    // Return null if not found
    return null;
  } else {
    return null;
  }
}

export function setCookie(name, value, daysToLive) {
  if (typeof window !== 'undefined') {
    // Encode value in order to escape semicolons, commas, and whitespace
    var cookie = name + '=' + encodeURIComponent(value) + '; path=/;';

    document.cookie = cookie;
  }
}

export function delCookie(name) {
  if (typeof window !== 'undefined') {
    document.cookie =
      name + '= ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
  }
}

export function fakeEmail() {
  let prefixes = [
    'Example',
    'Person',
    'Name',
    'User',
    'Guy',
    'Username',
    'Cat',
    'Dog',
  ];
  let postfixes = [
    'Man',
    '24',
    '65',
    'Cool',
    'Neat',
    '27',
    '99',
    '102',
    'Dude',
  ];
  //let tlds = ['com', 'org', 'net', 'xyz', 'biz'];

  return (
    prefixes[Math.floor(Math.random() * prefixes.length)] +
    postfixes[Math.floor(Math.random() * postfixes.length)]
  );

  //+
  //    '.' +
  //    tlds[Math.floor(Math.random() * tlds.length)]
}

export function inputChanged(evt, changeState) {
  changeState(evt.target.value);
}

export async function checkToken(token) {
  try {
    let resp = await fetch(api_url + '/me', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
      }),
    });
    let json = await resp.json();
    if (!json.error) {
      console.log(json);
      return true;
    } else {
      console.log(json);
      return false;
    }
  } catch {
    return false;
  }
  /*.catch((err) => {
      console.log(err);
      delCookie('username');
      delCookie('token');
      if (!this.state.offline && !this.state.message) {
        Swal.fire({
          title: 'Server Error!',
          text:
            'We are currently experiencing a problem with our server. Please come back later.',
          type: 'error',
          showConfirmButton: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
        });
        this.setState({ offline: true });
      }
    });*/
}

export function signOut() {
  fetch(api_url + '/logout', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: 'Basic Og==',
    },
    body: JSON.stringify({
      username: getCookie('username'),
      token: getCookie('token'),
    }),
  })
    .then((response) => {
      response.json().then((response) => {
        console.log(response);
        location.reload();
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

export function check_message(setResult) {
  fetch(base_api_url + '/message/messages').then((response) => {
    response.json().then((response) => {
      console.log(response);
      if (response.messages.length > 0) {
        if (response.messages[0].block) {
          Swal.fire({
            title: 'Alert',
            text: response.messages[0].text,
            type: 'error',
            showConfirmButton: false,
            allowEscapeKey: false,
            allowOutsideClick: false,
          });
          setResult(true);
        } else if (getCookie(response.messages[0].uuid) !== 'true') {
          Swal.fire({
            title: 'Information',
            text: response.messages[0].text,
            type: 'info',
            showConfirmButton: true,
            allowEscapeKey: true,
            allowOutsideClick: true,
          });
          setResult(false);
          setCookie(response.messages[0].uuid, true);
        }
      } else {
        setResult(false);
      }
    });
  });
}

export async function checkServerStatus(setStatus) {
  try {
    let resp = await fetch(api_url + '/');
  } catch {
    console.log(err);
    delCookie('username');
    delCookie('token');
    setStatus(false);
  }
}

export function ServerErrorMessage() {
  Swal.fire({
    title: 'Server Error!',
    text:
      'We are currently experiencing a problem with our server. Please come back later.',
    type: 'error',
    showConfirmButton: false,
    allowEscapeKey: false,
    allowOutsideClick: false,
  });
}

export function strikethrough(i, todos, setTodos) {
  let newtodos = todos;
  newtodos[i].done = !newtodos[i].done;
  setTodos([...newtodos]);
  updateTodos('done', newtodos[i].id, '', newtodos[i].done);
}
export function remove(i, todos, setTodos) {
  let newtodos = todos;
  let id = newtodos[i].id;
  newtodos.splice(i, 1);
  setTodos([...newtodos]);
  updateTodos('remove', id, '', false);
}
export function moveup(i, todos, setTodos) {
  if (Number(i) !== 0) {
    let newtodos = todos;
    var element = newtodos[Number(i)];
    newtodos.splice(Number(i), 1);
    newtodos.splice(Number(i) - 1, 0, element);
    setTodos(newtodos);
    //this.updateTodos(newtodos);
  }
}
export function bold(i, todos, setTodos) {
  let newtodos = todos;
  let id = newtodos[i].id;
  newtodos[i].bold = !newtodos[i].bold;
  setTodos([...newtodos]);
  updateTodos('bold', id, '', newtodos[i].bold);
}
export function movedown(i, todos, setTodos) {
  if (Number(i) !== todos.length - 1) {
    let newtodos = todos;
    var element = newtodos[Number(i)];
    newtodos.splice(Number(i), 1);
    newtodos.splice(Number(i) + 1, 0, element);
    setTodos(newtodos);
    //this.updateTodos(newtodos);
  }
}
export function add(text, todos, setTodos) {
  let newtodos = todos;
  let id = uuidv1();
  newtodos.push({
    text: text,
    done: false,
    id: id,
    bold: false,
  });
  setTodos([...newtodos]);
  updateTodos('add', id, text, false);
}

export function updateTodos(action, id, text, done) {
  fetch(api_url + '/update', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: 'Basic Og==',
    },
    body: JSON.stringify({
      username: getCookie('username'),
      token: getCookie('token'),
      action: action,
      id: id,
      text: text,
      done: done,
    }),
  })
    .then((response) => {})
    .catch((err) => {
      console.log(err);
    });
}

export function changePassword() {
  Swal.fire({
    title: 'Enter new password',
    input: 'password',
    inputValue: '',
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return 'You need to write something!';
      }
    },
  }).then((result) => {
    if (result.value) {
      Swal.fire({
        title: 'Enter password again',
        input: 'password',
        inputValue: '',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'You need to write something!';
          }
        },
      }).then((result2) => {
        if (result2.value === result.value) {
          console.log(result.value);
          fetch(api_url + '/change_password', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              authorization: 'Basic Og==',
            },
            body: JSON.stringify({
              username: getCookie('username'),
              token: getCookie('token'),
              password: result.value,
            }),
          })
            .then((response) => {
              response.json().then((response) => {
                console.log(response);

                if (!response.error) {
                  Swal.fire(
                    'Changed!',
                    'Your password has been changed, and you have been logged out on all devices.',
                    'success'
                  ).then(() => location.reload());
                } else {
                  Swal.fire('Error!', response.error_message, 'error');
                }
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          Swal.fire(
            "Passwords don't match",
            "Your passwords don't match!",
            'error'
          );
        }
      });
      //Swal.fire(
      //  'Currently not available',
      //  'Due to a change in the backend of this service, the "email my todos" feature is currently unavailable.',
      //  'error'
      //);
    }
  });
}
