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

    const carousel = document.getElementById('suggested-videos-carousel');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    if (carousel && prevButton && nextButton) {
        const scrollCarousel = (direction) => {
            const item = carousel.querySelector('.video-card');
            if (!item) return;
            const gapStyle = getComputedStyle(carousel).gap;
            const gap = gapStyle ? parseFloat(gapStyle.replace('px', '')) : 0;
            const itemWidth = item.offsetWidth + gap;
            const scrollDistance = itemWidth;
            if (direction === 'next') {
                carousel.scrollBy({ left: scrollDistance, behavior: 'smooth' });
            } else if (direction === 'prev') {
                carousel.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
            }
        };

        nextButton.addEventListener('click', () => scrollCarousel('next'));
        prevButton.addEventListener('click', () => scrollCarousel('prev'));
        
        const checkScrollPosition = () => {
            const isAtStart = carousel.scrollLeft <= 1;
            const isAtEnd = (carousel.scrollLeft + carousel.clientWidth) >= (carousel.scrollWidth - 1);
            prevButton.disabled = isAtStart;
            nextButton.disabled = isAtEnd;
            prevButton.style.opacity = isAtStart ? '0.5' : '1';
            nextButton.style.opacity = isAtEnd ? '0.5' : '1';
        };

        carousel.addEventListener('scroll', checkScrollPosition);
        window.addEventListener('resize', checkScrollPosition);
        checkScrollPosition();
    }
    
    lucide.createIcons();
});