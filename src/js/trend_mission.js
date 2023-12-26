const editButtons = document.querySelectorAll('.edit-button');
const editForms = document.querySelectorAll('.edit-form');
const commentContents = document.querySelectorAll('.comment-content');
const commentButtons = document.querySelectorAll('.comment-buttons');
const editTextareas = document.querySelectorAll('.edit-textarea');

editButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    editForms[index].classList.toggle('hidden');
    commentContents[index].classList.toggle('hidden');
    commentButtons[index].classList.toggle('hidden');

    // 기존 댓글 내용을 수정할 수 있는 입력 필드에 채워 넣음
    const existingComment = commentContents[index].textContent.trim();
    editTextareas[index].value = existingComment;
  });
});