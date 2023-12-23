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