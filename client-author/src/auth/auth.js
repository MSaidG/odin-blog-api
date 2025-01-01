const authPopup = document.getElementById("auth-popup");
const loginForm = document.querySelector(".login-form");
const signupForm = document.querySelector(".signup-form");

const loginButton = document.getElementById("login-button");
const signupButton = document.getElementById("signup-button");

const signupFormButton = document.getElementById("signup");
const loginFormButton = document.getElementById("login");

const usernameInput = document.getElementById("username-input");

const messages = document.getElementById("messages");

loginForm.style.display = "block";
signupForm.style.display = "none";
signupButton.style.opacity = "0.1";

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

loginFormButton.addEventListener("click", () => {
  resetAuthPopup();
  login();
});

function resetAuthPopup() {
  authPopup.style.visibility = "hidden";
  loginForm.style.display = "block";
  signupForm.style.display = "none";
  signupButton.style.opacity = "0.1";
  loginButton.style.opacity = "1";
}

function login() {
  fetch("http://localhost:4000/auth/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
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
