/**
 * Lazy Loading Utility
 * Implements lazy loading for images and non-critical resources
 */

class LazyLoader {
    constructor(options = {}) {
        this.threshold = options.threshold || 0.1;
        this.rootMargin = options.rootMargin || '50px';
        this.imageSelector = options.imageSelector || 'img[data-src]';
        this.observer = null;
        this.loadedImages = new Set();
    }

    init() {
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            this.loadAllImages();
            return;
        }

        this.setupObserver();
        this.observeImages();
    }

    setupObserver() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: this.threshold,
                rootMargin: this.rootMargin
            }
        );
    }

    observeImages() {
        const images = document.querySelectorAll(this.imageSelector);
        images.forEach(img => {
            this.observer.observe(img);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }

    loadImage(img) {
        if (this.loadedImages.has(img)) return;

        const src = img.getAttribute('data-src');
        const srcset = img.getAttribute('data-srcset');

        if (src) {
            img.src = src;
        }

        if (srcset) {
            img.srcset = srcset;
        }

        // Add loaded class for CSS transitions
        img.classList.add('lazy-loaded');
        this.loadedImages.add(img);

        // Remove data attributes
        img.removeAttribute('data-src');
        img.removeAttribute('data-srcset');
    }

    loadAllImages() {
        const images = document.querySelectorAll(this.imageSelector);
        images.forEach(img => this.loadImage(img));
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Export for use in tests and modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LazyLoader;
}
