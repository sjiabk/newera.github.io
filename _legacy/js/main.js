document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const navToggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');
    const navLinks = document.querySelectorAll('.nav__link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            navToggle.classList.toggle('active');

            // Animate hamburger to X
            const spans = navToggle.querySelectorAll('span');
            if (navList.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                navToggle.classList.remove('active');
                // Reset hamburger
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });

    // Carousel Logic
    const track = document.querySelector('.carousel__track');

    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel__btn--next');
        const prevButton = document.querySelector('.carousel__btn--prev');
        const dotsNav = document.querySelector('.carousel__nav');
        const dots = Array.from(dotsNav.children);

        const slideWidth = slides[0].getBoundingClientRect().width;

        // Arrange the slides next to one another
        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        slides.forEach(setSlidePosition);

        const moveToSlide = (track, currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };

        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('current-slide');
            targetDot.classList.add('current-slide');
        };

        // When I click left, move slides to the left
        prevButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const prevSlide = currentSlide.previousElementSibling;
            const currentDot = dotsNav.querySelector('.current-slide');
            const prevDot = currentDot.previousElementSibling;

            if (prevSlide) {
                moveToSlide(track, currentSlide, prevSlide);
                updateDots(currentDot, prevDot);
            } else {
                // Loop to last
                const lastSlide = slides[slides.length - 1];
                const lastDot = dots[dots.length - 1];
                moveToSlide(track, currentSlide, lastSlide);
                updateDots(currentDot, lastDot);
            }
        });

        // When I click right, move slides to the right
        nextButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const nextSlide = currentSlide.nextElementSibling;
            const currentDot = dotsNav.querySelector('.current-slide');
            const nextDot = currentDot.nextElementSibling;

            if (nextSlide) {
                moveToSlide(track, currentSlide, nextSlide);
                updateDots(currentDot, nextDot);
            } else {
                // Loop to first
                const firstSlide = slides[0];
                const firstDot = dots[0];
                moveToSlide(track, currentSlide, firstSlide);
                updateDots(currentDot, firstDot);
            }
        });

        // When I click the nav indicators, move to that slide
        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('button');

            if (!targetDot) return;

            const currentSlide = track.querySelector('.current-slide');
            const currentDot = dotsNav.querySelector('.current-slide');
            const targetIndex = dots.findIndex(dot => dot === targetDot);
            const targetSlide = slides[targetIndex];

            moveToSlide(track, currentSlide, targetSlide);
            updateDots(currentDot, targetDot);
        });
    }

    // Form Submission (WhatsApp)
    const form = document.getElementById('feedback-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;

            const whatsappNumber = '79990000000'; // Replace with real number
            const text = `Здравствуйте! Меня зовут ${name}. Мой телефон: ${phone}. Сообщение: ${message}`;

            const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

            window.open(url, '_blank');
        });
    }

    // Render Products in Catalog
    const renderProducts = () => {
        const grids = {
            health: document.getElementById('health-grid'),
            beauty: document.getElementById('beauty-grid'),
            hygiene: document.getElementById('hygiene-grid'),
            home: document.getElementById('home-grid')
        };

        // Check if we are on the catalog page
        if (!grids.health) return;

        products.forEach(product => {
            const grid = grids[product.category];
            if (grid) {
                const card = document.createElement('article');
                card.className = 'card';
                card.innerHTML = `
                <div class="card__image-wrapper">
                    <img src="${product.image}" alt="${product.title}" class="card__image">
                </div>
                <h3 class="card__title">${product.title}</h3>
                <p class="card__desc">${product.description}</p>
                <div style="padding: 0 1rem 1rem; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="font-weight: bold; color: var(--color-primary);">${product.price.toLocaleString('ru-RU')} ₽</span>
                        <span class="card__pv">${product.pv} PV</span>
                    </div>
                    <a href="product.html?id=${product.id}" class="btn btn--primary" style="padding: 8px 20px; font-size: 0.9rem;">Подробнее</a>
                </div>
            `;
                grid.appendChild(card);
            }
        });
    };

    renderProducts();

    // Render Product Details
    const renderProductDetails = () => {
        const productContainer = document.getElementById('product-container');
        if (!productContainer) return;

        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        const product = products.find(p => p.id === productId);

        if (!product) {
            productContainer.innerHTML = '<p>Товар не найден. <a href="catalog.html">Вернуться в каталог</a></p>';
            return;
        }

        // Update Title and Meta
        document.title = `${product.title} - New Era`;
        document.querySelector('meta[name="description"]').content = product.description;

        // Populate Elements
        document.getElementById('p-image').src = product.image;
        document.getElementById('p-image').alt = product.title;
        document.getElementById('p-title').textContent = product.title;
        document.getElementById('p-price').textContent = `${product.price.toLocaleString('ru-RU')} ₽`;
        document.getElementById('p-pv').textContent = `${product.pv} PV`;
        document.getElementById('p-description').textContent = product.fullDescription || product.description;
        document.getElementById('p-composition').textContent = product.composition;
        document.getElementById('p-usage').textContent = product.usage;

        // Properties List
        const propertiesList = document.getElementById('p-properties');
        propertiesList.innerHTML = '';
        if (product.properties && product.properties.length > 0) {
            product.properties.forEach(prop => {
                const li = document.createElement('li');
                li.textContent = prop;
                propertiesList.appendChild(li);
            });
        }

        // WhatsApp Link
        const whatsappBtn = document.getElementById('whatsapp-link');
        const message = `Здравствуйте! Я хочу заказать: ${product.title}`;
        whatsappBtn.href = `https://wa.me/79990000000?text=${encodeURIComponent(message)}`; // Replace with real number later
    };

    renderProductDetails();

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            // Check if target exists on this page
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80; // Adjust based on header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    navToggle.classList.remove('active');
                    const spans = navToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });
    });
});
