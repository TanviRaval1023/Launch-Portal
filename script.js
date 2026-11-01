
(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
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

  // Update this URL if your published application URL changes.
  const APP_URL = "http://gsfcuvoice.gsfcuniversity.ac.in/";

  function later(fn, ms) {
    const id = window.setTimeout(() => {
      timers = timers.filter((timerId) => timerId !== id);
      fn();
    }, ms);

    timers.push(id);
  }

  function clearSequence() {
    timers.forEach((id) => window.clearTimeout(id));
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
    try {
      audioContext =
        audioContext ||
        new (window.AudioContext || window.webkitAudioContext)();

      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      const now = audioContext.currentTime;
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = "sine";

      oscillator.frequency.setValueAtTime(
        value === 0 ? 880 : 520 + (10 - value) * 24,
        now
      );

      oscillator.frequency.exponentialRampToValueAtTime(
        value === 0 ? 1320 : 360 + (10 - value) * 18,
        now + 0.14
      );

      gain.gain.setValueAtTime(0.0001, now);

      gain.gain.exponentialRampToValueAtTime(
        value === 0 ? 0.12 : 0.055,
        now + 0.012
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + (value === 0 ? 0.42 : 0.2)
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start(now);
      oscillator.stop(now + (value === 0 ? 0.44 : 0.22));
    } catch (_) {
      // Audio is optional if the browser does not support it.
    }
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
    countdownLabel.style.opacity = "1";

    statusText.textContent = "GSFCU VOICE ONLINE";
    statusDot.style.background = "#7ee0b5";
    statusDot.style.boxShadow = "0 0 12px #7ee0b5";

    /*
     * Logo reveal takes 5.2 seconds.
     * After it finishes, fade out the identity label.
     * Then hold the revealed logo briefly before showing the finale.
     */
    later(() => {
      countdownLabel.style.transition = "opacity 0.8s ease";
      countdownLabel.style.opacity = "0";
    }, 3000);

    // Show the final launch screen after the logo reveal and hold.
    later(() => {
      setScene("finale");
    }, 8200);
  }

  function startCountdown() {
    if (running) return;

    clearSequence();
    running = true;

    setScene("portal");

    portalLogo.classList.remove("materialize");
    portal.classList.remove("particles-on", "energy-burst");

    countdown.style.opacity = "1";
    countdownLabel.style.opacity = "1";
    countdownLabel.style.transition = "";

    countdownLabel.textContent = "PORTAL CHARGING";

    statusText.textContent = "ENERGY CORE INITIALIZING";
    statusDot.style.background = "#d7a343";
    statusDot.style.boxShadow = "0 0 10px #d7a343";

    let value = 10;

    setCount(value);

    const tick = () => {
      value -= 1;

      if (value >= 0) {
        setCount(value);

        if (value <= 7) {
          countdownLabel.textContent = "PORTAL SYNCHRONIZING";
        }

        if (value <= 4) {
          countdownLabel.textContent = "CHANNELING ENERGY";
          statusText.textContent = "PORTAL ENERGY STABILIZING";
        }

        if (value === 1) {
          countdownLabel.textContent = "IDENTITY MATERIALIZING";
          statusText.textContent = "REVEALING GSFCU VOICE";
        }

        if (value === 0) {
          countdownLabel.textContent = "IDENTITY MATERIALIZING";
          statusText.textContent = "REVEALING GSFCU VOICE";

          later(showFinale, 650);
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
    countdown.textContent = "10";

    countdownLabel.style.opacity = "1";
    countdownLabel.style.transition = "";
    countdownLabel.textContent = "PORTAL CHARGING";

    statusText.textContent = "AWAITING START COMMAND";
    statusDot.style.background = "#d7a343";
    statusDot.style.boxShadow = "0 0 10px #d7a343";

    setScene("intro");
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (_) {
      statusText.textContent = "FULLSCREEN NOT AVAILABLE";
    }
  }

  // Configure the application link.
  visitLink.href = APP_URL;
  visitLink.target = "_blank";
  visitLink.rel = "noopener noreferrer";

  urlNote.textContent = "Opens GSFCU Voice in a new tab.";

  visitLink.addEventListener("click", () => {
    urlNote.textContent = "Opening GSFCU Voice...";
  });

  // Controls.
  startButton.addEventListener("click", startCountdown);
  replayButton.addEventListener("click", replay);

  if (fullscreenButton) {
    fullscreenButton.addEventListener("click", toggleFullscreen);
  }

  // Keyboard shortcuts.
  document.addEventListener("keydown", (event) => {
    const target = event.target;

    const typing =
      target instanceof HTMLElement &&
      (
        target.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(
          target.tagName
        )
      );

    if (event.key === "Enter" && current === "intro" && !typing) {
      startCountdown();
    }

    if (event.key.toLowerCase() === "r" && !typing) {
      replay();
    }

    if (
      event.code === "Space" &&
      current === "portal" &&
      !typing
    ) {
      event.preventDefault();
      clearSequence();
      showFinale();
    }

    if (event.key === "Escape" && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  });

  // Keep fullscreen button text synchronized with browser state.
  document.addEventListener("fullscreenchange", () => {
    if (fullscreenButton) {
      fullscreenButton.textContent = document.fullscreenElement
        ? "⛶ EXIT FULLSCREEN"
        : "⛶ FULLSCREEN";
    }
  });
})();
