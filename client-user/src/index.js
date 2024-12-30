const replyButtons = document.querySelectorAll(".reply-button");
const homePage = document.querySelector("#home");
const blogPage = document.querySelector("#blog");
const homeButton = document.querySelector("#home-button");
const commentPopup = document.querySelector("#comment-popup");
const cover = document.querySelector("#transparent-cover");
const commentSubmitButton = document.querySelector("#comment-submit");
const commentCloseButton = document.querySelector("#comment-close");

blogPage.style.display = "none";

homeButton.addEventListener("click", () => {
  console.log("clicked home button");
  homePage.style.display = "block";
  blogPage.style.display = "none";
});

replyButtons.forEach((replyButton) => {
  replyButton.addEventListener("click", () => {
    cover.style.display = "block";
    commentPopup.style.visibility = "visible";
  });
});

commentSubmitButton.addEventListener("click", () => {
  cover.style.display = "none";
  commentPopup.style.visibility = "hidden";
});

commentCloseButton.addEventListener("click", () => {
  cover.style.display = "none";
  commentPopup.style.visibility = "hidden";
});

fetch("http://localhost:4000/api/blogs", {
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
    parseBlogsData(data);
  })
  .catch((error) => {
    console.log(error);
  });

function getBlog(blogId) {
  fetch(`http://localhost:4000/api/blogs/${blogId}`, {
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
      parseBlog(data);
    })
    .catch((error) => {
      console.log(error);
    });
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
      console.log(data);
      parseComments(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function parseComments(data) {
  document.querySelector(".comments-list").innerHTML = "";
  data.forEach((comment) => {
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
    commentCard.appendChild(commentReplyButton);
    listItem.appendChild(commentCard);
    document.querySelector(".comments-list").appendChild(listItem);
  });
}

function parseBlogsData(data) {
  data.forEach((blog) => {
    const blogCard = document.createElement("div");
    blogCard.classList.add("card");
    const blogTitle = document.createElement("h2");
    blogTitle.textContent = blog.title;
    blogCard.appendChild(blogTitle);
    const blogOverview = document.createElement("p");
    blogOverview.textContent = blog.overview;
    blogCard.appendChild(blogOverview);
    const readMoreButton = document.createElement("a");
    readMoreButton.classList.add("read-more");
    readMoreButton.setAttribute("href", "#");
    readMoreButton.setAttribute("data-id", blog.id);
    readMoreButton.textContent = "Read More";
    blogCard.appendChild(readMoreButton);
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

  addReadMoreButtonsEventListener();
}

function addReadMoreButtonsEventListener() {
  document.querySelectorAll(".read-more").forEach((button) => {
    button.addEventListener("click", () => {
      const blogCard = button.parentElement;
      const blogId = button.getAttribute("data-id");
      getComments(blogId);
      blogCard.classList.toggle("expanded");
      homePage.style.display = "none";
      blogPage.style.display = "block";
      console.log("clicked");
    });
  });
}
