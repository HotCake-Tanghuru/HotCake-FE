const likeButtons = document.querySelectorAll(".like-button");

likeButtons.forEach((likeButton) => {
  likeButton.addEventListener("click", function () {
    const heart = this.querySelector(".heart");
    heart.style.fill = heart.style.fill ? "" : "#d7433a";
  });
});