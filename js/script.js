const productsContainer = document.querySelector(".products");

fetch("https://fakestoreapi.com/products")
  .then((response) => response.json())
  .then((data) => {
    http: data.forEach((product) => {
      const productHTML = `
        <div class="product">
          <img src="${product.image}" alt="${product.title}">
          <h3>${product.title}</h3>
          <p>$${product.price}</p>
          <button onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      `;
      productsContainer.innerHTML += productHTML;
    });
  })
  .catch((error) => console.error("Error fetching products:", error));

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const product = {
    id: productId,
    quantity: 1,
  };

  const existingProduct = cart.find((item) => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.getElementById("cart-count").textContent = cartCount;
}

// Update the cart count on page load
updateCartCount();

const cartItemsContainer = document.querySelector(".cart-items");

function displayCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartItemsContainer.innerHTML = "";

  cart.forEach((item) => {
    fetch(`https://fakestoreapi.com/products/${item.id}`)
      .then((response) => response.json())
      .then((product) => {
        const cartItemHTML = `
          <div class="cart-item">
            <img src="${product.image}" alt="${product.title}">
            <h4>${product.title}</h4>
            <p>$${product.price} x ${item.quantity}</p>
            <button onclick="removeFromCart(${product.id})">Remove</button>
          </div>
        `;
        cartItemsContainer.innerHTML += cartItemHTML;
      })
      .catch((error) => console.error("Error fetching product:", error));
  });

  updateCartTotal();
}

function updateCartTotal() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((acc, item) => {
    return acc + item.quantity * item.price;
  }, 0);
  document.getElementById("total").textContent = total.toFixed(2);
}

// Display cart items on page load
displayCartItems();

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart = cart.filter((item) => item.id !== productId);

  localStorage.setItem("cart", JSON.stringify(cart));
  displayCartItems();
  updateCartCount();
}

document
  .getElementById("checkout-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Capture billing, shipping, and payment information
    const billingInfo = {
      name: document.querySelector('.billing-info input[name="name"]').value,
      address: document.querySelector('.billing-info input[name="address"]')
        .value,
      email: document.querySelector('.billing-info input[name="email"]').value,
      phone: document.querySelector('.billing-info input[name="phone"]').value,
    };

    const shippingInfo = document.getElementById("same-as-billing").checked
      ? billingInfo
      : {
          name: document.querySelector('.shipping-info input[name="name"]')
            .value,
          address: document.querySelector(
            '.shipping-info input[name="address"]'
          ).value,
          email: document.querySelector('.shipping-info input[name="email"]')
            .value,
          phone: document.querySelector('.shipping-info input[name="phone"]')
            .value,
        };

    const paymentInfo = {
      cardNumber: document.querySelector(
        '.payment-info input[name="cardNumber"]'
      ).value,
      expiration: document.querySelector(
        '.payment-info input[name="expiration"]'
      ).value,
      cvv: document.querySelector('.payment-info input[name="cvv"]').value,
    };

    // Simulate order placement
    alert("Order placed successfully!");
    localStorage.removeItem("cart");
    window.location.href = "index.html"; // Redirect to home page after order
  });
