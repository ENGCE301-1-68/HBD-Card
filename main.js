const envSection = document.getElementById('envelope-section');
const decoLayer = document.getElementById('decoration-layer');
const bdaySection = document.getElementById('birthday-section');
const cakeContainer = document.getElementById('cake-container');
const flame = document.getElementById('flame');
const hbdText = document.getElementById('hbd-text');
const instruction = document.getElementById('instruction-text');
const smokeContainer = document.getElementById('smoke-container');

let isCandleLit = true;
let confettiInterval = null;

// --- 1. ตกแต่งหน้าแรก ---
function initDecorations() {
    const symbols = ['❤', '★', '●', '✦'];
    const colors = ['#ffafcc', '#b5ead7', '#ffde59', '#bc4749'];
    for (let i = 0; i < 20; i++) {
        const div = document.createElement('div');
        div.className = 'floating-item';
        div.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
        div.style.left = Math.random() * 100 + 'vw';
        div.style.top = Math.random() * 100 + 'vh';
        div.style.color = colors[Math.floor(Math.random() * colors.length)];
        div.style.fontSize = Math.random() * 20 + 10 + 'px';
        decoLayer.appendChild(div);

        gsap.to(div, {
            y: "random(-40, 40)", x: "random(-40, 40)", rotation: "random(-360, 360)",
            duration: "random(3, 5)", repeat: -1, yoyo: true, ease: "sine.inOut"
        });
    }
}
initDecorations();

// --- 2. เปิดซอง ---
gsap.to('.envelope', { scale: 1.05, duration: 1.2, repeat: -1, yoyo: true, ease: "power1.inOut" });

document.getElementById('envelope').addEventListener('click', () => {
    gsap.killTweensOf('.envelope');
    const tl = gsap.timeline();
    tl.to('.wax-seal-container', { scale: 0, opacity: 0, duration: 0.2 })
      .to('.flap', { rotationX: 180, duration: 0.4, ease: "power2.inOut" })
      .to(['#envelope-section', '#decoration-layer'], { 
          y: 150, opacity: 0, duration: 0.4, ease: "back.in(1.2)",
          onComplete: () => {
              envSection.style.display = 'none';
              decoLayer.style.display = 'none';
              runCakeSequence();
          }
      });
});

// --- 3. ฉากเค้ก ---
function runCakeSequence() {
    bdaySection.classList.remove('hidden');
    gsap.to(bdaySection, { opacity: 1, duration: 0.3 });
    
    gsap.set(['.layer-bottom', '.layer-middle', '.layer-top'], { y: -800, opacity: 1, scaleY: 1.5 });
    gsap.set('.candle', { scale: 0, opacity: 1 });

    const tl = gsap.timeline();
    tl.to('.layer-bottom', { y: 0, scaleY: 1, duration: 0.6, ease: "bounce.out" })
      .to('.layer-middle', { y: 0, scaleY: 1, duration: 0.5, ease: "bounce.out" }, "-=0.35")
      .to('.layer-top', { y: 0, scaleY: 1, duration: 0.4, ease: "bounce.out" }, "-=0.3")
      .to('.layer', { scaleY: 0.9, scaleX: 1.1, duration: 0.1, repeat: 1, yoyo: true })
      .to('.candle', { scale: 1, duration: 0.3, ease: "back.out(2)" })
      .to(instruction, { opacity: 1, y: -10, duration: 0.4, delay: 0.2 })
      .to(flame, { scaleY: 1.2, scaleX: 1.1, duration: 0.6, repeat: -1, yoyo: true, ease: "sine.inOut" });
}

// --- 4. คลิกเค้ก ---
cakeContainer.addEventListener('click', () => {
    gsap.killTweensOf(flame);
    gsap.killTweensOf(instruction);
    gsap.killTweensOf(hbdText);

    if (isCandleLit) {
        gsap.to(flame, { opacity: 0, scale: 0, duration: 0.2 });
        gsap.to(instruction, { opacity: 0, y: 10, duration: 0.2, overwrite: true });
        
        gsap.set(smokeContainer, { opacity: 1 });
        gsap.to('.smoke', {
            y: -120, x: 'random(-20, 20)', opacity: 0, scale: 3,
            stagger: 0.05, duration: 1.5, ease: "power2.out",
            onComplete: () => gsap.set(smokeContainer, { opacity: 0 })
        });

        gsap.to(hbdText, { 
            opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)",
            onStart: triggerGrandFireworks 
        });

        isCandleLit = false;
    } else {
        stopGrandFireworks();
        gsap.to(hbdText, { opacity: 0, scale: 0, duration: 0.3 });
        gsap.to(flame, { 
            opacity: 1, scale: 1, duration: 0.3, delay: 0.2,
            onComplete: () => {
                gsap.to(flame, { scaleY: 1.2, scaleX: 1.1, duration: 0.6, repeat: -1, yoyo: true, ease: "sine.inOut" });
            }
        });
        gsap.to(instruction, { opacity: 1, y: -10, duration: 0.4, delay: 0.4, overwrite: true });
        isCandleLit = true;
    }
});

// --- 5. พลุฉลอง ---
function triggerGrandFireworks() {
    if (confettiInterval) stopGrandFireworks();
    
    const duration = 5 * 1000; 
    const animationEnd = Date.now() + duration;

    confettiInterval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return stopGrandFireworks();

        const particleCount = 20 * (timeLeft / duration);

        confetti({
            particleCount, angle: 60, spread: 55, origin: { x: 0, y: 0.8 },
            colors: ['#ffafcc', '#ffde59', '#b5ead7', '#ffffff']
        });
        confetti({
            particleCount, angle: 120, spread: 55, origin: { x: 1, y: 0.8 },
            colors: ['#ffafcc', '#ffde59', '#b5ead7', '#ffffff']
        });
    }, 150);
}

function stopGrandFireworks() {
    if (confettiInterval) {
        clearInterval(confettiInterval);
        confettiInterval = null;
    }
}