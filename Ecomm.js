let card = document.querySelectorAll(".card");
let submit = document.getElementById("submit");

let num = 0;

let cartItems = document.querySelector(".cartItems");
let cartNum = document.getElementById("cartNum");

// Initially hide cart
cartItems.style.display = "none";


// Add To Cart
card.forEach(function (cards) {

    let addButton = cards.querySelector("button");

    addButton.addEventListener("click", function () {

        cartItems.style.display = "block";

        num++;

        cartNum.innerHTML = num;

        let div = document.createElement("div");

        div.classList.add("cartList");

        div.innerHTML = `
            <i class="fa-solid fa-xmark"></i>
            <img src="${cards.querySelector("img").src}" alt="Product">
            <p>$199</p>
        `;

        // Remove item button
        div.querySelector("i").addEventListener("click", function () {
            div.remove();

            num--;

            cartNum.innerHTML = num;

            if (num === 0) {
                cartItems.style.display = "none";
            }
        });

        cartItems.appendChild(div);

    });

});


// Contact Form
submit.addEventListener("click", function () {

    let email = document.getElementById("email");
    let password = document.getElementById("password");

    if (email.value.trim() === "" || password.value.trim() === "") {

        alert("Please enter Email and Password");

    } else {

        alert("Thank you for logging in!");

        email.value = "";
        password.value = "";

    }

});
