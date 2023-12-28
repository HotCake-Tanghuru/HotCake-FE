const BASEURL = 'http://43.202.230.2';
const userImg = document.querySelector('.user-img');
const userNickname = document.querySelector('.user-nickname');

function previewImage() {
  const input = document.querySelector('#imageUpload');
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      document.querySelector('#imagePreview').style.backgroundImage = `url(${e.target.result})`;
    }
    reader.readAsDataURL(file);
  }
}

function removeSelectedFile() {
  const input = document.querySelector('#imageUpload');
  const preview = document.querySelector('#imagePreview');

  input.value = '';
  preview.style.backgroundImage = 'none';
}

const token = localStorage.getItem('access_tokens');

fetch(`${BASEURL}/users/info`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
}).then(response => response.json())
  .then(data => {
    const imageUrl = data.user['profile_img'].includes('k.kakaocdn.net') ?
      data.user['profile_img'].replace('/media/http%3A/', 'http://') : `${BASEURL}${data.user['profile_img']}`;
    userImg.style.backgroundImage = `url(${imageUrl})`;
    userNickname.textContent = data.user['nickname'];
  })
