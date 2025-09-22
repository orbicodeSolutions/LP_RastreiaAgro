/*
 * Rastreia Agro - Landing Page JavaScript
 * 
 * Funcionalidades:
 * - Carousel de screenshots
 * - FAQ accordion
 * - Animações de scroll
 * - Smooth scrolling
 * - Otimizações de performance
 */

// Configurações
const CONFIG = {
    carousel: {
        autoPlay: true,
        autoPlayInterval: 5000,
        transitionDuration: 500
    },
    animations: {
        scrollOffset: 100,
        animationDuration: 600
    }
};

// Estado global
let currentSlide = 0;
let carouselInterval = null;
let isAnimating = false;

// DOM Elements
const elements = {
    carouselSlides: document.querySelectorAll('.carousel-slide'),
    carouselDots: document.querySelectorAll('.dot'),
    carouselBtns: {
        prev: document.querySelector('.carousel-btn.prev'),
        next: document.querySelector('.carousel-btn.next')
    },
    faqItems: document.querySelectorAll('.faq-item'),
    header: document.querySelector('.header'),
    navCta: document.querySelector('.nav-cta .btn')
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel();
    initializeFAQ();
    initializeScrollAnimations();
    initializeHeaderScroll();
    initializeParallax();
    initializeTiltCards();
    initializePerformanceOptimizations();
    
    console.log('Rastreia Agro - Landing Page carregada com sucesso!');
});

// Carousel Functions
function initializeCarousel() {
    if (!elements.carouselSlides.length) return;
    
    // Iniciar carousel
    showSlide(0);
    
    // Auto-play
    if (CONFIG.carousel.autoPlay) {
        startCarouselAutoPlay();
    }
    
    // Event listeners
    if (elements.carouselBtns.prev) {
        elements.carouselBtns.prev.addEventListener('click', () => changeSlide(-1));
    }
    
    if (elements.carouselBtns.next) {
        elements.carouselBtns.next.addEventListener('click', () => changeSlide(1));
    }
    
    // Pause on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopCarouselAutoPlay);
        carouselContainer.addEventListener('mouseleave', startCarouselAutoPlay);
    }
}

function showSlide(index) {
    if (isAnimating) return;
    
    isAnimating = true;
    
    // Remove active class from all slides and dots
    elements.carouselSlides.forEach(slide => slide.classList.remove('active'));
    elements.carouselDots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current slide and dot
    if (elements.carouselSlides[index]) {
        elements.carouselSlides[index].classList.add('active');
    }
    
    if (elements.carouselDots[index]) {
        elements.carouselDots[index].classList.add('active');
    }
    
    currentSlide = index;
    
    // Reset animation flag
    setTimeout(() => {
        isAnimating = false;
    }, CONFIG.carousel.transitionDuration);
}

function changeSlide(direction) {
    if (isAnimating) return;
    
    const totalSlides = elements.carouselSlides.length;
    let newIndex = currentSlide + direction;
    
    if (newIndex >= totalSlides) {
        newIndex = 0;
    } else if (newIndex < 0) {
        newIndex = totalSlides - 1;
    }
    
    showSlide(newIndex);
    
    // Reset auto-play
    if (CONFIG.carousel.autoPlay) {
        stopCarouselAutoPlay();
        startCarouselAutoPlay();
    }
}

// function currentSlide(index) {
//     if (isAnimating) return;
    
//     showSlide(index - 1);
    
//     // Reset auto-play
//     if (CONFIG.carousel.autoPlay) {
//         stopCarouselAutoPlay();
//         startCarouselAutoPlay();
//     }
// }

function startCarouselAutoPlay() {
    if (carouselInterval) return;
    
    carouselInterval = setInterval(() => {
        changeSlide(1);
    }, CONFIG.carousel.autoPlayInterval);
}

function stopCarouselAutoPlay() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }
}

// FAQ Functions
function initializeFAQ() {
    elements.faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => toggleFAQ(question));
        }
    });
}

function toggleFAQ(button) {
    const faqItem = button.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    elements.faqItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: `0px 0px -${CONFIG.animations.scrollOffset}px 0px`
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Generic reveal
                entry.target.classList.add('is-visible');
                // Legacy fade-in support
                entry.target.classList.add('fade-in');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.reveal, .section-header, .about-content, .importance-card, .benefit-card, .faq-item, .hero-text, .hero-image'
    );

    animatedElements.forEach((el, index) => {
        // Stagger via CSS classes if none provided
        if (!el.className.includes('reveal-delay-')) {
            const delayClass = `reveal-delay-${(index % 5) + 1}`;
            el.classList.add(delayClass);
        }
        revealObserver.observe(el);
    });
}

// Parallax for hero decorative shapes
function initializeParallax() {
    const shapes = document.querySelectorAll('.hero-decor .shape');
    if (!shapes.length) return;
    
    const handleParallax = throttle((e) => {
        const { innerWidth, innerHeight } = window;
        const cx = (e.clientX || innerWidth / 2) / innerWidth - 0.5;
        const cy = (e.clientY || innerHeight / 2) / innerHeight - 0.5;
        
        shapes.forEach(shape => {
            const depth = parseFloat(shape.getAttribute('data-depth')) || 0.06;
            const translateX = -cx * 40 * depth;
            const translateY = -cy * 40 * depth;
            shape.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
        });
    }, 16);
    
    window.addEventListener('mousemove', handleParallax);
    window.addEventListener('deviceorientation', (event) => {
        const beta = (event.beta || 0) / 90; // tilt X
        const gamma = (event.gamma || 0) / 90; // tilt Y
        shapes.forEach(shape => {
            const depth = parseFloat(shape.getAttribute('data-depth')) || 0.06;
            shape.style.transform = `translate3d(${gamma * 20 * depth}px, ${beta * 20 * depth}px, 0)`;
        });
    });
}

// Tilt effect for cards
function initializeTiltCards() {
    const cards = document.querySelectorAll('.importance-card, .benefit-card');
    if (!cards.length) return;
    
    cards.forEach(card => {
        const onMove = throttle((e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateY = ((x / rect.width) - 0.5) * 8;
            const rotateX = ((y / rect.height) - 0.5) * -8;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        }, 16);
        
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Header Scroll Effect
function initializeHeaderScroll() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            elements.header.classList.add('scrolled');
        } else {
            elements.header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    });
}

// Performance Optimizations
function initializePerformanceOptimizations() {
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Preload critical resources
    preloadCriticalResources();
}

function preloadCriticalResources() {
    const criticalImages = [
        'assets/logo-rastreia-agro.png',
        'assets/app-mockup.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// WhatsApp Link Tracking (Analytics placeholder)
function trackWhatsAppClick(source) {
    // Placeholder para analytics
    console.log(`WhatsApp click tracked from: ${source}`);
    
    // Exemplo de implementação com Google Analytics:
    // gtag('event', 'click', {
    //     event_category: 'WhatsApp',
    //     event_label: source
    // });
}

// Add click tracking to WhatsApp buttons
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', function() {
        const source = this.closest('section')?.className || 'unknown';
        trackWhatsAppClick(source);
    });
});

// Form Validation (if needed in future)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Erro na página:', e.error);
    // Aqui você pode enviar erros para um serviço de monitoramento
});

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registrado com sucesso');
            })
            .catch(function(error) {
                console.log('Falha ao registrar ServiceWorker:', error);
            });
    });
}

// A/B Testing Functions (placeholder)
function getABTestVariant() {
    // Implementar lógica de A/B testing aqui
    return Math.random() > 0.5 ? 'A' : 'B';
}

function applyABTestVariant(variant) {
    if (variant === 'B') {
        // Aplicar variação B do teste
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.innerHTML = 'Rastreia Agro conecta produtores à tecnologia, garantindo <span class="highlight">rastreabilidade</span> e controle de safras';
        }
    }
}

// Initialize A/B Testing
// const abVariant = getABTestVariant();
// applyABTestVariant(abVariant);

// Export functions for global access
window.changeSlide = changeSlide;
window.currentSlide = currentSlide;
window.toggleFAQ = toggleFAQ;

// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
            console.log('Page load time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
        }
    });
});

if ('PerformanceObserver' in window) {
    performanceObserver.observe({ entryTypes: ['navigation'] });
}