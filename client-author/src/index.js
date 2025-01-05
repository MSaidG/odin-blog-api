import { getAccessToken, getUser } from "./auth";

export let profile = { user: getUser() };
export function setProfile(profile, value) {
  profile.user = value;
}

console.log("PROFILE: " + profile.user);

const replyButtons = document.querySelectorAll(".reply-button");
const homePage = document.querySelector("#home");
const blogPage = document.querySelector("#blog");
const cover = document.querySelector("#transparent-cover");
const addCommentButton = document.querySelector("#add-comment");
const commentPopup = document.querySelector("#comment-popup");
const submitCommentButton = document.querySelector("#comment-submit");
const commentCloseButton = document.querySelector("#comment-close");
const commentList = document.querySelector(".comments-list");
const commentEditor = document.querySelector("#comment-editor");

const blogContent = document.querySelector(".blog-content");
const blogTitle = document.querySelector(".blog-title");
const blogOverview = document.querySelector(".blog-overview");

const blogAuthor = document.querySelector(".blog-author");
const blogBody = document.querySelector(".blog-body");
const blogDate = document.querySelector(".blog-date");
const collapse = document.querySelector("#collapse");
const createBlogButton = document.getElementById("create-blog");
const newBlog = document.getElementById("new-blog-nav");
const homeNav = document.getElementById("home-nav");
const messages = document.getElementById("messages");
const updateBlogButton = document.getElementById("update-blog");
const deleteBlogButton = document.getElementById("delete-blog");

const publishBlogButton = document.getElementById("publish-blog");
const unpublishBlogButton = document.getElementById("unpublish-blog");

const loginNav = document.getElementById("login-nav");

blogPage.style.display = "none";
createBlogButton.style.display = "none";
updateBlogButton.style.display = "none";
deleteBlogButton.style.display = "none";
publishBlogButton.style.display = "none";
unpublishBlogButton.style.display = "none";
let commentEditorValue = "";

updateBlogButton.addEventListener("click", () => {
  const blogId = updateBlogButton.getAttribute("data-id");
  updateBlog(blogId);
  const username = document.getElementById("profile-name").textContent.slice(8);
  getUserBlogs(username);
  viewHome();
});

deleteBlogButton.addEventListener("click", () => {
  const blogId = deleteBlogButton.getAttribute("data-id");
  deleteBlog(blogId);
  console.log(profile.user);
  const username = document.getElementById("profile-name").textContent.slice(8);
  getUserBlogs(username);
  viewHome();
});

newBlog.addEventListener("click", () => {
  blogPage.style.display = "block";
  createBlogButton.style.display = "block";
  homePage.style.display = "none";
  newBlog.style.display = "none";
});

function viewHome() {
  blogPage.style.display = "none";
  homePage.style.display = "block";
  createBlogButton.setAttribute("data-id", "");
  createBlogButton.style.display = "none";
  updateBlogButton.style.display = "none";
  deleteBlogButton.style.display = "none";
  publishBlogButton.style.display = "none";
  unpublishBlogButton.style.display = "none";
  newBlog.style.display = "block";
}

homeNav.addEventListener("click", () => {
  viewHome();
});

collapse.addEventListener("click", () => {
  if (commentList.style.display === "none") {
    commentList.style.display = "flex";
    commentList.scrollTop = commentList.scrollHeight;
  } else {
    commentList.style.display = "none";
    commentList.scrollTop = 0;
  }
});

addCommentButton.addEventListener("click", (e) => {
  cover.style.display = "block";
  commentPopup.style.visibility = "visible";
  const postId = e.target.getAttribute("data-id");
});

homeNav.addEventListener("click", () => {
  homePage.style.display = "block";
  blogPage.style.display = "none";
});

replyButtons.forEach((replyButton) => {
  replyButton.addEventListener("click", () => {
    cover.style.display = "block";
    commentPopup.style.visibility = "visible";
  });
});

submitCommentButton.addEventListener("click", () => {
  cover.style.display = "none";
  commentPopup.style.visibility = "hidden";
  const postId = addCommentButton.getAttribute("data-id");
  const userId = "f8c4b310-ea72-4df5-9c7a-348b361071fa"; // USER ID HARD CODED FOR NOW TO TEST
  postComment(postId, userId);
  // getComment(postId, userId);
});

commentCloseButton.addEventListener("click", () => {
  cover.style.display = "none";
  commentPopup.style.visibility = "hidden";
});

createBlogButton.addEventListener("click", (e) => {
  const postId = e.target.getAttribute("data-id");
  createBlog();
  const username = document.getElementById("profile-name").textContent.slice(8);
  console.log(username);
  getUserBlogs(username);
});

function setMessage(message) {
  const timeout = 5000;
  messages.textContent = message;
  setTimeout(() => {
    messages.textContent = "";
  }, timeout);
}

function deleteBlog(postId) {
  fetch(`http://localhost:4000/api/posts/${postId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      // credintials: "include",
      Authorization: `accessToken ${getAccessToken(document.cookie)}`,
      cookie: document.cookie,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        setMessage("You must be logged in to delete a blog");
      }
      setMessage("BLOG DELETED!");
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function updateBlog(postId) {
  fetch(`http://localhost:4000/api/posts/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      // credintials: "include",
      Authorization: `accessToken ${getAccessToken(document.cookie)}`,
      cookie: document.cookie,
    },
    body: JSON.stringify({
      title: blogTitle.textContent,
      text: blogBody.innerHTML,
      overview: blogOverview.textContent,
    }),
  })
    .then((response) => {
      console.log(response.status);
      if (response.status === 401) {
        setMessage("You must be logged in to update a blog");
      } else {
        setMessage("BLOG UPDATED!");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function createBlog() {
  const username = "test";
  const html = blogBody.innerHTML;
  const newHtml = html.replace(
    / contenteditable="true" style="position: relative;" spellcheck="false"/g,
    ""
  );
  fetch(`http://localhost:4000/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // credintials: "include",
      Authorization: `accessToken ${getAccessToken(document.cookie)}`,
      cookie: document.cookie,
    },
    body: JSON.stringify({
      title: blogTitle.textContent,
      text: newHtml,
      overview: blogOverview.textContent,
    }),
  })
    .then((response) => {
      if (response.status === 401) {
        setMessage("You must be logged in to create a blog");
      } else {
        setMessage("BLOG CREATED!");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

export function getUserBlogs(username) {
  fetch(`http://localhost:4000/api/users/${username}/posts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      parseBlogsData(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

console.log("USER: " + profile.user);
if (profile.user) {
  getUserBlogs(profile.user.username);
}

function getBlog(blogId) {
  fetch(`http://localhost:4000/api/posts/${blogId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      parseBlog(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function parseBlog(blog) {
  blogTitle.textContent = blog.title;
  blogAuthor.textContent = "by   " + blog.author.username;
  // blogBody.textContent = blog.text;
  blogBody.innerHTML = blog.text;
  const time = new Date(blog.time).toUTCString();
  blogDate.setAttribute("datetime", time);
  blogDate.textContent = time;
  addCommentButton.setAttribute("data-id", blog.id);
  submitCommentButton.setAttribute("data-id", blog.id);
}

function getComments(postId) {
  fetch(`http://localhost:4000/api/posts/${postId}/comments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      parseComments(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function parseComments(data) {
  commentList.innerHTML = "";
  data.forEach((comment) => {
    addComment(comment);
  });
}

function addComment(comment, isInserted = false) {
  const listItem = document.createElement("li");
  const commentCard = document.createElement("div");
  commentCard.classList.add("comment");
  const commentAuthor = document.createElement("h3");
  commentAuthor.textContent = comment.user.username;
  commentCard.appendChild(commentAuthor);
  const commentContent = document.createElement("p");
  commentContent.textContent = comment.text;
  commentCard.appendChild(commentContent);
  const commentTimestamp = document.createElement("time");
  const time = new Date(comment.time).toUTCString();
  commentTimestamp.setAttribute("datetime", time);
  commentTimestamp.textContent = time;
  commentCard.appendChild(commentTimestamp);
  const commentReplyButton = document.createElement("button");
  commentReplyButton.classList.add("reply-button");
  commentReplyButton.textContent = "Reply";
  commentReplyButton.addEventListener("click", () => {
    cover.style.display = "block";
    commentPopup.style.visibility = "visible";
  });
  commentCard.appendChild(commentReplyButton);
  listItem.appendChild(commentCard);
  if (!isInserted) {
    commentList.appendChild(listItem);
  } else {
    commentList.insertBefore(listItem, commentList.firstChild);
  }
}

function parseBlogsData(data) {
  document.querySelector("#blog-cards").innerHTML = "";
  data.forEach((blog) => {
    const blogCard = document.createElement("div");
    blogCard.classList.add("card");
    const blogTitle = document.createElement("h2");
    blogTitle.textContent = blog.title;
    blogCard.appendChild(blogTitle);
    const blogOverview = document.createElement("p");
    blogOverview.textContent = blog.overview;
    blogCard.appendChild(blogOverview);
    const editButton = document.createElement("a");
    editButton.classList.add("edit");
    editButton.setAttribute("href", "#");
    editButton.setAttribute("data-id", blog.id);
    createBlogButton.setAttribute("data-id", blog.id);
    editButton.textContent = "Edit";
    blogCard.appendChild(editButton);
    const timestamp = document.createElement("time");
    const time = new Date(blog.time)
      .toDateString()
      .split(" ")
      .slice(1, 4)
      .join(" ");

    timestamp.setAttribute("datetime", time);
    timestamp.textContent = time;
    blogCard.appendChild(timestamp);
    document.querySelector("#blog-cards").appendChild(blogCard);
  });

  addEditButtonsEventListener();
}

function addEditButtonsEventListener() {
  document.querySelectorAll(".edit").forEach((button) => {
    button.addEventListener("click", () => {
      const blogCard = button.parentElement;
      const blogId = button.getAttribute("data-id");
      updateBlogButton.style.display = "block";
      updateBlogButton.setAttribute("data-id", blogId);
      deleteBlogButton.style.display = "block";
      deleteBlogButton.setAttribute("data-id", blogId);
      publishBlogButton.style.display = "block";
      publishBlogButton.setAttribute("data-id", blogId);
      unpublishBlogButton.style.display = "block";
      unpublishBlogButton.setAttribute("data-id", blogId);
      newBlog.style.display = "none";
      getBlog(blogId);
      getComments(blogId);
      blogCard.classList.toggle("expanded");
      homePage.style.display = "none";
      blogPage.style.display = "block";
    });
  });
}

async function postComment(postId, userId) {
  commentEditorValue = commentEditor.value;
  await fetch(
    `http://localhost:4000/api/users/${userId}/posts/${postId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // credintials: "include",
        Authorization: `accessToken ${getAccessToken(document.cookie)}`,
        cookie: document.cookie,
      },
      body: JSON.stringify({ text: commentEditorValue }),
    }
  )
    .then((response) => {
      if (response.status === 401) {
        redirectToAuthRefresh();
        return alert("You must be logged in to leave a comment");
      }
      response.json();
    })
    .then((data) => {
      console.log("GET COMMENT? ");
      getComment(postId, userId);
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
}

export function redirectToAuthRefresh() {
  window.location.href = "http://localhost:4000/auth/refresh";
  return null;
}

function getComment(postId, userId) {
  fetch(`http://localhost:4000/api/users/${userId}/posts/${postId}/comments`, {
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
      addComment(data, true);
    })
    .catch((error) => {
      console.log(error);
    });
}
