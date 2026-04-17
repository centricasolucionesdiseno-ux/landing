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
    lucide.createIcons(); // Re-renderizar ícono
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

// Mejorar experiencia: mostrar submenú solo con hover en desktop
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
