const profileImage = document.querySelector('.profile-image');
const nicknameBox = document.querySelector('.nickname-box');
const followerNum = document.querySelector('.follower-num');
const followingNum = document.querySelector('.following-num');
const introBox = document.querySelector('.intro-box');
const listContainer = document.querySelector('.list-container');

let userId = 0

async function fetchUserData() {
  try {
    // 첫 번째 fetch 요청
    const response1 = await fetch(`${BASEURL}/users/info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    const data1 = await response1.json();

    console.log(data1);
    console.log(data1.user_id);
    userId = data1.user_id;

    // 두 번째 fetch 요청
    const response2 = await fetch(`${BASEURL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    const data2 = await response2.json();

    console.log(data2);
    const imageUrl = data2.profile_img.includes('k.kakaocdn.net') ?
      data2.profile_img.replace('/media/http%3A/', 'http://') : data2.profile_img;

    nicknameBox.textContent = data2.nickname;
    followerNum.textContent = data2.followers_count;
    followingNum.textContent = data2.following_count;
    introBox.textContent = data2.bio ? data2.bio : '자기소개가 없습니다.';
    profileImage.style.backgroundImage = `url(${imageUrl})`;

    // 세 번째 fetch 요청
    const response3 = await fetch(`${BASEURL}/trend-missions/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    const data3 = await response3.json();

    console.log(data3);
    data3.forEach((data) => {
      console.log(data.trend_name)
      // 새로운 리스트 아이템과 링크 생성
      const listItem = document.createElement('li');
      const link = document.createElement('a');

      link.href = `trend_mission.html?trend_id=${data.trend}`; // 링크의 href 설정
      link.textContent = data.trend_name; // 링크의 텍스트 설정

      listItem.appendChild(link); // 링크를 리스트 아이템에 추가
      listContainer.appendChild(listItem); // 리스트 아이템을 리스트 컨테이너에 추가
    });
  } catch (error) {
    console.error(error);
  }
}

// 함수 호출
fetchUserData();

document.querySelector('.edit-btn').addEventListener('click', () => {
  location.href = `edit_user.html?user=${userId}`;
});

document.querySelector('.stamp-btn').addEventListener('click', () => {
  location.href = `my_stamp.html?user=${userId}`;
});

document.querySelector('.like-list-btn').addEventListener('click', () => {
  location.href = `like_trends.html?user=${userId}`;
});