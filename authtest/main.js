fetch('http://localhost:3000/info', {
  method: 'get',
  credentials: 'include'
})
  .then(response => {
    return response.json();
  })
  .then(doc => {
    if (doc.authorized) {
      document.getElementById('username').innerHTML = doc.username;
      document.getElementById('bio').innerHTML = doc.bio;
    } else {
      document.getElementById('username').innerHTML = 'Not logged in!';
    }
  })
  .catch(function(err) {
    // Error :(
  });

function updatebio() {
  fetch('http://localhost:3000/setbio?', {
    method: 'post',
    credentials: 'include',
    body: JSON.stringify({ bio: document.getElementById('bio').value }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      return response.json();
    })
    .then(doc => {})
    .catch(function(err) {
      // Error :(
    });
}

function signout() {
  fetch('http://localhost:3000/signout?', {
    method: 'post',
    credentials: 'include'
  })
    .then(response => {
      return response.json();
    })
    .then(doc => {
      location.reload();
    })
    .catch(function(err) {
      // Error :(
    });
}

function signin() {
  fetch('http://localhost:3000/signin?', {
    method: 'post',
    credentials: 'include',
    body: JSON.stringify({
      username: document.getElementById('usernameenter').value,
      password: document.getElementById('passwordenter').value
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      return response.json();
    })
    .then(doc => {
      if (doc.success) {
        location.reload();
      } else {
        document.getElementById('error').innerHTML = doc.error;
      }
    })
    .catch(function(err) {
      // Error :(
    });
}

function signup() {
  fetch('http://localhost:3000/signup?', {
    method: 'post',
    credentials: 'include',
    body: JSON.stringify({
      username: document.getElementById('usernameenter').value,
      password: document.getElementById('passwordenter').value
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      return response.json();
    })
    .then(doc => {
      if (doc.success) {
        location.reload();
      } else {
        document.getElementById('error').innerHTML = doc.error;
      }
    })
    .catch(function(err) {
      // Error :(
    });
}
