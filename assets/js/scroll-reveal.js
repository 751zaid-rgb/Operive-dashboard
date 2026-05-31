(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll("[data-reveal], [data-stagger]").forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var THRESHOLD = 0.12;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: THRESHOLD });

  document.querySelectorAll("[data-reveal], [data-stagger]").forEach(function (el) {
    io.observe(el);
  });

  function animateCountUp(el) {
    var target = parseFloat(el.dataset.countTo) || 0;
    var duration = parseInt(el.dataset.countDuration, 10) || 1500;
    var prefix = el.dataset.countPrefix || "";
    var suffix = el.dataset.countSuffix || "";
    var decimals = parseInt(el.dataset.countDecimals, 10) || 0;
    var start = null;
    var startVal = 0;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 4);
      var current = startVal + (target - startVal) * eased;
      el.textContent = prefix + current.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toFixed(decimals) + suffix;
    }

    requestAnimationFrame(step);
  }

  var countIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCountUp(entry.target);
        countIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll("[data-count-to]").forEach(function (el) {
    var prefix = el.dataset.countPrefix || "";
    var suffix = el.dataset.countSuffix || "";
    el.textContent = prefix + "0" + suffix;
    countIo.observe(el);
  });
})();
