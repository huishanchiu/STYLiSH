import { getAjax, seachOnOtherPage, fbLogin, handleCartCount } from './base.js';

seachOnOtherPage();
fbLogin();
const URL = 'https://api.appworks-school.tw/api/1.0/products/';

const renderImage = (img, product) => {
  const mainImg = document.createElement('img');
  mainImg.className = 'product__main-image';
  mainImg.src = img;
  product.insertBefore(mainImg, product.children[0]);
};
const renderTitle = (title, detail) => {
  const productTitle = document.createElement('div');
  productTitle.className = 'product__title';
  productTitle.textContent = title;
  detail.insertBefore(productTitle, detail.children[0]);
};
const renderId = (id, detail) => {
  const productId = document.createElement('div');
  productId.className = 'product__id';
  productId.textContent = id;
  detail.insertBefore(productId, detail.children[1]);
};
const renderPrice = (price, detail) => {
  const productPrice = document.createElement('div');
  productPrice.className = 'product__price';
  productPrice.textContent = `TWD:${price}`;
  detail.insertBefore(productPrice, detail.children[2]);
};
const renderColor = (colors, variant) => {
  const productColors = document.createElement('div');
  productColors.id = 'colors';
  productColors.className = 'product__colors';
  colors.forEach((color) => {
    const productColor = document.createElement('div');
    productColor.className = 'product__color';
    productColor.style.backgroundColor = `#${color.code}`;
    productColors.appendChild(productColor);
    variant[0].appendChild(productColors);
  });
};
const renderSizes = (sizes, variant) => {
  const productSizes = document.createElement('div');
  productSizes.className = 'product__sizes';
  productSizes.id = 'sizes';
  sizes.forEach((size) => {
    const productSize = document.createElement('div');
    productSize.className = 'product__size';
    productSize.textContent = size;
    productSizes.appendChild(productSize);
  });

  variant[1].appendChild(productSizes);
};
const renderNote = (note, detail) => {
  const productNote = document.createElement('div');
  productNote.className = 'product__note';
  productNote.textContent = note;
  detail.appendChild(productNote);
};
const renderTexture = (texture, detail) => {
  const productTexture = document.createElement('div');
  productTexture.className = 'product__texture';
  productTexture.textContent = texture;
  detail.appendChild(productTexture);
};
const renderDescription = (description, detail) => {
  const productDescription = document.createElement('div');
  productDescription.className = 'product__description';
  productDescription.textContent = description;
  detail.appendChild(productDescription);
};
const renderWash = (wash, detail) => {
  const productWash = document.createElement('div');
  productWash.className = 'product__wash';
  productWash.textContent = `清洗：${wash}`;
  detail.appendChild(productWash);
};
const renderPlace = (place, detail) => {
  const productPlace = document.createElement('div');
  productPlace.className = 'product__place';
  productPlace.textContent = `產地：${place}`;
  detail.appendChild(productPlace);
};
const renderStory = (story, product) => {
  const productStory = document.createElement('div');
  productStory.className = 'product__story';
  productStory.textContent = story;
  product.appendChild(productStory);
};
const renderMoreImages = (images, product) => {
  for (let k = 0; k < images.length; k += 1) {
    const productImg = document.createElement('img');
    productImg.className = 'product__image';
    productImg.src = images[k];
    product.appendChild(productImg);
  }
};
const renderAllDetails = (data) => {
  const productData = JSON.parse(data);
  const productInfo = productData.data;
  const product = document.getElementById('product');
  const productDetail = document.querySelector('.product__detail');
  const productVariant = document.querySelectorAll('.product__variant');
  renderImage(productInfo.main_image, product);
  renderTitle(productInfo.title, productDetail);
  renderId(productInfo.id, productDetail);
  renderPrice(productInfo.price, productDetail);
  renderColor(productInfo.colors, productVariant);
  renderSizes(productInfo.sizes, productVariant);
  renderNote(productInfo.note, productDetail);
  renderTexture(productInfo.texture, productDetail);
  renderDescription(productInfo.description, productDetail);
  renderWash(productInfo.wash, productDetail);
  renderPlace(productInfo.place, productDetail);
  renderStory(productInfo.story, product);
  renderMoreImages(productInfo.images, product);

  const colorsObj = document.querySelectorAll('.product__color');
  const sizesObj = document.querySelectorAll('.product__size');
  const numBox = document.getElementById('quantity');
  const { variants } = productInfo;
  // NodeList=>array
  const sizes = [...sizesObj];
  const colors = [...colorsObj];
  const productQuantity = document.querySelector('.product__quantity');
  let num = Number(numBox.textContent);

  function toHex(int) {
    const hex = int.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }

  function RGBToHex(color) {
    const arr = [];
    color.replace(/[\d+.]+/g, (v) => {
      arr.push(parseFloat(v));
    });
    return `${arr.slice(0, 3).map(toHex).join('').toUpperCase()}`;
  }

  const productDefault = () => {
    colors[0].classList.add('product__color--selected');
    sizes[0].classList.add('product__size--selected');
    for (let i = 0; i < colors.length; i += 1) {
      if (colors[i].classList.contains('product__color--selected')) {
        variants.forEach((variant) => {
          // 當點到的顏色的庫存為零，加上disable
          if (
            RGBToHex(colors[i].style.backgroundColor) === variant.color_code &&
            variant.stock === 0
          ) {
            // 無庫存，加disabled&移除size-selected
            sizes.forEach((size) => {
              if (variant.size === size.textContent) {
                size.classList.add('product__size--disabled');
                sizes.forEach((sizeNew) => {
                  sizeNew.classList.remove('product__size--selected');
                });
                // 選出沒有disabled的
                const canSelect = sizes.filter(
                  (sizeNew) =>
                    !sizeNew.classList.contains('product__size--disabled')
                );
                canSelect[0].classList.add('product__size--selected');
              }
            });
          } else if (
            RGBToHex(colors[i].style.backgroundColor) === variant.color_code &&
            variant.stock !== 0
          ) {
            sizes.forEach((size) => {
              if (variant.size === size.textContent) {
                size.classList.remove('product__size--disabled');
              }
            });
          }
        });
      }
    }
  };
  productDefault();

  const handleColor = function () {
    colors.forEach((color) => {
      color.addEventListener('click', () => {
        if (color.classList.contains('product__color--selected')) {
          numBox.textContent = num;
        } else {
          colors.forEach((colorNew) => {
            colorNew.classList.remove('product__color--selected');
          });
          color.classList.add('product__color--selected');
          num = 1;
          numBox.textContent = num;
        }
        color.classList.add('product__color--selected');
        if (color.classList.contains('product__color--selected')) {
          variants.forEach((variant) => {
            if (
              RGBToHex(color.style.backgroundColor) === variant.color_code &&
              variant.stock === 0
            ) {
              // 顏色與庫存比對完之後，比對size，若這個stock=0的品項size剛好與頁面上選到的品項一致=>disable
              // 處理有尺寸無庫存狀態
              sizes.forEach((size) => {
                if (variant.size === size.textContent) {
                  size.classList.add('product__size--disabled');
                  // 選出沒有disabled的
                  const canSelect = sizes.filter(
                    (sizeNew) =>
                      !sizeNew.classList.contains('product__size--disabled')
                  );
                  if (size.classList.contains('product__size--selected')) {
                    // 如果有被選到先移除，再幫第一個加，否則會有兩個尺寸被選到的問題
                    size.classList.remove('product__size--selected');
                    canSelect[0].classList.add('product__size--selected');
                  }
                }
              });
            } else if (
              RGBToHex(color.style.backgroundColor) === variant.color_code &&
              variant.stock !== 0
            ) {
              sizes.forEach((size) => {
                if (variant.size === size.textContent) {
                  size.classList.remove('product__size--disabled');
                }
              });
            }
          });
        }
      });
    });
  };
  handleColor();

  const handleSize = function () {
    sizes.forEach((size) => {
      size.addEventListener('click', () => {
        if (!size.classList.contains('product__size--disabled')) {
          if (size.classList.contains('product__size--selected')) {
            numBox.textContent = num;
          } else {
            sizes.forEach((sizeNew) => {
              sizeNew.classList.remove('product__size--selected');
            });
            size.classList.add('product__size--selected');
            num = 1;
            numBox.textContent = num;
          }
        }
      });
    });
  };
  handleSize();

  const colorSelected = document.getElementsByClassName(
    'product__color--selected'
  );
  const sizeSelected = document.getElementsByClassName(
    'product__size--selected'
  );

  const handlePlusAndMinusBtn = () => {
    productQuantity.addEventListener('click', (event) => {
      if (event.target.matches('.increment')) {
        variants.forEach((variant) => {
          if (
            RGBToHex(colorSelected[0].style.backgroundColor) ===
              variant.color_code &&
            sizeSelected[0].textContent === variant.size
          ) {
            if (num < variant.stock) {
              num += 1;
            }
          }
        });
      } else if (event.target.matches('.decrement')) {
        num -= 1;
        if (num < 1) {
          num = 1;
        }
      }
      numBox.textContent = num;
    });
  };
  handlePlusAndMinusBtn();

  //= =================設定購物車==========
  if (localStorage.getItem('cart') == null) {
    localStorage.setItem('cart', JSON.stringify([]));
  }

  const cartId = productInfo.id;
  const cartImage = productInfo.main_image;
  const cartTitle = productInfo.title;
  const cartPrice = productInfo.price;
  const cartColors = productInfo.colors;
  const addToCartBtn = document.getElementById('add-to-cart');
  const counts = document.querySelectorAll('.count');
  const cartItems = JSON.parse(localStorage.getItem('cart'));

  const addItems = () => {
    if (!addToCartBtn.classList.contains('disable')) {
      const cartColor = RGBToHex(colorSelected[0].style.backgroundColor);
      // 轉換成colorcode=>被選擇的顏色
      // 如果被選擇的那個顏色code＝colors裡面的任何一個code，回傳他的
      const colorSelectedName = cartColors.filter((color) => {
        if (cartColor === color.code) {
          return color.name;
        }
        return false;
      });
      const cartColorName = colorSelectedName[0].name;
      // 要比對選到的顏色和選到的尺寸->得到庫存
      const stockSelect = variants.filter((variant) => {
        if (
          RGBToHex(colorSelected[0].style.backgroundColor) ===
            variant.color_code &&
          sizeSelected[0].textContent === variant.size
        ) {
          return variant.stock;
        }
        return false;
      });
      const color = {};
      color.code = RGBToHex(colorSelected[0].style.backgroundColor);
      color.name = cartColorName;
      const itemStock = stockSelect[0].stock;
      const addedProduct = {
        color,
        id: cartId,
        image: cartImage,
        title: cartTitle,
        price: cartPrice,
        size: sizeSelected[0].textContent,
        qty: num,
        stock: itemStock,
      };
      // 產品id、顏色、尺寸相等，不加為新的購物車品項=>只更新數量
      const oneItem = cartItems.filter(
        (item) =>
          item.id === addedProduct.id &&
          item.color.code === addedProduct.color.code &&
          item.size === addedProduct.size
      );
      // 如果不是一樣的品項，將被選擇的產品推至車裡
      if (oneItem.length === 0) {
        cartItems.push(addedProduct);
        window.alert('成功加入購物車！');
        if (num > 0) {
          num = +1;
          numBox.textContent = num;
        }
      }
      if (oneItem.length !== 0) {
        window.alert('已更新該商品數量');
        cartItems.forEach((event) => {
          const target = event;
          if (
            target.id === addedProduct.id &&
            target.color.code === addedProduct.color.code &&
            target.size === addedProduct.size
          ) {
            target.qty = Number(addedProduct.qty);
          }
        });
        if (num > 0) {
          num = +1;
          numBox.textContent = num;
        }
      }
      localStorage.setItem('cart', JSON.stringify(cartItems));
      for (let i = 0; i < counts.length; i += 1) {
        counts[i].innerHTML = cartItems.length;
      }
    }
  };

  const addItemsToCart = () => {
    addToCartBtn.addEventListener('click', () => {
      addItems();
    });
  };
  addItemsToCart();
};

if (window.location.search.split('=')[0] === '?id') {
  getAjax(`${URL}details${window.location.search}`, (response) =>
    renderAllDetails(response)
  );
}
handleCartCount();
