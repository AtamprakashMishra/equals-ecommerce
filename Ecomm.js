// ===================================
// EQUAL'S E-COMMERCE WEBSITE
// ===================================

// Select Elements
const cards = document.querySelectorAll(".card");

const search = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const sortFilter = document.getElementById("sortFilter");

const cartPanel = document.getElementById("cartPanel");
const wishlistPanel = document.getElementById("wishlistPanel");

const cartItems = document.getElementById("cartItems");
const wishlistItems = document.getElementById("wishlistItems");

const cartNum = document.getElementById("cartNum");
const wishlistNum = document.getElementById("wishlistNum");
const cartTotal = document.getElementById("cartTotal");

const overlay = document.getElementById("overlay");

const quickModal = document.getElementById("quickModal");
const checkoutModal = document.getElementById("checkoutModal");


// ===================================
// LOCAL STORAGE
// ===================================

let cart = JSON.parse(localStorage.getItem("equalsCart")) || [];

let wishlist = JSON.parse(localStorage.getItem("equalsWishlist")) || [];

function saveData() {
    localStorage.setItem("equalsCart", JSON.stringify(cart));
    localStorage.setItem("equalsWishlist", JSON.stringify(wishlist));
}


// ===================================
// MODAL AND PANEL FUNCTIONS
// ===================================

function closeAll() {
    document.querySelectorAll(".side-panel, .modal")
        .forEach(element => element.classList.remove("active"));

    overlay.classList.remove("active");
}

function openPanel(panel) {
    closeAll();
    panel.classList.add("active");
    overlay.classList.add("active");
}

document.getElementById("cartToggle").addEventListener("click", () => {
    openPanel(cartPanel);
});

document.getElementById("wishlistToggle").addEventListener("click", () => {
    openPanel(wishlistPanel);
});

document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", closeAll);
});

overlay.addEventListener("click", closeAll);

document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeAll();
});


// ===================================
// GET PRODUCT INFORMATION
// ===================================

function getProduct(card) {
    return {
        name: card.dataset.name,
        price: Number(card.dataset.price),
        category: card.dataset.category,
        image: card.querySelector("img").getAttribute("src")
    };
}


// ===================================
// FEATURE 1: SEARCH AND FILTER
// ===================================

const shops = document.querySelector(".shops");

function filterProducts() {

    const searchValue = search.value.toLowerCase().trim();

    const categoryValue = categoryFilter.value;

    const priceValue = priceFilter.value;

    const sortValue = sortFilter.value;

    let productCards = Array.from(cards);

    productCards.sort((a, b) => {

        const priceA = Number(a.dataset.price);
        const priceB = Number(b.dataset.price);

        if (sortValue === "low-high") {
            return priceA - priceB;
        }

        if (sortValue === "high-low") {
            return priceB - priceA;
        }

        return 0;
    });

    productCards.forEach(card => {

        const name = card.dataset.name.toLowerCase();

        const category = card.dataset.category;

        const price = Number(card.dataset.price);

        const matchSearch = name.includes(searchValue);

        const matchCategory =
            categoryValue === "all" ||
            category === categoryValue;

        let matchPrice = true;

        if (priceValue === "low") {
            matchPrice = price < 200;
        }

        if (priceValue === "medium") {
            matchPrice = price >= 200 && price <= 500;
        }

        if (priceValue === "high") {
            matchPrice = price > 500;
        }

        card.style.display =
            matchSearch && matchCategory && matchPrice
                ? ""
                : "none";

        shops.appendChild(card);
    });

    const visibleProducts = productCards.some(card =>
        card.style.display !== "none"
    );

    document.getElementById("noProducts").style.display =
        visibleProducts ? "none" : "block";
}

search.addEventListener("input", filterProducts);

categoryFilter.addEventListener("change", filterProducts);

priceFilter.addEventListener("change", filterProducts);

sortFilter.addEventListener("change", filterProducts);


// ===================================
// ADD TO CART
// ===================================

function addToCart(product) {

    const existingProduct = cart.find(
        item => item.name === product.name
    );

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveData();
    renderCart();

}


// ===================================
// FEATURE 4: CART QUANTITY
// ===================================

function changeQuantity(name, change) {

    const product = cart.find(item => item.name === name);

    if (!product) return;

    product.quantity += change;

    if (product.quantity <= 0) {
        cart = cart.filter(item => item.name !== name);
    }

    saveData();
    renderCart();
}


// Remove Product
function removeFromCart(name) {

    cart = cart.filter(item => item.name !== name);

    saveData();
    renderCart();
}


// ===================================
// CART DISPLAY
// ===================================

function renderCart() {

    cartItems.innerHTML = "";

    let total = 0;
    let totalQuantity = 0;

    cart.forEach(product => {

        total += product.price * product.quantity;

        totalQuantity += product.quantity;

        const div = document.createElement("div");

        div.className = "cart-product";

        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <div class="cart-details">

                <h4></h4>

                <p>$${product.price}</p>

                <div class="quantity">

                    <button class="minus">-</button>

                    <span>${product.quantity}</span>

                    <button class="plus">+</button>

                </div>

            </div>

            <button class="remove-item">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;

        div.querySelector("h4").textContent = product.name;

        div.querySelector(".minus").addEventListener("click", () => {
            changeQuantity(product.name, -1);
        });

        div.querySelector(".plus").addEventListener("click", () => {
            changeQuantity(product.name, 1);
        });

        div.querySelector(".remove-item").addEventListener("click", () => {
            removeFromCart(product.name);
        });

        cartItems.appendChild(div);

    });

    cartNum.textContent = totalQuantity;

    cartTotal.textContent = total.toFixed(2);

    document.getElementById("checkoutTotal").textContent =
        total.toFixed(2);

    document.getElementById("checkoutBtn").disabled =
        cart.length === 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty!</p>";
    }

}


// Add Button Events
cards.forEach(card => {

    const addButton = card.querySelector(".add-btn");

    addButton.addEventListener("click", () => {

        addToCart(getProduct(card));

        addButton.textContent = "Added!";

        setTimeout(() => {
            addButton.textContent = "Add to Cart";
        }, 800);

    });

});


// ===================================
// FEATURE 2: WISHLIST
// ===================================

function toggleWishlist(product) {

    const existing = wishlist.find(
        item => item.name === product.name
    );

    if (existing) {

        wishlist = wishlist.filter(
            item => item.name !== product.name
        );

    } else {

        wishlist.push(product);

    }

    saveData();
    renderWishlist();

    updateWishlistButtons();

}

function updateWishlistButtons() {

    cards.forEach(card => {

        const productName = card.dataset.name;

        const button = card.querySelector(".wish-btn");

        const icon = button.querySelector("i");

        const isSaved = wishlist.some(
            item => item.name === productName
        );

        button.classList.toggle("active", isSaved);

        icon.className = isSaved
            ? "fa-solid fa-heart"
            : "fa-regular fa-heart";

    });

}

function renderWishlist() {

    wishlistItems.innerHTML = "";

    wishlistNum.textContent = wishlist.length;

    if (wishlist.length === 0) {

        wishlistItems.innerHTML =
            "<p>Your wishlist is empty!</p>";

    }

    wishlist.forEach(product => {

        const div = document.createElement("div");

        div.className = "wishlist-product";

        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <div class="cart-details">
                <h4></h4>
                <p>$${product.price}</p>
                <button class="add-btn">Add to Cart</button>
            </div>

            <button class="remove-item">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;

        div.querySelector("h4").textContent = product.name;

        div.querySelector(".add-btn").addEventListener("click", () => {
            addToCart(product);
            openPanel(cartPanel);
        });

        div.querySelector(".remove-item").addEventListener("click", () => {
            wishlist = wishlist.filter(
                item => item.name !== product.name
            );

            saveData();
            renderWishlist();
            updateWishlistButtons();
        });

        wishlistItems.appendChild(div);

    });

}

cards.forEach(card => {

    card.querySelector(".wish-btn").addEventListener("click", () => {

        toggleWishlist(getProduct(card));

    });

});


// ===================================
// FEATURE 3: QUICK VIEW
// ===================================

let selectedProduct = null;

cards.forEach(card => {

    card.querySelector(".quick-btn").addEventListener("click", () => {

        selectedProduct = getProduct(card);

        document.getElementById("quickImage").src =
            selectedProduct.image;

        document.getElementById("quickName").textContent =
            selectedProduct.name;

        document.getElementById("quickPrice").textContent =
            "$" + selectedProduct.price;

        openPanel(quickModal);

    });

});

document.getElementById("quickAdd").addEventListener("click", () => {

    if (selectedProduct) {

        addToCart(selectedProduct);

        closeAll();

    }

});


// ===================================
// FEATURE 5: CHECKOUT
// ===================================

document.getElementById("checkoutBtn").addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;

    }

    document.getElementById("checkoutTotal").textContent =
        cart.reduce((sum, item) =>
            sum + item.price * item.quantity, 0
        ).toFixed(2);

    openPanel(checkoutModal);

});

document.getElementById("checkoutForm").addEventListener("submit", event => {

    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const name = document.getElementById("customerName").value;

    const email = document.getElementById("customerEmail").value;

    const address = document.getElementById("customerAddress").value;

    const payment = document.getElementById("paymentMethod").value;

    if (!name.trim() || !email.trim() || !address.trim() || !payment) {

        alert("Please fill all details!");

        return;

    }

    const orderNumber = "EQ" + Date.now().toString().slice(-8);

    alert(
        "Order placed successfully!\n\n" +
        "Order ID: " + orderNumber +
        "\nCustomer: " + name +
        "\nTotal: $" + cart.reduce((sum, item) =>
            sum + item.price * item.quantity, 0
        ).toFixed(2) +
        "\nPayment: " + payment
    );

    cart = [];

    saveData();

    renderCart();

    document.getElementById("checkoutForm").reset();

    closeAll();

});


// ===================================
// CONTACT FORM
// ===================================

document.getElementById("submit").addEventListener("click", () => {

    const email = document.getElementById("email");

    const password = document.getElementById("password");

    if (email.value.trim() === "" || password.value.trim() === "") {

        alert("Please enter Email and Password!");

    } else if (!email.checkValidity()) {

        alert("Please enter a valid Email!");

    } else {

        alert("Thank you for contacting Equal's!");

        email.value = "";
        password.value = "";

    }

});


// ===================================
// INITIALIZE WEBSITE
// ===================================

renderCart();

renderWishlist();

updateWishlistButtons();

filterProducts();
