// ==================================================================
// === PUNTO DE ENTRADA PRINCIPAL PARA TODO EL SCRIPT ===
// ==================================================================
document.addEventListener('DOMContentLoaded', () => {

    console.log('GETREADY - El DOM se ha cargado correctamente. Inicializando scripts...');

    // ------------------------------------------------------------------
    // --- LÓGICA DEL LOGO FIJO (STICKY LOGO) ---
    // ------------------------------------------------------------------
    const stickyLogo = document.getElementById('sticky-logo');
    const stickyLogoImg = document.getElementById('sticky-logo-img');
    const heroSection = document.getElementById('home');

    if (stickyLogo && stickyLogoImg && heroSection) {
        // 1. Mostrar/ocultar el logo fijo al hacer scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > heroSection.offsetHeight - 50) {
                stickyLogo.classList.add('visible');
            } else {
                stickyLogo.classList.remove('visible');
            }
        });

        // 2. Cambiar el color del logo según la sección visible
        const sections = document.querySelectorAll('[data-bg-color]');
        const observerOptionsLogo = {
            root: null,
            threshold: 0.4
        };

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bgColor = entry.target.getAttribute('data-bg-color');
                    console.log(`Entrando en la sección con fondo: ${bgColor}`); // Mensaje para depurar

                    if (bgColor === 'light') {
                        stickyLogoImg.src = 'images/logo/logo_solo_negro.webp';
                    } else {
                        stickyLogoImg.src = 'images/logo/logo_solo_blanco.webp';
                    }
                }
            });
        }, observerOptionsLogo);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

    } else {
        console.error("No se encontró uno de los elementos para el logo fijo: #sticky-logo, #sticky-logo-img, o #home.");
    }

    // ------------------------------------------------------------------
    // --- LÓGICA DE ANIMACIÓN DE ELEMENTOS AL HACER SCROLL (FADE IN UP) ---
    // ------------------------------------------------------------------
    const animatedElements = document.querySelectorAll('.feature-card, .showcase-text, .impact-content');
    const observerOptionsAnimate = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                observer.unobserve(entry.target); // Animar solo una vez
            }
        });
    }, observerOptionsAnimate);

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });
    
    // ------------------------------------------------------------------
    // --- EVENT LISTENERS GENERALES ---
    // ------------------------------------------------------------------

    // --- Scroll suave para los enlaces del menú ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Cierra el menú móvil si está abierto
                document.querySelector('.hamburger').classList.remove('active');
                document.querySelector('.mobile-menu').classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // --- Cerrar menú al hacer clic afuera ---
    document.addEventListener('click', function(event) {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu && hamburger && !hamburger.contains(event.target) && !mobileMenu.contains(event.target)) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // --- Cerrar menú con la tecla Escape ---
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const hamburger = document.querySelector('.hamburger');
            const mobileMenu = document.querySelector('.mobile-menu');
            if (hamburger && mobileMenu) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
    
    // --- Efecto Parallax en la sección Hero ---
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const floatingElements = document.querySelectorAll('.float-item');
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrollTop * speed}px)`;
        });
    });

    // --- Efecto Ripple en botones ---
    document.querySelectorAll('.hero-cta, .pr-submit').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.cssText = `position: absolute; width: ${size}px; height: ${size}px; left: ${x}px; top: ${y}px; background: rgba(255, 255, 255, 0.3); border-radius: 50%; transform: scale(0); animation: ripple 0.6s ease-out; pointer-events: none;`;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // --- Lazy loading para imágenes ---
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    lazyImages.forEach(img => imageObserver.observe(img));

    // --- Soporte táctil para menú ---
    let touchStartX = 0;
    let touchEndX = 0;
    document.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; });
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
});


// ==================================================================
// === FUNCIONES GLOBALES (ACCESIBLES DESDE EL HTML) ===
// ==================================================================

// --- Función para el menú hamburguesa ---
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

// --- Función para el formulario de pre-registro ---
function handlePreRegister(event) {
    event.preventDefault();

    // NOTA: Esta función tiene IDs que no existen en tu HTML actual, como 'name', 'last-name', y 'heard-us'.
    // Asegúrate de que los IDs en tu formulario coincidan o actualiza este código.
    
    console.log("Manejando el envío del formulario...");
    // Ejemplo de cómo obtener un valor que sí existe:
    const email = document.getElementById('email').value;
    console.log("Email:", email);
    
    const submitBtn = event.target.querySelector('.pr-submit');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'ASEGURANDO ACCESO...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = 'BIENVENIDO AL FUTURO';
        setTimeout(() => {
            alert('¡Gracias por unirte a la lista de espera! Te notificaremos cuando GET READY esté listo.');
            event.target.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }, 1000);
}

// --- Función para el gesto de swipe ---
function handleSwipe() {
    const mobileMenu = document.querySelector('.mobile-menu');
    // Swipe left to close menu (asumiendo que el menú está a la derecha)
    if (touchEndX < touchStartX - 50 && mobileMenu.classList.contains('active')) {
        toggleMenu();
    }
}


// --- Inyectar CSS para la animación de Ripple ---
const style = document.createElement('style');
style.textContent = `@keyframes ripple { to { transform: scale(2); opacity: 0; } }`;
document.head.appendChild(style);