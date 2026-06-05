document.addEventListener('DOMContentLoaded', () => {

  // ═══ NAVBAR SCROLL EFFECT ═══
  const nav = document.getElementById('site-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // ═══ LENIS SMOOTH SCROLL ═══
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  });

  // Synchronize Lenis scrolling with GSAP's ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // GSAP will handle all scroll reveals to avoid CSS conflicts.

  // ═══ ANIMATED COUNTERS ═══
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      if (target === 0 || isNaN(target)) { counterObserver.unobserve(el); return; }
      let current = 0;
      const step = Math.max(1, Math.floor(target / 60));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current + suffix;
      }, 25);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  // ═══ FAQ ACCORDION ═══
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ═══ NEWSLETTER FORM ═══
  const form = document.getElementById('newsletter-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input) {
        input.value = '';
        input.placeholder = '✓ Subscribed! Welcome to the community.';
        setTimeout(() => { input.placeholder = 'Enter your email address'; }, 3000);
      }
    });
  }

  // ═══ GSAP SCROLL ANIMATIONS ═══
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      setTimeout(initGSAP, 150);
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // Generic reveal-up elements (that aren't staggered specific elements)
    gsap.utils.toArray('.reveal-up:not(.vm-card, .pillar-tile, .product-card, .cert-logo-item, .why-card, .dosage-item, .flavor-card, .stat-card, .review-card, .faq-item)').forEach(el => {
      gsap.fromTo(el, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }
      );
    });

    // Hero entrance
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      // Stagger main hero content children
      gsap.fromTo(heroContent.children, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out', delay: 0.1 }
      );
      
      // Trust badge items stagger
      gsap.fromTo('.hero-trust-item',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out', delay: 0.5 }
      );

      // Partner logos
      gsap.fromTo('.partner-logo-text',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: 'power2.out', delay: 0.7 }
      );

      // Hero Parallax
      gsap.to('.hero-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    // Vision & Mission cards
    gsap.fromTo('.vm-card', 
      { opacity: 0, y: 30, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.15, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.vision-section', start: 'top 85%', once: true } }
    );

    // Pillar tiles - staggered entrance
    gsap.fromTo('.pillar-tile', 
      { opacity: 0, y: 20, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: '.pillars-grid', start: 'top 90%', once: true } }
    );

    // Product cards
    gsap.fromTo('.product-card', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.products-section', start: 'top 85%', once: true } }
    );

    // Certification logos
    gsap.fromTo('.cert-logo-item', 
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: '.cert-section', start: 'top 90%', once: true } }
    );

    // Why cards
    gsap.fromTo('.why-card', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.why-section', start: 'top 85%', once: true } }
    );

    // Dosage items
    gsap.fromTo('.dosage-item', 
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, stagger: 0.15, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: '.ingredient-section', start: 'top 80%', once: true } }
    );

    // Flavor cards
    gsap.fromTo('.flavor-card', 
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, stagger: 0.15, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: '.flavors-section', start: 'top 85%', once: true } }
    );

    // Stats cards
    gsap.fromTo('.stat-card', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: '.stats-grid', start: 'top 90%', once: true } }
    );

    // Review cards
    gsap.fromTo('.review-card', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.reviews-section', start: 'top 85%', once: true } }
    );

    // Roadmap cards staggered reveal
    gsap.fromTo('.roadmap-card', 
      { opacity: 0, y: 30, filter: 'blur(5px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.08, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.roadmap-section', start: 'top 80%', once: true } }
    );

    // FAQ items
    gsap.fromTo('.faq-item', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: '.faq-section', start: 'top 90%', once: true } }
    );
  }

  setTimeout(initGSAP, 300);

  // ═══ SMOOTH SCROLL FOR ANCHOR LINKS ═══
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ═══ MAGNETIC BUTTONS ═══
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  });

  // ═══ 3D TILT ON PRODUCT CARDS ═══
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -4; // Max 4 deg tilt
      const rotateY = ((x - centerX) / centerX) * 4;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });



  // ═══ PRODUCT DETAIL INTERACTIVITY ═══
  
  // Flavor Selection
  const flavorBtns = document.querySelectorAll('.pd-flavor-btn');
  if (flavorBtns.length > 0) {
    flavorBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Remove active class from siblings in the same grid
        const grid = e.target.closest('.pd-flavor-grid');
        grid.querySelectorAll('.pd-flavor-btn').forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        e.target.classList.add('active');
      });
    });
  }

  // Quantity Selector
  const qtyContainers = document.querySelectorAll('.pd-qty');
  if (qtyContainers.length > 0) {
    qtyContainers.forEach(container => {
      const minusBtn = container.querySelector('.pd-qty-btn:first-child');
      const plusBtn = container.querySelector('.pd-qty-btn:last-child');
      const input = container.querySelector('.pd-qty-input');

      minusBtn.addEventListener('click', () => {
        let val = parseInt(input.value);
        if (val > 1) {
          input.value = val - 1;
        }
      });

      plusBtn.addEventListener('click', () => {
        let val = parseInt(input.value);
        if (val < 99) {
          input.value = val + 1;
        }
      });
    });
  }

  // ═══ CURSOR SPOTLIGHT TRACKING ═══
  const handleMouseMove = (e) => {
    const selector = '.spotlight-card, .vm-card, .pillar-tile, .product-card, .why-card, .stat-card, .roadmap-card';
    const cardsToGlow = document.querySelectorAll(selector);
    cardsToGlow.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  };
  document.addEventListener('mousemove', handleMouseMove);

  // ═══ INTERACTIVE ROADMAP CONTROLLER ═══
  const roadmapWrapper = document.querySelector('.roadmap-scroll-wrapper');
  const roadmapPrevBtn = document.querySelector('.roadmap-section .btn-prev');
  const roadmapNextBtn = document.querySelector('.roadmap-section .btn-next');
  const roadmapNavBtns = document.querySelectorAll('.roadmap-nav-btn');
  const roadmapCards = document.querySelectorAll('.roadmap-card');

  if (roadmapWrapper && roadmapPrevBtn && roadmapNextBtn) {
    const scrollAmount = 364; // card width (340) + gap (24)
    roadmapPrevBtn.addEventListener('click', () => {
      roadmapWrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    roadmapNextBtn.addEventListener('click', () => {
      roadmapWrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  if (roadmapNavBtns.length > 0 && roadmapCards.length > 0 && typeof gsap !== 'undefined') {
    roadmapNavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        roadmapNavBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedYear = btn.dataset.year;

        roadmapCards.forEach(card => {
          const cardYear = card.dataset.year;
          if (selectedYear === 'all' || cardYear === selectedYear) {
            gsap.to(card, { 
              display: 'flex', 
              opacity: 1, 
              scale: 1, 
              duration: 0.4, 
              ease: 'power2.out',
              clearProps: 'transform' // Avoid overriding hover styles
            });
          } else {
            gsap.to(card, { 
              display: 'none', 
              opacity: 0, 
              scale: 0.95, 
              duration: 0.3, 
              ease: 'power2.in' 
            });
          }
        });
      });
    });
  }

  // ═══ PRODUCT PAGE INTERACTIONS ═══
  // Flavor Chips
  const flavorChips = document.querySelectorAll('.pd-chip');
  if (flavorChips.length > 0) {
    const flavorText = document.querySelector('.pd-flavor-text span');
    flavorChips.forEach(chip => {
      chip.addEventListener('click', () => {
        flavorChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        if (flavorText) {
          flavorText.textContent = chip.textContent;
        }
      });
    });
  }

  // Purchase Cards (One-time vs Subscribe)
  const purchaseCards = document.querySelectorAll('.pd-card-opt');
  if (purchaseCards.length > 0) {
    purchaseCards.forEach(card => {
      card.addEventListener('click', () => {
        purchaseCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });
  }

  // Quantity Box
  const qtyBox = document.querySelector('.pd-qty-box');
  if (qtyBox) {
    const qtyInput = qtyBox.querySelector('input');
    const btns = qtyBox.querySelectorAll('button');
    if (qtyInput && btns.length === 2) {
      btns[0].addEventListener('click', () => {
        let val = parseInt(qtyInput.value) || 1;
        if (val > 1) qtyInput.value = val - 1;
      });
      btns[1].addEventListener('click', () => {
        let val = parseInt(qtyInput.value) || 1;
        if (val < 99) qtyInput.value = val + 1;
      });
    }
  }

  // ═══ AUTO-SLIDING PRODUCT GALLERY ═══
  const thumbnailsContainer = document.querySelector('.pd-thumbnails');
  if (thumbnailsContainer) {
    const thumbs = Array.from(thumbnailsContainer.querySelectorAll('.pd-thumb'));
    if (thumbs.length > 1) {
      let autoSlideInterval;
      
      const startAutoSlide = () => {
        autoSlideInterval = setInterval(() => {
          let currentIndex = thumbs.findIndex(t => t.classList.contains('active'));
          if (currentIndex === -1) currentIndex = 0;
          let nextIndex = (currentIndex + 1) % thumbs.length;
          thumbs[nextIndex].click();
        }, 4000); // 4 seconds
      };

      startAutoSlide();

      // Optional: Pause on hover so the user can look at the image
      const galleryCol = document.querySelector('.pd-gallery-col');
      if (galleryCol) {
        galleryCol.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        galleryCol.addEventListener('mouseleave', startAutoSlide);
      }
    }
  }

});
