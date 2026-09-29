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

  /* ---------- Spotlight / in-depth card "see more" toggle ---------- */
  var spotlightToggles = document.querySelectorAll("[data-spotlight-toggle]");
  spotlightToggles.forEach(function (btn) {
    var card = btn.closest(".spotlight-card, .indepth-card");
    var more = card ? card.querySelector("[data-spotlight-more]") : null;
    if (!more) return;
    var labelMore = btn.getAttribute("data-label-more") || "See more use cases";
    var labelLess = btn.getAttribute("data-label-less") || "Show less";
    btn.addEventListener("click", function () {
      var isOpen = btn.classList.contains("open");
      if (isOpen) {
        more.classList.remove("open");
        btn.classList.remove("open");
        btn.innerHTML = labelMore + " <span class=\"chev\">▾</span>";
      } else {
        more.classList.add("open");
        btn.classList.add("open");
        btn.innerHTML = labelLess + " <span class=\"chev\">▾</span>";
      }
    });
  });

  /* ---------- Live demo panel: typed log (product-specific lines) ---------- */
  /* Generalised to support more than one log panel per page (e.g. Forge's
     hero demo log AND its "Live Handoffs" feed further down the page). */
  var logs = document.querySelectorAll("[data-demo-log]");
  logs.forEach(function (log) {
    var raw = log.getAttribute("data-demo-log");
    var messages = raw ? JSON.parse(raw) : [
      "Initializing workspace...",
      "Loading AI modules...",
      "Connecting data pipeline...",
      "Ready.",
      "— system operational —"
    ];
    var maxLines = parseInt(log.getAttribute("data-max-lines"), 10) || 6;
    var i = 0;
    function typeNext() {
      if (i >= messages.length) { i = 0; log.innerHTML = ""; }
      var msg = messages[i];
      var isDone = msg.indexOf("✓") === 0 || msg.toLowerCase().indexOf("human approval") !== -1;
      var line = document.createElement("div");
      line.className = "line" + (isDone ? " done" : "");
      line.textContent = msg;
      log.appendChild(line);
      while (log.children.length > maxLines) log.removeChild(log.firstChild);
      i++;
      setTimeout(typeNext, i === messages.length ? 2200 : 950);
    }
    typeNext();
  });

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

    var tabIndicator = document.createElement("span");
    tabIndicator.className = "page-tab-indicator";
    pageTabs.querySelector(".container").appendChild(tabIndicator);

    function moveIndicator(activeLink) {
      tabIndicator.style.width = activeLink.offsetWidth + "px";
      tabIndicator.style.transform = "translateX(" + activeLink.offsetLeft + "px)";
    }

    function setActiveTab(activeLink) {
      tabLinks.forEach(function (l) { l.classList.toggle("active", l === activeLink); });
      moveIndicator(activeLink);
    }

    window.addEventListener("resize", function () {
      var current = pageTabs.querySelector(".page-tab.active");
      if (current) moveIndicator(current);
    });

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
    ".faq-item", ".price-card", ".spotlight-card", ".integration-pill",
    ".indepth-card", ".highlights-card", ".logo-pill", ".metric-tile",
    ".global-presence-pin", ".final-cta .container", ".footer-col"
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

  /* ---------- Scroll-triggered stat counters (hero stats + metric tiles) ---------- */
  var countUpEls = document.querySelectorAll(".hero-stat .value, .metric-tile .value");
  if (countUpEls.length && "IntersectionObserver" in window) {
    countUpEls.forEach(function (el) {
      var raw = el.textContent.trim();
      var match = raw.match(/^([\d,]+)(.*)$/);
      if (!match) return;
      var target = parseInt(match[1].replace(/,/g, ""), 10);
      el.setAttribute("data-count-target", target);
      el.setAttribute("data-count-suffix", match[2] || "");
      el.textContent = "0" + (match[2] || "");
    });
    var countUpObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          if (el.dataset.counted === "true") return;
          el.dataset.counted = "true";
          var target = parseInt(el.getAttribute("data-count-target"), 10);
          var suffix = el.getAttribute("data-count-suffix") || "";
          var cur = 0;
          var step = Math.max(1, Math.round(target / 24));
          var timer = setInterval(function () {
            cur = Math.min(target, cur + step);
            el.textContent = cur + suffix;
            if (cur >= target) clearInterval(timer);
          }, 45);
          countUpObserver.unobserve(el);
        });
      },
      { threshold: 0.4, rootMargin: "0px 0px -40px 0px" }
    );
    countUpEls.forEach(function (el) { countUpObserver.observe(el); });
  }

  /* ---------- Cursor-glow: soft light follows the pointer over cards ---------- */
  var glowEls = document.querySelectorAll(".service-card, .featured-card, .ai-platform-card");
  glowEls.forEach(function (el) {
    el.addEventListener("mousemove", function (e) {
      var rect = el.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--mx", x + "%");
      el.style.setProperty("--my", y + "%");
    });
  });

  /* ---------- Forge: cycle a "live handoff" highlight across the role cards ---------- */
  var rolesGrid = document.querySelector(".roles-grid");
  if (rolesGrid) {
    var roleCards = rolesGrid.querySelectorAll(".indepth-card");
    var roleIdx = 0;
    if (roleCards.length) {
      setInterval(function () {
        roleCards.forEach(function (c) { c.classList.remove("active"); });
        roleCards[roleIdx % roleCards.length].classList.add("active");
        roleIdx++;
      }, 1400);
    }
  }

  /* ---------- Pulse: looping "live" test-coverage meter ---------- */
  var coverageEls = document.querySelectorAll("[data-coverage]");
  coverageEls.forEach(function (root) {
    var fill = root.querySelector("[data-coverage-fill]");
    var valueEl = root.querySelector("[data-coverage-value]");
    if (!fill) return;
    var target = parseInt(root.getAttribute("data-coverage-target"), 10) || 94;
    function run() {
      fill.style.width = "0%";
      if (valueEl) valueEl.textContent = "0%";
      var cur = 0;
      requestAnimationFrame(function () { fill.style.width = target + "%"; });
      var timer = setInterval(function () {
        cur = Math.min(target, cur + 2);
        if (valueEl) valueEl.textContent = cur + "%";
        if (cur >= target) clearInterval(timer);
      }, 1800 / (target / 2));
      setTimeout(run, 5200);
    }
    run();
  });

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

  /* ---------- Interactive particle-network canvas (hero backgrounds) ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    document.querySelectorAll(".hero-home, .product-hero").forEach(function (section) {
      var canvas = section.querySelector(".particle-network-canvas");
      if (!canvas || !canvas.getContext) return;
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var w = 0, h = 0, nodes = [];
      var mouse = { x: null, y: null };

      function resize() {
        w = section.clientWidth;
        h = section.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      function initNodes() {
        var count = Math.max(16, Math.min(42, Math.floor((w * h) / 26000)));
        nodes = [];
        for (var i = 0; i < count; i++) {
          nodes.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25
          });
        }
      }

      function step() {
        ctx.clearRect(0, 0, w, h);
        nodes.forEach(function (n) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        });
        for (var i = 0; i < nodes.length; i++) {
          for (var j = i + 1; j < nodes.length; j++) {
            var dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
              ctx.strokeStyle = "rgba(255,255,255," + (0.14 * (1 - dist / 130)) + ")";
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
          if (mouse.x !== null) {
            var mdx = nodes[i].x - mouse.x, mdy = nodes[i].y - mouse.y;
            var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < 150) {
              ctx.strokeStyle = "rgba(255,255,255," + (0.4 * (1 - mdist / 150)) + ")";
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke();
            }
          }
        }
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        nodes.forEach(function (n) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        });
        requestAnimationFrame(step);
      }

      resize();
      initNodes();
      window.addEventListener("resize", function () {
        resize();
        initNodes();
      });
      section.addEventListener("mousemove", function (e) {
        var rect = section.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      section.addEventListener("mouseleave", function () {
        mouse.x = null;
        mouse.y = null;
      });
      requestAnimationFrame(step);
    });
  }

  /* ---------- 3D tilt on cards (adds to the existing cursor-glow mousemove) ---------- */
  glowEls.forEach(function (el) {
    el.addEventListener("mousemove", function (e) {
      var rect = el.getBoundingClientRect();
      var rawX = e.clientX - rect.left;
      var rawY = e.clientY - rect.top;
      var rotateY = ((rawX - rect.width / 2) / (rect.width / 2)) * 6;
      var rotateX = -((rawY - rect.height / 2) / (rect.height / 2)) * 6;
      el.style.transform = "perspective(700px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-2px)";
    });
    el.addEventListener("mouseleave", function () {
      el.style.transform = "";
    });
  });

  /* ---------- Scroll-built diagram: CohesionX AI Decision Record ---------- */
  var drwFlow = document.querySelector(".drw-flow");
  if (drwFlow && "IntersectionObserver" in window) {
    var drwFlowObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("built");
            drwFlowObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    drwFlowObserver.observe(drwFlow);
  }

  /* ---------- Scroll-built diagram: connecting line through workflow step numbers ---------- */
  document.querySelectorAll(".workflow-rows").forEach(function (rows) {
    var nums = rows.querySelectorAll(".step-num");
    if (nums.length < 2 || window.innerWidth < 800) return;
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "workflow-connector");
    var path = document.createElementNS(svgNS, "path");
    svg.appendChild(path);
    rows.style.position = "relative";
    rows.insertBefore(svg, rows.firstChild);

    function layout() {
      var contRect = rows.getBoundingClientRect();
      svg.setAttribute("width", contRect.width);
      svg.setAttribute("height", contRect.height);
      var points = [];
      nums.forEach(function (n) {
        var r = n.getBoundingClientRect();
        points.push((r.left - contRect.left + r.width / 2) + "," + (r.top - contRect.top + r.height / 2));
      });
      path.setAttribute("d", "M" + points.join(" L"));
      var len = path.getTotalLength();
      path.style.strokeDasharray = len;
      if (!path.dataset.drawn) path.style.strokeDashoffset = len;
    }
    layout();
    window.addEventListener("resize", layout);

    if ("IntersectionObserver" in window) {
      var connectorObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              path.style.strokeDashoffset = 0;
              path.dataset.drawn = "true";
              connectorObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      connectorObserver.observe(rows);
    } else {
      path.style.strokeDashoffset = 0;
    }
  });
});