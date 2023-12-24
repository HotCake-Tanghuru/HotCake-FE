document.addEventListener('DOMContentLoaded', function () {
  var shareBtn = document.getElementById('shareBtn');
  var stampContainer = document.querySelector('.stamp-container');

  shareBtn.addEventListener('click', function () {
    html2canvas(stampContainer).then(canvas => {
      let link = document.createElement('a');
      link.download = 'My stamp.png';
      link.href = canvas.toDataURL()
      link.click();
    });
  });
});

var modal = document.getElementById("stampModal");
var closeBtn = document.querySelector(".close");

// stamp 클래스를 가진 모든 요소에 대해 클릭 이벤트를 등록합니다.
var stamps = document.querySelectorAll(".stamp");
stamps.forEach(function (stamp) {
  stamp.addEventListener("click", function () {
    modal.style.display = "block";
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