// Firebase config is already initialized in HTML
const db = firebase.firestore();
const productsContainer = document.getElementById('productsContainer');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

let allProducts = [];

function renderProducts(products) {
  productsContainer.innerHTML = '';
  if (products.length === 0) {
    productsContainer.innerHTML = '<p style="text-align:center;width:100%">لا توجد منتجات مطابقة.</p>';
    return;
  }
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => {
      window.location.href = `product.html?id=${p.id}`;
    };
    card.innerHTML = `
      <img src="${p.image}" class="product-image" alt="صورة المنتج">
      <div class="product-info">
        <div class="product-title">${p.name}</div>
        <div class="product-type">${p.type}</div>
        <div class="product-desc">${p.desc.substring(0, 60)}${p.desc.length > 60 ? '...' : ''}</div>
        <div class="product-price">${p.price} ج.م</div>
      </div>
    `;
    productsContainer.appendChild(card);
  });
}

function filterAndRender() {
  let filtered = allProducts;
  const search = searchInput.value.trim();
  if (search) {
    filtered = filtered.filter(p =>
      p.name.includes(search) ||
      p.type.includes(search) ||
      p.desc.includes(search)
    );
  }
  if (sortSelect.value === 'price') {
    filtered = filtered.slice().sort((a, b) => a.price - b.price);
  } else if (sortSelect.value === 'type') {
    filtered = filtered.slice().sort((a, b) => a.type.localeCompare(b.type, 'ar'));
  }
  renderProducts(filtered);
}

// جلب المنتجات من Firestore
function fetchProducts() {
  db.collection('products').onSnapshot(snapshot => {
    allProducts = [];
    snapshot.forEach(doc => {
      allProducts.push({ id: doc.id, ...doc.data() });
    });
    filterAndRender();
  });
}

if (productsContainer) {
  fetchProducts();
  searchInput.addEventListener('input', filterAndRender);
  sortSelect.addEventListener('change', filterAndRender);
}
