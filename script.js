// ============================================
// 1. INICIALIZACIÓN DE LUCIDE
// ============================================
lucide.createIcons();

// ============================================
// 2. MODO OSCURO
// ============================================
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

function updateThemeIcon() {
    const icon = darkModeToggle.querySelector('i');
    if (body.classList.contains('dark-mode')) {
        icon.setAttribute('data-lucide', 'sun');
    } else {
        icon.setAttribute('data-lucide', 'moon');
    }
    lucide.createIcons();
}

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
} else {
    body.classList.add('light-mode');
}
updateThemeIcon();

darkModeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    }
    updateThemeIcon();
});

// ============================================
// 3. SUBMENÚS CON HOVER
// ============================================
const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(dropdown => {
    const submenu = dropdown.querySelector('.submenu');
    if (submenu) {
        dropdown.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                submenu.style.display = 'block';
            }
        });
        
        dropdown.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                submenu.style.display = 'none';
            }
        });
    }
});

// ============================================
// 4. SLIDER AUTOMÁTICO
// ============================================
const track = document.getElementById('sliderTrack');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('sliderDots');

if (track && slides.length > 0 && prevBtn && nextBtn && dotsContainer) {
    console.log('✅ Slider inicializado. Slides encontrados:', slides.length);
    
    let currentIndex = 0;
    let slideInterval;
    const totalSlides = slides.length;
    const autoSlideInterval = 5000;

    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
        resetAutoPlay();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
        resetAutoPlay();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
        resetAutoPlay();
    }

    function startAutoPlay() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, autoSlideInterval);
    }

    function stopAutoPlay() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoPlay);
        sliderContainer.addEventListener('mouseleave', startAutoPlay);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    createDots();
    startAutoPlay();
    updateSlider();
    
} else {
    console.error('❌ Slider: Faltan elementos', {
        track: !!track,
        slides: slides.length,
        prevBtn: !!prevBtn,
        nextBtn: !!nextBtn,
        dotsContainer: !!dotsContainer
    });
}

// ============================================
// 5. CERRAR SUBMENÚS AL HACER CLIC FUERA
// ============================================
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.submenu').forEach(submenu => {
            submenu.style.display = 'none';
        });
    }
});

// ============================================
// 6. EMAILJS - FORMULARIO DE CONTACTO
// ============================================
if (typeof emailjs !== 'undefined') {
    emailjs.init("vS5vQ1DCKUxmKVffT");
    console.log('✅ EmailJS inicializado');
    
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const empresa = document.getElementById('empresa').value;
            
            if (!nombre || !email || !empresa) {
                alert('Por favor, completa los campos obligatorios (*)');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, ingresa un correo electrónico válido');
                return;
            }
            
            const templateParams = {
                name: nombre,
                email: email,
                empresa: empresa,
                cargo: document.getElementById('cargo').value,
                bd: document.getElementById('bd').value,
                mensaje: document.getElementById('mensaje').value
            };
            
            emailjs.send('service_921q6wa', 'template_bdzlqqa', templateParams)
                .then(function(response) {
                    console.log('✅ Email enviado:', response);
                    contactForm.style.display = 'none';
                    successMessage.style.display = 'block';
                    lucide.createIcons();
                })
                .catch(function(error) {
                    console.error('❌ Error EmailJS:', error);
                    alert('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.');
                });
        });
    }
} else {
    console.error('❌ EmailJS no está cargado');
}

// ============================================
// 7. NEWSLETTER FORM
// ============================================
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        console.log('📧 Newsletter:', email);
        alert('¡Gracias por suscribirte!');
        this.reset();
    });
}
