import { jwtDecode } from "jwt-decode";
export let isUserLoggedIn = false;

// checkUser();
const profileName = document.getElementById("profile-name");
const token = getAccessToken(document.cookie);
if (token) {
  const user = jwtDecode(token);
  profileName.textContent = "Welcome " + user.username;
}

const loginNav = document.getElementById("login-nav");
const logoutNav = document.getElementById("logout-nav");
check();

const authPopup = document.getElementById("auth-popup");
const loginForm = document.querySelector(".login-form");
const signupForm = document.querySelector(".signup-form");

const loginButton = document.getElementById("login-button");
const signupButton = document.getElementById("signup-button");

const signupFormButton = document.getElementById("signup");

const authCloseButton = document.getElementById("auth-close");

const usernameInput = document.getElementById("username-login");

const messages = document.getElementById("messages");

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

logoutNav.addEventListener("click", () => {
  document.cookie =
    "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  document.cookie =
    "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  logout();
  profileName.textContent = "";
  loginNav.style.display = "block";
  logoutNav.style.display = "none";
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
    })
    .catch((error) => {
      console.log(error);
    });
}

async function check() {
  console.log("Check");
  console.log(getAccessToken(document.cookie));
  await fetch("http://localhost:4000/auth/check", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `accessToken ${getAccessToken(document.cookie)}`,
      cookie: document.cookie,
    },
    mode: "cors",
    // redirect: "follow",
    // referrerPolicy: "no-referrer",
  })
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
      }
      initUI();
      response.json();
    })
    .then((data) => {
      console.log(data);
      console.log("Check:" + data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function initUI() {
  console.log(isUserLoggedIn);
  if (isUserLoggedIn) {
    loginNav.style.display = "none";
    logoutNav.style.display = "block";
  } else {
    loginNav.style.display = "block";
    logoutNav.style.display = "none";
    profileName.textContent = "";
  }
}

export function getAccessToken(documentCookie) {
  let accessToken = documentCookie && documentCookie.split("=")[1];
  if (accessToken != null) {
    documentCookie.split(" ").forEach((cookie) => {
      if (cookie.startsWith("accessToken")) {
        accessToken = cookie.split("=")[1].split(";")[0];
        isUserLoggedIn = true;
        return accessToken;
      }
    });
  }
  if (accessToken == null) {
    isUserLoggedIn = false;
  }
  return accessToken;
}
