const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('user_id');

const nicknameInput = document.getElementById('nickname');
const introTextArea = document.getElementById('bio');
const imagePreview = document.getElementById('imagePreview');

function fetchDataForEditUser(userId) {
  fetch(`${BASEURL}/users/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  }).then(response => response.json())
    .then(data => {
      // 닉네임 입력란에 데이터 설정
      nicknameInput.value = data.nickname;

      // 자기소개 입력란에 데이터 설정
      if (data.bio !== null) {
        introTextArea.value = data.bio;
      }

      // 프로필 이미지 미리보기 설정
      const imageUrl = data.profile_img.includes('k.kakaocdn.net') ?
        data.profile_img.replace('/media/http%3A/', 'http://') : data.profile_img;
      if (data.profile_img) {
        imagePreview.style.backgroundImage = `url(${imageUrl})`;
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

if (userId) {
  fetchDataForEditUser(userId);
} else {
  console.error('유저ID가 없습니다');
}


document.getElementById('profileForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const nickname = document.getElementById('nickname').value;
  const bio = document.getElementById('bio').value;
  const imageFile = document.getElementById('imageUpload').files[0];

  const formData = new FormData();
  formData.append('nickname', nickname);
  formData.append('bio', bio);
  if (imageFile) {
    formData.append('profile_img', imageFile);
  }

  fetch(`${BASEURL}/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      if (data) {
        alert('프로필 변경이 완료되었습니다.')
        window.location.href = `./user.html?user_id=${userId}`
      }
    })
    .catch(error => {
      console.error('에러:', error);
    });
});

document.querySelector('.logout-btn').addEventListener('click', () => {
  localStorage.removeItem('access_tokens');
  location.href = `${BASEURL}/oauth/kakao/logout/`
});
