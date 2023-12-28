const modal = document.getElementById("stampModal");
const closeBtn = document.querySelector(".close");
const stampElements = document.querySelectorAll('.stamp-container .stamp');
const stampImagesContainer = document.querySelector(".photos");

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('user_id');

let trendId = 0;

async function fetchStampData(userId) {
  const response = await fetch(`${BASEURL}/trend-missions/users/${userId}/stamp`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const stampData = await response.json();

  stampData.forEach((data, index) => {
    if (data.created_at) {
      const originalDate = data.created_at;
      const parsedDate = new Date(originalDate);
      const formattedDate = `${parsedDate.getFullYear()}.${parsedDate.getMonth() + 1}.${parsedDate.getDate()}`;
      console.log(data);
      const currentStampElement = stampElements[index];
      currentStampElement.setAttribute('data-stamp-id', data.id);
      currentStampElement.querySelector('.stamp-date').textContent = formattedDate;
      currentStampElement.classList.add('stamped');
    }
  });
}

if (userId) {
  fetchStampData(userId);
} else {
  console.error('유저ID가 없습니다');
}

document.addEventListener('DOMContentLoaded', function () {
  const shareBtn = document.getElementById('shareBtn');
  const stampContainer = document.querySelector('.stamp-container');

  shareBtn.addEventListener('click', function () {
    html2canvas(stampContainer).then(canvas => {
      let link = document.createElement('a');
      link.download = 'My stamp.png';
      link.href = canvas.toDataURL()
      link.click();
    });
  });
});

// stamp 클래스를 가진 모든 요소에 대해 클릭 이벤트를 등록합니다.
const stamps = document.querySelectorAll(".stamp");
stamps.forEach(function (stamp) {
  stamp.addEventListener("click", async function () {
    modal.style.display = "block";

    const stampId = stamp.dataset.stampId;

    const response = await fetch(`${BASEURL}/trend-missions/users/stamp/${stampId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (response.ok) {
      const stampData = await response.json();
      stampImagesContainer.innerHTML = '';

      stampData.trend_item_list.forEach((item, index) => {
        const img = document.createElement("img");
        img.src = `http://43.202.230.2/${item.image}`; // 이미지 URL 설정
        img.alt = `사진 ${index + 1}`; // 이미지 대체 텍스트 설정

        const li = document.createElement("li");
        li.appendChild(img);
        stampImagesContainer.appendChild(li);
      });
      console.log(stampData);

      const originalDate = stampData.created_at;
      const parsedDate = new Date(originalDate);
      const formattedDate = `${parsedDate.getFullYear()}.${parsedDate.getMonth() + 1}.${parsedDate.getDate()}`;

      const stampDate = document.getElementById("stampDate");
      stampDate.textContent = formattedDate;

      const moreLink = document.getElementById("moreLink");
      const dynamicUrl = `trend_mission.html?trend_mission_id=${stampData.trend_mission['id']}&trend_name=${stampData.trend_mission['trend']}&user_id=${stampData.user}`;
      moreLink.setAttribute("href", dynamicUrl);
    } else {
      console.error('응답이 오류를 포함합니다.');
    }
  });
});

// 닫기 버튼을 눌렀을 때의 이벤트를 등록합니다.
closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

// 모달창 외부를 클릭했을 때의 이벤트를 등록합니다.
window.addEventListener("click", function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});
