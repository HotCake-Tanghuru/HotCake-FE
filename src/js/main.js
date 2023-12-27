BASEURL = ''

let params = new URLSearchParams(window.location.search);
let encodedData = params.get('user_access');
let jsonData = atob(encodedData);
let data = JSON.parse(jsonData);
console.log(data);

access_token = data['access_token'];

localStorage.setItem('access_tokens', JSON.stringify(data.access_token));
localStorage.setItem('refresh_tokens', JSON.stringify(data.refresh_token));

// 접속중인 사용자 확인

fetch('http://43.202.230.2/users/info', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + access_token,
    'Content-Type': 'application/json',
  },
  credentials: 'include',
})
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })