checkUser();

let isUserLoggedIn = false;
const authPopup = document.getElementById("auth-popup");
const loginForm = document.querySelector(".login-form");
const signupForm = document.querySelector(".signup-form");

const loginButton = document.getElementById("login-button");
const signupButton = document.getElementById("signup-button");

const signupFormButton = document.getElementById("signup");
const loginFormButton = document.getElementById("login");

const loginNav = document.getElementById("login-nav");
const logoutNav = document.getElementById("logout-nav");
const authCloseButton = document.getElementById("auth-close");

const usernameInput = document.getElementById("username-login");

const messages = document.getElementById("messages");
const profileName = document.getElementById("profile-name");

loginForm.style.display = "block";
signupForm.style.display = "none";
signupButton.style.opacity = "0.1";
authPopup.style.visibility = "hidden";

loginNav.addEventListener("click", () => {
  authPopup.style.visibility = "visible";
  usernameInput.focus();
});

authCloseButton.addEventListener("click", () => {
  resetAuthPopup();
});

loginButton.addEventListener("click", () => {
  loginForm.style.display = "block";
  signupForm.style.display = "none";
  signupButton.style.opacity = "0.1";
  loginButton.style.opacity = "1";
});

loginButton.addEventListener("hover", () => {
  loginButton.style.opacity = "1";
});

signupButton.addEventListener("hover", () => {
  signupButton.style.opacity = "1";
});

signupButton.addEventListener("click", () => {
  loginForm.style.display = "none";
  signupForm.style.display = "block";
  loginButton.style.opacity = "0.1";
  signupButton.style.opacity = "1";
});

signupFormButton.addEventListener("click", () => {
  resetAuthPopup();
  signup();
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;
  resetAuthPopup();
  login(username, password);
});

function resetAuthPopup() {
  authPopup.style.visibility = "hidden";
  loginForm.style.display = "block";
  signupForm.style.display = "none";
  signupButton.style.opacity = "0.1";
  loginButton.style.opacity = "1";
}

async function login(username, password) {
  await fetch("http://localhost:4000/auth/login", {
    method: "POST",
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then((response) => {
      console.log(response);
      if (!response.ok) {
        alert("Please make sure you entered the right creditenials");
        profileName.textContent = "";
      } else {
        profileName.textContent = "Welcome " + username;
        loginNav.style.display = "none";
        logoutNav.style.display = "block";
      }
      response.json();
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
}

function signup() {
  fetch("http://localhost:4000/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      email,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function logout() {
  fetch("http://localhost:4000/auth/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function checkUser() {
  fetch(window.location.href, {
    method: "GET",
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
}