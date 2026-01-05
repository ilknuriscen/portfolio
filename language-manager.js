// Language Manager - Handles language switching and translations
const LanguageManager = {
  // Current active language
  currentLanguage: 'tr',

  // Initialize language on page load
  initializeLanguage() {
    // Try to get saved language from localStorage
    const saved = localStorage.getItem('preferredLanguage');
    this.currentLanguage = saved || 'tr';
    
    // Apply translations to the page
    this.updateDOM();
    
    // Update language switcher UI
    this.updateSwitcherUI();
    
    // Add event listeners to language buttons
    this.attachEventListeners();
  },

  // Set language and update everything
  setLanguage(lang) {
    if (lang !== 'tr' && lang !== 'en') return;
    
    this.currentLanguage = lang;
    
    // Update all translatable elements
    this.updateDOM();
    
    // Save preference to localStorage
    try {
      localStorage.setItem('preferredLanguage', lang);
    } catch (e) {
      console.warn('localStorage not available, language preference not saved');
    }
    
    // Update switcher UI
    this.updateSwitcherUI();
  },

  // Update all DOM elements with translations
  updateDOM() {
    // Find all elements with data-key attribute
    document.querySelectorAll('[data-key]').forEach(element => {
      const key = element.getAttribute('data-key');
      const translation = this.getTranslation(key);
      
      if (!translation) return;
      
      // Handle different element types
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        // Update placeholder for inputs
        element.placeholder = translation;
      } else if (element.tagName === 'BUTTON') {
        // Update button text content
        element.textContent = translation;
      } else if (element.hasAttribute('aria-label')) {
        // Update aria-label if present
        element.setAttribute('aria-label', translation);
      } else if (element.tagName === 'IMG') {
        // Update alt text for images
        element.setAttribute('alt', translation);
      } else {
        // Update text content for other elements
        element.textContent = translation;
      }
    });
  },

  // Get translation value from translations object
  getTranslation(key) {
    const keys = key.split('.');
    let value = translations[this.currentLanguage];
    
    // Navigate through nested object
    for (let k of keys) {
      value = value?.[k];
    }
    
    // Return translation or fallback to key
    return value || key;
  },

  // Get current language
  getCurrentLanguage() {
    return this.currentLanguage;
  },

  // Update language switcher UI
  updateSwitcherUI() {
    // Update button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const lang = btn.getAttribute('data-lang');
      if (lang === this.currentLanguage) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  },

  // Attach event listeners to language buttons
  attachEventListeners() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = btn.getAttribute('data-lang');
        this.setLanguage(lang);
      });
    });
  }
};

// Initialize language when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    LanguageManager.initializeLanguage();
  });
} else {
  // DOM is already loaded
  LanguageManager.initializeLanguage();
}
