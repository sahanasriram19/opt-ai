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

  /* ---------- Live demo panel animation ---------- */
  var log = document.querySelector("[data-demo-log]");
  if (log) {
    var messages = [
      "Initializing workspace...",
      "Loading AI modules...",
      "Connecting data pipeline...",
      "Ready.",
      "— system operational —"
    ];
    var i = 0;
    function typeNext() {
      if (i >= messages.length) { i = 0; log.innerHTML = ""; }
      var line = document.createElement("div");
      line.className = "line" + (i >= 3 ? " done" : "");
      line.textContent = messages[i];
      log.appendChild(line);
      while (log.children.length > 5) log.removeChild(log.firstChild);
      i++;
      setTimeout(typeNext, i === messages.length ? 2200 : 850);
    }
    typeNext();
  }

  var bars = document.querySelectorAll("[data-demo-bar]");
  function randomizeBars() {
    bars.forEach(function (bar) {
      var span = bar.querySelector("span");
      var valueEl = bar.parentElement.querySelector("b");
      var min = parseInt(bar.getAttribute("data-min") || "40", 10);
      var max = parseInt(bar.getAttribute("data-max") || "95", 10);
      var val = Math.floor(min + Math.random() * (max - min));
      span.style.width = val + "%";
      if (valueEl) valueEl.textContent = val + "%";
    });
  }
  if (bars.length) {
    randomizeBars();
    setInterval(randomizeBars, 2400);
  }

  var iconBlocks = document.querySelectorAll("[data-demo-icon]");
  if (iconBlocks.length) {
    var activeIdx = 0;
    setInterval(function () {
      iconBlocks.forEach(function (b) { b.classList.remove("active"); });
      iconBlocks[activeIdx % iconBlocks.length].classList.add("active");
      activeIdx++;
    }, 900);
  }

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