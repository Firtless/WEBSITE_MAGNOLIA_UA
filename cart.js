let iconCart = document.querySelector('.icon-cart');
let closeBtn = document.querySelector('.cartTab .close');
let body = document.querySelector('body');
let addToCartBtns = document.querySelectorAll('.add');
let listCart = document.querySelector('.listCart');
let cartCount = document.querySelector('.icon-cart span');
let checkoutBtn = document.querySelector('.checkOut');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Toggle cart visibility
iconCart.addEventListener('click', () => {
    body.classList.toggle('activeTabCart');
});
closeBtn.addEventListener('click', () => {
    body.classList.toggle('activeTabCart');
});

// Update cart UI
function updateCartUI() {
    listCart.innerHTML = '';
    let totalItems = 0;
    cart.forEach((item, index) => {
        totalItems += item.quantity;
        listCart.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}" style="width:50px;">
                <h4>${item.name}</h4>
                <p>${item.price}</p>
                <div>
                    <button class="decrease" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase" data-index="${index}">+</button>
                </div>
                <button class="remove" data-index="${index}">Очистити</button>
            </div>
        `;
    });
    cartCount.textContent = totalItems;
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add to Cart
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        let product = e.target.closest('.buy_box');
        let id = product.parentElement.id;
        let name = product.querySelector('h3').textContent;
        let price = product.querySelector('.price').textContent;
        let img = product.querySelector('img').src;

        let existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            if (existingItem.quantity < 300) {
                existingItem.quantity++;
            } else {
                alert('Cart limit reached (300 items).');
            }
        } else {
            cart.push({ id, name, price, img, quantity: 1 });
        }
        updateCartUI();
    });
});

// Cart Actions (Increase, Decrease, Remove)
listCart.addEventListener('click', (e) => {
    let index = e.target.dataset.index;

    if (e.target.classList.contains('increase')) {
        if (cart[index].quantity < 300) {
            cart[index].quantity++;
        } else {
            alert('Cart limit reached (300 items).');
        }
    }

    if (e.target.classList.contains('decrease')) {
        cart[index].quantity--;
        if (cart[index].quantity === 0) {
            cart.splice(index, 1);
        }
    }

    if (e.target.classList.contains('remove')) {
        cart.splice(index, 1);
    }

    updateCartUI();
});

// Handle Checkout
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty! Please add items before proceeding.');
        return;
    }
    
    // Save the cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Redirect to order.html
    window.location.href = 'order.html';
});


//OVERLAY
//OVERLAY

// Ensure global variables are declared
const productOverlay = document.getElementById('productOverlay');
const overlayImage = document.getElementById('overlayImage');
const overlayName = document.getElementById('overlayName');
const overlayPrice = document.getElementById('overlayPrice');
const overlayDescription = document.getElementById('overlayDescription');
const overlayDetails = document.getElementById('overlayDetails');
let currentImageIndex = 0;

// Open overlay function
function openOverlay(element) {
  const images = element.dataset.images.split(',');
  const name = element.querySelector('h3').textContent;
  const price = element.querySelector('.price').textContent;
  const description = element.dataset.description;

  // Fetching the detailed attributes
  const висота = element.dataset.висота || 'N/A';
  const освітлення = element.dataset.освітлення || 'N/A';
  const діаметр = element.dataset.діаметр || 'N/A';
  const ґрунт = element.dataset.ґрунт || 'N/A';
  const цвітіння = element.dataset.цвітіння || 'N/A';
  const морозостійкість = element.dataset.морозостійкість || 'N/A';

  // Building the details HTML dynamically
  const details = `
    <strong>Характеристика (${name})</strong><br>
    Висота доросл.: ${висота}<br>
    Відношення до освітлення: ${освітлення}<br>
    Макс.діаметр: ${діаметр}<br>
    Відношення до ґрунту: ${ґрунт}<br>
    Період цвітіння: ${цвітіння}<br>
    Зона морозостійкості: ${морозостійкість} <br>
  `;

  // Populating overlay content
  overlayImage.src = images[0];
  overlayImage.dataset.images = images;
  overlayName.textContent = name;
  overlayPrice.textContent = price;
  overlayDescription.textContent = description;
  overlayDetails.innerHTML = details;

  currentImageIndex = 0;
  productOverlay.style.display = 'block'; // Ensure overlay is displayed

  // Display overlay and prevent body scrolling
  productOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Disable background scrolling
}

// Close overlay function
function closeOverlay() {
  productOverlay.style.display = 'none';
  document.body.style.overflow = ''; // Restore background scrolling
}

// Exit overlay when clicking outside the content
productOverlay.addEventListener('click', function (event) {
  if (event.target === productOverlay) {
    closeOverlay();
  }
});

// Image navigation functions
function prevImage() {
  const images = overlayImage.dataset.images.split(',');
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  overlayImage.src = images[currentImageIndex];
}

function nextImage() {
  const images = overlayImage.dataset.images.split(',');
  currentImageIndex = (currentImageIndex + 1) % images.length;
  overlayImage.src = images[currentImageIndex];
}

// Attach click event to products
document.querySelectorAll('.buy_box').forEach((box) => {
  box.addEventListener('click', (e) => {
    if (!e.target.classList.contains('add')) {
      openOverlay(box.closest('div[id]')); // Pass the parent with datasets
    }
  });
});



// Initialize Cart UI on Load
updateCartUI();

// Optimazation: Local Storage
localStorage.setItem('cart', JSON.stringify(
    cartItems.map(item => ({ id: item.id, quantity: item.quantity }))
));
