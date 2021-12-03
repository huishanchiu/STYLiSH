import { seachOnOtherPage, fbLogin, handleCartCount } from './base.js';

handleCartCount();
fbLogin();
seachOnOtherPage();
// 當localStorage沒有資料陣列，指定一個空陣列放入資料庫
if (localStorage.getItem('cart') === null) {
  localStorage.setItem('cart', JSON.stringify([]));
}

const subtotalPrice = document.querySelector('.subtotal .value span');
const freight = document.querySelector('.freight .value span');
const totalPrice = document.querySelector('.total .value span');
const counts = document.querySelectorAll('.count');
const cartItems = JSON.parse(localStorage.getItem('cart'));
const items = document.getElementById('items');
items.className = 'items';

function renderCart() {
  cartItems.forEach((item) => {
    const theItem = document.createElement('div');
    theItem.className = 'item';
    const renderImage = () => {
      const img = document.createElement('img');
      img.className = 'item__image';
      img.src = `${item.image}`;
      theItem.insertBefore(img, theItem.children[0]);
    };
    renderImage();
    const renderItemDetail = () => {
      const itemDetail = document.createElement('div');
      const itemName = document.createElement('div');
      const itemId = document.createElement('div');
      const itemColor = document.createElement('div');
      const itemSize = document.createElement('div');

      itemDetail.className = 'item__detail';
      itemName.className = 'item__name';
      itemName.textContent = item.title;
      itemId.className = 'item__id';
      itemId.textContent = item.id;
      itemColor.className = 'item__color';
      itemColor.textContent = `顏色｜${item.color.name}`;
      itemSize.className = 'item__size';
      itemSize.textContent = `尺寸｜${item.size}`;

      itemDetail.appendChild(itemName);
      itemDetail.appendChild(itemId);
      itemDetail.appendChild(itemColor);
      itemDetail.appendChild(itemSize);
      theItem.appendChild(itemDetail);
    };
    renderItemDetail();
    const renderItemQuantity = () => {
      const itemQuantity = document.createElement('div');
      const itemQtyText = document.createElement('div');
      const itemQtySelect = document.createElement('select');
      itemQuantity.className = 'item__quantity';
      itemQtyText.className = 'mobile-text';
      itemQtyText.textContent = '數量';
      // 如果qtyOption的數量剛好等於選擇的數量，加上“被選擇”屬性
      const option = function (stock, qty) {
        for (let i = 1; i <= stock; i += 1) {
          const qtyOption = document.createElement('option');
          qtyOption.value = i;
          qtyOption.textContent = i;
          if (i === qty) {
            qtyOption.selected = 'selected';
          }
          itemQtySelect.appendChild(qtyOption);
        }
      };
      option(item.stock, item.qty);
      itemQuantity.appendChild(itemQtyText);
      itemQuantity.appendChild(itemQtySelect);
      theItem.appendChild(itemQuantity);
    };
    renderItemQuantity();
    const renderItemPrice = () => {
      const itemPrice = document.createElement('div');
      const itemPriceText = document.createElement('div');
      itemPrice.className = 'item__price';
      itemPrice.textContent = `NT.${item.price}`;
      itemPriceText.className = 'mobile-text';
      itemPriceText.textContent = '單價';
      itemPrice.insertAdjacentElement('afterbegin', itemPriceText);
      theItem.appendChild(itemPrice);
    };
    renderItemPrice();
    const renderItemSubtotal = () => {
      const itemSubtotal = document.createElement('div');
      const itemSubtotalPrice = document.createElement('span');
      const itemSubtotalText = document.createElement('div');
      itemSubtotal.className = 'item__subtotal';
      itemSubtotalPrice.className = 'item__subtotal__price';
      itemSubtotalPrice.textContent = `NT.${item.qty * item.price}`;
      itemSubtotalText.className = 'mobile-text';
      itemSubtotalText.textContent = '小計';
      itemSubtotal.appendChild(itemSubtotalText);
      itemSubtotal.appendChild(itemSubtotalPrice);
      theItem.appendChild(itemSubtotal);
    };
    renderItemSubtotal();
    const renderItemRemove = () => {
      const itemRemove = document.createElement('div');
      const itemRemoveImg = document.createElement('img');
      itemRemove.className = 'item__remove';
      itemRemoveImg.src = './images/cart-remove.png';
      itemRemove.appendChild(itemRemoveImg);
      theItem.appendChild(itemRemove);
      items.appendChild(theItem);
    };
    renderItemRemove();
  });
}
renderCart();
function calculator() {
  const sum = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  // 如果購物車為空，金額都為“”0，若不是空，將計算好的數量渲染到畫面上
  if (cartItems.length === 0) {
    subtotalPrice.textContent = 0;
    freight.textContent = 0;
    totalPrice.textContent = 0;
  } else {
    freight.textContent = 60;
    subtotalPrice.textContent = sum;
    totalPrice.textContent = sum + 60;
  }
}
calculator();

function updateCounts() {
  const headerCartCount = document.getElementById('title');
  headerCartCount.className = 'title';
  headerCartCount.textContent = `購物車(${cartItems.length})`;
  for (let i = 0; i < counts.length; i += 1) {
    counts[i].innerHTML = cartItems.length;
  }
  if (cartItems.length === 0) {
    const message = document.createElement('h2');
    message.textContent = '購物車空空如也......';
    message.className = 'cart__empty';
    items.appendChild(message);
    subtotalPrice.textContent = `NT.${0}`;
    totalPrice.textContent = `NT.${0}`;
    freight.textContent = `NT.${0}`;
  }

  calculator();
}
updateCounts();

items.addEventListener('click', (event) => {
  const parent = event.target.parentElement;
  const itemDelete = parent.parentElement; // 要刪除的品項
  if (parent.matches('.item__remove')) {
    const deleteCheck = window.confirm('真的不再考慮一下嗎？');
    if (deleteCheck) {
      const itemList = document.querySelectorAll('.item');
      // 將itemList(NodeList)轉為Array=>要刪除的清單
      const inCartItem = [...itemList];
      // 在清單中尋找名為“itemDelete”的位置
      const index = inCartItem.indexOf(itemDelete);
      itemDelete.remove();
      // 清除localstorage該筆資料
      cartItems.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }
  updateCounts();
});

const itemChangeQty = () => {
  items.addEventListener('change', (e) => {
    const { target } = e;
    const option = target.value;
    const { parentElement } = target;
    const changeQtyItem = parentElement.parentElement; // 要換數量的那個品項
    // 定義目前的車清單
    const itemList = document.querySelectorAll('.item');
    const inCartItem = [...itemList];
    // 這個品項在這筆訂單的位置
    const index = inCartItem.indexOf(changeQtyItem);
    cartItems[index].qty = Number(option);
    const itemSubtotalPrice = document.querySelectorAll(
      '.item__subtotal__price'
    );
    const sum = cartItems[index].qty * cartItems[index].price;
    itemSubtotalPrice[index].textContent = `NT.${sum}`;
    let sumTotal = 0;
    for (let i = 0; i < cartItems.length; i += 1) {
      sumTotal += cartItems[i].qty * cartItems[i].price;
    }
    subtotalPrice.textContent = `NT.${sumTotal}`;
    totalPrice.textContent = `NT.${sumTotal + 60}`;
    // 重要！要再存一次localstorage,不然重新整理後就會恢復成原本的
    const newCartItems = cartItems;
    localStorage.setItem('cart', JSON.stringify(newCartItems));
  });
};
itemChangeQty();

window.addEventListener('setItemEvent', updateCounts);

//= =====Tappay setupSDK設定參數========
TPDirect.setupSDK(
  12348,
  'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF',
  'sandbox'
);
//= =====TaDirect.card.setup設定外觀====
TPDirect.card.setup({
  // Display ccv field
  fields: {
    number: {
      // css selector
      element: '#card-number',
      placeholder: '**** **** **** ****',
    },
    expirationDate: {
      // DOM object
      element: document.getElementById('card-expiration-date'),
      placeholder: 'MM / YY',
    },
    ccv: {
      element: '#card-ccv',
      placeholder: 'ccv',
    },
  },

  styles: {
    input: {
      color: 'gray',
    },
    ':focus': {
      color: 'black',
    },
    '.valid': {
      color: 'green',
    },
    '.invalid': {
      color: 'red',
    },
    // Media queries
    // Note that these apply to the iframe, not the root window.
    '@media screen and (max-width: 400px)': {
      input: {
        color: 'orange',
      },
    },
  },
});

function IsEmail(email) {
  const regex = /^([a-zA-Z0-9_.\-+])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!regex.test(email)) {
    return false;
  }
  return true;
}

function IsPhone(phone) {
  const regex = /^09[0-9]{8}$/;
  if (!regex.test(phone)) {
    return false;
  }
  return true;
}

const inputName = document.getElementById('name');
const inputEmail = document.getElementById('email');
const inputPhone = document.getElementById('phone');
const inputAdd = document.getElementById('address');
const checkOutBtn = document.getElementById('checkout');
const time = document.querySelector('input[name="time"]:checked').value;

// 因為body不需要照片＆庫存->存成一個新的list
const checkOutList = JSON.parse(localStorage.getItem('cart'));

const newList = checkOutList.map((item) => {
  const newItem = {};
  newItem.id = item.id;
  newItem.title = item.title;
  newItem.color = item.color;
  newItem.price = item.price;
  newItem.qty = item.qty;
  newItem.size = item.size;
  return newItem;
});

const loading = document.getElementById('loading');
const showLoadingAnimation = () => {
  loading.style.display = 'block';
};
const hideLoadingAnimation = () => {
  loading.style.display = 'none';
};
const postCheckOutApi = function (body, bearerToken) {
  fetch('https://api.appworks-school.tw/api/1.0/order/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((response) => {
      cartItems.splice(0, cartItems.length);
      localStorage.setItem('cart', JSON.stringify(cartItems));
      hideLoadingAnimation();
      window.location.href = `./thankyou.html?number=${response.data.number}`;
    })

    .catch((err) => err);
};

checkOutBtn.addEventListener('click', (event) => {
  if (cartItems.length === 0) {
    alert('購物車空空的喔');
  } else {
    FB.getLoginStatus((res) => {
      if (res.status === 'connected') {
        if (!inputName.value) {
          alert('忘記輸入姓名囉！');
        } else if (!IsEmail(inputEmail.value)) {
          alert('E-mail好像有錯喔！');
        } else if (!IsPhone(inputPhone.value)) {
          alert('電話好像有錯喔！');
        } else if (inputAdd.value === '') {
          alert('忘記輸入地址囉！');
        } else {
          event.preventDefault();
          // 取得 TapPay Fields 的 status
          const tappayStatus = TPDirect.card.getTappayFieldsStatus();
          // 確認是否可以 getPrime
          if (tappayStatus.canGetPrime === false) {
            // 無法get prime的狀態：號碼有誤，期限有誤，安全碼有誤
            // status:錯誤代碼，0 為成功
            if (tappayStatus.status.number !== 0) {
              alert('信用卡號碼好像錯囉！');
            } else if (tappayStatus.status.expiry !== 0) {
              alert('有效期限好像錯囉！');
            } else if (tappayStatus.status.ccv !== 0) {
              alert('安全碼好像錯囉！');
            }
            alert('can not get prime');
            return;
          }

          TPDirect.card.getPrime((result) => {
            if (result.status !== 0) {
              alert(`get prime error ${result.msg}`);
              return;
            }
            const body = {
              prime: result.card.prime,
              order: {
                shipping: 'delivery',
                payment: 'credit_card',
                subtotal: subtotalPrice.textContent,
                freight: freight.textContent,
                total: totalPrice.textContent,
                recipient: {
                  name: inputName.value,
                  phone: inputPhone.value,
                  email: inputEmail.value,
                  address: inputAdd.value,
                  time: `${time}`,
                },
                list: newList,
              },
            };
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
                  const bearerAccessToken = response.data.access_token;
                  // server傳來的鑰匙
                  postCheckOutApi(body, bearerAccessToken);
                  showLoadingAnimation();
                })
                .catch((err) => {
                  console.log(err);
                });
            };
            // 我們將資料利用api與fb溝通，fb回傳accessToken
            const { accessToken } = res.authResponse;
            postSignInApi('facebook', accessToken);
          });
        }
      } else {
        alert('您尚未登入會員喔！');
      }
    });
  }
});
