export const handleCartCount = () => {
  const counts = document.querySelectorAll('.count');
  const cartItems = JSON.parse(localStorage.getItem('cart'));
  for (let i = 0; i < counts.length; i += 1) {
    counts[i].textContent = cartItems.length;
  }
};

export const getAjax = (src, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(xhr.responseText);
    }
  };
  xhr.open('GET', src, true);
  xhr.send();
};

export const seachOnOtherPage = () => {
  if (window.location.search.split('=')[0] === '?keyword') {
    window.location.href = `index.html${window.location.search}`;
  }
};

export const fbLogin = () => {
  window.fbAsyncInit = function () {
    FB.init({
      appId: '2900965646832857',
      cookie: true,
      xfbml: true,
      version: 'v11.0',
    });
    FB.AppEvents.logPageView();
  };

  // 嵌入臉書sdk
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

  //= ========FB.getLoginStatus 登入狀態=====================
  // (connected):使用者登入了facebook也授權給你的應用程式
  // (not_authorized):使用者登入了facebook但還沒授權給你的應用程式
  // (unknown):使用者沒登入facebook
  //= =======================登入狀態========================

  // 處理以FB登入(會先進入臉書登入頁面)
  function login() {
    FB.login(
      (response) => {
        if (response.status === 'connected') {
          alert('成功登入～～');
        } else {
          alert('登入失敗～～');
        }
      },
      { scope: 'public_profile,email' }
    );
  }

  // 確認用戶是否已經使用「Facebook 登入」來登入您的應用程式(不是臉書登入，使用臉書登入此APP)
  function checkLoginState() {
    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        window.location.href = './profile.html';
      } else {
        login();
      }
    });
  }

  const loginBtn = document.querySelectorAll('.member');
  loginBtn.forEach((btn) => {
    btn.addEventListener('click', checkLoginState);
  });
};
