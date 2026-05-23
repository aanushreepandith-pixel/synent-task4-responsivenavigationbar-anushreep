/* ==============================================
   SwiftBite – Navigation JavaScript
   Features:
   1. Hamburger toggle (open / close mobile menu)
   2. Close menu when a nav link is clicked
   3. Scroll-based navbar shadow
   4. Active link highlight on scroll (Intersection Observer)
   5. Smooth scroll for anchor links (polyfill-safe)
============================================== */

(function () {
  "use strict";

  /* ── 1. ELEMENT REFERENCES ── */
  const navbar    = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navMenu   = document.getElementById("navMenu");
  const navLinks  = document.querySelectorAll(".nav-link");
  const sections  = document.querySelectorAll("section[id]");

  /* ── 2. HAMBURGER TOGGLE ── */
  function toggleMenu(forceClose = false) {
    const isOpen = navMenu.classList.contains("open");

    if (forceClose || isOpen) {
      navMenu.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = ""; // restore scroll
    } else {
      navMenu.classList.add("open");
      hamburger.classList.add("open");
      hamburger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden"; // prevent background scroll
    }
  }

  hamburger.addEventListener("click", () => toggleMenu());

  /* ── 3. CLOSE MENU WHEN A LINK IS CLICKED ── */
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      toggleMenu(true); // force close
    });
  });

  /* ── 4. CLOSE MENU ON OUTSIDE CLICK ── */
  document.addEventListener("click", (e) => {
    if (
      navMenu.classList.contains("open") &&
      !navMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      toggleMenu(true);
    }
  });

  /* ── 5. CLOSE MENU ON ESC KEY ── */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") toggleMenu(true);
  });

  /* ── 6. NAVBAR SHADOW ON SCROLL ── */
  function handleScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  /* ── 7. ACTIVE LINK ON SCROLL (Intersection Observer) ── */
  const observerOptions = {
    root: null,
    rootMargin: "-50% 0px -50% 0px", // trigger when section centre hits viewport centre
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));

  /* ── 8. SMOOTH SCROLL POLYFILL FOR OLDER BROWSERS ── */
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navH = navbar.offsetHeight;
          const top = target.getBoundingClientRect().top + window.scrollY - navH;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
    });
  });

  /* ── 9. CART BUTTON MICRO-INTERACTION ── */
  const cartBtn = document.querySelector(".btn-cart");
  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      cartBtn.style.transform = "scale(0.94)";
      setTimeout(() => (cartBtn.style.transform = ""), 150);
    });
  }

  /* ── 10. "ORDER NOW" SCROLL-TO-HERO ── */
  const orderBtn = document.querySelector(".btn-order");
  if (orderBtn) {
    orderBtn.addEventListener("click", () => {
      toggleMenu(true);
      const hero = document.getElementById("home");
      if (hero) {
        const top = hero.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  }

  /* ── 11. ADD BUTTON ANIMATION (dishes) ── */
  document.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const original = btn.textContent;
      btn.textContent = "✓ Added!";
      btn.style.background = "linear-gradient(135deg, #22c55e, #16a34a)";
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = "";
      }, 1400);

      // bump cart count
      const countEl = document.querySelector(".cart-count");
      if (countEl) {
        const current = parseInt(countEl.textContent, 10) || 0;
        countEl.textContent = current + 1;
        countEl.style.transform = "scale(1.5)";
        setTimeout(() => (countEl.style.transform = ""), 300);
      }
    });
  });

  /* ── 12. CONTACT FORM ── */
  const sendBtn = document.querySelector(".btn-send");
  if (sendBtn) {
    sendBtn.addEventListener("click", () => {
      const inputs = document.querySelectorAll(".contact-form input, .contact-form textarea");
      const allFilled = [...inputs].every((i) => i.value.trim() !== "");
      if (!allFilled) {
        sendBtn.textContent = "⚠ Please fill all fields";
        sendBtn.style.background = "linear-gradient(135deg,#ef4444,#dc2626)";
        setTimeout(() => {
          sendBtn.textContent = "Send Message";
          sendBtn.style.background = "";
        }, 1800);
        return;
      }
      sendBtn.textContent = "✓ Message Sent!";
      sendBtn.style.background = "linear-gradient(135deg, #22c55e, #16a34a)";
      inputs.forEach((i) => (i.value = ""));
      setTimeout(() => {
        sendBtn.textContent = "Send Message";
        sendBtn.style.background = "";
      }, 2500);
    });
  }

  /* ── INIT ── */
  handleScroll(); // run once on load
})();