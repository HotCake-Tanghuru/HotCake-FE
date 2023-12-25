function formatCount(count) {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + '백만';
  } else if (count >= 1000000) {
    return (count / 100000).toFixed(1) + '십만';
  } else if (count >= 10000) {
    return (count / 10000).toFixed(1) + '만';
  } else {
    return count.toLocaleString();
  }
}

// 조회수를 가져옵니다.
const viewCount = document.getElementById('viewCount');
viewCount.textContent = formatCount(1234);

// 좋아요 카운트를 가져옵니다.
const likeCount = document.getElementById('likeCount');

// 좋아요 버튼을 가져옵니다.
const likeButton = document.querySelector('.like-button');

// 하트를 가져옵니다.
const heart = document.querySelector('.heart');

// 좋아요 버튼 클릭 여부를 저장하는 변수입니다.
let isLiked = false;

// 좋아요 버튼에 클릭 이벤트 리스너를 설정합니다.
likeButton.addEventListener('click', function () {
  // 좋아요 버튼 클릭 여부에 따라 카운트를 증가시키거나 감소시킵니다.
  let currentCount = Number(likeCount.innerText);
  if (!isLiked) {
    likeCount.innerText = currentCount + 1;
    heart.style.fill = '#D7433A'; // 하트를 빨간색으로 채웁니다.
  } else {
    likeCount.innerText = currentCount - 1;
    heart.style.fill = 'none'; // 하트를 원래대로 돌립니다.
  }
  // 좋아요 버튼 클릭 여부를 업데이트합니다.
  isLiked = !isLiked;
});

// 각 사용자의 이미지 URL
const userImages = [
  '../assets/images/user1_image1.jpg',
  '../assets/images/user1_image2.jpg',
  '../assets/images/user1_image3.jpg',
  '../assets/images/user2_image1.jpg'
];

// 사람 수를 나타내는 변수
const numberOfParticipant = userImages.length;

const usersFrame = document.getElementById('usersFrame');

// 사람 수만큼 요소를 생성
for (let i = 0; i < Math.min(numberOfParticipant, 4); i++) {
  const div = document.createElement('div');
  div.className = 'profile-img';
  div.style.backgroundImage = `url(${userImages[i]})`; // 이미지를 설정
  usersFrame.appendChild(div);
}

function handleTrendAuthentication() {
  window.location.href = 'trendverify.html';
}

// "userCount" id를 가진 요소를 찾아 참여 인원 수를 표시
const userCount = document.getElementById('userCount');
userCount.textContent = numberOfParticipant.toLocaleString();