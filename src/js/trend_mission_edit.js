const missionItem = document.querySelector('.mission-item');
const missionImage = document.querySelector('.mission-image');
const commentBox = document.querySelector('.comment-box');

const urlParams = new URLSearchParams(window.location.search);
const missionItemId = urlParams.get('trend_mission_item_id');

const userId = localStorage.getItem('user_id');
let trendName = '';
let trendMissionId = 0;

async function fetchMissionItemData(missionItemId) {
  try {
    const response = await fetch(`${BASEURL}/trend-missions/mission-item/${missionItemId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const missionItemData = await response.json();

    missionItem.textContent = missionItemData.trend_item_name;
    commentBox.value = missionItemData.content;
    trendMissionId = missionItemData.trend_mission;

    // 2번째 fetch 요청 수행
    fetch(`${BASEURL}/trend-missions/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then(response => response.json())
      .then(data => {
        data.forEach((mission) => {
          if (mission.id === missionItemData.trend_mission) {
            trendName = mission.trend_name;
          }
        });
      });
  } catch (error) {
    console.error(error);
  }
}

if (missionItemId) {
  fetchMissionItemData(missionItemId);
} else {
  console.error('트렌드 미션 아이템 ID가 없습니다');
}

document.getElementById('trendMissionEditBtn').addEventListener('click', function (event) {
  event.preventDefault();

  const imageFile = document.getElementById('imageUpload').files[0];

  if (!imageFile || !commentBox.value) {
    alert('이미지와 내용을 모두 입력해야 합니다.');
    return;
  }

  const formData = new FormData();
  formData.append('content', commentBox.value);
  formData.append('image', imageFile);

  fetch(`${BASEURL}/trend-missions/mission-item/${missionItemId}/edit`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      if (data) {
        alert('변경이 완료되었습니다.')
        window.location.href = `./trend_mission.html?trend_mission_id=${trendMissionId}&trend_name=${trendName}&user_id=${userId}`;
      }
    })
    .catch(error => {
      console.error('에러:', error);
    });

});
