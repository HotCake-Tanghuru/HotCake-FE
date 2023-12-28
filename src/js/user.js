const profileImage = document.querySelector('.profile-image');
const nicknameBox = document.querySelector('.nickname-box');
const followerNum = document.querySelector('.follower-num');
const followingNum = document.querySelector('.following-num');
const introBox = document.querySelector('.intro-box');
const listContainer = document.querySelector('.list-container');
const followButton = document.querySelector('.follow-btn');
const followersLink = document.querySelector('.followers a');
const followsingsLink = document.querySelector('.followings a');

const params = new URLSearchParams(window.location.search);
const userId = params.get('user_id');

let isFollowing = false;

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
    if (userId === String(data1.user_id)) {
      // 현재 페이지 방문자가 로그인된 사용자인 경우
      console.log('사용자는 자신의 페이지를 방문했습니다.');
      document.querySelector('.edit-btn').style.display = 'block';
      document.querySelector('.follow-btn').style.display = 'none';
      document.querySelector('.like-list-btn').style.display = 'block';
    } else {
      // 다른 사용자가 페이지를 방문한 경우
      console.log('다른 사용자가 페이지를 방문했습니다.');
      document.querySelector('.follow-btn').style.display = 'block';
      document.querySelector('.edit-btn').style.display = 'none';
      document.querySelector('.like-list-btn').style.display = 'none';

      const followGetResponse = await fetch(`${BASEURL}/users/${userId}/following`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const followGetData = await followGetResponse.json();
      followGetData.forEach((data) => {
        console.log(data);
        if (data.to_user === data1.user_id) {
          followButton.textContent = '팔로우 취소';
          isFollowing = true;
        } else {
          followButton.textContent = '팔로우 하기';
          isFollowing = false;
        }
      });
    }

    followersLink.href = `./followers.html?user_id=${userId}`;
    followsingsLink.href = `./followings.html?user_id=${userId}`;

    // 두 번째 fetch 요청
    const response2 = await fetch(`${BASEURL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    const data2 = await response2.json();

    nicknameBox.textContent = data2.nickname;
    followerNum.textContent = data2.followers_count;
    followingNum.textContent = data2.following_count;
    introBox.textContent = data2.bio ? data2.bio : '자기소개가 없습니다.';

    if (data2.profile_img) {
      const imageUrl = data2.profile_img.includes('k.kakaocdn.net') ?
        data2.profile_img.replace('/media/http%3A/', 'http://') : data2.profile_img;
      profileImage.style.backgroundImage = `url(${imageUrl})`;
    }

    // 세 번째 fetch 요청
    const response3 = await fetch(`${BASEURL}/trend-missions/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    const data3 = await response3.json();

    data3.forEach((data) => {
      // 새로운 리스트 아이템과 링크 생성
      const listItem = document.createElement('li');
      const link = document.createElement('a');

      link.href = `trend_mission.html?trend_mission_id=${data.id}&trend_name=${data.trend_name}&user_id=${data.user}`; // 링크의 href 설정
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
  location.href = `edit_user.html?user_id=${userId}`;
});

document.querySelector('.follow-btn').addEventListener('click', async () => {
  const followResponse = await fetch(`${BASEURL}/users/${userId}/following`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const followData = await followResponse.json();
  console.log(followData)
  if (followData.message === '팔로잉 취소 완료') {
    isFollowing = false;
  } else {
    isFollowing = true;
  }
  console.log(isFollowing);
  followButton.textContent = isFollowing ? '팔로우 취소' : '팔로우 하기';
  followerNum.textContent = isFollowing ? Number(followerNum.textContent) + 1 : Number(followerNum.textContent) - 1;
});

document.querySelector('.stamp-btn').addEventListener('click', () => {
  location.href = `my_stamp.html?user_id=${userId}`;
});

document.querySelector('.like-list-btn').addEventListener('click', () => {
  location.href = `like_trends.html?user_id=${userId}`;
});