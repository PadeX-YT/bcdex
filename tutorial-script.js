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
            const item = carousel.querySelector('.video-suggested-card, .video-card');
            if (!item) return;
            const gapStyle = getComputedStyle(carousel).gap;
            const gap = gapStyle ? parseFloat(gapStyle.replace('px', '')) : 20;
            const itemWidth = item.offsetWidth + gap;
            const scrollDistance = itemWidth;
            if (direction === 'next') {
                carousel.scrollBy({ left: scrollDistance, behavior: 'smooth' });
            } else if (direction === 'prev') {
                carousel.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
            }
        };

        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            scrollCarousel('next');
        });

        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            scrollCarousel('prev');
        });

        const checkScrollPosition = () => {
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;
            const isAtStart = carousel.scrollLeft <= 8;
            const isAtEnd = carousel.scrollLeft >= maxScroll - 8;

            prevButton.disabled = isAtStart;
            nextButton.disabled = isAtEnd;
            prevButton.style.opacity = isAtStart ? '0.35' : '1';
            prevButton.style.cursor = isAtStart ? 'not-allowed' : 'pointer';
            nextButton.style.opacity = isAtEnd ? '0.35' : '1';
            nextButton.style.cursor = isAtEnd ? 'not-allowed' : 'pointer';
        };

        carousel.addEventListener('scroll', checkScrollPosition, { passive: true });
        window.addEventListener('resize', checkScrollPosition);
        setTimeout(checkScrollPosition, 100);
    }

    lucide.createIcons();
});