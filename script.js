// Form handling
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Terima kasih! Pesan Anda telah terkirim.');
    this.reset();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add scroll animation for sections
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight * 0.75) {
            section.classList.add('visible');
        }
    });
});

// Order form functionality
const orderForm = document.getElementById('order-form');
const formSteps = document.querySelectorAll('.form-step');
const orderSteps = document.querySelectorAll('.step');
const nextButtons = document.querySelectorAll('.next-btn');
const prevButtons = document.querySelectorAll('.prev-btn');
const quantityInput = document.getElementById('quantity');
const quantityBtns = document.querySelectorAll('.quantity-btn');
let currentStep = 1;

// Product prices (in rupiah)
const prices = {
    'kambing-etawa': 5000000,
    'susu-kambing': 50000,
    'pupuk-organik': 75000
};

// Handle quantity buttons
quantityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const input = quantityInput;
        const value = parseInt(input.value);
        
        if (btn.classList.contains('minus')) {
            if (value > 1) input.value = value - 1;
        } else {
            input.value = value + 1;
        }
        
        updateOrderSummary();
    });
});

// Navigation between steps
function goToStep(step) {
    formSteps.forEach(formStep => {
        formStep.classList.remove('active');
    });
    orderSteps.forEach(orderStep => {
        orderStep.classList.remove('active');
    });
    
    formSteps[step-1].classList.add('active');
    for(let i = 0; i < step; i++) {
        orderSteps[i].classList.add('active');
    }
    
    currentStep = step;
}

nextButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            goToStep(currentStep + 1);
            updateOrderSummary();
        }
    });
});

prevButtons.forEach(button => {
    button.addEventListener('click', () => {
        goToStep(currentStep - 1);
    });
});

// Validate each step
function validateStep(step) {
    const currentFormStep = formSteps[step-1];
    const inputs = currentFormStep.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value) {
            isValid = false;
            input.classList.add('error');
            showError(input, 'Field ini harus diisi');
        } else {
            input.classList.remove('error');
            removeError(input);
            
            // Validasi tambahan
            if (input.type === 'email' && !validateEmail(input.value)) {
                isValid = false;
                input.classList.add('error');
                showError(input, 'Email tidak valid');
            }
            if (input.type === 'tel' && !validatePhone(input.value)) {
                isValid = false;
                input.classList.add('error');
                showError(input, 'Nomor telepon tidak valid');
            }
        }
    });
    
    if (!isValid) {
        alert('Mohon lengkapi semua field yang diperlukan');
    }
    
    return isValid;
}

// Helper functions for validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[0-9]{10,13}$/;
    return re.test(phone);
}

function showError(input, message) {
    const errorDiv = input.parentElement.querySelector('.error-message') || 
                    document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    if (!input.parentElement.querySelector('.error-message')) {
        input.parentElement.appendChild(errorDiv);
    }
}

function removeError(input) {
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Update order summary
function updateOrderSummary() {
    const summaryContent = document.querySelector('.summary-content');
    const totalPriceElement = document.querySelector('.total-price .price');
    const selectedProduct = document.querySelector('input[name="product"]:checked');
    const quantity = parseInt(quantityInput.value);
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    
    if (selectedProduct) {
        const price = prices[selectedProduct.value];
        const total = price * quantity;
        
        summaryContent.innerHTML = `
            <div class="summary-section">
                <h4>Detail Produk</h4>
                <p><strong>Produk:</strong> ${selectedProduct.nextElementSibling.querySelector('h3').textContent}</p>
                <p><strong>Jumlah:</strong> ${quantity}</p>
                <p><strong>Harga Satuan:</strong> Rp ${price.toLocaleString()}</p>
            </div>
            ${currentStep === 3 ? `
                <div class="summary-section">
                    <h4>Data Pemesan</h4>
                    <p><strong>Nama:</strong> ${nameInput.value}</p>
                    <p><strong>Email:</strong> ${emailInput.value}</p>
                    <p><strong>Telepon:</strong> ${phoneInput.value}</p>
                    <p><strong>Alamat:</strong> ${addressInput.value}</p>
                </div>
            ` : ''}
        `;
        
        totalPriceElement.textContent = `Rp ${total.toLocaleString()}`;
    }
}

// Handle form submission
orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateStep(currentStep)) {
        const formData = {
            product: document.querySelector('input[name="product"]:checked').value,
            quantity: quantityInput.value,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            payment: document.querySelector('input[name="payment"]:checked').value
        };

        // Tampilkan konfirmasi dengan data lengkap
        const confirmMessage = `
            Terima kasih atas pesanan Anda!
            
            Detail Pesanan:
            - Produk: ${document.querySelector('input[name="product"]:checked').nextElementSibling.querySelector('h3').textContent}
            - Jumlah: ${formData.quantity}
            - Total: ${document.querySelector('.total-price .price').textContent}
            
            Data Pemesan:
            - Nama: ${formData.name}
            - Email: ${formData.email}
            - Telepon: ${formData.phone}
            - Alamat: ${formData.address}
            
            Metode Pembayaran: ${formData.payment === 'transfer' ? 'Transfer Bank' : 'Bayar di Tempat (COD)'}
            
            Kami akan segera memproses pesanan Anda dan menghubungi Anda melalui telepon/email yang telah diberikan.
        `;

        alert(confirmMessage);
        orderForm.reset();
        goToStep(1);
    }
});

// Update summary when product selection changes
document.querySelectorAll('input[name="product"]').forEach(input => {
    input.addEventListener('change', updateOrderSummary);
});

// Testimonial slider functionality
const testimonialSlider = document.querySelector('.testimonial-slider');
const prevBtn = document.querySelector('.nav-btn.prev');
const nextBtn = document.querySelector('.nav-btn.next');
const cardWidth = 300; // Width of testimonial card + gap

function updateNavButtons() {
    prevBtn.disabled = testimonialSlider.scrollLeft <= 0;
    nextBtn.disabled = testimonialSlider.scrollLeft >= testimonialSlider.scrollWidth - testimonialSlider.clientWidth;
}

prevBtn.addEventListener('click', () => {
    testimonialSlider.scrollLeft -= cardWidth;
    updateNavButtons();
});

nextBtn.addEventListener('click', () => {
    testimonialSlider.scrollLeft += cardWidth;
    updateNavButtons();
});

testimonialSlider.addEventListener('scroll', updateNavButtons);

// Initial button state
updateNavButtons();

// Auto-scroll functionality
let autoScrollInterval;

function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
        if (testimonialSlider.scrollLeft >= testimonialSlider.scrollWidth - testimonialSlider.clientWidth) {
            testimonialSlider.scrollLeft = 0;
        } else {
            testimonialSlider.scrollLeft += cardWidth;
        }
        updateNavButtons();
    }, 5000);
}

function stopAutoScroll() {
    clearInterval(autoScrollInterval);
}

// Start auto-scroll and handle hover
startAutoScroll();
testimonialSlider.addEventListener('mouseenter', stopAutoScroll);
testimonialSlider.addEventListener('mouseleave', startAutoScroll);

// Mobile menu functionality
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenu.querySelector('i').classList.toggle('fa-bars');
    mobileMenu.querySelector('i').classList.toggle('fa-times');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('nav')) {
        navLinks.classList.remove('active');
        mobileMenu.querySelector('i').classList.add('fa-bars');
        mobileMenu.querySelector('i').classList.remove('fa-times');
    }
});

// Product category filter
const categoryButtons = document.querySelectorAll('.category-btn');
const productCards = document.querySelectorAll('.product-card');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const category = button.dataset.category;
        
        productCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Product detail modal (you can add this functionality later)
const detailButtons = document.querySelectorAll('.detail-btn');
detailButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Add your modal functionality here
        alert('Detail produk akan ditampilkan di sini');
    });
});

// Gallery functionality
const galleryButtons = document.querySelectorAll('.gallery-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.querySelector('.gallery-modal');
const modalImage = modal.querySelector('.modal-image');
const modalCaption = modal.querySelector('.modal-caption');
const modalClose = modal.querySelector('.modal-close');
const modalPrev = modal.querySelector('.modal-prev');
const modalNext = modal.querySelector('.modal-next');
let currentImageIndex = 0;

// Filter gallery items
galleryButtons.forEach(button => {
    button.addEventListener('click', () => {
        galleryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const category = button.dataset.category;
        
        galleryItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Open modal
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentImageIndex = index;
        updateModal(item);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Close modal
modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Navigate through images
modalPrev.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
    updateModal(galleryItems[currentImageIndex]);
});

modalNext.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
    updateModal(galleryItems[currentImageIndex]);
});

// Update modal content
function updateModal(item) {
    const img = item.querySelector('img');
    const title = item.querySelector('h3');
    const desc = item.querySelector('p');
    
    modalImage.src = img.src;
    modalImage.alt = img.alt;
    modalCaption.querySelector('h3').textContent = title.textContent;
    modalCaption.querySelector('p').textContent = desc.textContent;
}

// Close modal on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    if (e.key === 'ArrowLeft') modalPrev.click();
    if (e.key === 'ArrowRight') modalNext.click();
});

// Blog functionality
const articles = {
    article1: {
        title: "Tips Sukses Beternak Kambing",
        content: `
            <h2>Tips Sukses Beternak Kambing</h2>
            <p>Beternak kambing bisa menjadi usaha yang menguntungkan jika dilakukan dengan tepat. Berikut adalah beberapa tips penting untuk sukses dalam beternak kambing:</p>
            
            <h3>1. Pemilihan Bibit</h3>
            <p>Pilih bibit kambing yang berkualitas dengan memperhatikan:</p>
            <ul>
                <li>Kondisi fisik yang sehat dan normal</li>
                <li>Berasal dari indukan yang produktif</li>
                <li>Memiliki genetik yang baik</li>
            </ul>

            <h3>2. Pakan yang Tepat</h3>
            <p>Berikan pakan yang berkualitas dan sesuai dengan kebutuhan:</p>
            <ul>
                <li>Hijauan segar sebagai pakan utama</li>
                <li>Konsentrat sebagai pakan tambahan</li>
                <li>Air bersih yang selalu tersedia</li>
            </ul>

            <h3>3. Kandang yang Sehat</h3>
            <p>Pastikan kandang memenuhi standar kesehatan:</p>
            <ul>
                <li>Sirkulasi udara yang baik</li>
                <li>Lantai yang selalu bersih dan kering</li>
                <li>Ukuran yang sesuai dengan jumlah ternak</li>
            </ul>
        `
    },
    article2: {
        title: "Manfaat Susu Kambing bagi Kesehatan",
        content: `
            <h2>Manfaat Susu Kambing bagi Kesehatan</h2>
            <p>Susu kambing memiliki berbagai kandungan nutrisi penting yang bermanfaat bagi kesehatan tubuh. Berikut adalah beberapa manfaat utama mengonsumsi susu kambing:</p>

            <h3>1. Mudah Dicerna</h3>
            <p>Susu kambing memiliki struktur molekul lemak yang lebih kecil, sehingga lebih mudah dicerna dibandingkan susu sapi. Hal ini membuat susu kambing cocok untuk orang yang sensitif terhadap susu sapi.</p>

            <h3>2. Kaya Nutrisi</h3>
            <p>Kandungan nutrisi dalam susu kambing meliputi:</p>
            <ul>
                <li>Protein berkualitas tinggi</li>
                <li>Kalsium untuk kesehatan tulang</li>
                <li>Vitamin A, B, dan E</li>
                <li>Mineral penting seperti zinc dan selenium</li>
            </ul>

            <h3>3. Manfaat Kesehatan</h3>
            <p>Mengonsumsi susu kambing secara rutin dapat memberikan manfaat:</p>
            <ul>
                <li>Meningkatkan sistem kekebalan tubuh</li>
                <li>Menjaga kesehatan tulang dan gigi</li>
                <li>Membantu pertumbuhan dan perkembangan</li>
            </ul>
        `
    }
};

// Handle article modal
const articleModal = document.querySelector('.article-modal');
const articleBody = document.querySelector('.article-body');
const readMoreButtons = document.querySelectorAll('.read-more');
const closeArticleButton = document.querySelector('.close-article');

readMoreButtons.forEach(button => {
    button.addEventListener('click', () => {
        const articleId = button.dataset.article;
        const article = articles[articleId];
        
        articleBody.innerHTML = article.content;
        articleModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

closeArticleButton.addEventListener('click', () => {
    articleModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

articleModal.addEventListener('click', (e) => {
    if (e.target === articleModal) {
        articleModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && articleModal.classList.contains('active')) {
        articleModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Contact form handling
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate form
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;
    
    if (!name || !email || !subject || !message) {
        alert('Mohon lengkapi semua field yang diperlukan');
        return;
    }
    
    if (!validateEmail(email)) {
        alert('Mohon masukkan alamat email yang valid');
        return;
    }
    
    // Show success message
    const confirmMessage = `
        Terima kasih telah menghubungi kami!
        
        Detail Pesan:
        Nama: ${name}
        Email: ${email}
        Subjek: ${subject}
        Pesan: ${message}
        
        Kami akan segera merespons pesan Anda.
    `;
    
    alert(confirmMessage);
    contactForm.reset();
}); 