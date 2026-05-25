(function () {
  "use strict";

  const SEQUENCES = {
    restaurant: [
      { role: "user", text: "Hi, can I book a table for 4 tonight?", time: "7:41 PM" },
      { role: "bot", text: "Happy to help. What time works for you, and what name should I put on the request?", time: "7:41 PM" },
      { role: "user", text: "8:30 under Layla please", time: "7:42 PM" },
      { role: "bot", text: "Got it. Your request for 4 at 8:30 under Layla has been received. The team will confirm the next step.", time: "7:42 PM" }
    ],
    "home-services": [
      { role: "user", text: "Do you do AC repair in Austin?", time: "2:18 PM" },
      { role: "bot", text: "Yes, we cover Austin and surrounding areas. What's the issue and how urgent is it?", time: "2:18 PM" },
      { role: "user", text: "AC is out, need someone today", time: "2:19 PM" },
      { role: "bot", text: "Logging this as urgent. Can I get your name, address, and best number?", time: "2:19 PM" }
    ]
  };

  const TYPING_DELAY = 900;
  const MESSAGE_DELAY = 600;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildChat(container, sequenceKey) {
    const messages = SEQUENCES[sequenceKey] || SEQUENCES.restaurant;
    const body = container.querySelector(".chat-preview__body");
    if (!body) return;

    let started = false;

    function runSequence() {
      if (started) return;
      started = true;

      let delay = 300;

      messages.forEach(function (msg, i) {
        if (msg.role === "bot" && i > 0) {
          const typingEl = document.createElement("div");
          typingEl.className = "chat-typing";
          typingEl.setAttribute("aria-hidden", "true");
          typingEl.innerHTML = "<span></span><span></span><span></span>";
          body.appendChild(typingEl);

          setTimeout(function () {
            typingEl.classList.add("visible");
          }, delay);

          delay += TYPING_DELAY;

          setTimeout(function () {
            typingEl.classList.remove("visible");
            setTimeout(function () {
              typingEl.remove();
            }, 200);
          }, delay - MESSAGE_DELAY / 2);
        }

        setTimeout(function () {
          const msgEl = document.createElement("div");
          msgEl.className = "chat-msg chat-msg--" + msg.role;
          msgEl.innerHTML =
            '<div class="chat-msg__bubble">' +
            escapeHtml(msg.text) +
            '</div><div class="chat-msg__time">' +
            escapeHtml(msg.time) +
            "</div>";
          body.appendChild(msgEl);
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              msgEl.classList.add("visible");
            });
          });
          body.scrollTop = body.scrollHeight;
        }, delay);

        delay += MESSAGE_DELAY + (msg.role === "bot" ? 0 : MESSAGE_DELAY * 0.5);
      });
    }

    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runSequence();
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    io.observe(container);
  }

  document.querySelectorAll("[data-chat-sequence]").forEach(function (el) {
    buildChat(el, el.dataset.chatSequence);
  });
})();
