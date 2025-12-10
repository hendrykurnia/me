// holiday-decor.js (Full code with Tab Focus Reset and Slow Rain)

let activeFireworks = 0;
const MAX_FIREWORKS = 10;
// Global flag to prevent multiple 'pop' intervals from being set up
let isPopIntervalRunning = false;

// Global variables to store interval IDs for cleanup
let popIntervalId = null;
let rainIntervalId = null;

// Holiday decor mapping (Remains the same)
const holidayDecor = {
    0: {
        panel: 'holiday-decor/decorations/new-year.png',
        items: {
            src: [
                'holiday-decor/decorations/firework1.png',
                'holiday-decor/decorations/firework2.png',
            ],
            type: 'pop',
            count: 10
        }
    },
    6: {
        panel: 'holiday-decor/decorations/july-4th.png',
        items: {
            src: [
                'holiday-decor/decorations/confetti1.png'
            ],
            type: 'pop',
            count: 12
        }
    },
    9: {
        panel: 'holiday-decor/decorations/halloween.png',
        items: {
            src: [
                'holiday-decor/decorations/pumpkin.png',
                'holiday-decor/decorations/spider.png',
                'holiday-decor/decorations/bat.png'
            ],
            type: 'rain',
            count: 20
        }
    },
    10: {
        panel: 'holiday-decor/decorations/thanksgiving.png',
        items: {
            src: [
                'holiday-decor/decorations/maple-leaf1.png',
                'holiday-decor/decorations/maple-leaf2.png'
            ],
            type: 'rain',
            count: 20
        }
    },
    11: {
        panel: 'holiday-decor/decorations/christmas.png',
        items: {
            src: [
                'holiday-decor/decorations/snowflake1.png',
                'holiday-decor/decorations/snowflake2.png',
                'holiday-decor/decorations/candy.png'
            ],
            type: 'rain',
            count: 25
        }
    }
};

// -------------------------------------------------------------------
// --- Helper Functions ---

function createExplosion(x, height, items) {
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

    // Pop interval is now handled here and only runs if visible
    if (items.type === 'pop' && document.visibilityState === 'visible' && !isPopIntervalRunning) {
        isPopIntervalRunning = true;
        popIntervalId = setInterval(() => createDecorItem(items.src, 'pop', items), 700);
    }
}

function createDecorItem(src, type, items) {
    const el = document.createElement('img');
    const finalSrc = Array.isArray(src) ? src[Math.floor(Math.random() * src.length)] : src;
    el.src = finalSrc;
    el.className = 'holiday-decor-item';

    const size = 40 + Math.random() * 80;
    el.style.width = `${size}px`;
    el.style.setProperty('--item-opacity', (0.35 + Math.random() * 0.65).toString());
    el.style.left = `${Math.random() * window.innerWidth}px`;

    if (type === 'rain') {
        el.style.top = '-80px';
        // --- SLOWER FALL SPEED: Duration 10s to 20s ---
        el.style.animation = `rain ${10 + Math.random() * 10}s linear forwards`;
        
        document.body.appendChild(el);
        el.addEventListener('animationend', () => el.remove());
    } else if (type === 'pop') {
        if (activeFireworks >= MAX_FIREWORKS) return;

        activeFireworks++;
        const x = Math.random() * window.innerWidth;
        el.style.left = `${x}px`;
        el.style.bottom = '-40px';
        const height = Math.floor(250 + Math.random() * 250);
        el.style.setProperty('--launch-height', `-${height}px`);
        el.style.setProperty('--rot-start', `${Math.random() * 40 - 20}deg`);
        el.style.setProperty('--rot-mid', `${Math.random() * 40 - 20}deg`);
        el.style.setProperty('--rot-end', `${Math.random() * 40 - 20}deg`);
        el.style.animation = `firework-launch ${1.5 + Math.random() * 0.7}s ease-out forwards`;
        document.body.appendChild(el);
        
        el.addEventListener('animationend', () => {
            el.remove();
            activeFireworks--;
        });
        setTimeout(() => createExplosion(x, height, items), 1300);
    }
}

// Function to stop the decoration process and clean up intervals and elements
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

    // Remove all existing decor items and particles from the DOM
    document.querySelectorAll('.holiday-decor-item').forEach(el => el.remove());
    document.querySelectorAll('.firework-particle').forEach(el => el.remove());
    
    // Remove the panel element if it exists
    const panelEl = document.querySelector('.holiday-panel');
    if (panelEl) {
        panelEl.remove();
    }
}

// Function to start the decoration process (NOTE: No continuous interval here anymore!)
function startHolidayDecorations(items) {
    // Create initial items
    for (let i = 0; i < items.count; i++) {
        setTimeout(() => createDecorItem(items.src, items.type, items), i * 400);
    }

    // The continuous 'rain' interval is now handled by the visibilitychange listener.
    // The continuous 'pop' interval is handled inside createExplosion on the first fire.
}

// -------------------------------------------------------------------
// --- Main Execution and Event Listeners ---

const aboutSection = document.querySelector('.about');
const experienceSection = document.querySelectorAll('.experience-item');
const skillsSection = document.querySelector('.skills');
const headerElement = document.querySelector('header');

// Function to run when the tab visibility changes (handles reset and start/stop)
const handleVisibilityChange = () => {
    const isVisible = document.visibilityState === 'visible';
    const currentMonth = new Date().getMonth(); // Use fixed month for testing

    // --- CRITICAL: Always reset and restart on visible ---
    if (isVisible) {
        stopHolidayDecorations(); // 1. Cleanup old decorations and intervals

        if (holidayDecor[currentMonth]) {
            const { panel, items } = holidayDecor[currentMonth];

            // 2. Add panel
            const panelEl = document.createElement('div');
            panelEl.className = 'holiday-panel';
            panelEl.innerHTML = `<img src="${panel}" alt="">`;
            document.body.appendChild(panelEl);

            // 3. Start initial burst/launch
            startHolidayDecorations(items);

            // 4. Start continuous rain animation (if applicable)
            if (items.type === 'rain' && rainIntervalId === null) {
                // Change 1200 to 2500 or higher for less frequent rain generation
                rainIntervalId = setInterval(() => createDecorItem(items.src, 'rain'), 2500);
            }
        }
        checkPanelOverlap(); // 5. Run initial overlap check
    } else {
        // --- Tab is HIDDEN: Stop continuous animations ---
        stopHolidayDecorations(); 
    }
};

// 1. Initial run on page load
handleVisibilityChange();

// 2. Add event listener for tab switching
document.addEventListener('visibilitychange', handleVisibilityChange);

// --- Panel Overlap Check Logic (Remains the same) ---
function checkPanelOverlap() {
    const panelEl = document.querySelector('.holiday-panel');
    if (!panelEl) return;
    const panelRect = panelEl.getBoundingClientRect();

    function isOverlapping(rect1, rect2) {
        return !(
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom ||
            rect1.right < rect2.left ||
            rect1.left > rect2.right
        );
    }

    let hide = false;
    if (headerElement && isOverlapping(panelRect, headerElement.getBoundingClientRect())) hide = true;
    if (aboutSection && isOverlapping(panelRect, aboutSection.getBoundingClientRect())) hide = true;
    if (skillsSection && isOverlapping(panelRect, skillsSection.getBoundingClientRect())) hide = true;
    if (experienceSection) {
        experienceSection.forEach(item => {
            if (isOverlapping(panelRect, item.getBoundingClientRect())) hide = true;
        });
    }

    if (hide) {
        panelEl.style.opacity = '0';
        panelEl.style.pointerEvents = 'none';
    } else {
        panelEl.style.opacity = '1';
        panelEl.style.pointerEvents = 'auto';
    }
}

// Run on scroll and resize
window.addEventListener('scroll', checkPanelOverlap);
window.addEventListener('resize', checkPanelOverlap);