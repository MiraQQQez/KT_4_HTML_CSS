/**
 * Theatre of Tragedy - Интерактивные элементы сайта
 * Основной файл JavaScript
 * 
 * © 2025 Igor Silin. Все права защищены.
 */

// ========================================
// 1. ИНТЕРАКТИВНОЕ АНИМИРОВАННОЕ ЛОГО
// ========================================

/**
 * Инициализация анимации логотипа
 * Добавляет эффекты вращения, пульсации и свечения
 */
function initLogoAnimation() {
    const logoContainer = document.querySelector('.logo-animated');
    const logoCircle = document.querySelector('.logo-circle');
    const logoPath = document.querySelector('.logo-path');
    const logoText = document.querySelector('.logo-text');
    
    if (!logoContainer) return;
    
    // Анимация при наведении мыши
    logoContainer.addEventListener('mouseenter', () => {
        logoContainer.style.transform = 'scale(1.1) rotate(360deg)';
        logoCircle.style.strokeWidth = '5';
        logoPath.style.fill = '#FFD700';
    });
    
    logoContainer.addEventListener('mouseleave', () => {
        logoContainer.style.transform = 'scale(1) rotate(0deg)';
        logoCircle.style.strokeWidth = '3';
        logoPath.style.fill = '#8B0000';
    });
    
    // Пульсация при клике
    logoContainer.addEventListener('click', () => {
        logoContainer.classList.add('logo-pulse');
        setTimeout(() => {
            logoContainer.classList.remove('logo-pulse');
        }, 1000);
    });
    
    // Автоматическая анимация каждые 5 секунд
    setInterval(() => {
        logoText.classList.add('logo-glow');
        setTimeout(() => {
            logoText.classList.remove('logo-glow');
        }, 2000);
    }, 5000);
}

// ========================================
// 2. ИНТЕРАКТИВНЫЙ СЛАЙДЕР АЛЬБОМОВ
// ========================================

/**
 * Класс для управления слайдером альбомов
 */
class AlbumSlider {
    constructor() {
        this.track = document.getElementById('sliderTrack');
        this.slides = document.querySelectorAll('.slider-slide');
        this.prevBtn = document.getElementById('sliderPrev');
        this.nextBtn = document.getElementById('sliderNext');
        this.dotsContainer = document.getElementById('sliderDots');
        
        this.currentIndex = 0;
        this.slideCount = this.slides.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 секунд
        
        if (this.track && this.slides.length > 0) {
            this.init();
        }
    }
    
    /**
     * Инициализация слайдера
     */
    init() {
        this.createDots();
        this.attachEventListeners();
        this.updateSlider();
        this.startAutoPlay();
    }
    
    /**
     * Создание индикаторов (точек) для слайдера
     */
    createDots() {
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < this.slideCount; i++) {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            dot.setAttribute('aria-label', `Перейти к альбому ${i + 1}`);
            
            if (i === 0) {
                dot.classList.add('active');
            }
            
            dot.addEventListener('click', () => {
                this.goToSlide(i);
                this.resetAutoPlay();
            });
            
            this.dotsContainer.appendChild(dot);
        }
    }
    
    /**
     * Подключение обработчиков событий
     */
    attachEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.resetAutoPlay();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.resetAutoPlay();
            });
        }
        
        // Поддержка свайпов на мобильных устройствах
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        this.track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
        
        // Пауза автопрокрутки при наведении
        this.track.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
        });
        
        this.track.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
        
        // Управление клавиатурой
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
                this.resetAutoPlay();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
                this.resetAutoPlay();
            }
        });
    }
    
    /**
     * Обработка свайпов
     */
    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
            this.resetAutoPlay();
        }
    }
    
    /**
     * Переход к следующему слайду
     */
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slideCount;
        this.updateSlider();
    }
    
    /**
     * Переход к предыдущему слайду
     */
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
        this.updateSlider();
    }
    
    /**
     * Переход к конкретному слайду
     */
    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlider();
    }
    
    /**
     * Обновление позиции слайдера
     */
    updateSlider() {
        const offset = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${offset}%)`;
        
        // Обновление активной точки
        const dots = this.dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
        
        // Обновление состояния кнопок
        this.updateButtons();
    }
    
    /**
     * Обновление состояния кнопок навигации
     */
    updateButtons() {
        if (this.prevBtn && this.nextBtn) {
            // Можно добавить логику для отключения кнопок на краях
            // Но для циклического слайдера это не требуется
        }
    }
    
    /**
     * Запуск автоматической прокрутки
     */
    startAutoPlay() {
        this.stopAutoPlay(); // Очищаем предыдущий интервал
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    /**
     * Остановка автоматической прокрутки
     */
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    /**
     * Перезапуск автоматической прокрутки
     */
    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// ========================================
// 3. АНИМИРОВАННОЕ БУРГЕР-МЕНЮ
// ========================================

/**
 * Инициализация бургер-меню
 */
function initBurgerMenu() {
    const burgerBtn = document.getElementById('burgerMenu');
    const nav = document.getElementById('mainNav');
    
    if (!burgerBtn || !nav) return;
    
    // Обработчик клика на бургер-меню
    burgerBtn.addEventListener('click', () => {
        const isOpen = burgerBtn.classList.toggle('active');
        nav.classList.toggle('active');
        
        // Обновление aria-атрибута для доступности
        burgerBtn.setAttribute('aria-expanded', isOpen);
        burgerBtn.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
        
        // Блокировка прокрутки при открытом меню на мобильных
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Закрытие меню при клике на ссылку
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerBtn.classList.remove('active');
            nav.classList.remove('active');
            burgerBtn.setAttribute('aria-expanded', 'false');
            burgerBtn.setAttribute('aria-label', 'Открыть меню');
            document.body.style.overflow = '';
        });
    });
    
    // Закрытие меню при клике вне его области
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !burgerBtn.contains(e.target)) {
            if (burgerBtn.classList.contains('active')) {
                burgerBtn.classList.remove('active');
                nav.classList.remove('active');
                burgerBtn.setAttribute('aria-expanded', 'false');
                burgerBtn.setAttribute('aria-label', 'Открыть меню');
                document.body.style.overflow = '';
            }
        }
    });
    
    // Закрытие меню при нажатии Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && burgerBtn.classList.contains('active')) {
            burgerBtn.classList.remove('active');
            nav.classList.remove('active');
            burgerBtn.setAttribute('aria-expanded', 'false');
            burgerBtn.setAttribute('aria-label', 'Открыть меню');
            document.body.style.overflow = '';
        }
    });
}

// ========================================
// 4. ДОПОЛНИТЕЛЬНЫЕ ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ
// ========================================

/**
 * Подсветка активного пункта меню при прокрутке
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Анимация печатания текста
 */
function typeWriter(element, text, speed = 100) {
    if (!element) return;
    
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/**
 * Анимация появления элементов при прокрутке
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Наблюдение за секциями
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('animate-on-scroll');
        observer.observe(section);
    });
    
    // Наблюдение за карточками
    const cards = document.querySelectorAll('.member-card, .album-card, .quote-card');
    cards.forEach(card => {
        card.classList.add('animate-on-scroll');
        observer.observe(card);
    });
}

/**
 * Плавная прокрутка к якорям
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Пропускаем пустые якори
            if (href === '#' || href === '#!') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Кнопка "Наверх"
 */
function initScrollToTop() {
    // Создаем кнопку, если её нет
    let scrollBtn = document.querySelector('.scroll-to-top');
    
    if (!scrollBtn) {
        scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '↑';
        scrollBtn.setAttribute('aria-label', 'Вернуться наверх');
        document.body.appendChild(scrollBtn);
    }
    
    // Показываем/скрываем кнопку при прокрутке
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Прокрутка наверх при клике
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// 5. ИНИЦИАЛИЗАЦИЯ ВСЕХ КОМПОНЕНТОВ
// ========================================

/**
 * Инициализация всех интерактивных элементов после загрузки DOM
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎭 Theatre of Tragedy - Инициализация интерактивных элементов...');
    
    // 1. Инициализация анимированного лого
    initLogoAnimation();
    console.log('✅ Анимированное лого инициализировано');
    
    // 2. Инициализация слайдера
    const slider = new AlbumSlider();
    console.log('✅ Слайдер альбомов инициализирован');
    
    // 3. Инициализация бургер-меню
    initBurgerMenu();
    console.log('✅ Бургер-меню инициализировано');
    
    // 4. Дополнительные функции
    initScrollAnimations();
    initSmoothScroll();
    initScrollToTop();
    console.log('✅ Дополнительные анимации инициализированы');
    
    // 5. Анимация печатания для заголовка
    const title = document.querySelector('h1');
    if (title) {
        const originalText = title.textContent;
        title.style.opacity = '0';
        setTimeout(() => {
            title.style.opacity = '1';
            typeWriter(title, originalText, 100);
        }, 500);
    }
    
    // 6. Подсветка активного пункта меню
    window.addEventListener('scroll', updateActiveNavLink);
    window.addEventListener('load', updateActiveNavLink);
    
    console.log('🎉 Все интерактивные элементы успешно загружены!');
});

/**
 * Обработка изменения размера окна
 */
window.addEventListener('resize', () => {
    // Закрываем меню при изменении размера окна
    const burgerBtn = document.getElementById('burgerMenu');
    const nav = document.getElementById('mainNav');
    
    if (burgerBtn && nav && window.innerWidth > 768) {
        burgerBtn.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
    }
});
