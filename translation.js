let currentTranslations = {}; // To store the currently loaded translations

// Function to fetch and load translations
async function loadTranslations(lang) {
    return new Promise((resolve, reject) => {
        // Español por defecto: no requiere archivo externo
        if (lang === 'es') {
            if (typeof translations_es !== 'undefined') {
                currentTranslations = translations_es;
            } else {
                currentTranslations = {}; // Base en HTML español
            }
            return resolve();
        }

        const script = document.createElement('script');
        script.src = `${lang}.js?v=${Date.now()}`;
        script.onload = () => {
            let loadedTranslations = null;
            if (lang === 'en' && typeof translations_en !== 'undefined') {
                loadedTranslations = translations_en;
            } else if (lang === 'pt-br' && typeof translations_pt_br !== 'undefined') {
                loadedTranslations = translations_pt_br;
            }

            if (loadedTranslations) {
                currentTranslations = loadedTranslations;
                resolve();
            } else {
                console.error(`Error: translations_${lang} object not found after loading ${lang}.js`);
                // No bloquear: continuar sin traducciones para no romper selector
                currentTranslations = {};
                resolve();
            }
            document.head.removeChild(script);
        };
        script.onerror = (error) => {
            console.error(`Error loading translations for ${lang}:`, error);
            currentTranslations = {};
            resolve();
        };
        document.head.appendChild(script);
    });
}

// Guardar HTML original (español base) una sola vez
function snapshotOriginalI18n() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        if (!el.dataset.i18nOriginal) {
            el.dataset.i18nOriginal = (el.tagName.toLowerCase() === 'title') ? el.textContent : el.innerHTML;
        }
    });
}

// Function to apply translations to the page
async function setLanguage(lang) {
    await loadTranslations(lang); // Load translations for the selected language

    if (!currentTranslations) return;

    const isSpanishBase = (lang === 'es' && typeof translations_es === 'undefined');

    // 1. Traducir todos los elementos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (isSpanishBase) {
            // Restaurar contenido original en español guardado
            if (element.dataset.i18nOriginal) {
                if (element.tagName.toLowerCase() === 'title') {
                    element.textContent = element.dataset.i18nOriginal;
                } else {
                    element.innerHTML = element.dataset.i18nOriginal;
                }
            }
            return;
        }
        if (currentTranslations[key]) {
            if (element.tagName.toLowerCase() === 'title') {
                element.textContent = currentTranslations[key];
            } else {
                element.innerHTML = currentTranslations[key];
            }
        }
    });

    // 2. Actualizar la bandera seleccionada en el selector (assuming this logic is still needed)
    const flagUrl = getFlagImageUrl(lang);

    ['desktop', 'mobile'].forEach(scope => {
        const selector = document.getElementById(`language-selector-${scope}`);
        if (selector && flagUrl) {
            selector.style.backgroundImage = `url('${flagUrl}')`;
            selector.setAttribute('data-current-lang', lang);
        }
    });

    // 3. Guardar el idioma en el almacenamiento local para persistencia
    localStorage.setItem('bcdeXLang', lang);

    // 4. Actualizar el atributo lang del HTML
    document.documentElement.lang = lang;
}

// Function to get flag image URL (assuming this is still needed)
function getFlagImageUrl(lang) {
    const flagMap = {
        'es': 'img/españa.png',
        'en': 'img/usa.png',
        'pt-br': 'img/brasil.png'
    };
    return flagMap[lang] || '';
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    // --- Lógica del Menú Móvil ---
    if (mobileMenuButton && mobileMenu && menuIcon && closeIcon) {
      mobileMenuButton.addEventListener('click', () => {
          const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true' || false;
          mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
          mobileMenu.classList.toggle('hidden');
          menuIcon.classList.toggle('hidden');
          closeIcon.classList.toggle('hidden');
      });
    }

    // --- Lógica del Selector de Idioma (Delegación) ---
    const getLanguageContainers = () => document.querySelectorAll('.language-container');
    const closeAllDropdowns = () => {
        getLanguageContainers().forEach(container => {
            const dd = container.querySelector('.language-dropdown');
            if (dd) dd.classList.remove('active');
        });
    };

    // Abrir/cerrar dropdown al click en el selector
    document.addEventListener('click', (event) => {
        const selectorEl = event.target.closest('.language-selector');
        if (selectorEl) {
            event.stopPropagation();
            const container = selectorEl.closest('.language-container');
            const dropdown = container && container.querySelector('.language-dropdown');
            // Cerrar otros
            getLanguageContainers().forEach(other => {
                if (other !== container) {
                    const otherDd = other.querySelector('.language-dropdown');
                    if (otherDd) otherDd.classList.remove('active');
                }
            });
            if (dropdown) dropdown.classList.toggle('active');
            return;
        }

        // Selección de idioma
        const optionEl = event.target.closest('.language-option');
        if (optionEl) {
            const selectedLang = optionEl.getAttribute('data-lang');
            if (selectedLang) {
                setLanguage(selectedLang).catch(console.error);
                closeAllDropdowns();
                console.log('Idioma seleccionado:', selectedLang);
            }
            return;
        }

        // Click fuera: cerrar todos
        const insideContainer = event.target.closest('.language-container');
        if (!insideContainer) closeAllDropdowns();
    });

    // Inicializar selectores (si existe la función externa)
    if (typeof toggleDropdown === 'function') {
        toggleDropdown('language-selector-desktop', 'language-dropdown-desktop');
        toggleDropdown('language-selector-mobile', 'language-dropdown-mobile');
    }

    // --- Capturar originales y cargar idioma inicial ---
    snapshotOriginalI18n();
    const initialLang = localStorage.getItem('bcdeXLang') || 'es';
    setLanguage(initialLang); // Carga inicial

  } catch (e) {
    console.error('Error inicializando traducciones/selector:', e);
  }

  // Delegación de evento para el botón hamburguesa (robusto en todas las páginas)
  try {
    document.addEventListener('click', (event) => {
      const btn = event.target.closest('#mobile-menu-button');
      if (!btn) return;
      const mobileMenu = document.getElementById('mobile-menu');
      const menuIcon = document.getElementById('menu-icon');
      const closeIcon = document.getElementById('close-icon');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true' || false;
      btn.setAttribute('aria-expanded', String(!isExpanded));
      if (mobileMenu) mobileMenu.classList.toggle('hidden');
      if (menuIcon) menuIcon.classList.toggle('hidden');
      if (closeIcon) closeIcon.classList.toggle('hidden');
    });
  } catch (e) {
    console.error('Error vinculando manejador delegado del menú móvil:', e);
  }

  try {
    // Function of utility to copy text to clipboard
    function copyToClipboard(text, button) {
        try {
            // Create a temporary text area
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed'; // Avoid scrolling
            textarea.style.opacity = 0;
            document.body.appendChild(textarea);

            // Select and copy
            textarea.select();
            document.execCommand('copy');

            document.body.removeChild(textarea);

            // Visual feedback
            const originalText = button.innerHTML;
            button.innerHTML = '<svg data-lucide="check" class="w-4 h-4"></svg>';
            button.classList.add('bg-green-600', 'hover:bg-green-700');
            lucide.createIcons(); // Reload Lucide icon

            setTimeout(() => {
                button.innerHTML = '<svg data-lucide="copy" class="w-4 h-4"></svg>';
                button.classList.remove('bg-green-600', 'hover:bg-green-700');
                lucide.createIcons(); // Reload Lucide icon
            }, 1500);

        } catch (err) {
            console.error('Could not copy text: ', err);
        }
    }

    // Initialize copy buttons
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const codeBlock = event.currentTarget.closest('.code-block');
            const codeToCopy = codeBlock.getAttribute('data-code');
            copyToClipboard(codeToCopy, event.currentTarget);
        });
    });

    // Initialize Lucide icons
    lucide.createIcons();
  } catch (e) {
    console.error('Error inicializando utilidades/copiar/iconos:', e);
  }
});