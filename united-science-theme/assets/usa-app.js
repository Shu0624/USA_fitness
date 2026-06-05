/* ════════════════════════════════════════════════════════════════
   USA SUPPLEMENT — SHOPIFY THEME JS
   Production-ready with Shopify Theme Editor lifecycle management
   GSAP + Lenis + AJAX Cart + Variant Picker
   ════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ──────────────────────────────────────
     ACCESSIBILITY: Respect reduced motion
     ────────────────────────────────────── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ──────────────────────────────────────
     LENIS SMOOTH SCROLL (conditional)
     ────────────────────────────────────── */
  let lenis = null;

  function initLenis() {
    if (typeof Lenis === 'undefined' || prefersReducedMotion) return;
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });

      if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
      } else {
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
      }
    } catch (e) {
      console.warn('Lenis init failed:', e);
    }
  }

  /* ──────────────────────────────────────
     NAVBAR SCROLL EFFECT
     ────────────────────────────────────── */
  function initNavbar() {
    const nav = document.getElementById('site-nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ──────────────────────────────────────
     GSAP SCROLL ANIMATIONS (scoped)
     Accepts optional scope element for
     Shopify Theme Editor section reload
     ────────────────────────────────────── */
  function initAnimations(scope) {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = scope || document;

    // Generic reveal-up elements
    gsap.utils.toArray(
      '.reveal-up:not(.vm-card, .pillar-tile, .product-card, .cert-logo-item, .why-card, .dosage-item, .flavor-card, .stat-card, .review-card, .faq-item)',
      ctx
    ).forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true } }
      );
    });

    // Hero entrance (only on initial load, not section reload)
    const heroContent = ctx.querySelector ? ctx.querySelector('.hero-content') : document.querySelector('.hero-content');
    if (heroContent && !scope) {
      gsap.fromTo(heroContent.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out', delay: 0.1 }
      );
      gsap.fromTo('.hero-trust-item',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out', delay: 0.5 }
      );
      gsap.fromTo('.partner-logo-text',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: 'power2.out', delay: 0.7 }
      );
      gsap.to('.hero-bg', {
        yPercent: 30, ease: 'none',
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    // Section-specific staggered animations
    const sectionAnimations = [
      { sel: '.vm-card', trigger: '.vision-section', props: { y: 30, scale: 0.98 }, to: { scale: 1 } },
      { sel: '.pillar-tile', trigger: '.pillars-grid', props: { y: 20, scale: 0.98 }, to: { scale: 1 }, stagger: 0.08, dur: 0.6 },
      { sel: '.product-card', trigger: '.products-section', props: { y: 30 } },
      { sel: '.cert-logo-item', trigger: '.cert-section', props: { x: -20 }, dur: 0.6, stagger: 0.1 },
      { sel: '.why-card', trigger: '.why-section', props: { y: 30 } },
      { sel: '.dosage-item', trigger: '.ingredient-section', props: { x: -20 }, dur: 0.6 },
      { sel: '.flavor-card', trigger: '.flavors-section', props: { scale: 0.95 }, to: { scale: 1 }, dur: 0.6 },
      { sel: '.stat-card', trigger: '.stats-grid', props: { y: 20 }, dur: 0.6 },
      { sel: '.review-card', trigger: '.reviews-section', props: { y: 30 } },
      { sel: '.roadmap-card', trigger: '.roadmap-section', props: { y: 30, filter: 'blur(5px)' }, to: { filter: 'blur(0px)' }, stagger: 0.08 },
      { sel: '.faq-item', trigger: '.faq-section', props: { y: 20 }, dur: 0.5, stagger: 0.1 }
    ];

    sectionAnimations.forEach(anim => {
      const elements = ctx.querySelectorAll ? ctx.querySelectorAll(anim.sel) : document.querySelectorAll(anim.sel);
      const triggerEl = ctx.querySelector ? ctx.querySelector(anim.trigger) : document.querySelector(anim.trigger);
      if (elements.length === 0 || !triggerEl) return;

      const fromProps = { opacity: 0, ...anim.props };
      const toProps = {
        opacity: 1, x: 0, y: 0,
        ...(anim.to || {}),
        stagger: anim.stagger || 0.15,
        duration: anim.dur || 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: triggerEl, start: 'top 85%', once: true }
      };

      gsap.fromTo(elements, fromProps, toProps);
    });
  }

  /* ──────────────────────────────────────
     ANIMATED COUNTERS (scoped)
     ────────────────────────────────────── */
  function initCounters(scope) {
    const ctx = scope || document;
    const counters = ctx.querySelectorAll('.stat-number[data-target], .vm-stat-number[data-target]');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        if (isNaN(target)) { observer.unobserve(el); return; }

        let current = 0;
        el.textContent = '0' + suffix;

        const duration = 1500; // 1.5s animation duration
        const frameRate = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameRate);
        let frame = 0;

        const timer = setInterval(() => {
          frame++;
          const progress = frame / totalFrames;
          const easeProgress = progress * (2 - progress); // Ease out quad
          current = Math.round(easeProgress * target);

          if (frame >= totalFrames) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current + suffix;
        }, frameRate);

        observer.unobserve(el);
      });
    }, { threshold: 0.1 });

    counters.forEach(c => observer.observe(c));
  }

  /* ──────────────────────────────────────
     FAQ ACCORDION (scoped)
     ────────────────────────────────────── */
  function initFAQ(scope) {
    const ctx = scope || document;
    ctx.querySelectorAll('.faq-q').forEach(btn => {
      // Avoid duplicate listeners by checking a flag
      if (btn.dataset.bound) return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const wasOpen = item.classList.contains('open');
        // Close all FAQ items in this section
        item.closest('.faq-list').querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      });
    });
  }

  /* ──────────────────────────────────────
     ROADMAP CONTROLLER (scoped)
     ────────────────────────────────────── */
  function initRoadmap(scope) {
    const ctx = scope || document;
    const wrapper = ctx.querySelector('.roadmap-scroll-wrapper');
    const prevBtn = ctx.querySelector('.roadmap-section .btn-prev');
    const nextBtn = ctx.querySelector('.roadmap-section .btn-next');
    const navBtns = ctx.querySelectorAll('.roadmap-nav-btn');
    const cards = ctx.querySelectorAll('.roadmap-card');

    if (wrapper && prevBtn && nextBtn) {
      const scrollAmount = 364;
      prevBtn.addEventListener('click', () => wrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
      nextBtn.addEventListener('click', () => wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
    }

    if (navBtns.length > 0 && cards.length > 0) {
      navBtns.forEach(btn => {
        if (btn.dataset.bound) return;
        btn.dataset.bound = 'true';
        btn.addEventListener('click', () => {
          navBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const selectedYear = btn.dataset.year;

          cards.forEach(card => {
            const cardYear = card.dataset.year;
            const show = (selectedYear === 'all' || cardYear === selectedYear);
            if (typeof gsap !== 'undefined') {
              gsap.to(card, show
                ? { display: 'flex', opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out', clearProps: 'transform' }
                : { display: 'none', opacity: 0, scale: 0.95, duration: 0.3, ease: 'power2.in' }
              );
            } else {
              card.style.display = show ? 'flex' : 'none';
            }
          });
        });
      });
    }
  }

  /* ──────────────────────────────────────
     PRODUCT GALLERY — Auto-slider (scoped)
     ────────────────────────────────────── */
  function initProductGallery(scope) {
    const ctx = scope || document;
    const thumbnailsContainer = ctx.querySelector('.pd-thumbnails');
    if (!thumbnailsContainer) return;

    const thumbs = Array.from(thumbnailsContainer.querySelectorAll('.pd-thumb'));
    if (thumbs.length <= 1) return;

    let autoSlideInterval;

    const startAutoSlide = () => {
      autoSlideInterval = setInterval(() => {
        let currentIndex = thumbs.findIndex(t => t.classList.contains('active'));
        if (currentIndex === -1) currentIndex = 0;
        let nextIndex = (currentIndex + 1) % thumbs.length;
        thumbs[nextIndex].click();
      }, 4000);
    };

    startAutoSlide();

    const galleryCol = ctx.querySelector('.pd-gallery-col');
    if (galleryCol) {
      galleryCol.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
      galleryCol.addEventListener('mouseleave', startAutoSlide);
    }

    // Store interval reference for cleanup on section unload
    if (scope) scope.__autoSlideInterval = autoSlideInterval;
  }

  /* ──────────────────────────────────────
     PRODUCT VARIANT PICKER
     Wires flavor/option buttons to
     Shopify variant IDs and AJAX Cart
     ────────────────────────────────────── */
  function initVariantPicker(scope) {
    const ctx = scope || document;
    const flavorBtns = ctx.querySelectorAll('.pd-flavor-btn');
    if (flavorBtns.length === 0) return;

    flavorBtns.forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', (e) => {
        const grid = e.target.closest('.pd-flavor-grid');
        grid.querySelectorAll('.pd-flavor-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        // Build selected options and find matching Shopify variant
        updateVariantFromOptions(ctx);
      });
    });
  }

  function updateVariantFromOptions(ctx) {
    const form = ctx.querySelector('.pd-form');
    if (!form) return;

    // Collect all selected option values
    const selectedOptions = [];
    ctx.querySelectorAll('.pd-option-group').forEach(group => {
      const activeBtn = group.querySelector('.pd-flavor-btn.active');
      if (activeBtn) selectedOptions.push(activeBtn.dataset.optionValue);
    });

    // Find matching variant from the product JSON (if available)
    const productJSON = ctx.querySelector('[data-product-json]');
    if (productJSON) {
      try {
        const product = JSON.parse(productJSON.textContent);
        const matchingVariant = product.variants.find(v => {
          return selectedOptions.every((opt, i) => v.options[i] === opt);
        });
        if (matchingVariant) {
          form.querySelector('input[name="id"]').value = matchingVariant.id;
          // Update price display
          const priceEl = ctx.querySelector('.pd-price');
          if (priceEl) priceEl.textContent = formatMoney(matchingVariant.price);
          // Update compare-at price
          const compareEl = ctx.querySelector('.pd-compare-price');
          if (compareEl) {
            if (matchingVariant.compare_at_price > matchingVariant.price) {
              compareEl.innerHTML = '<s>' + formatMoney(matchingVariant.compare_at_price) + '</s>';
              compareEl.style.display = '';
            } else {
              compareEl.style.display = 'none';
            }
          }
          // Update button state
          const addBtn = ctx.querySelector('.pd-add-btn');
          if (addBtn) {
            if (matchingVariant.available) {
              addBtn.disabled = false;
              addBtn.textContent = 'Add to Cart — ' + formatMoney(matchingVariant.price);
            } else {
              addBtn.disabled = true;
              addBtn.textContent = 'Sold Out';
            }
          }
        }
      } catch (e) {
        console.warn('Variant update failed:', e);
      }
    }
  }

  function formatMoney(cents) {
    // Shopify stores prices in cents (or paise for INR)
    return '₹' + (cents / 100).toFixed(2).replace(/\.00$/, '');
  }

  /* ──────────────────────────────────────
     QUANTITY SELECTOR (scoped)
     ────────────────────────────────────── */
  function initQuantitySelector(scope) {
    const ctx = scope || document;
    ctx.querySelectorAll('.pd-qty').forEach(container => {
      const btns = container.querySelectorAll('.pd-qty-btn');
      const input = container.querySelector('.pd-qty-input');
      if (!input || btns.length < 2) return;

      btns.forEach(btn => {
        if (btn.dataset.bound) return;
        btn.dataset.bound = 'true';
        btn.addEventListener('click', () => {
          let val = parseInt(input.value) || 1;
          if (btn.dataset.action === 'decrease' && val > 1) input.value = val - 1;
          if (btn.dataset.action === 'increase' && val < 99) input.value = val + 1;
        });
      });
    });
  }

  /* ──────────────────────────────────────
     AJAX CART — Add to Cart via Fetch API
     Uses Shopify's /cart/add.js endpoint
     ────────────────────────────────────── */
  function initAJAXCart(scope) {
    const ctx = scope || document;
    const forms = ctx.querySelectorAll('.pd-form');

    forms.forEach(form => {
      if (form.dataset.bound) return;
      form.dataset.bound = 'true';
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('.pd-add-btn');
        if (!submitBtn || submitBtn.disabled) return;

        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Adding...';
        submitBtn.disabled = true;

        try {
          const formData = new FormData(form);
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            body: formData
          });

          if (response.ok) {
            submitBtn.textContent = '✓ Added to Cart!';
            submitBtn.style.background = 'var(--usa-green)';

            // Update cart count in header
            updateCartCount();

            setTimeout(() => {
              submitBtn.textContent = originalText;
              submitBtn.style.background = '';
              submitBtn.disabled = false;
            }, 2000);
          } else {
            const error = await response.json();
            submitBtn.textContent = error.description || 'Error — Try Again';
            submitBtn.style.background = 'var(--usa-red)';
            setTimeout(() => {
              submitBtn.textContent = originalText;
              submitBtn.style.background = '';
              submitBtn.disabled = false;
            }, 2500);
          }
        } catch (err) {
          console.error('Cart add error:', err);
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      });
    });
  }

  async function updateCartCount() {
    try {
      const res = await fetch('/cart.js');
      const cart = await res.json();
      document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = cart.item_count;
        el.style.display = cart.item_count > 0 ? '' : 'none';
      });
    } catch (e) { /* silent fail */ }
  }

  /* ──────────────────────────────────────
     NEWSLETTER FORM
     ────────────────────────────────────── */
  function initNewsletter(scope) {
    const ctx = scope || document;
    const form = ctx.querySelector('#newsletter-form');
    if (!form || form.dataset.bound) return;
    form.dataset.bound = 'true';

    form.addEventListener('submit', (e) => {
      // On Shopify, the native form will POST to /contact
      // This provides visual feedback before redirect
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        // Let the form submit naturally to Shopify
        // but show a quick visual cue
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          btn.textContent = '✓ Subscribed!';
          btn.style.background = 'var(--usa-green)';
        }
      }
    });
  }

  /* ──────────────────────────────────────
     MICRO-INTERACTIONS (global, once)
     Magnetic buttons + 3D tilt + spotlight
     ────────────────────────────────────── */
  function initMicroInteractions() {
    if (prefersReducedMotion) return;

    // Magnetic Buttons
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

    // 3D Tilt on Product Cards
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -4;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 4;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
      });
    });

    // Cursor spotlight tracking
    document.addEventListener('mousemove', (e) => {
      const selector = '.spotlight-card, .vm-card, .pillar-tile, .product-card, .why-card, .stat-card, .roadmap-card';
      document.querySelectorAll(selector).forEach(card => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });
    }, { passive: true });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ════════════════════════════════════════
     GLOBAL IMAGE HELPER
     Called by onclick in product thumbnails
     ════════════════════════════════════════ */
  window.changeMainImage = function(thumbEl, fullSrc) {
    const mainImg = document.getElementById('pdMainImage');
    if (mainImg) {
      mainImg.src = fullSrc;
      mainImg.style.opacity = '0';
      setTimeout(() => { mainImg.style.opacity = '1'; }, 50);
    }
    // Update active state
    const container = thumbEl.closest('.pd-thumbnails');
    if (container) {
      container.querySelectorAll('.pd-thumb').forEach(t => t.classList.remove('active'));
      thumbEl.classList.add('active');
    }
  };

  /* ════════════════════════════════════════
     MASTER INIT — Called on DOMContentLoaded
     ════════════════════════════════════════ */
  function initAll(scope) {
    initCounters(scope);
    initFAQ(scope);
    initRoadmap(scope);
    initProductGallery(scope);
    initVariantPicker(scope);
    initQuantitySelector(scope);
    initAJAXCart(scope);
    initNewsletter(scope);
  }

  /* ════════════════════════════════════════
     EVENT LISTENERS
     ════════════════════════════════════════ */

  // Initial page load
  document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initLenis();
    initAll();
    initMicroInteractions();

    // Delay GSAP slightly to ensure libraries are loaded
    if (typeof gsap !== 'undefined') {
      initAnimations();
    } else {
      const waitForGSAP = setInterval(() => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          clearInterval(waitForGSAP);
          initAnimations();
        }
      }, 150);
      // Safety timeout — stop waiting after 5 seconds
      setTimeout(() => clearInterval(waitForGSAP), 5000);
    }
  });

  /* ════════════════════════════════════════
     SHOPIFY THEME EDITOR LIFECYCLE HOOKS
     
     These events fire when a merchant:
     - Adds/removes/reorders sections in Customize
     - Changes section settings
     - Clicks into a section to edit it
     
     Without these, GSAP animations break,
     event listeners leak, and intervals orphan.
     ════════════════════════════════════════ */

  // A section was added or reloaded in the Theme Editor
  document.addEventListener('shopify:section:load', (e) => {
    const section = e.target;
    initAll(section);
    initAnimations(section);
  });

  // A section was removed — clean up to prevent memory leaks
  document.addEventListener('shopify:section:unload', (e) => {
    const section = e.target;

    // Kill any auto-slide intervals attached to this section
    if (section.__autoSlideInterval) {
      clearInterval(section.__autoSlideInterval);
    }

    // Kill orphaned GSAP ScrollTrigger instances scoped to this section
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach(st => {
        if (section.contains(st.trigger)) st.kill();
      });
    }
  });

  // A section was selected (clicked) in the Theme Editor
  document.addEventListener('shopify:section:select', (e) => {
    // Scroll the section into view smoothly
    e.target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // A block was selected in the Theme Editor (e.g., a specific FAQ item)
  document.addEventListener('shopify:block:select', (e) => {
    const block = e.target;

    // If it's a FAQ item, open it
    if (block.classList.contains('faq-item')) {
      block.classList.add('open');
    }

    // Scroll block into view
    block.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // A block was deselected
  document.addEventListener('shopify:block:deselect', (e) => {
    const block = e.target;
    if (block.classList.contains('faq-item')) {
      block.classList.remove('open');
    }
  });

})();
