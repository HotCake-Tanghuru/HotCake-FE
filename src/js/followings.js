let userId = 0;

// 팔로잉 정보를 가져오는 함수
async function getUserInfo() {
  try {
    // 접속 중인 유저 확인
    const userInfoResponse = await fetch('http://43.202.230.2/users/info', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_tokens'),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
  const data1 = await userInfoResponse.json();
  console.log(data1);
  userId = data1.user_id;

  //유저의 팔로잉 확인
  const followinglistResponse = await fetch(`http://43.202.230.2/users/${userId}/following`,
    {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_tokens'),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    const data2 = await followinglistResponse.json();
    console.log(data2);

    const followlist = document.querySelector('.follow-list')
    followlist.innerHTML = '';

    data2.forEach(following => {
      const { user_info } = following;
      const followuser = document.createElement('li');
      followuser.className = 'follow-user';
      console.log(user_info.profile_img)

      const row1 = document.createElement('div')
      row1.className = 'row-1'

      const followUserImage = document.createElement('div')
      followUserImage.className = 'follow-user-image'

      const followusername = document.createElement('p')
      followusername.className = 'follow-user-name'
      followusername.innerText = user_info.nickname

      const row1follwerbuttons = document.createElement('div')

      const followingbutton = document.createElement('button')
      followingbutton.className = 'following-button'
      followingbutton.innerText = '팔로우중'

      const imageUrl = user_info.profile_img.includes('k.kakaocdn.net') ?
        user_info.profile_img.replace('/media/image/profile/http%3A/', 'http://') : `${BASEURL}${user_info.profile_img}`;

        console.log(imageUrl)

        followUserImage.style.backgroundImage = `url(${imageUrl})`;

      row1.appendChild(followUserImage)
      row1.appendChild(followusername)
      row1follwerbuttons.appendChild(followingbutton)

      followuser.appendChild(row1)
      followuser.appendChild(row1follwerbuttons)

      followlist.appendChild(followuser)
    })
    const followListElement = document.querySelector('.follow-list');
    followListElement.addEventListener('click', handleDeleteClick);
    const searchresult = document.querySelector('.search-results');
    searchresult.style.display = 'none';
  }
  catch (error) {
    console.error(error);
  }
}

//검색
async function showSearchresult() {
  const searchInput = document.getElementById('search');
  const searchValue = searchInput.value.trim();
  const followList = document.querySelector('.follow-list');
  const searchresult = document.querySelector('.search-results');

  try {
    if (searchValue === '') {
      await getUserInfo(); // getUserInfo 함수가 완료될 때까지 기다립니다.
      searchresult.style.display = 'none'; // 검색 결과 숨김
      followList.style.display = 'block'; // 팔로우 목록을 보여줍니다.
    } else {
      // 서버에 검색 요청 보내기
      const searchresponse = await fetch(`http://43.202.230.2/users/search?nickname=${encodeURIComponent(searchValue)}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_tokens'),
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const searchdata = await searchresponse.json();
      console.log(searchdata);

      followList.style.display = 'none'; // 팔로우 목록 숨김
      searchresult.innerHTML = '';

      for (let i = 0; i < searchdata.length; i++) {

        const searchuser = document.createElement('li')
        searchuser.className = 'search-user'
        const row1 = document.createElement('div')
        row1.className = 'row-1'

        const searchUserImage = document.createElement('div')
        searchUserImage.className = 'search-user-image'

        const searchusername = document.createElement('p')
        searchusername.className = 'search-user-name'
        searchusername.innerText = searchdata[i].nickname

        const row1follwerbuttons = document.createElement('div')

        const btnfollowerbutton = document.createElement('button');
        btnfollowerbutton.className = 'btn follower-button';
        btnfollowerbutton.innerText = '팔로우';
        btnfollowerbutton.id = searchdata[i].id;

        const imageUrl = searchdata[i].profile_img.includes('k.kakaocdn.net') ?
          searchdata[i].profile_img.replace('/media/http%3A/', 'http://') : `${BASEURL}${searchdata[i].profile_img}`;

        searchUserImage.style.backgroundImage = `url(${imageUrl})`;

        row1.appendChild(searchUserImage)
        row1.appendChild(searchusername)
        row1follwerbuttons.appendChild(btnfollowerbutton)

        searchuser.appendChild(row1)
        searchuser.appendChild(row1follwerbuttons)

        searchresult.appendChild(searchuser)
      }

      searchresult.style.display = 'block'; // 검색 결과 표시

    }
  }
  catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getUserInfo(); // 팔로워 정보를 가져옵니다.

  const searchForm = document.querySelector('.search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      showSearchresult();
    });
  }
});