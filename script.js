const totalPriceCart = () => document.querySelector('.total-price');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function literal() {
  return document.querySelector('.cart__items');
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const sessaoItems = document.querySelector('.items');
  sessaoItems.appendChild(section);
  return section;
}

// LOADING
function loader() {
  return document.querySelector('div');
}

function hideLoading() {
  const pai = document.querySelector('.container');
  pai.removeChild(loader());
}

// FIM LOADING

const createListProcuct = async (produtos) => {
  const apiUrl = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${produtos}`);
  const object = await apiUrl.json();
  for (let i = 0; i < object.results.length; i += 1) {
    createProductItemElement(object.results[i]);
  }
  hideLoading();
};

const saveLocalStorage = () => {
  const arrProducts = [];
  const itemsCart = document.querySelectorAll('.cart__item');
  if (itemsCart.length > 0 && itemsCart !== null) {
    itemsCart.forEach((valor) => arrProducts.push(valor.innerHTML));
    localStorage.setItem('listProducts', JSON.stringify(arrProducts));
  }
};

function saveItemValue() {
  const cartItem = document.querySelectorAll('.cart__items li');
  let total = 0;
  cartItem.forEach((valor) => { total += parseFloat(valor.innerHTML.split('$')[1]); });
  totalPriceCart().innerHTML = `${total}`;
  localStorage.setItem('price', total);
}

const loadCartProcuts = () => {
  const itemsCart = JSON.parse(localStorage.getItem('listProducts'));
  const priceCart = localStorage.getItem('price');
  if (itemsCart !== null && itemsCart.length > 0) {
    itemsCart.forEach((valor) => {
      const criarLi = createCustomElement('li', 'cart__item', valor);
      literal().appendChild(criarLi);
    });
  }
  document.querySelector('.total-price').innerHTML = priceCart;
};

function cartItemClickListener(event) {
  literal().removeChild(event.target);
  saveLocalStorage();
  saveItemValue();
}

function createCartItemElement(produtos) {
  fetch(`https://api.mercadolibre.com/items/${produtos}`)
  .then((response) => response.json())
  .then((produto) => {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${produto.id} | NAME: ${produto.title} | PRICE: $${produto.price}`;
    const cartOl = document.querySelector('.cart__items');
    cartOl.appendChild(li);
    saveLocalStorage();
    li.addEventListener('click', cartItemClickListener);
    saveItemValue();
    return li;
  });
}

const adicionarCarrinho = () => {
  const botoes = document.querySelectorAll('.item__add');
  for (let i = 0; i < botoes.length; i += 1) {
    botoes[i].addEventListener('click', (event) => {
      const itemAdd = event.target.parentNode.firstChild.innerText;
      createCartItemElement(itemAdd);
    });
  }
};

window.onload = async () => {
  await createListProcuct('computador');
  await loadCartProcuts();
  await adicionarCarrinho();
};

// Esvaziar Carrinho 
window.addEventListener('load', function () {
  const ButtonEmptyCart = document.querySelector('.empty-cart');
  ButtonEmptyCart.addEventListener('click', () => {
  literal().innerHTML = '';
  totalPriceCart().innerHTML = '0';
});
});