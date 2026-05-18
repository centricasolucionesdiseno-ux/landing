document.addEventListener('DOMContentLoaded', function() {
    
    // 2. INICIALIZACIÓN DE LUCIDE
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
        console.log('✅ Lucide inicializado');
    } else {
        console.warn('⚠️ Lucide no está disponible');
    }

    // 3. MODO OSCURO
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    function updateThemeIcon() {
        if (!darkModeToggle) return;
        const icon = darkModeToggle.querySelector('i');
        if (!icon) return;
        
        if (body.classList.contains('dark-mode')) {
            icon.setAttribute('data-lucide', 'sun');
        } else {
            icon.setAttribute('data-lucide', 'moon');
        }
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    function updateLogo() {
        const logoImg = document.querySelector('.logo-img');
        if (!logoImg) return;
        
        const isDarkMode = body.classList.contains('dark-mode');
        
        if (isDarkMode) {
            logoImg.src = 'https://raw.githubusercontent.com//centricasolucionesdiseno-ux/landing/main/Imagenes/Logos/LogoClaro.png';
        } else {
            logoImg.src = 'https://raw.githubusercontent.com//centricasolucionesdiseno-ux/landing/main/Imagenes/Logos/LogoColor.png';
        }
    }

    // Verificar preferencia guardada
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
    } else {
        body.classList.add('light-mode');
    }
    updateThemeIcon();
    updateLogo();

    // Alternar modo oscuro
    if (darkModeToggle) {
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
            updateLogo();
        });
    }

    // 4. SUBMENÚS CON HOVER
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

    // 5. SLIDER AUTOMÁTICO
    const track = document.getElementById('sliderTrack');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');

    // Aplicar imágenes de fondo a cada slide según data-image
    const slidesConImagen = document.querySelectorAll('.slide');
    slidesConImagen.forEach(slide => {
        const imagenUrl = slide.getAttribute('data-image');
        if (imagenUrl) {
            const slideContent = slide.querySelector('.slide-content');
            if (slideContent) {
                slideContent.style.backgroundImage = `url('${imagenUrl}')`;
                slideContent.style.backgroundSize = 'cover';
                slideContent.style.backgroundPosition = 'center';
            }
        }
    });

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
            if (!track) return;
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
        console.warn('⚠️ Slider no encontrado o elementos faltantes');
    }

    // ========== CARRUSEL UNIFICADO ==========
    class Carousel {
        constructor(element, options = {}) {
            this.carousel = element;
            this.track = this.carousel.querySelector('.carousel-track');
            this.slides = Array.from(this.track.children);
            this.prevBtn = this.carousel.querySelector('.carousel-prev');
            this.nextBtn = this.carousel.querySelector('.carousel-next');
            this.dotsContainer = this.carousel.querySelector('.carousel-dots');
            this.autoPlay = options.autoPlay || false;
            this.intervalTime = options.intervalTime || 5000;
            this.currentIndex = 0;
            this.slideWidth = 0;
            this.autoPlayInterval = null;
            
            this.init();
        }
        
        init() {
            if (this.slides.length === 0) return;
            
            // Configurar el ancho de los slides
            this.setSlideWidth();
            
            // Crear dots
            if (this.dotsContainer) {
                this.createDots();
            }
            
            // Event listeners
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => this.prevSlide());
            }
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => this.nextSlide());
            }
            
            // Auto-play
            if (this.autoPlay) {
                this.startAutoPlay();
                this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
                this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
            }
            
            // Responsive
            window.addEventListener('resize', () => {
                this.setSlideWidth();
                this.goToSlide(this.currentIndex);
            });
            
            // Ir al primer slide
            this.goToSlide(0);
            
            // Re-inicializar Lucide por si hay nuevos íconos
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }
        }
        
        setSlideWidth() {
            const isMultiple = this.carousel.classList.contains('carousel-multiple');
            if (isMultiple) {
                const container = this.carousel.querySelector('.carousel-track-container');
                if (container) {
                    const containerWidth = container.getBoundingClientRect().width;
                    const slidesPerView = window.innerWidth > 968 ? 3 : (window.innerWidth > 768 ? 2 : 1);
                    this.slideWidth = containerWidth / slidesPerView;
                }
            } else {
                if (this.slides[0]) {
                    this.slideWidth = this.slides[0].getBoundingClientRect().width;
                }
            }
            
            this.slides.forEach(slide => {
                slide.style.minWidth = `${this.slideWidth}px`;
            });
        }
        
        createDots() {
            this.dotsContainer.innerHTML = '';
            this.slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
        }
        
        updateDots() {
            if (!this.dotsContainer) return;
            const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                if (index === this.currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        goToSlide(index) {
            if (index < 0) {
                index = this.slides.length - 1;
            } else if (index >= this.slides.length) {
                index = 0;
            }
            
            this.currentIndex = index;
            const moveAmount = -this.slideWidth * this.currentIndex;
            this.track.style.transform = `translateX(${moveAmount}px)`;
            
            if (this.dotsContainer) {
                this.updateDots();
            }
            
            // Agregar animación al slide activo
            this.slides.forEach((slide, i) => {
                if (i === this.currentIndex) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
        }
        
        nextSlide() {
            this.goToSlide(this.currentIndex + 1);
        }
        
        prevSlide() {
            this.goToSlide(this.currentIndex - 1);
        }
        
        startAutoPlay() {
            if (this.autoPlay) {
                this.autoPlayInterval = setInterval(() => this.nextSlide(), this.intervalTime);
            }
        }
        
        stopAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
        }
    }

    // Inicializar todos los carruseles
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        const autoPlay = carousel.hasAttribute('data-autoplay');
        const intervalTime = parseInt(carousel.getAttribute('data-interval')) || 5000;
        new Carousel(carousel, { autoPlay, intervalTime });
    });
    // ========== FIN CARRUSEL UNIFICADO ==========

    // ========== SISTEMA DE ANIMACIONES AL SCROLL ==========
    
    // Definir los diferentes tipos de animaciones
    const animations = {
        'fade-up': {
            initial: { opacity: 0, transform: 'translateY(30px)' },
            visible: { opacity: 1, transform: 'translateY(0)' }
        },
        'fade-down': {
            initial: { opacity: 0, transform: 'translateY(-30px)' },
            visible: { opacity: 1, transform: 'translateY(0)' }
        },
        'fade-left': {
            initial: { opacity: 0, transform: 'translateX(-30px)' },
            visible: { opacity: 1, transform: 'translateX(0)' }
        },
        'fade-right': {
            initial: { opacity: 0, transform: 'translateX(30px)' },
            visible: { opacity: 1, transform: 'translateX(0)' }
        },
        'zoom-in': {
            initial: { opacity: 0, transform: 'scale(0.9)' },
            visible: { opacity: 1, transform: 'scale(1)' }
        },
        'zoom-out': {
            initial: { opacity: 0, transform: 'scale(1.1)' },
            visible: { opacity: 1, transform: 'scale(1)' }
        },
        'rotate': {
            initial: { opacity: 0, transform: 'rotate(-5deg) scale(0.95)' },
            visible: { opacity: 1, transform: 'rotate(0) scale(1)' }
        },
        'flip': {
            initial: { opacity: 0, transform: 'perspective(400px) rotateX(90deg)' },
            visible: { opacity: 1, transform: 'perspective(400px) rotateX(0)' }
        }
    };

    // Elementos que se animarán al scroll
    const animatedElements = [
        // Secciones completas
        { selector: '.section', animation: 'fade-up', delay: 0, threshold: 0.15 },
        { selector: '.hero-static', animation: 'fade-down', delay: 0, threshold: 0.1 },
        { selector: '.hero-video', animation: 'zoom-in', delay: 0, threshold: 0.1 },
        
        // Tarjetas individuales
        { selector: '.card', animation: 'fade-up', delay: 0.1, threshold: 0.2, stagger: true },
        { selector: '.card-flip', animation: 'zoom-in', delay: 0.1, threshold: 0.2, stagger: true },
        { selector: '.card-float', animation: 'fade-up', delay: 0.1, threshold: 0.2, stagger: true },
        { selector: '.card-highlight', animation: 'fade-left', delay: 0.1, threshold: 0.2, stagger: true },
        
        // Grids y contenedores
        { selector: '.grid-2', animation: 'fade-up', delay: 0, threshold: 0.2 },
        { selector: '.grid-auto', animation: 'fade-up', delay: 0, threshold: 0.2 },
        { selector: '.flip-grid', animation: 'fade-up', delay: 0, threshold: 0.2 },
        
        // Elementos de hero
        { selector: '.hero-title', animation: 'fade-down', delay: 0, threshold: 0.1 },
        { selector: '.hero-subtitle', animation: 'fade-up', delay: 0.1, threshold: 0.1 },
        { selector: '.hero-description', animation: 'fade-up', delay: 0.2, threshold: 0.1 },
        { selector: '.hero-buttons', animation: 'fade-up', delay: 0.3, threshold: 0.1 },
        
        // Títulos de sección
        { selector: '.section-title', animation: 'fade-down', delay: 0, threshold: 0.2 },
        { selector: '.section-subtitle', animation: 'fade-up', delay: 0.1, threshold: 0.2 },
        
        // Elementos de metodología
        { selector: '.metodologia-paso', animation: 'fade-right', delay: 0.1, threshold: 0.2, stagger: true },
        
        // Elementos de estadísticas
        { selector: '.stat-item', animation: 'zoom-in', delay: 0.1, threshold: 0.3, stagger: true },
        
        // Elementos del carrusel
        { selector: '.carousel-slide', animation: 'fade-up', delay: 0, threshold: 0.2 },
        
        // Badges y elementos pequeños
        { selector: '.badge', animation: 'zoom-in', delay: 0.2, threshold: 0.2, stagger: true }
    ];

    // Función para aplicar la animación a un elemento
    function applyAnimation(element, animationType, delay = 0) {
        const animation = animations[animationType];
        if (!animation) return;
        
        // Aplicar estilos iniciales
        Object.assign(element.style, animation.initial);
        element.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`;
        element.style.willChange = 'opacity, transform';
        
        // Marcar como animado
        element.setAttribute('data-animated', 'false');
        element.setAttribute('data-animation-type', animationType);
        
        // Función para mostrar el elemento
        const showElement = () => {
            if (element.getAttribute('data-animated') === 'true') return;
            Object.assign(element.style, animation.visible);
            element.setAttribute('data-animated', 'true');
        };
        
        // Verificar si ya es visible
        const checkVisibility = () => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const threshold = parseFloat(element.getAttribute('data-threshold') || '0.2');
            const isVisible = rect.top <= windowHeight - (windowHeight * threshold) && rect.bottom >= 0;
            
            if (isVisible) {
                showElement();
                window.removeEventListener('scroll', checkVisibility);
                window.removeEventListener('resize', checkVisibility);
            }
        };
        
        // Guardar threshold personalizado si existe
        const parentConfig = animatedElements.find(cfg => 
            element.matches && element.matches(cfg.selector)
        );
        if (parentConfig) {
            element.setAttribute('data-threshold', parentConfig.threshold);
        }
        
        // Escuchar eventos
        window.addEventListener('scroll', checkVisibility);
        window.addEventListener('resize', checkVisibility);
        checkVisibility(); // Verificar inmediatamente
    }

    // Función para aplicar animaciones escalonadas (stagger)
    function applyStaggerAnimation(elements, animationType, baseDelay, threshold) {
        elements.forEach((element, index) => {
            const delay = baseDelay + (index * 0.05);
            const animation = animations[animationType];
            if (!animation) return;
            
            Object.assign(element.style, animation.initial);
            element.style.transition = `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`;
            element.style.willChange = 'opacity, transform';
            element.setAttribute('data-animated', 'false');
            element.setAttribute('data-animation-type', animationType);
            
            const showElement = () => {
                if (element.getAttribute('data-animated') === 'true') return;
                Object.assign(element.style, animation.visible);
                element.setAttribute('data-animated', 'true');
            };
            
            const checkVisibility = () => {
                const rect = element.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                const isVisible = rect.top <= windowHeight - (windowHeight * threshold) && rect.bottom >= 0;
                
                if (isVisible) {
                    showElement();
                    window.removeEventListener('scroll', checkVisibility);
                    window.removeEventListener('resize', checkVisibility);
                }
            };
            
            window.addEventListener('scroll', checkVisibility);
            window.addEventListener('resize', checkVisibility);
            checkVisibility();
        });
    }

    // Inicializar todas las animaciones
    function initAnimations() {
        animatedElements.forEach(config => {
            const elements = document.querySelectorAll(config.selector);
            
            if (elements.length === 0) return;
            
            if (config.stagger && elements.length > 1) {
                // Animación escalonada para múltiples elementos
                applyStaggerAnimation(
                    Array.from(elements),
                    config.animation,
                    config.delay,
                    config.threshold
                );
            } else {
                // Animación individual
                elements.forEach(element => {
                    applyAnimation(element, config.animation, config.delay);
                });
            }
        });
        
        console.log('✅ Sistema de animaciones inicializado');
    }

    // Observador de scroll para elementos dinámicos (como carrusel)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.getAttribute('data-animated') !== 'true') {
                const animationType = entry.target.getAttribute('data-animation-type');
                if (animationType && animations[animationType]) {
                    const animation = animations[animationType];
                    Object.assign(entry.target.style, animation.visible);
                    entry.target.setAttribute('data-animated', 'true');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    // Observar elementos que se cargan dinámicamente
    function observeDynamicElements() {
        const allAnimatedElements = document.querySelectorAll('[data-animation-type]');
        allAnimatedElements.forEach(el => {
            if (el.getAttribute('data-animated') === 'false') {
                observer.observe(el);
            }
        });
    }

    // Inicializar animaciones cuando el DOM esté listo
    initAnimations();
    
    // Re-evaluar animaciones después de que el carrusel se inicialice
    setTimeout(() => {
        observeDynamicElements();
    }, 500);
    
    // Re-evaluar en cambios de ventana
    window.addEventListener('resize', () => {
        setTimeout(observeDynamicElements, 100);
    });
    
    // ========== FIN SISTEMA DE ANIMACIONES ==========
    
    // 6. CERRAR SUBMENÚS AL HACER CLIC FUERA
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.submenu').forEach(submenu => {
                submenu.style.display = 'none';
            });
        }
    });

    // 7. EMAILJS - FORMULARIO DE CONTACTO
    if (typeof emailjs !== 'undefined' && emailjs.init) {
        emailjs.init("vS5vQ1DCKUxmKVffT");
        console.log('✅ EmailJS inicializado correctamente');
        
        const contactForm = document.getElementById('contactForm');
        const successMessage = document.getElementById('successMessage');

        if (contactForm) {
            console.log('✅ Formulario de contacto encontrado');
            
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('📤 Enviando formulario...');
                
                const nombre = document.getElementById('nombre')?.value || '';
                const email = document.getElementById('email')?.value || '';
                const empresa = document.getElementById('empresa')?.value || '';
                const cargo = document.getElementById('cargo')?.value || '';
                const bd = document.getElementById('bd')?.value || '';
                const mensaje = document.getElementById('mensaje')?.value || '';
                
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
                    cargo: cargo,
                    bd: bd,
                    mensaje: mensaje
                };
                
                console.log('📧 Enviando a EmailJS:', templateParams);
                
                emailjs.send('service_r3bh1qv', 'template_54jibgs', templateParams)
                    .then(function(response) {
                        console.log('✅ Correo enviado exitosamente:', response.status);
                        contactForm.style.display = 'none';
                        if (successMessage) {
                            successMessage.style.display = 'block';
                            if (typeof lucide !== 'undefined') {
                                lucide.createIcons();
                            }
                        }
                        setTimeout(() => {
                            contactForm.style.display = 'flex';
                            if (successMessage) successMessage.style.display = 'none';
                            contactForm.reset();
                        }, 5000);
                    })
                    .catch(function(error) {
                        console.error('❌ Error detallado de EmailJS:', error);
                        alert('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.');
                    });
            });
        } else {
            console.error('❌ No se encontró el formulario con id "contactForm"');
        }
    } else {
        console.error('❌ EmailJS no está cargado. Verifica que la librería esté en el HTML.');
    }

    // 8. NEWSLETTER FORM
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value : '';
            console.log('📧 Newsletter suscripción:', email);
            alert('¡Gracias por suscribirte!');
            this.reset();
        });
    }
    
    // 9. SCROLL SUAVE PARA PÁGINAS LEGALES
    const legalLinks = document.querySelectorAll('.legal-sidebar a');
    const sections = document.querySelectorAll('.legal-content section');

    if (legalLinks.length && sections.length) {
        legalLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        function highlightActiveLink() {
            let scrollPosition = window.scrollY + 150;
            let activeIndex = -1;
            sections.forEach((sec, idx) => {
                const offsetTop = sec.offsetTop;
                if (scrollPosition >= offsetTop) activeIndex = idx;
            });
            legalLinks.forEach((link, idx) => {
                if (idx === activeIndex) link.style.fontWeight = 'bold';
                else link.style.fontWeight = 'normal';
            });
        }
        window.addEventListener('scroll', highlightActiveLink);
    }
    
    console.log('✅ Script completamente cargado');
});
