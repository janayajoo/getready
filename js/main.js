// Hamburger menu toggle
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            document.querySelector('.hamburger').classList.remove('active');
            document.querySelector('.mobile-menu').classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Form submission handler

function handlePreRegister(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const heardUs = document.getElementById('heard-us').value;
    const countryCode = document.getElementById('country-code').value;
    const phoneNumber = document.getElementById('phone-number').value;

    const lettersOnlyRegex = /^[a-zA-Z\sñáéíóúÁÉÍÓÚ]+$/;
    const numbersOnlyRegex = /^\d+$/;
    const emailRegex = /^\S+@\S+\.\S+$/;


    if (!name || !lastName || !email || !phoneNumber || !heardUs) {
        alert('Por favor, completa todos los campos requeridos.');
        return;
    }

    if (!lettersOnlyRegex.test(name)) {
        alert('El nombre solo debe contener letras y espacios.');
        return;
    }
    if (!lettersOnlyRegex.test(lastName)) {
        alert('El apellido solo debe contener letras y espacios.');
        return;
    }

    if (!emailRegex.test(email)) {
        alert('Por favor, ingresa una dirección de correo electrónico válida.');
        return;
    }

    if (!numbersOnlyRegex.test(phoneNumber)) {
        alert('El número de teléfono solo debe contener dígitos (0-9).');
        return;
    }

    const fullPhoneNumber = countryCode + phoneNumber.replace(/\s/g, ''); 
    const formData = {
        name: name,
        last_name: lastName,
        email: email,
        phone: fullPhoneNumber,
        heard_about_us: heardUs
    };

    (async () => {
        try {
            const { data, error } = await supabaseClient
                .from("pre_registrations")
                .insert([formData]);

            if (error) {
                console.error("Error al insertar en Supabase:", error);
                alert("Hubo un problema al enviar tus datos. Intenta nuevamente.");
                return;
            }

            console.log("Datos insertados:", data);
        } catch (err) {
            console.error("Error de conexión con Supabase:", err);
        }
    })();

    console.log('Datos del formulario capturados:', formData);

    const submitBtn = event.target.querySelector('.pr-submit');
    const originalText = submitBtn.textContent;
    const originalBackground = submitBtn.style.background;

    submitBtn.textContent = 'SECURING ACCESS...';
    submitBtn.style.background = 'var(--accent-rose)';
    submitBtn.disabled = true;
    
    setTimeout(() => {

        submitBtn.textContent = 'WELCOME TO THE FUTURE';
        
        setTimeout(() => {
            alert('Thank you for joining the waitlist. We\'ll notify you when GET READY is ready.');
            
            event.target.reset();
        
            submitBtn.textContent = originalText;
            submitBtn.style.background = originalBackground;
            submitBtn.disabled = false;
        }, 1500);
    }, 1000);
}


// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!hamburger.contains(event.target) && !mobileMenu.contains(event.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close menu with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target); // Animate only once
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .showcase-text, .impact-content');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// Navbar scroll effect
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add subtle parallax to floating elements
    const floatingElements = document.querySelectorAll('.float-item');
    floatingElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrollTop * speed}px)`;
    });
    
    lastScrollTop = scrollTop;
});

// Add loading animation to CTA buttons
document.querySelectorAll('.hero-cta, .pr-submit').forEach(button => {
    button.addEventListener('click', function(e) {
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);


// Performance optimization - Lazy load images if any are added later
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Add touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const mobileMenu = document.querySelector('.mobile-menu');
    
    // Swipe right to close menu
    if (touchEndX < touchStartX - 50 && mobileMenu.classList.contains('active')) {
        toggleMenu();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('CLOSET//AI - Digital Wardrobe Intelligence loaded successfully');
});
