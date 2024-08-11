document.getElementById("checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();
  alert("Order placed successfully!");
  window.location.href = "index.html";
});
