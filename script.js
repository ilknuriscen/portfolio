// ============================================================================
// CORE INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initTheme();
    initNavigation();
    initHero();
    initProjects();
    initContact();
    initScrollProgress();
    initAnimations();
    initGradientMesh();
    initCursorEffects();
    initCVDownload();
    initGlitchEffect();
    initScrollRevealAnimations();
    initScrollToTop();
});

// ============================================================================
// THEME MANAGEMENT
// ============================================================================

function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const STORAGE_KEY = 'portfolio-theme';
    
    // Get saved theme or default to dark
    const savedTheme = localStorage.getItem(STORAGE_KEY) || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Theme toggle listener
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem(STORAGE_KEY, newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// ============================================================================
// NAVIGATION
// ============================================================================

function initNavigation() {
    const menuToggle = document.querySelector('.navbar-menu-toggle');
    const menu = document.querySelector('.navbar-menu');
    const menuLinks = document.querySelectorAll('.navbar-menu-links a');
    const navLinks = document.querySelectorAll('.navbar-links a, .navbar-menu-links a');
    
    // Mobile menu toggle
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
        
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
            });
        });
    }
    
    // Smooth scroll navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ============================================================================
// HERO SECTION
// ============================================================================

function initHero() {
    const ctaButtons = document.querySelectorAll('.hero-cta .cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (button.classList.contains('primary')) {
                // View Projects
                const projectsSection = document.querySelector('#projects');
                if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (button.classList.contains('secondary')) {
                // Get in Touch
                const contactSection = document.querySelector('#contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // Animate headline
    const headline = document.querySelector('.hero-headline');
    if (headline) {
        const text = headline.textContent;
        headline.textContent = '';
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.setProperty('--char-delay', `${index * 0.05}s`);
            headline.appendChild(span);
        });
    }
    
    // Animate subtitle (typing effect)
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        subtitle.classList.add('typing');
        
        let charIndex = 0;
        const typeChar = () => {
            if (charIndex < text.length) {
                subtitle.textContent += text[charIndex];
                charIndex++;
                setTimeout(typeChar, 50);
            } else {
                subtitle.classList.remove('typing');
            }
        };
        
        typeChar();
    }
}

// ============================================================================
// PROJECTS SECTION
// ============================================================================

function initProjects() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectGrid = document.querySelector('.project-grid');
    const modal = document.getElementById('projectModal');
    const modalClose = document.querySelector('.modal-close');
    
    // Store current project index for language switching
    let currentProjectIndex = null;
    
    const projects = [
        {
            id: 1,
            title: 'Cinema Ticket Sales Project',
            category: 'web',
            description: 'The Cinema Ticket Sales System I developed using C# and Windows Forms allows users to view movies, showtimes, and theaters and purchase tickets.',
            technologies: ['C#', 'Windows Forms', 'Entity Framework Core', 'MySQL']
        },
        {
            id: 2,
            title: 'Medication Reminder System',
            category: 'mobile',
            description: 'The Medication Reminder System, developed with Laravel, allows users to track their medication intake, box selections, and usage releases by storing them in a database.',
            technologies: ['Laravel', 'PHP', 'Blade', 'MySQL']
        },
        {
            id: 3,
            title: 'Rhythm Game Project',
            category: 'design',
            description: 'I prepared the backend with PHP and Laravel, and the interactive interface with JavaScript; players use the keyboard to press notes at the right time to collect points.',
            technologies: ['PHP', 'Laravel', 'JavaScript']
        },
        {
            id: 4,
            title: 'Animals Game',
            category: 'web',
            description: 'I created this to help children recognize and choose animals. The game is supported by visual and audio content, offering a fun and educational experience.',
            technologies: ['HTML', 'CSS', 'JavaScript']
        }
    ];
    
    // Function to update modal with translated content
    function updateModalWithProject(index) {
        currentProjectIndex = index;
        const project = projects[index];
        
        // Get translations based on current language
        const projectKey = project.id === 1 ? 'ecommerce' : 
                           project.id === 2 ? 'fitness' :
                           project.id === 3 ? 'design' :
                           project.id === 4 ? 'analytics' : 'ecommerce';
        
        const translatedTitle = LanguageManager.getTranslation(`projects.${projectKey}`);
        const translatedDesc = LanguageManager.getTranslation(`projects.${projectKey}FullDesc`);
        
        // Update modal content with translated text
        document.getElementById('modalTitle').textContent = translatedTitle;
        document.getElementById('modalDescription').textContent = translatedDesc;
        
        // Update technologies
        const techContainer = document.getElementById('modalTechnologies');
        techContainer.innerHTML = '';
        project.technologies.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'modal-tech-tag';
            tag.textContent = tech;
            techContainer.appendChild(tag);
        });
    }
    
    // Set initial active filter
    if (filterButtons.length > 0) {
        filterButtons[0].classList.add('active');
    }
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const filterValue = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const shouldShow = filterValue === 'all' || category === filterValue;
                
                if (shouldShow) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
    
    // Project detail buttons
    projectCards.forEach((card, index) => {
        const button = card.querySelector('.project-details-btn');
        if (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Update modal with translated content
                updateModalWithProject(index);
                
                // Show modal
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        }
    });
    
    // Modal close
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Close modal on backdrop click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Close modal on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Update modal when language changes
    const originalSetLanguage = LanguageManager.setLanguage.bind(LanguageManager);
    LanguageManager.setLanguage = function(lang) {
        originalSetLanguage(lang);
        // If modal is open, update its content
        if (modal && modal.classList.contains('active') && currentProjectIndex !== null) {
            updateModalWithProject(currentProjectIndex);
        }
    };
}

// ============================================================================
// CONTACT FORM
// ============================================================================

function initContact() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const successMessage = document.querySelector('.form-success');
    
    // Input animations
    [nameInput, emailInput, messageInput].forEach(input => {
        if (!input) return;
        
        input.addEventListener('focus', () => {
            const label = input.parentElement.querySelector('.form-label');
            if (label) label.classList.add('active');
        });
        
        input.addEventListener('blur', () => {
            const label = input.parentElement.querySelector('.form-label');
            if (label && !input.value.trim()) {
                label.classList.remove('active');
            }
        });
        
        input.addEventListener('input', () => {
            const label = input.parentElement.querySelector('.form-label');
            if (label) {
                if (input.value.trim()) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate
        const errors = {};
        
        if (!nameInput.value.trim()) {
            errors.name = 'Name is required';
        }
        
        if (!emailInput.value.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
            errors.email = 'Please enter a valid email';
        }
        
        if (!messageInput.value.trim()) {
            errors.message = 'Message is required';
        } else if (messageInput.value.trim().length < 10) {
            errors.message = 'Message must be at least 10 characters';
        }
        
        // Clear previous errors
        form.querySelectorAll('.form-error').forEach(el => {
            el.textContent = '';
            el.classList.remove('show');
        });
        
        if (Object.keys(errors).length > 0) {
            // Show errors
            Object.keys(errors).forEach(fieldName => {
                const input = document.getElementById(fieldName);
                if (input) {
                    const errorElement = input.parentElement.querySelector('.form-error');
                    if (errorElement) {
                        errorElement.textContent = errors[fieldName];
                        errorElement.classList.add('show');
                    }
                }
            });
            return;
        }
        
        // Success
        if (successMessage) {
            successMessage.textContent = '✓ Message sent successfully!';
            successMessage.classList.add('show');
            
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 3000);
        }
        
        // Clear form
        nameInput.value = '';
        emailInput.value = '';
        messageInput.value = '';
        
        form.querySelectorAll('.form-label').forEach(label => {
            label.classList.remove('active');
        });
    });
}

// ============================================================================
// SCROLL PROGRESS
// ============================================================================

function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-fill');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = documentHeight > 0 ? (scrolled / documentHeight) * 100 : 0;
        
        progressBar.style.width = `${progress}%`;
    });
}

// ============================================================================
// ANIMATIONS
// ============================================================================

function initAnimations() {
    // Observe elements for scroll animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });
        
        // Observe timeline items
        document.querySelectorAll('.timeline-item').forEach(item => {
            observer.observe(item);
        });
        
        // Observe about cards
        document.querySelectorAll('.about-card').forEach(card => {
            observer.observe(card);
        });
        
        // Observe skill cards
        document.querySelectorAll('.skill-card').forEach(card => {
            observer.observe(card);
        });
    }
}



// ============================================================================
// ANIMATED GRADIENT MESH BACKGROUND
// ============================================================================

function initGradientMesh() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    // Set canvas size
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop - çok hafif, sadece gradient
    function animate() {
        time += 0.005;

        // Create animated gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        
        // Smooth color transitions with sine waves
        const color1Offset = 0.3 + Math.sin(time) * 0.1;
        const color2Offset = 0.5 + Math.sin(time + Math.PI / 3) * 0.1;
        const color3Offset = 0.7 + Math.sin(time + (2 * Math.PI) / 3) * 0.1;

        gradient.addColorStop(0, `rgba(99, 102, 241, ${0.08 + Math.sin(time) * 0.02})`);
        gradient.addColorStop(color1Offset, `rgba(129, 140, 248, ${0.06 + Math.sin(time + Math.PI / 2) * 0.02})`);
        gradient.addColorStop(color2Offset, `rgba(99, 102, 241, ${0.05 + Math.sin(time + Math.PI) * 0.02})`);
        gradient.addColorStop(color3Offset, `rgba(129, 140, 248, ${0.06 + Math.sin(time + (3 * Math.PI) / 2) * 0.02})`);
        gradient.addColorStop(1, `rgba(99, 102, 241, ${0.08 + Math.sin(time + 2 * Math.PI) * 0.02})`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add subtle diagonal lines
        ctx.strokeStyle = `rgba(129, 140, 248, ${0.03 + Math.sin(time * 0.5) * 0.01})`;
        ctx.lineWidth = 1;

        const lineSpacing = 100;
        const offset = (time * 20) % lineSpacing;

        // Diagonal lines
        for (let i = -canvas.height; i < canvas.width; i += lineSpacing) {
            ctx.beginPath();
            ctx.moveTo(i + offset, -canvas.height);
            ctx.lineTo(i + offset + canvas.height, canvas.height);
            ctx.stroke();
        }

        animationId = requestAnimationFrame(animate);
    }

    animate();

    // Pause animation when hero section is out of view
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && animationId) {
                    cancelAnimationFrame(animationId);
                }
            });
        }, { threshold: 0 });

        observer.observe(heroSection);
    }
}

// ============================================================================
// ADVANCED CURSOR EFFECTS - SMOOTH FOLLOW + MAGNETIC HOVER
// ============================================================================

function initCursorEffects() {
    // Check if touch device
    if (window.matchMedia('(hover: none)').matches) {
        return; // Disable on touch devices
    }

    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'cursor-main';
    document.body.appendChild(cursor);

    const cursorTrail = document.createElement('div');
    cursorTrail.className = 'cursor-trail';
    document.body.appendChild(cursorTrail);

    const cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';
    document.body.appendChild(cursorRing);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let trailX = 0;
    let trailY = 0;
    let isOverInteractive = false;

    // Smooth animation loop
    function animate() {
        // Smooth follow for main cursor
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        // Slower follow for trail
        trailX += (mouseX - trailX) * 0.05;
        trailY += (mouseY - trailY) * 0.05;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        cursorTrail.style.left = trailX + 'px';
        cursorTrail.style.top = trailY + 'px';

        cursorRing.style.left = cursorX + 'px';
        cursorRing.style.top = cursorY + 'px';

        requestAnimationFrame(animate);
    }

    animate();

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.classList.add('active');
        cursorTrail.classList.add('active');
        cursorRing.classList.add('active');
    });

    // Hide cursor effects when mouse leaves window
    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        cursorTrail.classList.remove('active');
        cursorRing.classList.remove('active');
    });

    // Magnetic hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, .project-card, .skill-card, .bio-button');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            isOverInteractive = true;
            cursor.classList.add('hover');
            cursorRing.classList.add('hover');
            
            // Magnetic pull effect
            const rect = element.getBoundingClientRect();
            const elementCenterX = rect.left + rect.width / 2;
            const elementCenterY = rect.top + rect.height / 2;
            
            // Pull cursor towards element center
            mouseX += (elementCenterX - mouseX) * 0.3;
            mouseY += (elementCenterY - mouseY) * 0.3;
        });

        element.addEventListener('mouseleave', () => {
            isOverInteractive = false;
            cursor.classList.remove('hover');
            cursorRing.classList.remove('hover');
        });

        element.addEventListener('mousedown', () => {
            cursor.classList.add('click');
            setTimeout(() => cursor.classList.remove('click'), 150);
        });
    });
}

// ============================================================================
// CV DOWNLOAD FUNCTIONALITY
// ============================================================================

function initCVDownload() {
    const cvButton = document.getElementById('cvDownloadBtn');
    if (!cvButton) return;

    cvButton.addEventListener('click', (e) => {
        e.preventDefault();

        // CV dosyasını indir
        const link = document.createElement('a');
        link.href = 'İlknur-İşcen-CV.pdf';
        link.download = 'İlknur-İşcen-CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Add animation feedback
        cvButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            cvButton.style.transform = '';
        }, 150);
    });
}


// ============================================================================
// GLITCH EFFECT ANIMATION
// ============================================================================

function initGlitchEffect() {
    const headline = document.querySelector('.hero-headline');
    if (!headline) return;

    headline.addEventListener('mouseenter', () => {
        headline.classList.add('glitch-active');
    });

    headline.addEventListener('mouseleave', () => {
        headline.classList.remove('glitch-active');
    });
}

// ============================================================================
// SCROLL REVEAL ANIMATIONS
// ============================================================================

function initScrollRevealAnimations() {
    const revealElements = document.querySelectorAll(
        '.skill-card, .project-card, .about-bio, .bio-highlights'
    );

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        element.classList.add('reveal');
        observer.observe(element);
    });
}


// ============================================================================
// SCROLL TO TOP BUTTON
// ============================================================================

function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (!scrollToTopBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    // Smooth scroll to top on click
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
