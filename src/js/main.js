BASEURL = ''

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



  })


//핫 트렌드 페이지 조회
fetch('http://43.202.230.2/trends', {
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
      trendImageList.push('http://43.202.230.2/' + trendList[i].image);
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
      image.src = 'http://43.202.230.2/' + trendList[i].image; // 이미지 URL
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