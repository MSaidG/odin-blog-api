const replyButtons = document.querySelectorAll(".reply-button");
const homePage = document.querySelector("#home");
const blogPage = document.querySelector("#blog");
const homeButton = document.querySelector("#home-button");
const commentPopup = document.querySelector("#comment-popup");
const cover = document.querySelector("#transparent-cover");
const commentSubmitButton = document.querySelector("#comment-submit");
const commentCloseButton = document.querySelector("#comment-close");

blogPage.style.display = "none";

document.querySelectorAll(".read-more").forEach((button) => {
  button.addEventListener("click", () => {
    const blogCard = button.parentElement;
    blogCard.classList.toggle("expanded");
    homePage.style.display = "none";
    blogPage.style.display = "block";
    console.log("clicked");
  });
});

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
    console.log(response);
    return response.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });
