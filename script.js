// Modo oscuro
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Inicializar Lucide íconos
lucide.createIcons();

// Verificar preferencia guardada
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
    darkModeToggle.textContent = '☀️';
} else {
    body.classList.add('light-mode');
    darkModeToggle.textContent = '🌙';
}

// Alternar modo oscuro
darkModeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        darkModeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
});

// Opcional: Cerrar submenús al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        const submenus = document.querySelectorAll('.submenu');
        submenus.forEach(submenu => {
            submenu.style.display = 'none';
        });
    }
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
