// =========================================================
// Optimum Solutions — AI Section shared behavior
// AIs nav dropdown, FAQ accordion, and the live-feeling
// demo animation in the product hero panel.
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
  /* ---------- AIs dropdown (navbar) ---------- */
  var dropdowns = document.querySelectorAll(".nav-item-dropdown");
  dropdowns.forEach(function (dd) {
    var trigger = dd.querySelector(".nav-item");
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = dd.classList.contains("open");
      dropdowns.forEach(function (other) { other.classList.remove("open"); });
      if (!isOpen) dd.classList.add("open");
    });
  });
  document.addEventListener("click", function () {
    dropdowns.forEach(function (dd) { dd.classList.remove("open"); });
  });

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var q = item.querySelector(".faq-question");
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      faqItems.forEach(function (i) { i.classList.remove("open"); });
      if (!isOpen) item.classList.add("open");
    });
  });

  /* ---------- Spotlight card "see more" toggle ---------- */
  var spotlightToggles = document.querySelectorAll("[data-spotlight-toggle]");
  spotlightToggles.forEach(function (btn) {
    var card = btn.closest(".spotlight-card");
    var more = card ? card.querySelector("[data-spotlight-more]") : null;
    if (!more) return;
    btn.addEventListener("click", function () {
      var isOpen = btn.classList.contains("open");
      if (isOpen) {
        more.classList.remove("open");
        btn.classList.remove("open");
        btn.innerHTML = "See more use cases <span class=\"chev\">▾</span>";
      } else {
        more.classList.add("open");
        btn.classList.add("open");
        btn.innerHTML = "Show less <span class=\"chev\">▾</span>";
      }
    });
  });

  /* ---------- Live demo panel: typed log (product-specific lines) ---------- */
  var log = document.querySelector("[data-demo-log]");
  if (log) {
    var raw = log.getAttribute("data-demo-log");
    var messages = raw ? JSON.parse(raw) : [
      "Initializing workspace...",
      "Loading AI modules...",
      "Connecting data pipeline...",
      "Ready.",
      "— system operational —"
    ];
    var i = 0;
    function typeNext() {
      if (i >= messages.length) { i = 0; log.innerHTML = ""; }
      var msg = messages[i];
      var isDone = msg.indexOf("✓") === 0 || msg.toLowerCase().indexOf("human approval") !== -1;
      var line = document.createElement("div");
      line.className = "line" + (isDone ? " done" : "");
      line.textContent = msg;
      log.appendChild(line);
      while (log.children.length > 6) log.removeChild(log.firstChild);
      i++;
      setTimeout(typeNext, i === messages.length ? 2200 : 950);
    }
    typeNext();
  }

  /* ---------- Live demo panel: pipeline track (Forge / Pulse) ---------- */
  var pipelines = document.querySelectorAll("[data-pipeline]");
  pipelines.forEach(function (track) {
    var nodes = track.querySelectorAll(".pipeline-node");
    var ticket = track.querySelector("[data-ticket]");
    var gateAttr = track.getAttribute("data-gate-index");
    var gateIdx = gateAttr === null ? -1 : parseInt(gateAttr, 10);
    var gateNote = track.parentElement.querySelector("[data-gate-note]");
    var idx = 0;
    function place() {
      nodes.forEach(function (n, i) {
        n.classList.toggle("active", i === idx);
        n.classList.toggle("done", i < idx);
      });
      if (ticket) ticket.style.top = (idx / (nodes.length - 1)) * 100 + "%";
      if (gateNote) gateNote.classList.toggle("show", idx === gateIdx);
    }
    function tick() {
      var atGate = idx === gateIdx;
      setTimeout(function () {
        idx = (idx + 1) % nodes.length;
        place();
        tick();
      }, atGate ? 2600 : 1300);
    }
    place();
    tick();
  });

  /* ---------- Live demo panel: count-up stat tiles ---------- */
  var counters2 = document.querySelectorAll("[data-count-to]");
  counters2.forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count-to"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var cur = 0;
    var step = Math.max(1, Math.round(target / 24));
    var timer = setInterval(function () {
      cur = Math.min(target, cur + step);
      el.textContent = cur + suffix;
      if (cur >= target) clearInterval(timer);
    }, 55);
  });

  /* ---------- AI Studio: Agent Lifecycle carousel (live) ---------- */
  var lifecycles = document.querySelectorAll("[data-lifecycle]");
  lifecycles.forEach(function (root) {
    var steps = JSON.parse(root.getAttribute("data-lifecycle"));
    var stepEls = root.querySelectorAll(".lifecycle-step");
    var labelEls = root.querySelectorAll(".lifecycle-step-labels span:not(:empty)");
    var dotEls = root.querySelectorAll(".lifecycle-dots span");
    var detailIcon = root.querySelector(".lifecycle-detail-icon");
    var detailTitle = root.querySelector(".lifecycle-detail h4");
    var detailBody = root.querySelector(".lifecycle-detail p");
    var idx = 0;

    function render() {
      stepEls.forEach(function (el, i) { el.classList.toggle("active", i === idx); });
      labelEls.forEach(function (el, i) { el.classList.toggle("active", i === idx); });
      dotEls.forEach(function (el, i) { el.classList.toggle("active", i === idx); });
      if (detailIcon) detailIcon.innerHTML = stepEls[idx].innerHTML;
      if (detailTitle) detailTitle.textContent = steps[idx].title;
      if (detailBody) detailBody.textContent = steps[idx].body;
    }
    render();
    setInterval(function () {
      idx = (idx + 1) % steps.length;
      render();
    }, 2600);

    stepEls.forEach(function (el, i) {
      el.style.cursor = "pointer";
      el.addEventListener("click", function () { idx = i; render(); });
    });
  });

  /* ---------- Section bookmarks: scrollspy + smooth-scroll offset ---------- */
  var pageTabs = document.querySelector("[data-page-tabs]");
  if (pageTabs) {
    var tabLinks = pageTabs.querySelectorAll(".page-tab");
    var tabSections = [];
    tabLinks.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      if (section) tabSections.push({ link: link, section: section });
    });

    function setActiveTab(activeLink) {
      tabLinks.forEach(function (l) { l.classList.toggle("active", l === activeLink); });
    }

    if (tabSections.length) {
      setActiveTab(tabSections[0].link);
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var match = tabSections.filter(function (t) { return t.section === entry.target; })[0];
              if (match) setActiveTab(match.link);
            }
          });
        },
        { rootMargin: "-140px 0px -70% 0px", threshold: 0 }
      );
      tabSections.forEach(function (t) { observer.observe(t.section); });
    }
  }

  /* ---------- Scroll-reveal: fade + rise sections/cards into view ---------- */
  var revealSelector = [
    ".section-head", ".service-card", ".featured-card", ".ai-platform-card",
    ".standout-grid > div", ".workflow-row", ".testimonial-card", ".video-card",
    ".faq-item", ".pricing-card", ".spotlight-card", ".integration-pill"
  ].join(", ");
  var revealEls = document.querySelectorAll(revealSelector);
  if (revealEls.length && "IntersectionObserver" in window) {
    revealEls.forEach(function (el) {
      el.classList.add("reveal-init");
      var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = (Math.min(siblings, 6) * 60) + "ms";
    });
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Floating mobile CTA: show once the hero has scrolled by ---------- */
  var floatCta = document.querySelector("[data-mobile-cta]");
  if (floatCta) {
    var hero = document.querySelector(".product-hero");
    var toggleFloatCta = function () {
      var pastHero = hero ? window.scrollY > hero.offsetHeight * 0.6 : window.scrollY > 400;
      floatCta.classList.toggle("show", pastHero);
    };
    toggleFloatCta();
    window.addEventListener("scroll", toggleFloatCta, { passive: true });
  }

  /* ---------- CohesionX: live Decision Record diagram ---------- */
  var drw = document.querySelector("[data-drw]");
  if (drw) {
    var drwChips = drw.querySelectorAll(".drw-chip");
    var drwActiveIdx = 0;
    setInterval(function () {
      drwChips.forEach(function (c) { c.classList.remove("active"); });
      drwChips[drwActiveIdx % drwChips.length].classList.add("active");
      drwActiveIdx++;
    }, 750);

    var counters = drw.querySelectorAll("[data-drw-counter]");
    function animateCounters() {
      counters.forEach(function (el) {
        var min = parseInt(el.getAttribute("data-min"), 10);
        var max = parseInt(el.getAttribute("data-max"), 10);
        var suffix = el.getAttribute("data-suffix") || "";
        var val = Math.floor(min + Math.random() * (max - min));
        el.textContent = val + suffix;
      });
    }
    animateCounters();
    setInterval(animateCounters, 2400);
  }
});