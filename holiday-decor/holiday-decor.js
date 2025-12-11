// -------------------------------------------------------------------
// holiday-decor.js — Refactored Version with per-item size
// -------------------------------------------------------------------

let activeFireworks = 0;
const MAX_FIREWORKS = 10;

let isPopIntervalRunning = false;
let popIntervalId = null;
let rainIntervalId = null;

// -------------------------------------------------------------------
// NEW holidayDecor Structure with size
// -------------------------------------------------------------------

const holidayDecor = {
    0: {
        panel: {
            items: ['holiday-decor/decorations/new-year.png'],
            effect: 'jump', // none | dance | jump
            size: 240
        },
        ornament: {
            items: [
                'holiday-decor/decorations/firework1.png',
                'holiday-decor/decorations/firework2.png'
            ],
            effect: 'pop',
            "min-size": 60,
            "max-size": 180
        }
    },
    6: {
        panel: {
            items: ['holiday-decor/decorations/july-4th.png'],
            effect: 'jump',
            size: 200
        },
        ornament: {
            items: ['holiday-decor/decorations/confetti1.png'],
            effect: 'pop',
            "min-size": 60,
            "max-size": 180
        }
    },
    9: {
        panel: {
            items: ['holiday-decor/decorations/halloween.png'],
            effect: 'dance',
            size: 260
        },
        ornament: {
            items: [
                'holiday-decor/decorations/pumpkin.png',
                'holiday-decor/decorations/spider.png',
                'holiday-decor/decorations/bat.png'
            ],
            effect: 'rain',
            "min-size": 40,
            "max-size": 120
        }
    },
    10: {
        panel: {
            items: ['holiday-decor/decorations/thanksgiving.png'],
            effect: 'jump',
            size: 280
        },
        ornament: {
            items: [
                'holiday-decor/decorations/maple-leaf1.png',
                'holiday-decor/decorations/maple-leaf2.png'
            ],
            effect: 'rain',
            "min-size": 60,
            "max-size": 100
        }
    },
    11: {
        panel: {
            items: ['holiday-decor/decorations/christmas.png'],
            effect: 'dance',
            size: 200
        },
        ornament: {
            items: [
                'holiday-decor/decorations/snowflake1.png',
                'holiday-decor/decorations/snowflake2.png'
            ],
            effect: 'rain',
            "min-size": 40,
            "max-size": 100
        }
    }
};

// -------------------------------------------------------------------
// Panel Effects
// -------------------------------------------------------------------

function applyPanelDanceEffect(panelEl) {
    panelEl.style.animation = `dance 4s ease-in-out infinite`;
}

function applyPanelJumpEffect(panelEl) {
    panelEl.style.animation = `jump 1.8s ease-in-out infinite`;
}

function applyPanelEffect(panelEl, effect) {
    if (!effect || effect === 'none') return;
    if (effect === 'dance') applyPanelDanceEffect(panelEl);
    if (effect === 'jump') applyPanelJumpEffect(panelEl);
}

// -------------------------------------------------------------------
// Ornament Effects
// -------------------------------------------------------------------

// Rain (slow fall)
function runRainEffect(el, srcList, ornament) {
    const finalSrc = srcList[Math.floor(Math.random() * srcList.length)];
    el.src = finalSrc;

    // Size based on ornament payload
    const size = ornament["min-size"] + Math.random() * (ornament["max-size"] - ornament["min-size"]);
    el.style.width = `${size}px`;

    el.style.top = '-80px';
    el.style.animation = `rain ${10 + Math.random() * 10}s linear forwards`;

    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
}

// Pop (fireworks)
function runPopEffect(el, srcList, ornament) {
    if (activeFireworks >= MAX_FIREWORKS) return;

    const finalSrc = srcList[Math.floor(Math.random() * srcList.length)];
    el.src = finalSrc;

    // Size based on ornament payload
    const size = ornament["min-size"] + Math.random() * (ornament["max-size"] - ornament["min-size"]);
    el.style.width = `${size}px`;

    activeFireworks++;

    const x = Math.random() * window.innerWidth;
    const height = 250 + Math.random() * 250;

    el.style.left = `${x}px`;
    el.style.bottom = '-40px';
    el.style.setProperty('--launch-height', `-${height}px`);
    el.style.setProperty('--rot-start', `${Math.random()*40-20}deg`);
    el.style.setProperty('--rot-mid', `${Math.random()*40-20}deg`);
    el.style.setProperty('--rot-end', `${Math.random()*40-20}deg`);
    el.style.animation = `firework-launch ${1.5 + Math.random() * 0.7}s ease-out forwards`;

    document.body.appendChild(el);

    el.addEventListener('animationend', () => {
        el.remove();
        activeFireworks--;
        createExplosion(x, height);
    });

    if (!isPopIntervalRunning) {
        isPopIntervalRunning = true;
        popIntervalId = setInterval(() => {
            const newEl = document.createElement('img');
            newEl.className = 'holiday-decor-item';
            runPopEffect(newEl, srcList, ornament);
        }, 700);
    }
}

// Pop explosion particles
function createExplosion(x, height) {
    const particleCount = 6 + Math.floor(Math.random() * 5);
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.classList.add('firework-particle');
        p.style.position = 'fixed';
        p.style.left = `${x}px`;
        p.style.bottom = `${height + 40}px`;
        p.style.width = '6px';
        p.style.height = '6px';
        p.style.borderRadius = '50%';
        p.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;
        p.style.zIndex = 9998;
        p.style.transform = `translate(${Math.random()*80 - 40}px, ${Math.random()*80 - 40}px)`;
        p.style.animation = 'firework-particle 0.7s ease-out forwards';

        document.body.appendChild(p);
        p.addEventListener('animationend', () => p.remove());
    }
}

// -------------------------------------------------------------------
// Item Creation
// -------------------------------------------------------------------

function createDecorItem(srcList, effect, ornament) {
    const el = document.createElement('img');
    el.className = 'holiday-decor-item';

    if (effect === 'rain') runRainEffect(el, srcList, ornament);
    else if (effect === 'pop') runPopEffect(el, srcList, ornament);
    else {
        const size = ornament.size || 80;
        el.style.width = `${size}px`;
        el.src = srcList[Math.floor(Math.random() * srcList.length)];
        document.body.appendChild(el);
    }

    el.style.left = `${Math.random() * window.innerWidth}px`;
    el.style.setProperty('--item-opacity', (0.35 + Math.random() * 0.65).toString());
}

// -------------------------------------------------------------------
// Start / Stop Decorations
// -------------------------------------------------------------------

function stopHolidayDecorations() {
    if (rainIntervalId !== null) {
        clearInterval(rainIntervalId);
        rainIntervalId = null;
    }

    if (popIntervalId !== null) {
        clearInterval(popIntervalId);
        popIntervalId = null;
        isPopIntervalRunning = false;
    }

    document.querySelectorAll('.holiday-decor-item').forEach(el => el.remove());
    document.querySelectorAll('.firework-particle').forEach(el => el.remove());

    const panelEl = document.querySelector('.holiday-panel');
    if (panelEl) panelEl.remove();
}

function startHolidayDecorations(ornament) {
    for (let i = 0; i < ornament.items.length; i++) {
        setTimeout(() => createDecorItem(ornament.items, ornament.effect, ornament), i * 400);
    }
}

// -------------------------------------------------------------------
// Visibility Detection
// -------------------------------------------------------------------

const aboutSection = document.querySelector('.about');
const experienceSection = document.querySelectorAll('.experience-item');
const skillsSection = document.querySelector('.skills');
const headerElement = document.querySelector('header');

function handleVisibilityChange() {
    const isVisible = document.visibilityState === 'visible';
    const currentMonth = new Date().getMonth();

    if (isVisible) {
        stopHolidayDecorations();

        const config = holidayDecor[currentMonth];
        if (config) {
            const { panel, ornament } = config;

            const panelEl = document.createElement('div');
            panelEl.className = 'holiday-panel';
            panelEl.innerHTML = `<img src="${panel.items[0]}" alt="">`;
            document.body.appendChild(panelEl);

            panelEl.style.width = `${panel.size}px`;

            applyPanelEffect(panelEl, panel.effect);

            startHolidayDecorations(ornament);

            if (ornament.effect === 'rain' && rainIntervalId === null) {
                rainIntervalId = setInterval(
                    () => createDecorItem(ornament.items, 'rain', ornament),
                    2500
                );
            }
        }

        checkPanelOverlap();
    } else {
        stopHolidayDecorations();
    }
}

handleVisibilityChange();
document.addEventListener('visibilitychange', handleVisibilityChange);

// -------------------------------------------------------------------
// Panel Overlap Logic
// -------------------------------------------------------------------

function checkPanelOverlap() {
    const panelEl = document.querySelector('.holiday-panel');
    if (!panelEl) return;

    const panelRect = panelEl.getBoundingClientRect();

    function isOverlapping(r1, r2) {
        return !(
            r1.bottom < r2.top ||
            r1.top > r2.bottom ||
            r1.right < r2.left ||
            r1.left > r2.right
        );
    }

    let hide = false;

    if (headerElement && isOverlapping(panelRect, headerElement.getBoundingClientRect())) hide = true;
    if (aboutSection && isOverlapping(panelRect, aboutSection.getBoundingClientRect())) hide = true;
    if (skillsSection && isOverlapping(panelRect, skillsSection.getBoundingClientRect())) hide = true;
    experienceSection.forEach(item => {
        if (isOverlapping(panelRect, item.getBoundingClientRect())) hide = true;
    });

    panelEl.style.opacity = hide ? '0' : '1';
    panelEl.style.pointerEvents = hide ? 'none' : 'auto';
}

window.addEventListener('scroll', checkPanelOverlap);
window.addEventListener('resize', checkPanelOverlap);