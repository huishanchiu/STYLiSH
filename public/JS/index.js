import { getAjax, handleCartCount, fbLogin } from './base.js';

fbLogin();
window.onload = function () {
  handleCartCount();
};

const URL = 'https://api.appworks-school.tw/api/1.0/products/';
const mainContent = document.querySelector('.container');
let paging = 1;

function render(data) {
  const productData = JSON.parse(data);
  const productInfo = productData.data;
  paging = productData.next_paging;
  if (productData.data.length === 0) {
    mainContent.innerHTML = '搜尋不到此產品喔!';
    mainContent.className = 'sorry';
  } else {
    for (let i = 0; i < productInfo.length; i += 1) {
      const colorsTag = document.createElement('div');

      for (let j = 0; j < productInfo[i].colors.length; j += 1) {
        const colorTag = document.createElement('div');
        colorTag.className = 'item-color';
        colorTag.style.backgroundColor = `#${productInfo[i].colors[j].code}`;
        colorsTag.appendChild(colorTag);
      }
      const products = document.createElement('a');
      const imgTag = document.createElement('img');
      const titleTag = document.createElement('div');
      const priceTag = document.createElement('div');
      products.href = '#';
      imgTag.src = productInfo[i].main_image;
      imgTag.alt = 'product-image';

      const title = document.createTextNode(productInfo[i].title);
      const price = document.createTextNode(`TWD.${productInfo[i].price}`);

      titleTag.className = 'item-title';
      priceTag.className = 'item-price';
      products.className = 'product';
      colorsTag.className = 'item-colors';
      products.href = `./product.html?id=${productInfo[i].id}`;

      titleTag.appendChild(title);
      priceTag.appendChild(price);
      products.appendChild(imgTag);
      products.appendChild(colorsTag);
      products.appendChild(titleTag);
      products.appendChild(priceTag);
      mainContent.appendChild(products);
    }
  }
}

let category = '';
const changeCategory = () => {
  if (window.location.search === '?tag=women') {
    category = 'women';
    getAjax(`${URL}${category}`, (response) => render(response));
  } else if (window.location.search === '?tag=men') {
    category = 'men';
    getAjax(`${URL}${category}`, (response) => render(response));
  } else if (window.location.search === '?tag=accessories') {
    category = 'accessories';
    getAjax(`${URL}${category}`, (response) => render(response));
  } else if (window.location.search === '') {
    category = 'all';
    getAjax(`${URL}${category}`, (response) => render(response));
  }
};
changeCategory();

if (window.location.search.split('=')[0] === '?keyword') {
  getAjax(`${URL}search${window.location.search}`, (response) =>
    render(response)
  );
}
// const search = () => {
//   const searches = document.querySelectorAll('.search');
//   const handleSearch = (event) => {
//     event.preventDefault();
//     const isEnterKeyCode = event.keyCode === 13;
//     if (isEnterKeyCode) {
//       const keyword = event.target.value;
//       window.location.href = `./?keyword=${keyword}`;
//     }
//   };
//   searches.forEach((searchBtn) => {
//     searchBtn.addEventListener('keyup', handleSearch);
//   });
// };
// search();

const bannerContent = document.getElementById('campaigns');
function showBanner(data) {
  const bannerData = JSON.parse(data);
  const bannerInfo = bannerData.data;
  for (let i = 0; i < bannerInfo.length; i += 1) {
    const aTag = document.createElement('a');
    const storyTag = document.createElement('div');
    const story = document.createTextNode(bannerInfo[i].story);
    aTag.className = 'campaign';
    storyTag.className = 'campaign__story';
    aTag.href = `./product.html?id=${bannerInfo[i].product_id}`;
    aTag.style = `background-image:url(${bannerInfo[i].picture})`;

    storyTag.appendChild(story);
    aTag.appendChild(storyTag);
    bannerContent.appendChild(aTag);
  }
  let num = 0;
  const campaigns = document.querySelectorAll('.campaign');
  const dots = document.querySelectorAll('.dot');
  campaigns[0].classList.add('campaign--active');
  dots[0].classList.add('dot--active');

  function showCampaign(n) {
    for (let i = 0; i < campaigns.length; i += 1) {
      campaigns[i].classList.remove('campaign--active');
      dots[i].classList.remove('dot--active');
    }
    campaigns[n].classList.add('campaign--active');
    dots[n].classList.add('dot--active');
  }
  setInterval(() => {
    num += 1;
    if (num === campaigns.length) {
      num = 0;
    }
    showCampaign(num);
  }, 5000);
  for (let i = 0; i < dots.length; i += 1) {
    (function () {
      dots[i].onclick = function () {
        showCampaign(i);
      };
    })(i);
  }
}

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const scrollBottom = 1;
  if (scrollHeight - scrollTop - clientHeight < scrollBottom) {
    if (paging !== undefined) {
      getAjax(`${URL}${category}?paging=${paging}`, (response) =>
        render(response)
      );
    }
  }
});

getAjax(
  'https://api.appworks-school.tw/api/1.0/marketing/campaigns',
  (response) => showBanner(response)
);
