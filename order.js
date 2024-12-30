// Fetch cart data from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let orderItemsContainer = document.getElementById('order-items');
let totalPriceElement = document.getElementById('total-price');
const confirmButton = document.querySelector('#payment-form button[type="submit"]'); // Target the submit button

// Display cart items in order summary with images
function displayOrderItems() {
    orderItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const price = parseFloat(item.price) || 0; // Ensure valid price
        const itemTotal = price * item.quantity; // Calculate item total
        total += itemTotal;

        orderItemsContainer.innerHTML += `
            <div class="order-item">
                <img src="${item.img}" alt="${item.name}" class="order-item-img">
                <span>${item.name} x ${item.quantity}</span>
                <span>₴${itemTotal.toFixed(2)}</span>
            </div>`;
    });

    totalPriceElement.innerHTML = `<strong>Загальна сума:</strong> ₴${total.toFixed(2)}`;
}

// Form Validation
function validateForm() {
    const phoneOrEmail = document.getElementById('phone').value;
    const phoneRegex = /^[0-9\s\-\(\)]+$/;  // Allow numbers, spaces, dashes, and parentheses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Basic email format

    if (!phoneRegex.test(phoneOrEmail) && !emailRegex.test(phoneOrEmail)) {
        alert('Будь ласка, введіть дійсний телефон або email.');
        return false;
    }

    return true;
}

// Handle form submission
document.getElementById('payment-form').addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return; // Stop processing if validation fails
    }

    // Disable the button and prevent further clicks
    confirmButton.disabled = true;
    confirmButton.textContent = 'Обробка замовлення...';

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.getElementById('payment-method').value;

    let orderDetails = `Ім'я: ${name}\nТелефон: ${phone}\nАдреса: ${address}\nМетод оплати: ${paymentMethod}\n\nЗамовлення:\n`;
    cart.forEach(item => {
        orderDetails += `${item.name} x ${item.quantity} - ₴${(parseFloat(item.price) * item.quantity).toFixed(2)}\n`;
    });
    orderDetails += `\nЗагальна сума: ₴${parseFloat(totalPriceElement.textContent.split('₴')[1]).toFixed(2)}`;

    const params = {
        name: name,
        phone: phone,
        address: address,
        paymentMethod: paymentMethod,
        order: orderDetails
    };

    // Send with EmailJS
    emailjs.send("service_44vuzbl", "template_rq8vlb9", params)
    .then(() => {
        document.getElementById('confirmation-message').style.display = 'block';
        localStorage.removeItem('cart'); // Clear the cart after successful email
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 7000); 
    }).catch(err => {
        console.error('Помилка з EmailJS:', err);
        alert('Сталася помилка при відправці замовлення. Спробуйте ще раз.');
        confirmButton.disabled = false; // Re-enable button if there's an error
        confirmButton.textContent = 'Підтвердити замовлення';
    });
});

// Initialize on load
displayOrderItems();
