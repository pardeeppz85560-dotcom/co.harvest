
const categories = ["Fruit", "Greens", "Pantry", "Bakery", "Drinks"];

const catalog = {
  Fruit: [
    "Pink Lady Apples", "Clementines", "Golden Pears",
    "Ruby Grapefruit", "Mangoes", "Blueberries",
    "Strawberries", "Green Grapes", "Avocados", "Lemons",
    "Blood Oranges", "Peaches", "Kiwi Fruit", "Pomegranate",
    "Fresh Figs", "Pineapple", "Raspberries", "Blackberries",
    "Plums", "Bananas"
  ],
  Greens: [
    "Baby Spinach", "Tender Kale", "Rainbow Carrots",
    "Heirloom Tomatoes", "Cucumbers", "Zucchini",
    "Sweet Peppers", "Broccoli", "Snap Peas", "Fresh Basil",
    "Mint Bunch", "Rocket Leaves", "Red Onions",
    "Golden Beets", "Cauliflower", "Spring Onions",
    "Baby Potatoes", "Green Beans", "Radishes", "Mushrooms"
  ],
  Pantry: [
    "Wildflower Honey", "Almond Butter", "Rolled Oats",
    "Organic Chickpeas", "Olive Oil", "Sea Salt Flakes",
    "Raw Cashews", "Dried Apricots", "Brown Lentils",
    "Maple Syrup", "Cacao Nibs", "Pumpkin Seeds",
    "Basmati Rice", "Quinoa", "Coconut Sugar", "Tahini",
    "Pistachios", "Chia Seeds", "Cinnamon Sticks",
    "Dried Cranberries"
  ],
  Bakery: [
    "Country Sourdough", "Seeded Rye Loaf", "Butter Croissant",
    "Olive Focaccia", "Oat Cookies", "Cinnamon Bun",
    "Wholegrain Crackers", "Brioche Loaf", "Sesame Bagels",
    "Lemon Loaf Cake", "Almond Biscotti", "Rustic Baguette",
    "Chocolate Brownie", "Fruit Scone", "Rosemary Flatbread",
    "Vanilla Shortbread", "Walnut Bread", "Pita Bread",
    "Granola Bar", "Apple Turnover"
  ],
  Drinks: [
    "Breakfast Tea", "Chamomile Tea", "Matcha Green Tea",
    "Cold Brew Coffee", "Ginger Lemon Tonic",
    "Sparkling Apple Juice", "Cocoa Blend", "Peppermint Tea",
    "Hibiscus Infusion", "Oat Milk", "Turmeric Latte Mix",
    "Roasted Coffee Beans", "Earl Grey Tea", "Rose Lemonade",
    "Coconut Water", "Vanilla Chai", "Berry Kombucha",
    "Drinking Chocolate", "Lemongrass Tea",
    "Orange Blossom Water"
  ]
};

const imageIds = [
  "photo-1610832958506-aa56368176cf",
  "photo-1547592180-85f173990554",
  "photo-1490645935967-10de6ba17061",
  "photo-1540420773420-3366772f4999",
  "photo-1544787219-7f47ccb76574",
  "photo-1498837167922-ddd27525d352",
  "photo-1512621776951-a57141f2eefd",
  "photo-1540189549336-e6e99c3679fe",
  "photo-1511690743698-d9d85f2fbf38",
  "photo-1509440159596-0249088772ff",
  "photo-1571771894821-ce9b6c11b08e",
  "photo-1568702846914-96b305d2aaeb",
  "photo-1571575173700-afb9492e6a50",
  "photo-1596591606975-97ee5cef3a1e",
  "photo-1560806887-1e4cd0b6cbd6",
  "photo-1563805042-7684c019e1cb"
];

const descriptions = {
  Fruit: "Selected for flavour and freshness, ready to brighten your everyday table.",
  Greens: "Fresh, vibrant produce for simple meals and feel-good cooking.",
  Pantry: "A cupboard favourite selected for flavour and everyday usefulness.",
  Bakery: "A comforting bake for slow mornings and little treats.",
  Drinks: "A thoughtful sip for a quiet moment or a bright morning."
};

// Generate 100 products per category = 500 listings.
const products = [];
let nextId = 1;

categories.forEach((category, categoryIndex) => {
  const names = catalog[category];

  for (let i = 0; i < 100; i++) {
    const baseName = names[i % names.length];
    const variant = Math.floor(i / names.length);

    const name = variant === 0
      ? baseName
      : `${["Select", "Market", "Reserve", "Seasonal", "Classic"][variant % 5]} ${baseName}`;

    const price = [89, 79, 129, 99, 119][categoryIndex]
      + ((i * 37 + categoryIndex * 23) % 11) * 17;

    const imageId = imageIds[
      (i + categoryIndex * 3) % imageIds.length
    ];

    products.push({
      id: nextId++,
      name,
      category,
      price,
      size: ["250 g", "500 g", "1 pack", "1 bunch", "1 jar"][
        (i + categoryIndex) % 5
      ],
      tag: i % 13 === 0 ? "Bestseller" :
           i % 17 === 0 ? "New in" :
           i % 7 === 0 ? "Seasonal" : "",
      image: `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=800&q=80`,
      description: descriptions[category],
      featured: (i * 7 + categoryIndex * 13) % 19
    });
  }
});

function loadSaved(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

const state = {
  category: "All",
  query: "",
  sort: "featured",
  shown: 12,
  cart: loadSaved("harvest_cart", []),
  wishlist: loadSaved("harvest_wishlist", [])
};

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function saveState() {
  localStorage.setItem("harvest_cart", JSON.stringify(state.cart));
  localStorage.setItem("harvest_wishlist", JSON.stringify(state.wishlist));
}

function money(value) {
  return "₹" + value.toLocaleString("en-IN");
}

function getFilteredProducts() {
  let list = products.filter(product => {
    const categoryMatches =
      state.category === "All" ||
      product.category === state.category;

    const queryMatches =
      `${product.name} ${product.category}`
        .toLowerCase()
        .includes(state.query.toLowerCase());

    return categoryMatches && queryMatches;
  });

  if (state.sort === "low") {
    list.sort((a, b) => a.price - b.price);
  } else if (state.sort === "high") {
    list.sort((a, b) => b.price - a.price);
  } else if (state.sort === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    list.sort((a, b) => a.featured - b.featured || a.id - b.id);
  }

  return list;
}

function renderProducts() {
  const list = getFilteredProducts();
  const visible = list.slice(0, state.shown);

  $("#productGrid").innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-image-wrap"
           data-detail="${product.id}"
           tabindex="0"
           role="button"
           aria-label="View ${product.name}">

        <img
          loading="lazy"
          src="${product.image}"
          alt="${product.name}"
          onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'">

        ${product.tag
          ? `<span class="product-tag">${product.tag}</span>`
          : ""}

        <button class="heart-btn ${state.wishlist.includes(product.id) ? "saved" : ""}"
                data-wish="${product.id}"
                aria-label="Save ${product.name}">
          ${state.wishlist.includes(product.id) ? "♥" : "♡"}
        </button>

        <button class="quick-add"
                data-add="${product.id}"
                aria-label="Add ${product.name} to bag">+</button>
      </div>

      <div class="product-info" data-detail="${product.id}">
        <div class="product-meta">
          <span>${product.category.toUpperCase()}</span>
          <span>✳ ${((product.id % 5) + 4.5).toFixed(1)}</span>
        </div>

        <h3>${product.name}</h3>

        <div class="product-bottom">
          <span class="product-price">${money(product.price)}</span>
          <span class="product-size">${product.size}</span>
        </div>
      </div>
    </article>
  `).join("");

  $("#resultCount").textContent = list.length;
  $("#totalCount").textContent = list.length;
  $("#shownCount").textContent = visible.length;

  $("#loadMore").style.display =
    visible.length < list.length ? "inline-block" : "none";

  $("#activeFilters").textContent = state.query
    ? `Search results for "${state.query}" · ${list.length} items`
    : "";

  $$("#filterPills button").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.category === state.category
    );
  });
}

function renderCounts() {
  const count = state.cart.reduce((sum, item) => sum + item.qty, 0);

  $("#cartCount").textContent = count;
  $("#wishlistCount").textContent = state.wishlist.length;
  $("#drawerCartCount").textContent = `(${count})`;
}

let toastTimer;

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function addToCart(id) {
  const product = products.find(p => p.id === Number(id));
  if (!product) return;

  const existing = state.cart.find(item => item.id === product.id);

  if (existing) {
    existing.qty++;
  } else {
    state.cart.push({ id: product.id, qty: 1 });
  }

  saveState();
  renderCounts();
  renderCart();
  showToast(`${product.name} added to your bag`);
}

function toggleWishlist(id) {
  id = Number(id);

  if (state.wishlist.includes(id)) {
    state.wishlist = state.wishlist.filter(item => item !== id);
    showToast("Removed from favourites");
  } else {
    state.wishlist.push(id);
    showToast("Saved to your favourites");
  }

  saveState();
  renderProducts();
  renderWishlist();
  renderCounts();
}

function closeAll() {
  $$(".drawer, .modal").forEach(element => {
    element.classList.remove("open");
  });

  $("#overlay").classList.remove("open");
  document.body.classList.remove("locked");
}

function openDrawer(id) {
  closeAll();
  $("#overlay").classList.add("open");
  $("#" + id).classList.add("open");
  document.body.classList.add("locked");
}

function renderCart() {
  if (!state.cart.length) {
    $("#cartItems").innerHTML = `
      <div class="empty-state">
        <h3>Your bag is empty ♡</h3>
        <p>Find something good for your table.</p>
      </div>
    `;

    $("#cartFooter").innerHTML = "";
    return;
  }

  $("#cartItems").innerHTML = state.cart.map(item => {
    const product = products.find(p => p.id === item.id);

    return `
      <div class="cart-line">
        <img src="${product.image}" alt="${product.name}">

        <div>
          <h3>${product.name}</h3>
          <p>${product.category} · ${product.size}</p>

          <div class="qty-controls">
            <button data-qty="${product.id}" data-delta="-1">−</button>
            <span>${item.qty}</span>
            <button data-qty="${product.id}" data-delta="1">+</button>
          </div>

          <button class="remove-btn" data-remove="${product.id}">
            Remove
          </button>
        </div>

        <strong>${money(product.price * item.qty)}</strong>
      </div>
    `;
  }).join("");

  const subtotal = state.cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + product.price * item.qty;
  }, 0);

  $("#cartFooter").innerHTML = `
    <div class="subtotal-row">
      <span>Subtotal</span>
      <strong>${money(subtotal)}</strong>
    </div>

    <p class="shipping-note">
      ${subtotal >= 1499
        ? "Your order qualifies for free shipping!"
        : `You're ${money(1499 - subtotal)} away from free shipping.`}
    </p>

    <button class="checkout-btn" id="checkoutBtn">
      Continue to checkout ↗
    </button>

    <small>Demo checkout. No payment will be taken.</small>
  `;
}

function renderWishlist() {
  if (!state.wishlist.length) {
    $("#wishlistItems").innerHTML = `
      <div class="empty-state">
        <h3>Your favourites will live here ♡</h3>
        <p>Tap the heart on anything you love.</p>
      </div>
    `;
    return;
  }

  $("#wishlistItems").innerHTML = state.wishlist.map(id => {
    const product = products.find(p => p.id === id);

    return `
      <div class="cart-line">
        <img src="${product.image}" alt="${product.name}">

        <div>
          <h3>${product.name}</h3>
          <p>${product.category} · ${product.size}</p>
          <strong>${money(product.price)}</strong>
          <div>
            <button class="remove-btn" data-add="${product.id}">
              Add to bag
            </button>
            <button class="remove-btn" data-wish="${product.id}">
              Remove
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function openProduct(id) {
  const product = products.find(p => p.id === Number(id));
  if (!product) return;

  $("#modalContent").innerHTML = `
    <div class="modal-product">
      <img src="${product.image}" alt="${product.name}">

      <div>
        <p class="eyebrow">${product.category.toUpperCase()}</p>
        <h2>${product.name}</h2>

        <strong>
          ${money(product.price)}
          <span class="muted">/ ${product.size}</span>
        </strong>

        <p>${product.description}</p>

        <p>
          ✳ Thoughtfully selected<br>
          ✳ Packed with care<br>
          ✳ Made for your everyday table
        </p>

        <button class="primary-btn" data-add="${product.id}">
          Add to bag ＋
        </button>
      </div>
    </div>
  `;

  closeAll();
  $("#overlay").classList.add("open");
  $("#productModal").classList.add("open");
  document.body.classList.add("locked");
}

// Product grid interactions
$("#productGrid").addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  const wish = event.target.closest("[data-wish]");
  const detail = event.target.closest("[data-detail]");

  if (add) {
    event.stopPropagation();
    addToCart(add.dataset.add);
    return;
  }

  if (wish) {
    event.stopPropagation();
    toggleWishlist(wish.dataset.wish);
    return;
  }

  if (detail) openProduct(detail.dataset.detail);
});

$("#productGrid").addEventListener("keydown", event => {
  if (
    (event.key === "Enter" || event.key === " ") &&
    event.target.matches("[data-detail]")
  ) {
    event.preventDefault();
    openProduct(event.target.dataset.detail);
  }
});

// Shared button interactions
document.body.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  const wish = event.target.closest("[data-wish]");
  const qty = event.target.closest("[data-qty]");
  const remove = event.target.closest("[data-remove]");

  if (add && !event.target.closest("#productGrid")) {
    addToCart(add.dataset.add);
  }

  if (wish && !event.target.closest("#productGrid")) {
    toggleWishlist(wish.dataset.wish);
  }

  if (qty) {
    const item = state.cart.find(
      product => product.id === Number(qty.dataset.qty)
    );

    if (item) {
      item.qty += Number(qty.dataset.delta);

      if (item.qty <= 0) {
        state.cart = state.cart.filter(
          product => product.id !== item.id
        );
      }

      saveState();
      renderCart();
      renderCounts();
    }
  }

  if (remove) {
    state.cart = state.cart.filter(
      item => item.id !== Number(remove.dataset.remove)
    );

    saveState();
    renderCart();
    renderCounts();
  }

  if (event.target.closest("[data-close]")) {
    closeAll();
  }

  if (event.target.id === "checkoutBtn") {
    showToast("Demo checkout — payment integration is required.");
  }
});

$("#overlay").addEventListener("click", closeAll);

$("#cartToggle").addEventListener("click", () => {
  renderCart();
  openDrawer("cartDrawer");
});

$("#wishlistToggle").addEventListener("click", () => {
  renderWishlist();
  openDrawer("wishlistDrawer");
});

// Mobile navigation
$("#menuToggle").addEventListener("click", () => {
  $("#mainNav").classList.toggle("open");
});

$$(".header nav a").forEach(link => {
  link.addEventListener("click", () => {
    $("#mainNav").classList.remove("open");
  });
});

// Search
$("#searchToggle").addEventListener("click", () => {
  $("#searchPanel").classList.toggle("open");

  if ($("#searchPanel").classList.contains("open")) {
    $("#searchInput").focus();
  }
});

$("#searchInput").addEventListener("input", event => {
  state.query = event.target.value.trim();
  state.shown = 12;
  renderProducts();
});

$("#clearSearch").addEventListener("click", () => {
  $("#searchInput").value = "";
  state.query = "";
  state.shown = 12;
  renderProducts();
});

// Categories
$("#filterPills").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  state.category = button.dataset.category;
  state.shown = 12;
  renderProducts();
});

$("#collections").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  state.category = button.dataset.category;
  state.shown = 12;
  renderProducts();

  $("#shop").scrollIntoView({ behavior: "smooth" });
});

// Sorting and pagination
$("#sortSelect").addEventListener("change", event => {
  state.sort = event.target.value;
  state.shown = 12;
  renderProducts();
});

$("#loadMore").addEventListener("click", () => {
  state.shown += 12;
  renderProducts();
});

// Newsletter demo
$("#newsletterForm").addEventListener("submit", event => {
  event.preventDefault();

  $("#newsletterMessage").textContent =
    "Thanks for joining! Demo form — no email was sent.";

  $("#emailInput").value = "";
});

// Escape closes drawers and modal
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeAll();
});

// Initial render
renderProducts();
renderCounts();
renderCart();
renderWishlist();
