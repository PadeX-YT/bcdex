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

    // If page loads with a hash, center the target after layout is ready
    try {
        if (location.hash && location.hash.length > 1) {
            const id = decodeURIComponent(location.hash.slice(1));
            const target = document.getElementById(id);
            if (target) {
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 75);
            }
        }
    } catch {}

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
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // Modal functionality for images
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-image");
    const captionText = document.getElementById("modal-caption");
    const closeButton = document.getElementsByClassName("modal-close-button")[0];

    document.querySelectorAll('.blog-image-center a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent opening image in new tab
            modal.style.display = "block";
            modalImg.src = this.href;
            captionText.innerHTML = this.querySelector('img').alt;
        });
    });

    if (closeButton) {
        closeButton.addEventListener('click', function() {
            modal.style.display = "none";
        });
    }

    // Close modal when clicking outside the image
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    }
});