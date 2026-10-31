(() => {
  const $ = (s) => document.querySelector(s);
  const intro = $("#intro");
  const portalScene = $("#portalScene");
  const portal = $("#portal");
  const countdown = $("#countdown");
  const countdownLabel = $("#countdownLabel");
  const statusText = $("#statusText");
  const statusDot = $("#statusDot");
  const portalLogo = $("#portalLogo");
  const finale = $("#finale");
  const startButton = $("#startButton");
  const replayButton = $("#replayButton");
  const fullscreenButton = $("#fullscreenButton");
  const visitLink = $("#visitLink");
  const urlNote = $("#urlNote");

  let timers = [];
  let current = "intro";
  let running = false;
  let audioContext = null;

  // Replace this with the real published GSFCU Voice URL when available.
  const APP_URL = "http://gsfcuvoice.gsfcuniversity.ac.in/";

  function later(fn, ms) {
    const id = window.setTimeout(fn, ms);
    timers.push(id);
  }
  function clearSequence() {
    timers.forEach(clearTimeout);
    timers = [];
    running = false;
  }
  function setScene(name) {
    current = name;
    intro.classList.toggle("hidden", name !== "intro");
    portalScene.classList.toggle("active", name === "portal");
    finale.classList.toggle("active", name === "finale");
  }
  function playTick(value) {
    // Synthesized locally with Web Audio; no external sound file is required.
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === "suspended") audioContext.resume();
      const now = audioContext.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(value === 1 ? 880 : 520 + (10 - value) * 24, now);
      osc.frequency.exponentialRampToValueAtTime(value === 1 ? 1320 : 360 + (10 - value) * 18, now + 0.14);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(value === 1 ? 0.12 : 0.055, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (value === 1 ? 0.42 : 0.2));
      osc.connect(gain); gain.connect(audioContext.destination);
      osc.start(now); osc.stop(now + (value === 1 ? 0.44 : 0.22));
    } catch (_) { /* Sound is optional if browser audio is unavailable. */ }
  }

  function setCount(value) {
    countdown.textContent = String(value);
    countdown.classList.remove("pop");
    void countdown.offsetWidth;
    countdown.classList.add("pop");
    playTick(value);
  }
  function showFinale() {
    clearSequence();
    portalLogo.classList.add("materialize");
    portal.classList.add("particles-on", "energy-burst");
    countdown.style.opacity = "0";
    countdownLabel.textContent = "IDENTITY CONFIRMED";
    statusText.textContent = "GSFCU VOICE ONLINE";
    statusDot.style.background = "#7ee0b5";
    statusDot.style.boxShadow = "0 0 12px #7ee0b5";
    // Let the full sunrise finish (5.2s), then hold the complete emblem for 3s.
    later(() => {
      setScene("finale");
    }, 5200 + 3000);
  }
  function startCountdown() {
    if (running) return;
    clearSequence();
    running = true;
    setScene("portal");
    portalLogo.classList.remove("materialize");
    portal.classList.remove("particles-on", "energy-burst");
    countdown.style.opacity = "1";
    countdownLabel.textContent = "PORTAL CHARGING";
    statusText.textContent = "ENERGY CORE INITIALIZING";
    statusDot.style.background = "#d7a343";
    statusDot.style.boxShadow = "0 0 10px #d7a343";
    let value = 10;
    setCount(value);
    // A visible countdown number is shown for one second each: 10, 9, ... 1.
    const tick = () => {
      value -= 1;
      if (value >= 1) {
        setCount(value);
        if (value <= 7) countdownLabel.textContent = "PORTAL SYNCHRONIZING";
        if (value <= 4) {
          countdownLabel.textContent = "CHANNELING ENERGY";
          statusText.textContent = "PORTAL ENERGY STABILIZING";
        }
        if (value === 1) {
          countdownLabel.textContent = "IDENTITY MATERIALIZING";
          statusText.textContent = "REVEALING GSFCU VOICE";
          later(showFinale, 1000);
          return;
        }
        later(tick, 1000);
      }
    };
    later(tick, 1000);
  }
  function replay() {
    clearSequence();
    portalLogo.classList.remove("materialize");
    portal.classList.remove("particles-on", "energy-burst");
    countdown.style.opacity = "1";
    setScene("intro");
  }
  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (_) {
      statusText.textContent = "FULLSCREEN NOT AVAILABLE";
    }
  }

  // Keep the CTA safe until the user supplies the real app URL.
  visitLink.href = APP_URL;
visitLink.target = "_blank";
visitLink.rel = "noopener noreferrer";

urlNote.textContent = "Opens GSFCU Voice in a new tab.";

visitLink.addEventListener("click", () => {
  urlNote.textContent = "Opening GSFCU Voice...";
});

  startButton.addEventListener("click", startCountdown);
  replayButton.addEventListener("click", replay);
  fullscreenButton.addEventListener("click", toggleFullscreen);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && current === "intro") startCountdown();
    if (event.key.toLowerCase() === "r") replay();
    if (event.code === "Space" && current === "portal") {
      event.preventDefault();
      clearSequence();
      showFinale();
    }
    if (event.key === "Escape" && document.fullscreenElement) document.exitFullscreen();
  });
})();