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



// 좋아요 카운트를 가져옵니다.
// const likeCount = document.getElementById('likeCount');


// // 각 사용자의 이미지 URL
// const userImages = [
//   '../assets/images/user1_image1.jpg',
//   '../assets/images/user1_image2.jpg',
//   '../assets/images/user1_image3.jpg',
//   '../assets/images/user2_image1.jpg'
// ];

// // 사람 수를 나타내는 변수
// const numberOfParticipant = userImages.length;

// const usersFrame = document.getElementById('usersFrame');

// // 사람 수만큼 요소를 생성
// for (let i = 0; i < Math.min(numberOfParticipant, 4); i++) {
//   const div = document.createElement('div');
//   div.className = 'profile-img';
//   div.style.backgroundImage = `url(${userImages[i]})`; // 이미지를 설정
//   usersFrame.appendChild(div);
// }

// function handleTrendAuthentication() {
//   window.location.href = 'trendverify.html';
// }

// // "userCount" id를 가진 요소를 찾아 참여 인원 수를 표시
// const userCount = document.getElementById('userCount');
// userCount.textContent = numberOfParticipant.toLocaleString();


  // 트렌드 상세 조회
const urlParams = new URLSearchParams(window.location.search);
const trendId = urlParams.get('trend_id');
const trendName = urlParams.get('trend_name');

fetch('http://43.202.230.2/trends/' + trendId, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('access_tokens'),
    'Content-Type': 'application/json',
  },
  credentials: 'include',
})
  .then(response => response.json())
  .then(data => {
    // 트렌드 데이터 값 넣어주기
    // 트렌드 이름 넣어주기
    const trendNameContent = document.getElementById('trend-name')
    const h2 = document.createElement('h2');
    h2.textContent = trendName; // 변수 값을 넣어줍니다.
    trendNameContent.appendChild(h2);

    // 조회수를 가져옵니다.
    const viewCount = document.getElementById('viewCount');
    const trendViewCount = data.trend_view_count;
    const intViewCount = Number(trendViewCount.view_count)
    viewCount.textContent = formatCount(intViewCount);

    // 좋아요 카운트를 가져옵니다.
    const likeCount = document.getElementById('likeCount');
    likeCount.textContent = formatCount(data.like_count);

    // 참여중인 사용자들을 불러옵니다
    // 각 사용자의 이미지 URL
    const userImages = [
      // '../assets/images/user1_image1.jpg',
      // '../assets/images/user1_image2.jpg',
      // '../assets/images/user1_image3.jpg',
      // '../assets/images/user2_image1.jpg'
    ];
    user_trend_list = data.users_with_trend
    for (let i = 0; i < user_trend_list.length; i++) {
      userImages.push('http://43.202.230.2/' + user_trend_list[i].profile_img);
    }

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

    // 트렌드에 해당하는 아이템 리스트를 불러옵니다.
    const itemList = data.trend_item;

    const trendItems = document.getElementsByClassName('trend-items');
    for (let i = 0; i<itemList.length; i++) {
      const item = document.createElement('div');
      // li 요소 생성
      const li = document.createElement('li');
      li.classList.add('trend-item');

      // 이미지 요소 생성
      const img = document.createElement('img');
      img.src = 'http://43.202.230.2/' + itemList[i].image;
      img.alt = itemList[i].title;

      // description 요소 생성
      const description = document.createElement('div');
      description.classList.add('description');

      // h3 요소 생성
      const h3 = document.createElement('h3');
      h3.textContent = itemList[i].title;

      // p 요소 생성
      const p = document.createElement('p');
      p.innerHTML = itemList[i].content;

      // li 요소에 자식 요소 추가
      description.appendChild(h3);
      description.appendChild(p);
      li.appendChild(img);
      li.appendChild(description);
      item.appendChild(li);
      trendItems[0].appendChild(item);
    }
  });


// 좋아요 버튼을 가져옵니다.
const likeButton = document.querySelector('.like-button');

// 하트를 가져옵니다.
const heart = document.querySelector('.heart');

// 좋아요 버튼 클릭 여부를 저장하는 변수입니다.
let isLiked = false;


// 이미 좋아요 한 경우 하트를 빨간색으로 채웁니다.
// 접속중인 사용자 확인

fetch('http://43.202.230.2/users/info', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('access_tokens'),
    'Content-Type': 'application/json',
  },
  credentials: 'include',
})
  .then(response => response.json())
  .then(data => {
    userId = data.user_id;
    fetch('http://43.202.230.2/trends/' + userId + '/likelist', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_tokens'),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        if (trendId == data[i].id) {
          isLiked = true;
          heart.style.fill = '#D7433A'; // 하트를 빨간색으로 채웁니다.
        }
      }
    })
  });







// 좋아요 버튼에 클릭 이벤트 리스너를 설정합니다.
likeButton.addEventListener('click', function () {
  // 좋아요 버튼 클릭 여부에 따라 카운트를 증가시키거나 감소시킵니다.
  let currentCount = Number(likeCount.innerText);
  if (!isLiked) {
    likeCount.innerText = currentCount + 1;
    heart.style.fill = '#D7433A'; // 하트를 빨간색으로 채웁니다.

    // 좋아요 요청 api 호출
    fetch('http://43.202.230.2/trends/' + trendId + '/likes', {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_tokens'),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

  } else {
    likeCount.innerText = currentCount - 1;
    heart.style.fill = 'none'; // 하트를 원래대로 돌립니다.

    // 좋아요 취소 api 호출
    fetch('http://43.202.230.2/trends/' + trendId+ '/likes', {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_tokens'),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
  }
  // 좋아요 버튼 클릭 여부를 업데이트합니다.
  isLiked = !isLiked;
});

function handleTrendAuthentication() {
  // 트렌드 미션 생성
  fetch('http://43.202.230.2/trend-missions/create', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_tokens'),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        'trend': trendId
      })
    })
    .then(response => response.json())
    .then(data => {
      // 트렌드 미션 페이지로 이동
      window.location.href = './trend_mission.html?trend_mission_id=' + data.id;
    })

}