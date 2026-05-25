(function () {
  "use strict";

  const SEQUENCES = {
    en: {
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
    },
    es: {
      restaurant: [
        { role: "user", text: "Hola, ¿puedo reservar una mesa para 4 esta noche?", time: "7:41 PM" },
        { role: "bot", text: "Claro. ¿Qué hora te funciona y a qué nombre dejo la solicitud?", time: "7:41 PM" },
        { role: "user", text: "8:30 a nombre de Layla, por favor", time: "7:42 PM" },
        { role: "bot", text: "Listo. Recibimos tu solicitud para 4 a las 8:30 a nombre de Layla. El equipo confirmará el siguiente paso.", time: "7:42 PM" }
      ],
      "home-services": [
        { role: "user", text: "¿Reparan aire acondicionado en Austin?", time: "2:18 PM" },
        { role: "bot", text: "Sí, cubrimos Austin y alrededores. ¿Cuál es el problema y qué tan urgente es?", time: "2:18 PM" },
        { role: "user", text: "El aire no funciona, necesito a alguien hoy", time: "2:19 PM" },
        { role: "bot", text: "Lo marco como urgente. ¿Me das tu nombre, dirección y mejor número?", time: "2:19 PM" }
      ]
    },
    ar: {
      restaurant: [
        { role: "user", text: "مرحبًا، هل يمكنني طلب حجز طاولة لأربعة أشخاص الليلة؟", time: "7:41 PM" },
        { role: "bot", text: "بكل سرور. ما الوقت المناسب لك، وبأي اسم أسجل الطلب؟", time: "7:41 PM" },
        { role: "user", text: "8:30 باسم ليلى من فضلك", time: "7:42 PM" },
        { role: "bot", text: "تم. استلمنا طلبك لأربعة أشخاص الساعة 8:30 باسم ليلى. سيؤكد الفريق الخطوة التالية.", time: "7:42 PM" }
      ],
      "home-services": [
        { role: "user", text: "هل تصلحون المكيفات في أوستن؟", time: "2:18 PM" },
        { role: "bot", text: "نعم، نغطي أوستن والمناطق المحيطة. ما المشكلة وكم هي عاجلة؟", time: "2:18 PM" },
        { role: "user", text: "المكيف متوقف وأحتاج شخصًا اليوم", time: "2:19 PM" },
        { role: "bot", text: "سأسجلها كحالة عاجلة. هل يمكنني أخذ اسمك وعنوانك وأفضل رقم للتواصل؟", time: "2:19 PM" }
      ]
    }
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
    const body = container.querySelector(".chat-preview__body");
    if (!body) return;

    let started = false;
    let activeTimers = [];

    function getMessages() {
      const locale = document.documentElement.lang === "ar" || document.documentElement.lang === "es"
        ? document.documentElement.lang
        : "en";
      const bundle = SEQUENCES[locale] || SEQUENCES.en;
      return bundle[sequenceKey] || bundle.restaurant;
    }

    function setTimer(callback, delay) {
      const id = window.setTimeout(callback, delay);
      activeTimers.push(id);
      return id;
    }

    function clearTimers() {
      activeTimers.forEach(function (id) {
        window.clearTimeout(id);
      });
      activeTimers = [];
    }

    function runSequence() {
      if (started) return;
      started = true;
      const messages = getMessages();

      let delay = 300;

      messages.forEach(function (msg, i) {
        if (msg.role === "bot" && i > 0) {
          const typingEl = document.createElement("div");
          typingEl.className = "chat-typing";
          typingEl.setAttribute("aria-hidden", "true");
          typingEl.innerHTML = "<span></span><span></span><span></span>";
          body.appendChild(typingEl);

          setTimer(function () {
            typingEl.classList.add("visible");
          }, delay);

          delay += TYPING_DELAY;

          setTimer(function () {
            typingEl.classList.remove("visible");
            setTimeout(function () {
              typingEl.remove();
            }, 200);
          }, delay - MESSAGE_DELAY / 2);
        }

        setTimer(function () {
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

    document.addEventListener("operive:localechange", function () {
      if (!started) return;
      clearTimers();
      body.innerHTML = "";
      started = false;
      runSequence();
    });
  }

  document.querySelectorAll("[data-chat-sequence]").forEach(function (el) {
    buildChat(el, el.dataset.chatSequence);
  });
})();
