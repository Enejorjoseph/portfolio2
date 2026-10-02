(function() {
  let layer = document.getElementById("comets");
  if (!layer) {
    layer = document.createElement("div");
    layer.className = "comet-layer";
    layer.id = "comets";
    document.body.appendChild(layer);
  }
  const cometCount = window.innerWidth < 768 ? 20 : 40;
  const speeds = [1.5, 1.8, 2, 2.2, 2.5, 2.8, 3];
  const sizes = ["comet--small", "comet--small", "comet--small", "comet--medium", "comet--medium", "comet--large"];
  for (let i = 0; i < cometCount; i++) {
    const comet = document.createElement("div");
    comet.className = "comet " + sizes[Math.floor(Math.random() * sizes.length)];
    layer.appendChild(comet);
    const delay = Math.random() * 5;
    const duration = speeds[Math.floor(Math.random() * speeds.length)];
    comet.style.animation = "comet " + duration + "s linear " + delay + "s infinite";
    const top = Math.random() * 120 - 20;
    const leftOffset = Math.random() * 40;
    comet.style.top = top + "vh";
    comet.style.left = leftOffset + "vw";
  }
})();
