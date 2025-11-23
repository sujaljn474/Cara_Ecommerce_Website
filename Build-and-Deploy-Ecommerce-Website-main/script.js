/*******************************************
  NAVIGATION MENU (OPEN/CLOSE FOR MOBILE)
*******************************************/
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

// When the mobile bar icon is clicked → open the menu
if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    });
}

// When close icon is clicked → hide the menu
if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}



/*******************************************
  CART STORAGE SETUP
  (cart is saved inside browser localStorage)
*******************************************/
let cart = JSON.parse(localStorage.getItem("cart")) || [];


// Save cart to localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}



/*******************************************
  ADD TO CART FUNCTION
*******************************************/
function addToCart(product) {

    // Check if product already exists in cart
    const existingItem = cart.find(item => item.name === product.name);

    if (existingItem) {
        // if product already in cart → increase quantity
        existingItem.quantity++;
    } else {
        // otherwise → add new item
        cart.push(product);
    }

    // Save updated cart
    saveCart();

    alert("Item added to cart!");
}



/*******************************************
  "ADD TO CART" BUTTON FUNCTIONALITY ON SHOP.HTML
*******************************************/
const addButtons = document.querySelectorAll(".cart");

// Loop through all cart buttons
addButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();

        // Find the product card where button was clicked
        const productBox = button.closest(".pro");

        // Extract details
        const name = productBox.querySelector("h5").innerText;
        const price = parseFloat(productBox.querySelector("h4").innerText.replace("$", ""));
        const img = productBox.querySelector("img").src;

        // Send product to cart
        addToCart({
            name: name,
            price: price,
            img: img,
            quantity: 1
        });
    });
});



/*******************************************
  LOAD CART ITEMS ON cart.html
*******************************************/
function loadCart() {
    const cartTable = document.querySelector("#cart tbody");

    if (!cartTable) return; // if not on cart.html → exit

    cartTable.innerHTML = ""; // clear previous rows

    // Add each product row to the table
    cart.forEach((item, index) => {

        // Create a table row
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><i class="fa-regular fa-circle-xmark remove" data-index="${index}"></i></td>
            <td><img src="${item.img}" width="50"></td>
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td><input type="number" min="1" value="${item.quantity}" class="qty" data-index="${index}"></td>
            <td class="subtotal">$${(item.price * item.quantity).toFixed(2)}</td>
        `;

        cartTable.appendChild(row);
    });

    updateTotals(); // update total price
}



/*******************************************
  UPDATE CART TOTALS
*******************************************/
function updateTotals(discountPercent = 0) {
    let subTotal = 0;

    // Calculate subtotal
    cart.forEach(item => {
        subTotal += item.price * item.quantity;
    });

    let discountAmount = (subTotal * discountPercent) / 100;
    let shipping = subTotal > 0 ? 10 : 0;
    let total = subTotal - discountAmount + shipping;

    // Update HTML values
    const subtotalCell = document.querySelector("#subtotal table tr:first-child td:last-child");
    const totalCell = document.querySelector("#subtotal table tr:last-child td:last-child");

    if (subtotalCell && totalCell) {
        subtotalCell.textContent = `$${subTotal.toFixed(2)}`;
        totalCell.textContent = `$${total.toFixed(2)}`;
    }
}



/*******************************************
  CHANGE QUANTITY IN CART
*******************************************/
document.addEventListener("input", (event) => {

    // If quantity input is changed
    if (event.target.classList.contains("qty")) {
        const index = event.target.dataset.index;
        const newQty = parseInt(event.target.value);

        cart[index].quantity = newQty;

        saveCart();
        loadCart();
    }
});



/*******************************************
  REMOVE ITEM FROM CART
*******************************************/
document.addEventListener("click", (event) => {

    if (event.target.classList.contains("remove")) {

        const index = event.target.dataset.index;
        cart.splice(index, 1); // delete 1 item

        saveCart();
        loadCart();
    }
});



/*******************************************
  COUPON SYSTEM
*******************************************/
document.addEventListener("click", (event) => {

    if (event.target.innerText === "Apply") {

        const input = document.querySelector("#coupon input");
        const code = input.value.trim().toUpperCase();

        let discount = 0;

        // Only SAVE10 works
        if (code === "SAVE10") {
            discount = 10;
        }

        updateTotals(discount);

        if (discount) {
            alert("Coupon Applied! 10% Off");
        } else {
            alert("Invalid Coupon");
        }
    }
});



/*******************************************
  CHECKOUT BUTTON → GO TO INVOICE PAGE
*******************************************/
document.addEventListener("click", (event) => {

    if (event.target.innerText.includes("Proceed to checkout")) {

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        // Save a copy for Invoice Page
        localStorage.setItem("invoiceCart", JSON.stringify(cart));

        window.location.href = "invoice.html";
    }

    
});




/*******************************************
  AUTO LOAD CART IF WE ARE ON cart.html
*******************************************/
if (window.location.pathname.includes("cart.html")) {
    loadCart();
}
