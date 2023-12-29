const BASEURL = 'http://3.38.185.80';
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
    localStorage.setItem('user_id', data.user_id);
    document.querySelector('.user-profile a').href = `./user.html?user_id=${data.user_id}`;
    if (data.user['profile_img']) {
      const imageUrl = data.user['profile_img'].includes('k.kakaocdn.net') ?
        data.user['profile_img'].replace('/media/http%3A/', 'http://') : `${BASEURL}${data.user['profile_img']}`;
      userImg.style.backgroundImage = `url(${imageUrl})`;
    }
    userNickname.textContent = data.user['nickname'];
  })
  .catch(error => {
    // 요청 실패 시 에러 처리
    console.error('프로필 정보를 가져오지 못했습니다:', error);
    //확인 알림창
    const isOk = confirm('사용자 정보가 없습니다. 로그인 페이지로 이동합니다.');
    if (isOk) {
      window.location.href = './login.html';
    }
  });