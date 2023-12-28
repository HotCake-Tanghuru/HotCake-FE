//const likeButtons = document.querySelectorAll(".like-button");

//likeButtons.forEach((likeButton) => {
  //likeButton.addEventListener("click", function () {
    //const heart = this.querySelector(".heart");
    //heart.style.fill = heart.style.fill ? "" : "#d7433a";
  //});
//});

let userId = 0;

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
  
  const likeTrendsResponse = await fetch(`http://43.202.230.2/trends/${userId}/likelist`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_tokens'),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    const data2 = await likeTrendsResponse.json();
    console.log(data2);

    data2.forEach((trend) => {
      // 새로운 리스트 아이템과 링크 생성
      const liketrends = document.querySelector('.like-trends');

      const liketrend = document.createElement('li');
      liketrend.className = 'like-trend';

      const trendimages = document.createElement('ul');
      trendimages.className = 'trend-images';
      
      // 트렌드 아이템 불러오기
      trend.trend_item.slice(0, 3).forEach((trend_item) => {
        const trendimage = document.createElement('li');
        trendimage.className = 'trend-image';
        const img = document.createElement('img');
        img.src = BASEURL + '/' + trend_item.image;
        trendimage.appendChild(img);

        trendimages.appendChild(trendimage);
      });

      const themecontainer = document.createElement('div');
      themecontainer.className = 'theme-container';

      const trendLink = document.createElement('a');
      trendLink.href = `trend.html?trend_id=${trend.id}&trend_name=${trend.name}`;

      const h3 = document.createElement('h3');
      h3.textContent = trend.name;
      h3.className = 'trend-theme';

      trendLink.appendChild(h3);

      themecontainer.appendChild(trendLink);

      liketrend.appendChild(trendimages);
      liketrend.appendChild(themecontainer);

      liketrends.appendChild(liketrend);
    });
  }
  catch (err) {
    console.log(err);
  }
}
getUserInfo()