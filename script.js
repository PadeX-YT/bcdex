document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true' || false;
            
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            
            if (mobileMenu) {
                mobileMenu.classList.toggle('hidden');
            }

            if (menuIcon) {
                menuIcon.classList.toggle('hidden');
            }
            if (closeIcon) {
                closeIcon.classList.toggle('hidden');
            }
        });
    }

    // Smooth-scroll: center any in-page anchor target (works on all pages)
    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href^="#"]');
        if (!link) return;
        const href = link.getAttribute('href');
        // Ignore just "#" (top) and empty
        if (!href || href === '#') return;
        const id = href.slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        event.preventDefault();
        const rect = target.getBoundingClientRect();
        const absoluteTop = rect.top + window.pageYOffset;
        const targetCenter = absoluteTop + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const scrollTop = Math.max(0, targetCenter - viewportCenter);
        window.scrollTo({ top: scrollTop, behavior: 'smooth' });
    });

});
