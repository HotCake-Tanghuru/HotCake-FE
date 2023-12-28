// 처음 접속 시 토큰 저장

let params = new URLSearchParams(window.location.search);
let encodedData = params.get('user_access');
access_token = '';
if (encodedData != null) {
  let jsonData = atob(encodedData);
  let data = JSON.parse(jsonData);
  access_token = data['access_token'];
  localStorage.setItem('access_tokens', data.access_token);
  localStorage.setItem('refresh_tokens', data.refresh_token);
}

//핫 트렌드 페이지 조회
fetch('http://43.202.230.2' + '/trends', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('access_tokens'),
    'Content-Type': 'application/json',
  },
  credentials: 'include',
})
  .then(response => response.json())
  .then(data => {
    const trendList = data['trends'];
    const followedTrendList = data['followed_trends']; // 친구들의 팔로우한 트렌드 리스트

    let trendNameList = [];
    let trendImageList = [];
    let trendIdList = [];
    for (let i = 0; i < trendList.length; i++) {
      trendIdList.push(trendList[i].id);
      trendNameList.push(trendList[i].name);
      trendImageList.push('http://43.202.230.2' + '/' + trendList[i].image);
    }

    const outer = document.querySelector('.outer');
    const innerList = document.querySelector('.inner-list');

    for (let i = 0; i < trendList.length; i++) {
      const slide = document.createElement('div');
      slide.classList.add('trend');

      const link = document.createElement('a');
      link.href = './trend.html?trend_id=' + trendList[i].id + '&trend_name=' + trendList[i].name; // 트렌드 상세 페이지 링크

      const image = document.createElement('img');
      image.id = 'trend_image';
      image.src ='http://43.202.230.2' + '/' + trendList[i].image; // 이미지 URL
      image.alt = trendList[i].name; // 이미지 대체 텍스트

      const trendName = document.createElement('div');
      trendName.classList.add('dim');
      trendName
      trendName.innerHTML = '<strong>' + trendList[i].name + '</strong>'; // 트렌드 이름

      link.appendChild(image);
      link.appendChild(trendName);
      slide.appendChild(link);
      innerList.appendChild(slide);
    }

    // 슬라이드 기능 구현
    const inners = document.querySelectorAll('.trend');
    let currentIndex = 0; // 현재 슬라이드 화면 인덱스

    inners.forEach((inner) => {
      inner.style.width = `${outer.clientWidth}px`; // inner의 width를 모두 outer의 width로 만들기
    })

    innerList.style.width = `${outer.clientWidth * inners.length}px`; // innerList의 width를 inner의 width * inner의 개수로 만들기

    /*
      버튼에 이벤트 등록하기
    */
    const buttonLeft = document.getElementById('button-left');
    const buttonRight = document.getElementById('button-right');

    buttonLeft.addEventListener('click', () => {
      currentIndex--;
      currentIndex = currentIndex < 0 ? 0 : currentIndex; // index값이 0보다 작아질 경우 0으로 변경
      innerList.style.marginLeft = `-${outer.clientWidth * currentIndex}px`; // index만큼 margin을 주어 옆으로 밀기
    });

    buttonRight.addEventListener('click', () => {
      currentIndex++;
      currentIndex = currentIndex >= inners.length ? inners.length - 1 : currentIndex; // index값이 inner의 총 개수보다 많아질 경우 마지막 인덱스값으로 변경
      innerList.style.marginLeft = `-${outer.clientWidth * currentIndex}px`; // index만큼 margin을 주어 옆으로 밀기
    });
  })

// 랜덤한 팔로우 데이터 조회
fetch('http://43.202.230.2' + '/trend-missions/random', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('access_tokens'),
    'Content-Type': 'application/json',
  },
  credentials: 'include',
})
  .then(response => response.json())
  .then(data => {
    console.log(data);

    let followingUserName = data['user_nickname'];
    let followingUserId = data['user'];
    let trendName = data['trend_name'];
    let trendId = data['trend'];
    let trend_mission_id = data['id'];
    let imageList = [];
    for (let i = 0; i < 3; i++) {
      if (data['trend_item_list'][i].image == null) {
        imageList.push('./user.png');
      } else{
        imageList.push('http://43.202.230.2' + data['trend_item_list'][i].image);
      }
    }

    const trendPostList = document.querySelector('.trend-posts');

    // 요소 생성
    const trendPost = document.createElement('li');
    trendPost.classList.add('trend-post');

    const trendUser = document.createElement('h3');
    trendUser.classList.add('trend-user');
    
    // 사용자 이름 + 프로필 링크
    const trendUserSpan = document.createElement('span');
    const userProfileA = document.createElement('a');
    userProfileA.href = './user.html?user_id=' + followingUserId;
    userProfileA.innerHTML = followingUserName;
    trendUserSpan.appendChild(userProfileA);
    trendUser.appendChild(trendUserSpan);

    // 중간에 - 추가
    trendUser.innerHTML += ' - ';

    // 트렌드 이름 + 트렌드 링크
    const trendNameStrong = document.createElement('strong');
    const trendNameA = document.createElement('a');
    trendNameA.href = './trend.html?trend_id=' + trendId + '&trend_name=' + trendName;
    trendNameA.innerHTML = trendName;
    trendNameStrong.appendChild(trendNameA);
    trendUser.appendChild(trendNameStrong);

    // 트렌드 미션 이미지 리스트
    const trendPhotos = document.createElement('ul');
    trendPhotos.classList.add('trend-photos');

    // 이미지 3개만 노출
    for (let k = 0; k<3; k++) {
      const photoli = document.createElement('li');
      const photoA = document.createElement('a');
      const photoImg = document.createElement('img');

      photoA.href = './trend_mission.html?trend_mission_id=' + trend_mission_id + '&trend_name=' + trendName + '&user_id=' + followingUserId;
      photoImg.src = imageList[k];

      
      photoA.appendChild(photoImg);
      photoli.appendChild(photoA);
      trendPhotos.appendChild(photoli);
    }

    trendPost.appendChild(trendUser);
    trendPost.appendChild(trendPhotos);

    trendPostList.appendChild(trendPost);

  });


