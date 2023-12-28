const missionItem = document.querySelector('.mission-item');
const missionImage = document.querySelector('.mission-image');
const comment = document.querySelector('.comment');

const urlParams = new URLSearchParams(window.location.search);
const missionItemId = urlParams.get('trend_mission_item_id');

async function fetchMissionItemData(missionItemId) {
  const response = await fetch(`${BASEURL}/trend-missions/mission-item/${missionItemId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const missionItemData = await response.json();
  console.log(missionItemData);
  missionItem.textContent = missionItemData.trend_item_name
  comment.textContent = missionItemData.content
  missionImage.style.backgroundImage = `url(http://43.202.230.2/${missionItemData.image})`;
}

if (missionItemId) {
  fetchMissionItemData(missionItemId);
} else {
  console.error('트렌드 미션 ID가 없습니다');
}

document.getElementById('trendMissionEditBtn').addEventListener('click', function (event) {
  event.preventDefault();
  window.location.href = `trend_mission_edit.html?trend_mission_item_id=${missionItemId}`;
});
