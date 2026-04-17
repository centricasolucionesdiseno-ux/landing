// Inicializar Lucide íconos
lucide.createIcons();

// Modo oscuro
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Función para actualizar el ícono
function updateThemeIcon() {
    const icon = darkModeToggle.querySelector('i');
    if (body.classList.contains('dark-mode')) {
        icon.setAttribute('data-lucide', 'sun');
    } else {
        icon.setAttribute('data-lucide', 'moon');
    }
    lucide.createIcons();
}

// Verificar preferencia guardada
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
} else {
    body.classList.add('light-mode');
}
updateThemeIcon();

// Alternar modo oscuro
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

// Submenús con hover
const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(dropdown => {
    const submenu = dropdown.querySelector('.submenu');
    
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
});

// Slider automático (solo si existe)
const track = document.getElementById('sliderTrack');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('sliderDots');

if (track && slides.length > 0 && prevBtn && nextBtn && dotsContainer) {
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
        document.querySelectorAll('.dot').forEach((dot, index) => {
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
        slideInterval = setInterval(nextSlide, autoSlideInterval);
    }

    function stopAutoPlay() {
        clearInterval(slideInterval);
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
    lucide.createIcons();
}

// Cerrar submenús al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.submenu').forEach(submenu => {
            submenu.style.display = 'none';
        });
    }
});

// ========== FORMULARIO CON EMAILJS ==========
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

// Inicializar EmailJS con tu Public Key
emailjs.init("vS5vQ1DCKUxmKVffT");  // ⚠️ REEMPLAZA ESTO

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validación básica
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const empresa = document.getElementById('empresa').value;
        
        if (!nombre || !email || !empresa) {
            alert('Por favor, completa los campos obligatorios (*)');
            return;
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, ingresa un correo electrónico válido');
            return;
        }
        
        // Preparar datos - Los nombres DEBEN coincidir con las variables del template
        const templateParams = {
            name: nombre,           // ← Coincide con {{name}}
            email: email,           // ← Coincide con {{email}}
            empresa: empresa,       // ← Coincide con {{empresa}}
            cargo: document.getElementById('cargo').value,
            bd: document.getElementById('bd').value,
            mensaje: document.getElementById('mensaje').value
        };
        
        // Enviar usando EmailJS
        emailjs.send('service_921q6wa', 'template_bdzlqqa', templateParams)
            .then(function(response) {
                console.log('Éxito:', response);
                // Mostrar mensaje de éxito
                contactForm.style.display = 'none';
                successMessage.style.display = 'block';
                lucide.createIcons();
            }, function(error) {
                console.log('Error:', error);
                alert('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.');
            });
    });
}
// ========== NEWSLETTER FORM ==========
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        // Aquí puedes conectar con EmailJS también
        console.log('Newsletter suscripción:', email);
        alert('¡Gracias por suscribirte!');
        this.reset();
    });
}
