document.addEventListener('DOMContentLoaded', () => {

    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinksList = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
        navLinksList.classList.toggle('active');
        navToggle.querySelector('i').classList.toggle('fa-bars');
        navToggle.querySelector('i').classList.toggle('fa-times');
    });

    // Smooth Scroll for links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Lightbox Functionality
    let currentIndex = 0;
    let allImages = [];

    const createLightbox = () => {
        let lightbox = document.getElementById('lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <button class="lightbox-prev"><i class="fas fa-chevron-left"></i></button>
                    <img id="lightbox-img" src="" alt="Zoomed">
                    <button class="lightbox-next"><i class="fas fa-chevron-right"></i></button>
                    <button class="lightbox-close"><i class="fas fa-times"></i></button>
                </div>
            `;
            document.body.appendChild(lightbox);

            lightbox.addEventListener('click', e => {
                if (e.target.id === 'lightbox' || e.target.classList.contains('lightbox-close') || e.target.parentElement.classList.contains('lightbox-close')) {
                    lightbox.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });

            const prevBtn = lightbox.querySelector('.lightbox-prev');
            const nextBtn = lightbox.querySelector('.lightbox-next');

            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                changeImage(-1);
            });

            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                changeImage(1);
            });
        }
    };

    const changeImage = (dir) => {
        currentIndex += dir;
        if (currentIndex < 0) currentIndex = allImages.length - 1;
        if (currentIndex >= allImages.length) currentIndex = 0;

        const img = document.getElementById('lightbox-img');
        img.src = allImages[currentIndex].src;
    };

    const setupLightbox = () => {
        const imagesToClick = document.querySelectorAll('.galeri-item img, .menu-item-card img, .about-image img');
        allImages = Array.from(imagesToClick);
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');

        imagesToClick.forEach((image, index) => {
            image.style.cursor = 'zoom-in';
            image.addEventListener('click', () => {
                currentIndex = index;
                lightboxImg.src = image.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    };

    createLightbox();
    setupLightbox();

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') changeImage(-1);
            if (e.key === 'ArrowRight') changeImage(1);
            if (e.key === 'Escape') {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });

    // Refresh lightbox image list when filtering menu
    const refreshLightboxImages = () => {
        const imagesToClick = document.querySelectorAll('.galeri-item img, .menu-item-card img, .about-image img');
        const visibleImages = Array.from(imagesToClick).filter(img => {
            // Check if parent item is visible
            return img.closest('.menu-item-card')?.style.display !== 'none';
        });
        allImages = visibleImages;
    };

    // Menu Filtering Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const menuItems = document.querySelectorAll('.menu-item-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const target = btn.getAttribute('data-target');

            menuItems.forEach(item => {
                if (target === 'all') {
                    item.style.display = 'block';
                    // Re-trigger AOS for visible items
                    item.setAttribute('data-aos', 'fade-up');
                } else {
                    if (item.classList.contains(target)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });

            // Refresh AOS to handle visibility changes
            AOS.refresh();
            refreshLightboxImages();
        });
    });

});
