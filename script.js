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
