(function() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let layer = document.getElementById("space-glow");
  if (!layer) {
    layer = document.createElement("div");
    layer.className = "glow-layer";
    layer.id = "space-glow";
    document.body.appendChild(layer);
  }

  const aura = document.createElement("div");
  aura.className = "glow-aura";
  const bloom = document.createElement("div");
  bloom.className = "glow-bloom";
  layer.append(aura, bloom);

  const SELECTOR = "a, button, .btn, .card, .chip, [role='button']";
  const LERP = 0.12;
  const SCALE = 1.45;

  let tx = 0, ty = 0, x = 0, y = 0, scale = 1, raf = 0, live = false;
  let hovered = null;

  function paint() {
    aura.style.transform =
      "translate3d(" + x + "px," + y + "px,0) translate(-50%,-50%) scale(" + scale.toFixed(3) + ")";
  }

  function place() {
    if (!hovered) return;
    const r = hovered.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const size = Math.max(r.width, r.height) * 1.6 + 260;
    bloom.style.width = size + "px";
    bloom.style.height = size + "px";
    bloom.style.transform =
      "translate3d(" + (r.left + r.width / 2) + "px," + (r.top + r.height / 2) + "px,0) translate(-50%,-50%)";
  }

  function frame() {
    x += (tx - x) * LERP;
    y += (ty - y) * LERP;
    const goal = hovered ? SCALE : 1;
    scale += (goal - scale) * 0.08;
    paint();
    if (hovered) place();
    const settled =
      !hovered &&
      Math.abs(tx - x) < 0.1 &&
      Math.abs(ty - y) < 0.1 &&
      Math.abs(goal - scale) < 0.001;
    raf = settled ? 0 : requestAnimationFrame(frame);
  }

  function run() {
    if (!raf) raf = requestAnimationFrame(frame);
  }

  window.addEventListener(
    "pointermove",
    function(e) {
      tx = e.clientX;
      ty = e.clientY;
      if (!live) {
        live = true;
        x = tx;
        y = ty;
        layer.classList.add("is-live");
      }
      run();
    },
    { passive: true }
  );

  document.addEventListener("pointerover", function(e) {
    if (reduced) return;
    const el = e.target.closest ? e.target.closest(SELECTOR) : null;
    if (el === hovered) return;
    hovered = el;
    layer.classList.toggle("is-hovering", !!el);
    if (el) place();
    run();
  });

  document.documentElement.addEventListener("pointerleave", function() {
    live = false;
    hovered = null;
    layer.classList.remove("is-live", "is-hovering");
    tx = 0;
    ty = 0;
    x = 0;
    y = 0;
    scale = 1;
    paint();
  });

  window.addEventListener("pointerdown", function(e) {
    if (reduced) return;
    const ripple = document.createElement("div");
    ripple.className = "glow-ripple";
    ripple.style.left = e.clientX + "px";
    ripple.style.top = e.clientY + "px";
    layer.appendChild(ripple);
    ripple.addEventListener("animationend", function() {
      ripple.remove();
    });
  });
})();