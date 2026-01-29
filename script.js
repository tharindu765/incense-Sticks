/**
 * Aura Incense - Premium Incense Brand Website
 * JavaScript for interactions and animations
 */

(function () {
  'use strict';

  // ========== ACTIVE LINK HIGHLIGHTING & SCROLL SPY ==========
  const sections = document.querySelectorAll('.scroll-section');
  const navLinks = document.querySelectorAll('.nav__link');

  const navObserverOptions = {
    threshold: 0.5 // Trigger when 50% visible
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove active class from all
        navLinks.forEach(link => link.classList.remove('active'));

        // Add active class to corresponding link
        const id = entry.target.getAttribute('id');
        const activeLink = document.querySelector(`.nav__link[href="#${id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }, navObserverOptions);

  sections.forEach(section => {
    navObserver.observe(section);
  });

  // ========== THEME TOGGLE ==========
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = document.querySelector('.theme-icon-sun');
  const moonIcon = document.querySelector('.theme-icon-moon');

  // Body transition helper to prevent flash
  document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';

  // Function to Apply Theme
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (theme === 'dark') {
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
      if (themeToggle) themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
      if (themeToggle) themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  // Check for saved theme
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Set initial theme
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // ========== HEADER SCROLL EFFECT ==========
  const header = document.getElementById('header');
  let lastScrollY = 0;

  function handleHeaderScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========== TESTIMONIAL CAROUSEL ==========
  const carousel = document.getElementById('testimonialCarousel');
  const dots = document.querySelectorAll('.testimonials__dot');
  const testimonials = carousel ? carousel.querySelectorAll('.testimonial-card') : [];
  let currentIndex = 0;
  let autoplayInterval;

  function showTestimonial(index) {
    // Hide all testimonials
    testimonials.forEach((testimonial, i) => {
      testimonial.style.display = 'none';
      testimonial.style.opacity = '0';
    });

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('testimonials__dot--active', i === index);
      dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    // Show current testimonial with fade effect
    if (testimonials[index]) {
      testimonials[index].style.display = 'block';
      // Trigger reflow for animation
      testimonials[index].offsetHeight;
      testimonials[index].style.opacity = '1';
      testimonials[index].style.transition = 'opacity 0.5s ease';
    }

    currentIndex = index;
  }

  function nextTestimonial() {
    const nextIndex = (currentIndex + 1) % testimonials.length;
    showTestimonial(nextIndex);
  }

  function startAutoplay() {
    autoplayInterval = setInterval(nextTestimonial, 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  // Initialize carousel
  if (testimonials.length > 0) {
    showTestimonial(0);
    startAutoplay();

    // Dot click handlers
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        stopAutoplay();
        showTestimonial(index);
        startAutoplay();
      });
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
  }

  // ========== SCROLL-TRIGGERED ANIMATIONS ==========
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });

  // ========== MOBILE MENU TOGGLE ==========
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.querySelector('.nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      nav.classList.toggle('nav--open');

      // Animate hamburger
      menuToggle.classList.toggle('menu-toggle--active');
    });
  }

  // ========== GSAP HERO ANIMATION ==========
  gsap.registerPlugin(ScrollTrigger);

  const canvas = document.getElementById("hero-canvas");
  const context = canvas ? canvas.getContext("2d") : null;
  const loader = document.getElementById("hero-loader");
  const heroSection = document.querySelector(".hero-canvas-container");

  // Image sequence configuration
  const frameCount = 80;
  const currentFrame = { index: 0 };
  const images = [];
  const imagePath = (index) =>
    `.agent/hero/animation-images/Smooth_ritual_transition_1080p_202601290923_${index.toString().padStart(3, '0')}.jpg`;

  // Preload images
  function preloadImages() {
    let loadedCount = 0;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = imagePath(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          if (loader) loader.classList.add("hidden");
          startAnimation();
        }
      };
      images.push(img);
    }
  }

  function render() {
    if (!context || !canvas) return;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw current frame image covering the canvas (object-fit: cover equivalent)
    const img = images[currentFrame.index];
    if (img) {
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);

      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;

      context.drawImage(
        img,
        0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
      );
    }
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
  }

  function startAnimation() {
    if (!canvas || !heroSection) return;

    // Initial render
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // GSAP Timeline triggered by scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "+=3000", // Scroll distance of 3000px to play animation
        scrub: 0.5, // Smooth scrubbing
        pin: true, // Pin the hero section during animation
        anticipatePin: 1
      },
      onUpdate: render // Render on every frame update
    });

    // Animate the frame index
    tl.to(currentFrame, {
      index: frameCount - 1,
      ease: "none",
      snap: "index", // Snap to integer frame index
      duration: 1
    });

    // Parallax effects for text content
    // We want the text to fade out or move up as we scroll deep into the animation
    gsap.to(".hero__content", {
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "+=1000",
        scrub: true
      },
      y: -100,
      opacity: 0,
      ease: "power2.in"
    });

    // Hide scroll instruction
    gsap.to(".scroll-instruction", {
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "+=200",
        scrub: true
      },
      opacity: 0
    });
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canvas && !prefersReducedMotion) {
    preloadImages();
  } else if (canvas && prefersReducedMotion) {
    // Fallback: Just load the last frame (glowing smoke) or first frame
    // For reduced motion, we might just want to show a nice static image
    // Let's load the last frame which should be the "glowing smoke"
    const img = new Image();
    img.src = imagePath(frameCount - 1);
    img.onload = () => {
      images[frameCount - 1] = img; // Put it in the array slots
      currentFrame.index = frameCount - 1;
      if (loader) loader.classList.add("hidden");
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
    };
  }

  // ========== PRELOADER (Optional Enhancement) ==========
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

})();
