// ============================================
// 1. ESPERAR A QUE EL DOM ESTÉ LISTO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 2. INICIALIZACIÓN DE LUCIDE
    // ============================================
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
        console.log('✅ Lucide inicializado');
    } else {
        console.warn('⚠️ Lucide no está disponible');
    }

    // ============================================
    // 3. MODO OSCURO (CORREGIDO)
    // ============================================
    // Modo oscuro con logo dinámico
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
updateLogo();  // ← Inicializar logo

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
        updateLogo();  // ← Actualizar logo al cambiar tema
    });
}

    // ============================================
    // 4. SUBMENÚS CON HOVER
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
    // 5. SLIDER AUTOMÁTICO
    // ============================================
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

    // ============================================
    // 6. CERRAR SUBMENÚS AL HACER CLIC FUERA
    // ============================================
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.submenu').forEach(submenu => {
                submenu.style.display = 'none';
            });
        }
    });

    // ============================================
    // 7. EMAILJS - FORMULARIO DE CONTACTO
    // ============================================
    // Verificar que EmailJS esté cargado
    if (typeof emailjs !== 'undefined' && emailjs.init) {
        // Inicializar con TU Public Key
        emailjs.init("vS5vQ1DCKUxmKVffT");
        console.log('✅ EmailJS inicializado correctamente');
        
        const contactForm = document.getElementById('contactForm');
        const successMessage = document.getElementById('successMessage');

        if (contactForm) {
            console.log('✅ Formulario de contacto encontrado');
            
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('📤 Enviando formulario...');
                
                // Obtener valores con validación
                const nombre = document.getElementById('nombre')?.value || '';
                const email = document.getElementById('email')?.value || '';
                const empresa = document.getElementById('empresa')?.value || '';
                const cargo = document.getElementById('cargo')?.value || '';
                const bd = document.getElementById('bd')?.value || '';
                const mensaje = document.getElementById('mensaje')?.value || '';
                
                // Validación básica
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
                
                // Preparar parámetros - DEBEN coincidir con tu template
                const templateParams = {
                    name: nombre,
                    email: email,
                    empresa: empresa,
                    cargo: cargo,
                    bd: bd,
                    mensaje: mensaje
                };
                
                console.log('📧 Enviando a EmailJS:', templateParams);
                
                // Enviar usando TUS IDs
                emailjs.send('service_r3bh1qv', 'template_54jibgs', templateParams)
                    .then(function(response) {
                        console.log('✅ Correo enviado exitosamente:', response.status, response.text);
                        // Mostrar mensaje de éxito
                        contactForm.style.display = 'none';
                        if (successMessage) {
                            successMessage.style.display = 'block';
                            if (typeof lucide !== 'undefined') {
                                lucide.createIcons();
                            }
                        }
                        // Opcional: Resetear formulario después de 5 segundos
                        setTimeout(() => {
                            contactForm.style.display = 'flex';
                            if (successMessage) successMessage.style.display = 'none';
                            contactForm.reset();
                        }, 5000);
                    })
                    .catch(function(error) {
                        console.error('❌ Error detallado de EmailJS:', error);
                        let errorMsg = 'Hubo un error al enviar el mensaje. ';
                        if (error.text) {
                            errorMsg += error.text;
                        } else if (error.message) {
                            errorMsg += error.message;
                        } else {
                            errorMsg += 'Por favor, verifica tu conexión e intenta nuevamente.';
                        }
                        alert(errorMsg);
                    });
            });
        } else {
            console.error('❌ No se encontró el formulario con id "contactForm"');
        }
    } else {
        console.error('❌ EmailJS no está cargado. Verifica que la librería esté en el HTML.');
    }
});
    // ============================================
    // 8. NEWSLETTER FORM
    // ============================================
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
    
    console.log('✅ Script completamente cargado');
});

// ============================================
// 9. LOGO DINÁMICO SEGÚN TEMA
// ============================================
function updateLogo() {
    const logoImg = document.querySelector('.logo-img');
    if (!logoImg) return;
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    if (isDarkMode) {
        logoImg.src = 'https://raw.githubusercontent.com//centricasolucionesdiseno-ux/landing/main/Imagenes/Logos/LogoClaro.png';
    } else {
        logoImg.src = 'https://raw.githubusercontent.com//centricasolucionesdiseno-ux/landing/main/Imagenes/Logos/LogoColor.png';
    }
}

// Llamar a la función cuando cambie el tema
// Busca el event listener del modo oscuro y agrega updateLogo()
// Si ya existe, agrega la línea dentro:

// En el event listener del darkModeToggle, agrega:
// updateLogo();

// Ejemplo de cómo debería quedar:
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
        updateLogo();  // ← Agrega esta línea
    });
}

// Inicializar logo al cargar
updateLogo();

// Scroll suave para páginas legales
const legalLinks = document.querySelectorAll('.legal-sidebar a');
const sections = document.querySelectorAll('.legal-content section');

if(legalLinks.length && sections.length) {
    legalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if(targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Resaltar enlace activo al hacer scroll
    function highlightActiveLink() {
        let scrollPosition = window.scrollY + 150;
        let activeIndex = -1;
        sections.forEach((sec, idx) => {
            const offsetTop = sec.offsetTop;
            if(scrollPosition >= offsetTop) activeIndex = idx;
        });
        legalLinks.forEach((link, idx) => {
            if(idx === activeIndex) link.style.fontWeight = 'bold';
            else link.style.fontWeight = 'normal';
        });
    }
    window.addEventListener('scroll', highlightActiveLink);
}
