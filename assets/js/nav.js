(function () {
  "use strict";

  const nav = document.querySelector(".nav");
  const hamburger = document.querySelector(".nav__hamburger");
  const mobileNav = document.querySelector(".nav__mobile");
  let isOpen = false;
  let ticking = false;

  if (!nav) return;

  function updateNavOnScroll() {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        requestAnimationFrame(updateNavOnScroll);
        ticking = true;
      }
    },
    { passive: true }
  );

  function toggleMobileNav() {
    if (!hamburger || !mobileNav) return;
    isOpen = !isOpen;
    hamburger.classList.toggle("open", isOpen);
    mobileNav.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen.toString());
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  if (hamburger) {
    hamburger.addEventListener("click", toggleMobileNav);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) toggleMobileNav();
  });

  if (mobileNav) {
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (isOpen) toggleMobileNav();
      });
    });
  }

  const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
  document.querySelectorAll(".nav__link").forEach(function (link) {
    const href = (link.getAttribute("href") || "/").replace(/\/$/, "") || "/";
    if (href === currentPath || (href !== "/" && currentPath.startsWith(href))) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
})();
