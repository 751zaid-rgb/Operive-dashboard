(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.getElementById("routing-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const NODE_COUNT = 55;
  const CONNECTION_DISTANCE = 160;
  const ACTIVE_COLOR = "hsla(225, 100%, 60%, 1)";
  const NODE_COLOR = "hsla(225, 100%, 80%, 0.5)";
  const ACTIVE_NODE_GLOW = "hsla(225, 100%, 60%, 0.15)";

  let width;
  let height;
  let nodes;
  let animId;
  let activeNode = 0;
  let pulseRadius = 0;
  let pulseGrow = true;

  function resize() {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function createNodes() {
    nodes = Array.from({ length: NODE_COUNT }, function (_, i) {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 1,
        active: i === activeNode
      };
    });
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);

    nodes.forEach(function (n) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DISTANCE) {
          const alpha = 1 - dist / CONNECTION_DISTANCE;
          const isActiveEdge = nodes[i].active || nodes[j].active;
          ctx.beginPath();
          ctx.strokeStyle = isActiveEdge
            ? "hsla(225,100%,60%," + (alpha * 0.55).toFixed(3) + ")"
            : "hsla(225,100%,70%," + (alpha * 0.14).toFixed(3) + ")";
          ctx.lineWidth = isActiveEdge ? 1 : 0.5;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    pulseRadius += pulseGrow ? 0.4 : -0.4;
    if (pulseRadius > 18) pulseGrow = false;
    if (pulseRadius < 4) pulseGrow = true;

    nodes.forEach(function (n) {
      if (n.active) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, pulseRadius, 0, Math.PI * 2);
        ctx.fillStyle = ACTIVE_NODE_GLOW;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.active ? ACTIVE_COLOR : NODE_COLOR;
      ctx.fill();
    });

    animId = requestAnimationFrame(tick);
  }

  function init() {
    resize();
    createNodes();
    tick();
    setInterval(function () {
      if (nodes) {
        nodes[activeNode].active = false;
        activeNode = Math.floor(Math.random() * nodes.length);
        nodes[activeNode].active = true;
        pulseRadius = 4;
      }
    }, 3000);
  }

  const ro = new ResizeObserver(function () {
    cancelAnimationFrame(animId);
    resize();
    tick();
  });
  ro.observe(canvas.parentElement);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
