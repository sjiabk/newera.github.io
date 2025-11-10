
document.addEventListener('DOMContentLoaded', function() {
  // Mobile Navigation Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileToggle) {
    mobileToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      const isOpen = navLinks.classList.contains('active');
      mobileToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
  }
  
// Header Scroll Effect + hide-on-scroll for mobile
const header = document.querySelector('.header');
if (header) {
  const MOBILE_MAX_WIDTH = 1023; // <1024px — мобильные
  let lastScroll = window.pageYOffset || document.documentElement.scrollTop;
  let ticking = false;
  const THRESHOLD = 10;

  function onScroll() {
    const current = window.pageYOffset || document.documentElement.scrollTop;

    // класс .scrolled по вашей логике (например тень/фон после 50px)
    if (current > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    // поведение скрытия только на мобильных
    if (window.innerWidth <= MOBILE_MAX_WIDTH) {
      const delta = current - lastScroll;
      if (Math.abs(delta) > THRESHOLD) {
        if (delta > 0 && current > 50) {
          // скролл вниз — скрываем
          header.classList.add('header-hidden');
        } else if (delta < 0) {
          // скролл вверх — показываем
          header.classList.remove('header-hidden');
        }
      }
    } else {
      // на десктопе всегда показываем
      header.classList.remove('header-hidden');
    }

    lastScroll = current <= 0 ? 0 : current;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > MOBILE_MAX_WIDTH) header.classList.remove('header-hidden');
  });
}

  // Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
      
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Scroll Animation
  const fadeElements = document.querySelectorAll('.fade-in');
  
  function checkFade() {
    fadeElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;
      
      if (elementTop < window.innerHeight - 100 && elementBottom > 0) {
        element.classList.add('active');
      }
    });
  }
  
  // Initial check
  checkFade();
  
  // Check on scroll
  window.addEventListener('scroll', checkFade);
  
  // Back to Top Button
  const backToTopButton = document.querySelector('.back-to-top');
  
  if (backToTopButton) {
    // Show button when user scrolls down 300px from the top
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('active');
      } else {
        backToTopButton.classList.remove('active');
      }
    });
    
    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Testimonial Slider
  const sliderContainer = document.querySelector('.testimonial-slider');
  
  if (sliderContainer) {
    const testimonials = sliderContainer.querySelectorAll('.testimonial-item');
    let currentIndex = 0;
    
    // Create navigation dots
    const dotsContainer = document.createElement('div');
    dotsContainer.classList.add('slider-dots');
    
    testimonials.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.classList.add('slider-dot');
      if (index === 0) dot.classList.add('active');
      
      dot.addEventListener('click', () => {
        goToSlide(index);
      });
      
      dotsContainer.appendChild(dot);
    });
    
    sliderContainer.appendChild(dotsContainer);
    
    // Hide all testimonials except the first one
    testimonials.forEach((testimonial, index) => {
      if (index !== 0) {
        testimonial.style.display = 'none';
      }
    });
    
    // Auto slide
    const autoSlide = setInterval(() => {
      nextSlide();
    }, 5000);
    
    // Navigation functions
    function goToSlide(index) {
      testimonials[currentIndex].style.display = 'none';
      dotsContainer.children[currentIndex].classList.remove('active');
      
      currentIndex = index;
      
      testimonials[currentIndex].style.display = 'block';
      dotsContainer.children[currentIndex].classList.add('active');
    }
    
    function nextSlide() {
      const nextIndex = (currentIndex + 1) % testimonials.length;
      goToSlide(nextIndex);
    }
    
    function prevSlide() {
      const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
      goToSlide(prevIndex);
    }
    
    // Create prev/next buttons
    const prevButton = document.createElement('button');
    prevButton.classList.add('slider-btn', 'slider-btn-prev');
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.addEventListener('click', prevSlide);
    
    const nextButton = document.createElement('button');
    nextButton.classList.add('slider-btn', 'slider-btn-next');
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.addEventListener('click', nextSlide);
    
    sliderContainer.appendChild(prevButton);
    sliderContainer.appendChild(nextButton);
    
    // Pause auto slide on hover
    sliderContainer.addEventListener('mouseenter', () => {
      clearInterval(autoSlide);
    });
  }
  
  // Form Validation
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      
      // Simple validation
      if (!nameInput.value.trim()) {
        markInvalid(nameInput, 'Name is required');
        isValid = false;
      } else {
        markValid(nameInput);
      }
      
      if (!emailInput.value.trim()) {
        markInvalid(emailInput, 'Email is required');
        isValid = false;
      } else if (!isValidEmail(emailInput.value)) {
        markInvalid(emailInput, 'Please enter a valid email');
        isValid = false;
      } else {
        markValid(emailInput);
      }
      
      if (!messageInput.value.trim()) {
        markInvalid(messageInput, 'Message is required');
        isValid = false;
      } else {
        markValid(messageInput);
      }
      
      if (isValid) {
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        setTimeout(() => {
          contactForm.innerHTML = '<div class="alert alert-success">Thank you for your message! We will get back to you shortly.</div>';
        }, 1500);
      }
    });
    
    function markInvalid(input, message) {
      input.classList.add('is-invalid');
      
      let errorDiv = input.nextElementSibling;
      if (!errorDiv || !errorDiv.classList.contains('invalid-feedback')) {
        errorDiv = document.createElement('div');
        errorDiv.classList.add('invalid-feedback');
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
      }
      
      errorDiv.textContent = message;
    }
    
    function markValid(input) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      
      const errorDiv = input.nextElementSibling;
      if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
        errorDiv.textContent = '';
      }
    }
    
    function isValidEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email.toLowerCase());
    }
  }
  
  // Project Filtering
  const projectFilters = document.querySelector('.project-filters');
  
  if (projectFilters) {
    const filterBtns = projectFilters.querySelectorAll('button');
    const projects = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        // Filter projects
        projects.forEach(project => {
          if (filter === 'all') {
            project.style.display = 'block';
          } else {
            if (project.classList.contains(filter)) {
              project.style.display = 'block';
            } else {
              project.style.display = 'none';
            }
          }
        });
      });
    });
  }

  // Counter Animation
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const step = Math.ceil(target / (duration / 16)); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      el.textContent = current;
      
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      }
    }, 16);
  }
  
  // Initialize counters when they come into view
  const counters = document.querySelectorAll('.counter');
  
  if (counters.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
      observer.observe(counter);
    });
  }
}); 