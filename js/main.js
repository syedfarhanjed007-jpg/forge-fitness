/**
 * FORGE Fitness Gym - Main JavaScript
 * Vanilla JS — No frameworks
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // DOM Ready
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initMobileNav();
    initSmoothScroll();
    initScrollAnimations();
    initActiveNavHighlight();
    initScheduleFilter();
    initClassesFilter();
    initFaqAccordion();
    initPricingHover();
    initStatsCounter();
    initStickyNav();
    initContactForm();
  }

  // ---------------------------------------------------------------------------
  // 1. Mobile Nav Toggle (hamburger menu)
  // ---------------------------------------------------------------------------
  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle, .hamburger, .mobile-menu-btn');
    var navMenu = document.querySelector('.nav-menu, .nav-links, .main-nav ul');
    var overlay = document.querySelector('.nav-overlay');

    if (!toggle || !navMenu) return;

    toggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('active');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
      if (overlay) overlay.classList.toggle('active', isOpen);
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
        if (overlay) overlay.classList.remove('active');
      });
    });

    // Close on overlay click
    if (overlay) {
      overlay.addEventListener('click', function () {
        navMenu.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
        overlay.classList.remove('active');
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 2. Smooth Scroll for Anchor Links
  // ---------------------------------------------------------------------------
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '#top') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var offset = 80; // account for sticky nav
          var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 3. Scroll-Based Animations (Intersection Observer)
  // ---------------------------------------------------------------------------
  function initScrollAnimations() {
    var animElements = document.querySelectorAll(
      '.fade-in, .fade-up, .fade-left, .fade-right, .scale-in, [data-animate]'
    );

    if (!animElements.length) return;

    // Set initial hidden state
    animElements.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      var type = el.dataset.animate || '';
      if (type === 'fade-up' || el.classList.contains('fade-up')) {
        el.style.transform = 'translateY(30px)';
      } else if (type === 'fade-left' || el.classList.contains('fade-left')) {
        el.style.transform = 'translateX(-30px)';
      } else if (type === 'fade-right' || el.classList.contains('fade-right')) {
        el.style.transform = 'translateX(30px)';
      } else if (type === 'scale-in' || el.classList.contains('scale-in')) {
        el.style.transform = 'scale(0.95)';
      }
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var delay = el.dataset.delay || 0;
            setTimeout(function () {
              el.style.opacity = '1';
              el.style.transform = 'translate(0) scale(1)';
              el.classList.add('animated');
            }, Number(delay));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    animElements.forEach(function (el) { observer.observe(el); });
  }

  // ---------------------------------------------------------------------------
  // 4. Active Nav Link Highlighting Based on Current Page
  // ---------------------------------------------------------------------------
  function initActiveNavHighlight() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === '') currentPage = 'index.html';

    document.querySelectorAll('.nav-menu a, .nav-links a, .main-nav a').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkPage = href.split('/').pop().split('#')[0];
      if (linkPage === currentPage || (currentPage === 'index.html' && (linkPage === '' || linkPage === 'index.html'))) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 5. Schedule Filter by Day
  // ---------------------------------------------------------------------------
  function initScheduleFilter() {
    var dayButtons = document.querySelectorAll('.schedule-filter .day-btn, .schedule-nav button, [data-day]');
    var scheduleItems = document.querySelectorAll('.schedule-item, .schedule-class, [data-schedule-day]');

    if (!dayButtons.length || !scheduleItems.length) return;

    dayButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Update active button
        dayButtons.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        var selectedDay = this.dataset.day || this.textContent.trim().toLowerCase();

        scheduleItems.forEach(function (item) {
          var itemDay = item.dataset.scheduleDay || item.dataset.day || '';
          if (selectedDay === 'all' || itemDay.toLowerCase() === selectedDay.toLowerCase()) {
            item.style.display = '';
            item.classList.remove('hidden');
          } else {
            item.style.display = 'none';
            item.classList.add('hidden');
          }
        });
      });
    });

    // Auto-select today
    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    var today = days[new Date().getDay()];
    var todayBtn = document.querySelector('[data-day="' + today + '"]');
    if (todayBtn) todayBtn.click();
  }

  // ---------------------------------------------------------------------------
  // 6. Classes Filter by Type
  // ---------------------------------------------------------------------------
  function initClassesFilter() {
    var filterBtns = document.querySelectorAll('.class-filter .filter-btn, .class-nav button, [data-class-type]');
    var classCards = document.querySelectorAll('.class-card, .class-item, [data-class]');

    if (!filterBtns.length || !classCards.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        var filterType = this.dataset.classType || this.dataset.filter || this.textContent.trim().toLowerCase();

        classCards.forEach(function (card, index) {
          var cardType = card.dataset.class || card.dataset.type || '';
          var show = filterType === 'all' || cardType.toLowerCase().indexOf(filterType.toLowerCase()) !== -1;

          if (show) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.classList.remove('hidden');
            setTimeout(function () {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, index * 80);
          } else {
            card.style.display = 'none';
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 7. FAQ Accordion Toggle
  // ---------------------------------------------------------------------------
  function initFaqAccordion() {
    var faqItems = document.querySelectorAll('.faq-item, .accordion-item');

    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var question = item.querySelector('.faq-question, .accordion-header, .accordion-btn, summary');
      var answer = item.querySelector('.faq-answer, .accordion-body, .accordion-content');

      if (!question || !answer) return;

      // Ensure answer is hidden by default
      answer.style.maxHeight = '0';
      answer.style.overflow = 'hidden';
      answer.style.transition = 'max-height 0.35s ease, padding 0.35s ease';

      question.addEventListener('click', function (e) {
        e.preventDefault();
        var isOpen = item.classList.contains('active');

        // Close all others
        faqItems.forEach(function (other) {
          if (other !== item && other.classList.contains('active')) {
            other.classList.remove('active');
            var otherAnswer = other.querySelector('.faq-answer, .accordion-body, .accordion-content');
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
            var otherQ = other.querySelector('.faq-question, .accordion-header, .accordion-btn');
            if (otherQ) otherQ.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current
        if (isOpen) {
          item.classList.remove('active');
          answer.style.maxHeight = '0';
          question.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 8. Pricing Card Hover Effects
  // ---------------------------------------------------------------------------
  function initPricingHover() {
    var cards = document.querySelectorAll('.pricing-card, .price-card, .plan-card');

    cards.forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
        this.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.3)';
        this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      });

      card.addEventListener('mouseleave', function () {
        if (this.classList.contains('featured') || this.classList.contains('popular')) {
          this.style.transform = 'scale(1.05)';
        } else {
          this.style.transform = 'translateY(0) scale(1)';
        }
        this.style.boxShadow = '';
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 9. Stats Counter Animation When in Viewport
  // ---------------------------------------------------------------------------
  function initStatsCounter() {
    var statNumbers = document.querySelectorAll('.stat-number, .counter, [data-count]');

    if (!statNumbers.length) return;

    var animated = false;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !animated) {
            animated = true;
            animateAllCounters();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    statNumbers.forEach(function (el) { observer.observe(el); });

    function animateAllCounters() {
      statNumbers.forEach(function (counter) {
        var target = parseInt(counter.dataset.count || counter.textContent.replace(/[^0-9]/g, ''), 10);
        if (isNaN(target)) return;

        var suffix = counter.textContent.replace(/[0-9,]/g, '').trim(); // e.g. "+" or "K+"
        var duration = 2000;
        var start = 0;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          // Ease out quad
          var eased = 1 - (1 - progress) * (1 - progress);
          var current = Math.floor(eased * target);
          counter.textContent = current.toLocaleString() + suffix;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            counter.textContent = target.toLocaleString() + suffix;
          }
        }

        requestAnimationFrame(step);
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 10. Sticky Nav with Background Change on Scroll
  // ---------------------------------------------------------------------------
  function initStickyNav() {
    var nav = document.querySelector('nav, .navbar, .main-nav, header nav');

    if (!nav) return;

    var scrollThreshold = 50;

    function updateNav() {
      if (window.scrollY > scrollThreshold) {
        nav.classList.add('scrolled', 'nav-solid');
        nav.classList.remove('nav-transparent');
      } else {
        nav.classList.remove('scrolled', 'nav-solid');
        nav.classList.add('nav-transparent');
      }
    }

    window.addEventListener('scroll', throttle(updateNav, 16), { passive: true });
    updateNav(); // initial state
  }

  // ---------------------------------------------------------------------------
  // 11. Form Validation for Contact Page
  // ---------------------------------------------------------------------------
  function initContactForm() {
    var form = document.querySelector('.contact-form, #contactForm, form[data-validate]');

    if (!form) return;

    var fields = {
      name: form.querySelector('[name="name"], #name'),
      email: form.querySelector('[name="email"], #email'),
      phone: form.querySelector('[name="phone"], #phone'),
      subject: form.querySelector('[name="subject"], #subject'),
      message: form.querySelector('[name="message"], #message')
    };

    form.addEventListener('submit', function (e) {
      var valid = true;

      // Clear previous errors
      form.querySelectorAll('.error-message').forEach(function (el) { el.remove(); });
      form.querySelectorAll('.field-error').forEach(function (el) { el.classList.remove('field-error'); });

      // Name validation
      if (fields.name && fields.name.value.trim().length < 2) {
        showError(fields.name, 'Please enter your name (at least 2 characters)');
        valid = false;
      }

      // Email validation
      if (fields.email) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(fields.email.value.trim())) {
          showError(fields.email, 'Please enter a valid email address');
          valid = false;
        }
      }

      // Phone validation (optional but if filled must be valid)
      if (fields.phone && fields.phone.value.trim() !== '') {
        var phonePattern = /^[\+]?[\d\s\-\(\)]{7,}$/;
        if (!phonePattern.test(fields.phone.value.trim())) {
          showError(fields.phone, 'Please enter a valid phone number');
          valid = false;
        }
      }

      // Subject validation
      if (fields.subject && fields.subject.value.trim().length < 2) {
        showError(fields.subject, 'Please enter a subject');
        valid = false;
      }

      // Message validation
      if (fields.message && fields.message.value.trim().length < 10) {
        showError(fields.message, 'Please enter a message (at least 10 characters)');
        valid = false;
      }

      if (!valid) {
        e.preventDefault();
        // Focus first error field
        var firstError = form.querySelector('.field-error');
        if (firstError) firstError.focus();
      }
    });

    // Real-time validation on blur
    Object.keys(fields).forEach(function (key) {
      var field = fields[key];
      if (!field) return;
      field.addEventListener('blur', function () {
        validateField(this, key);
      });
    });

    function validateField(field, type) {
      // Remove existing error for this field
      var existing = field.parentElement.querySelector('.error-message');
      if (existing) existing.remove();
      field.classList.remove('field-error');

      var val = field.value.trim();

      switch (type) {
        case 'name':
          if (val.length > 0 && val.length < 2) {
            showError(field, 'Name must be at least 2 characters');
          }
          break;
        case 'email':
          if (val.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            showError(field, 'Please enter a valid email');
          }
          break;
        case 'phone':
          if (val.length > 0 && !/^[\+]?[\d\s\-\(\)]{7,}$/.test(val)) {
            showError(field, 'Please enter a valid phone number');
          }
          break;
        case 'message':
          if (val.length > 0 && val.length < 10) {
            showError(field, 'Message must be at least 10 characters');
          }
          break;
      }
    }

    function showError(field, message) {
      field.classList.add('field-error');
      var errorEl = document.createElement('span');
      errorEl.className = 'error-message';
      errorEl.textContent = message;
      errorEl.style.color = '#ff4444';
      errorEl.style.fontSize = '0.85rem';
      errorEl.style.display = 'block';
      errorEl.style.marginTop = '4px';
      field.parentElement.appendChild(errorEl);
    }
  }

  // ---------------------------------------------------------------------------
  // Utility: Throttle
  // ---------------------------------------------------------------------------
  function throttle(fn, wait) {
    var last = 0;
    return function () {
      var now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn.apply(this, arguments);
      }
    };
  }

})();
