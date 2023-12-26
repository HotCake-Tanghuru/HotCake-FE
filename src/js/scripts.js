function previewImage() {
  const input = document.querySelector('#imageUpload');
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      document.querySelector('#imagePreview').style.backgroundImage = `url(${e.target.result})`;
    }
    reader.readAsDataURL(file);
  }
}

function removeSelectedFile() {
  const input = document.querySelector('#imageUpload');
  const preview = document.querySelector('#imagePreview');

  input.value = '';
  preview.style.backgroundImage = 'none';
}