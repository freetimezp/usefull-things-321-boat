const rainCanvas = document.getElementById("rain");
const splashCanvas = document.getElementById("splashes");

const rCtx = rainCanvas.getContext("2d");
const sCtx = splashCanvas.getContext("2d");

let w, h;
function resize() {
    w = rainCanvas.width = splashCanvas.width = window.innerWidth;
    h = rainCanvas.height = splashCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* =====================
   RAIN PARTICLES
===================== */
const rainDrops = [];
const rainCount = 600;

class Rain {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * -h;
        this.len = Math.random() * 20 + 10;
        this.speed = Math.random() * 10 + 10;
        this.wind = -2;
    }
    update() {
        this.x += this.wind;
        this.y += this.speed;

        if (this.y > h - 200) {
            createSplash(this.x, h - 200);
            this.reset();
        }
    }
    draw() {
        rCtx.beginPath();
        rCtx.moveTo(this.x, this.y);
        rCtx.lineTo(this.x + this.wind, this.y + this.len);
        rCtx.strokeStyle = "rgba(255,255,255,0.4)";
        rCtx.lineWidth = 1;
        rCtx.stroke();
    }
}

for (let i = 0; i < rainCount; i++) rainDrops.push(new Rain());

/* =====================
   SPLASH PARTICLES
===================== */
const splashes = [];

function createSplash(x, y) {
    for (let i = 0; i < 5; i++) {
        splashes.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * -3,
            life: 20,
        });
    }
}

function drawSplashes() {
    sCtx.clearRect(0, 0, w, h);
    splashes.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life--;

        sCtx.beginPath();
        sCtx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        sCtx.fillStyle = "rgba(255,255,255,0.6)";
        sCtx.fill();

        if (p.life <= 0) splashes.splice(i, 1);
    });
}

/* =====================
   LIGHTNING
===================== */
const lightning = document.querySelector(".lightning");
const brand = document.querySelector(".brand");

function strikeLightning() {
    lightning.style.opacity = "0.9";
    brand.style.textShadow = "0 0 30px rgba(255,255,255,0.9)";

    setTimeout(() => {
        lightning.style.opacity = "0";
        brand.style.textShadow = "0 0 12px rgba(255,180,120,0.4)";
    }, 100);

    cta.style.boxShadow = "0 0 60px rgba(255,255,255,0.9)";
    setTimeout(() => {
        cta.style.boxShadow = "";
    }, 1000);
}

setInterval(() => {
    if (Math.random() > 0.7) strikeLightning();
}, 4000);

/* =====================
   ANIMATE
===================== */
function animate() {
    rCtx.clearRect(0, 0, w, h);

    rainDrops.forEach((d) => {
        d.update();
        d.draw();
    });

    drawSplashes();
    requestAnimationFrame(animate);
}
animate();

/* =====================
   LOGO STAGGER
===================== */
const letters = document.querySelectorAll(".logo span");

letters.forEach((letter, i) => {
    letter.style.animationDelay = `${0.6 + i * 0.08}s`;
});

/* =====================
   CTA INTERACTIONS
===================== */
const cta = document.querySelector(".cta");

cta.addEventListener("mousemove", (e) => {
    const rect = cta.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    cta.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.05)`;
});

cta.addEventListener("mouseleave", () => {
    cta.style.transform = "translate(0,0) scale(1)";
});

/* Ripple */
cta.addEventListener("click", (e) => {
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${e.offsetX}px`;
    ripple.style.top = `${e.offsetY}px`;
    cta.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
});
