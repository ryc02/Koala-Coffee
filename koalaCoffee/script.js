let menuItems = [];

const storeItems = [
    { name: "Caneca Koala Coffee", price: 45.90, oldPrice: 59.90, img: "img/ChocoKoala.png", description: "Caneca de cerâmica premium com logo exclusivo. Capacidade 350ml.", badge: "Mais Vendido" },
    { name: "Boné Koala Coffee", price: 49.90, oldPrice: 69.90, img: "img/ChocoKoala.png", description: "Boné ajustável com bordado premium. Proteção e estilo.", badge: "Mais Vendido" },
    { name: "Ecobag Koala", price: 35.00, oldPrice: 45.00, img: "img/ChocoKoala.png", description: "Ecobag 100% algodão sustentável, ideal para suas compras.", badge: "Novo" }
];

let cart = [];

const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

const renderMenu = (filter = 'all') => {
    const filtered = filter === 'all' ? menuItems : menuItems.filter(i => i.category === filter);
    $('menuContainer').innerHTML = filtered.map((item, i) => `
        <div class="box" data-category="${item.category}">
            <span class="category-badge">${item.category}</span>
            <img src="${item.img}" alt="${item.name}">
            <h3>${item.name}</h3>
            <div class="price">R$${item.price.toFixed(2)} <span>R$${item.oldPrice.toFixed(2)}</span></div>
            <button class="btn" onclick="addToCart(${menuItems.indexOf(item)}, 'menu')">Adicionar à Sacola</button>
        </div>
    `).join('');
};

const renderStore = () => {
    $('storeContainer').innerHTML = storeItems.map((item, i) => `
        <div class="store-item">
            <div class="store-item-image">
                <img src="${item.img}" alt="${item.name}">
                <span class="store-badge">${item.badge}</span>
            </div>
            <div class="store-item-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="price">R$${item.price.toFixed(2)} <span>R$${item.oldPrice.toFixed(2)}</span></div>
                <button class="btn" onclick="addToCart(${i}, 'store')">Adicionar à Sacola</button>
            </div>
        </div>
    `).join('');
};

const addToCart = (index, type) => {
    const item = type === 'menu' ? menuItems[index] : storeItems[index];
    const existing = cart.find(i => i.name === item.name);
    existing ? existing.quantity++ : cart.push({ ...item, quantity: 1 });
    updateCart();
    showNotification(`${item.name} adicionado à sacola!`);
};

const removeFromCart = index => {
    showNotification(`${cart[index].name} removido da sacola!`);
    cart.splice(index, 1);
    updateCart();
};

const updateCart = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    $('cartCount').textContent = totalItems;
    
    if (!cart.length) {
        $('cartItems').innerHTML = '<div class="empty-cart">Sua sacola está vazia</div>';
        $('cartTotal').innerHTML = '';
        $('cartModal').classList.remove('has-items');
        return;
    }
    
    $('cartModal').classList.add('has-items');
    $('cartItems').innerHTML = cart.map((item, i) => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>R$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <button class="remove-item" onclick="removeFromCart(${i})" aria-label="Remover item">×</button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    $('cartTotal').innerHTML = `Total: <span style="color: var(--accent-color)">R$${total.toFixed(2)}</span>`;
};

$('checkoutBtn').onclick = () => {
    if (!cart.length) return;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const message = `Olá! Gostaria de fazer o seguinte pedido:\n\n${cart.map(item => 
        `${item.quantity}x ${item.name} - R$${(item.price * item.quantity).toFixed(2)}`
    ).join('\n')}\n\n*Total: R$${total.toFixed(2)}*`;
    window.open(`https://wa.me/5511987654321?text=${encodeURIComponent(message)}`, '_blank');
    showNotification('Redirecionando para o WhatsApp...');
};

const showNotification = msg => {
    const n = document.createElement('div');
    n.style.cssText = 'position:fixed;top:120px;right:20px;background:var(--main-color);color:white;padding:1.5rem 2rem;border-radius:var(--radius);box-shadow:0 5px 20px rgba(0,0,0,0.3);z-index:3000;animation:slideInRight 0.5s ease;font-size:1.6rem';
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => { n.style.animation = 'slideOutRight 0.5s ease'; setTimeout(() => n.remove(), 500); }, 3000);
};

let slides = $$(".slide"), dots = $$(".dots span"), currentIndex = 0;

$$(".slide").forEach((_, i) => {
    const dot = document.createElement("span");
    dot.onclick = () => showSlide(i);
    $$(".dots")[0].appendChild(dot);
});

dots = $$(".dots span");
dots[0].classList.add("active");

const showSlide = i => {
    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));
    slides[i].classList.add("active");
    dots[i].classList.add("active");
    currentIndex = i;
};

$$(".next")[0].onclick = () => showSlide((currentIndex + 1) % slides.length);
$$(".prev")[0].onclick = () => showSlide((currentIndex - 1 + slides.length) % slides.length);
setInterval(() => showSlide((currentIndex + 1) % slides.length), 5000);

$$('.filter-btn').forEach(btn => {
    btn.onclick = () => {
        $$('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMenu(btn.dataset.filter);
    };
});

const toggleModal = (modal, active) => {
    $(modal).classList.toggle('active', active);
    if (modal === 'searchModal' && !active) {
        $('searchInput').value = '';
        $('searchResults').innerHTML = '';
    }
};

$('searchBtn').onclick = () => { toggleModal('searchModal', true); $('searchInput').focus(); };
$('closeSearch').onclick = () => toggleModal('searchModal', false);
$('searchModal').onclick = e => e.target === $('searchModal') && toggleModal('searchModal', false);
$('cartBtn').onclick = () => toggleModal('cartModal', true);
$('closeCart').onclick = () => toggleModal('cartModal', false);
$('menuToggle').onclick = () => { $('menuToggle').classList.toggle('active'); $$('.navbar')[0].classList.toggle('active'); };

$('searchInput').oninput = e => {
    const term = e.target.value.toLowerCase().trim();
    if (!term) { $('searchResults').innerHTML = ''; return; }
    
    const results = [...menuItems, ...storeItems].filter(i => i.name.toLowerCase().includes(term));
    $('searchResults').innerHTML = !results.length ? 
        '<p style="text-align:center;padding:2rem;color:#999">Nenhum produto encontrado</p>' :
        results.map(item => {
            const isMenu = menuItems.includes(item);
            const index = isMenu ? menuItems.indexOf(item) : storeItems.indexOf(item);
            return `<div class="search-result-item" onclick="addToCart(${index}, '${isMenu ? 'menu' : 'store'}'); toggleModal('searchModal', false);">
                <img src="${item.img}" alt="${item.name}">
                <div class="search-result-info"><h4>${item.name}</h4><p>R$${item.price.toFixed(2)}</p></div>
            </div>`;
        }).join('');
};

window.onscroll = () => {
    $$('.header')[0].classList.toggle('scrolled', scrollY > 100);
    $('scrollTop').classList.toggle('active', scrollY > 500);
    
    let current = '';
    $$('section').forEach(section => {
        if (scrollY >= section.offsetTop - 200) current = section.id;
    });
    $$('.navbar a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href').slice(1) === current);
    });
};

$('scrollTop').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

$$('.navbar a').forEach(link => link.onclick = () => {
    $$('.navbar')[0].classList.remove('active');
    $('menuToggle').classList.remove('active');
});

$$('.newsletter-form')[0]?.addEventListener('submit', e => {
    e.preventDefault();
    showNotification('Obrigado por se inscrever! Em breve você receberá nossas novidades.');
    e.target.reset();
});

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    $$('img').forEach(img => observer.observe(img));
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Busca os dados do Java (Back End)
        const response = await fetch('http://localhost:8080/produtos');
        menuItems = await response.json();
        
        // Mapeamento de dados: 
        // O Java usa "imagemUrl", mas seu site antigo usava "img".
        // O Java usa "precoAntigo", mas seu site antigo usava "oldPrice".
        // Vamos adaptar aqui para não quebrar o resto do site:
        menuItems = menuItems.map(item => ({
            ...item,
            img: item.imagemUrl || 'img/ChocoKoala.png', // Imagem padrão se faltar
            oldPrice: item.precoAntigo || (item.preco * 1.2) // Simula preço antigo se não tiver
        }));

        renderMenu(); // Renderiza com os dados vindos do banco!
        renderStore(); // (Você pode fazer a mesma lógica para storeItems depois)
        
    } catch (error) {
        console.error("Erro ao conectar com o Back End:", error);
        alert("Aviso: O servidor Java precisa estar rodando para carregar o menu!");
    }

    // ... mantém o código original dos links de rolagem ...
    $$('a[href^="#"]').forEach(anchor => {
        anchor.onclick = e => {
            const href = anchor.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                $(href.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };
    });
});