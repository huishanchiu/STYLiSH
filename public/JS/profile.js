import { seachOnOtherPage, handleCartCount } from './base.js';

handleCartCount();
seachOnOtherPage();
function logout() {
  FB.logout(() => {
    alert('已成功登出～～');
    window.location.href = './index.html';
  });
}
function renderProfile(user) {
  const member = document.getElementById('member');
  const img = document.createElement('img');
  img.src = user.picture;
  member.appendChild(img);
  const memberDetail = document.createElement('div');
  const userName = document.createElement('h3');
  const userMail = document.createElement('h3');
  const logoutBtn = document.createElement('button');
  logoutBtn.onclick = function () {
    logout();
  };

  userName.textContent = user.name;
  userMail.textContent = user.email;
  logoutBtn.textContent = '登出';
  logoutBtn.className = 'logoutBtn';
  memberDetail.className = 'member__detail';
  memberDetail.appendChild(userName);
  memberDetail.appendChild(userMail);
  memberDetail.appendChild(logoutBtn);
  member.appendChild(memberDetail);
}
const postSignInApi = function (graphDomain, accessToken) {
  fetch('https://api.appworks-school.tw/api/1.0/user/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: graphDomain,
      access_token: accessToken,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      const { user } = response.data;
      renderProfile(user);
    })
    .catch((err) => {
      console.log(err);
    });
};
//= =======FB==JavaScript SDK========
window.fbAsyncInit = function () {
  FB.init({
    appId: '2900965646832857',
    cookie: true,
    xfbml: true,
    version: 'v11.0',
  });
  FB.AppEvents.logPageView();
  // 在init的狀態下偵測使用者是否有登入過
  FB.getLoginStatus((response) => {
    const { accessToken } = response.authResponse;
    if (response.status === 'connected') {
      postSignInApi('facebook', accessToken);
    } else {
      window.location.href = './index.html';
    }
  });
};

(function log(d, s, id) {
  const fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  const js = d.createElement(s);
  js.id = id;
  js.src = 'https://connect.facebook.net/en_US/sdk.js';
  fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');

const loginBtn = document.querySelectorAll('.member');
loginBtn.forEach((btn) => {
  btn.addEventListener('click', () => {
    window.location.href = './profile.html';
  });
});
