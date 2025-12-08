// holiday-decor.js (Single file, no modules, no imports/exports)

let activeFireworks = 0;
const MAX_FIREWORKS = 10;
// Global flag to prevent multiple 'pop' intervals from being set up
let isPopIntervalRunning = false; 

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
// --- Helper Functions (Now defined in the global scope) ---

function createExplosion(x, height, items) {
    const particleCount = 6 + Math.floor(Math.random() * 5);

    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.classList.add('firework-particle');
        
        // particle style
        p.style.position = 'fixed';
        p.style.left = `${x}px`;
        p.style.bottom = `${height + 40}px`;
        p.style.width = '6px';
        p.style.height = '6px';
        p.style.borderRadius = '50%';
        p.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;
        p.style.zIndex = 9998;

        // random scatter direction
        p.style.transform = `translate(${Math.random()*80 - 40}px, ${Math.random()*80 - 40}px)`;

        // animation
        p.style.animation = `firework-particle 0.7s ease-out forwards`;

        document.body.appendChild(p);

        // cleanup
        p.addEventListener('animationend', () => p.remove());
    }

    // Initialize the recurring 'pop' interval ONLY IF it hasn't started yet
    if (items.type === 'pop' && !isPopIntervalRunning) {
        isPopIntervalRunning = true;
        setInterval(() => createDecorItem(items.src, 'pop', items), 700);
    }
}

function createDecorItem(src, type, items) {
    const el = document.createElement('img');

    // --- NEW: if src is an array, pick one at random ---
    const finalSrc = Array.isArray(src)
        ? src[Math.floor(Math.random() * src.length)]
        : src;

    el.src = finalSrc;
    el.className = 'holiday-decor-item';

    // random size (60–160px)
    const size = 40 + Math.random() * 80;
    
    el.style.width = `${size}px`;
    el.style.setProperty('--item-opacity', (0.35 + Math.random() * 0.65).toString());

    // random horizontal position
    el.style.left = `${Math.random() * window.innerWidth}px`;

    if (type === 'rain') {
        el.style.top = '-80px';
        el.style.animation = `rain ${5 + Math.random() * 5}s linear forwards`;
    } 
    else if (type === 'pop') {
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

        // Pass full item object for explode logic
        setTimeout(() => createExplosion(x, height, items), 1300);
    }

    document.body.appendChild(el);

    if (type === 'rain') {
        el.addEventListener('animationend', () => el.remove());
    }
}

// Function to start the decoration process
function startHolidayDecorations(items) {
    // Create initial items
    for (let i = 0; i < items.count; i++) {
        // Pass the full 'items' object to ensure the helpers have the context they need
        setTimeout(() => createDecorItem(items.src, items.type, items), i * 400); 
    }

    // Ongoing rain
    if (items.type === 'rain') {
        setInterval(() => createDecorItem(items.src, 'rain'), 1200);
    }
    // 'pop' interval is handled inside createExplosion to ensure the first one fires correctly.
}

// -------------------------------------------------------------------
// --- Main Execution Logic (Remains the same) ---

const month = 11;//new Date().getMonth();

if (holidayDecor[month]) {
    const { panel, items } = holidayDecor[month];

    // Add floating sidebar panel
    const panelEl = document.createElement('div');
    panelEl.className = 'holiday-panel';
    panelEl.innerHTML = `<img src="${panel}" alt="">`;
    document.body.appendChild(panelEl);

    // Call the refactored main function
    startHolidayDecorations(items);
}

// --- Panel Overlap Check Logic (Remains the same) ---
const panelEl = document.querySelector('.holiday-panel');
const aboutSection = document.querySelector('.about');
const experienceSection = document.querySelectorAll('.experience-item');
const skillsSection = document.querySelector('.skills');

function checkPanelOverlap() {
    if (!panelEl) return;

    const panelRect = panelEl.getBoundingClientRect();

    // Helper to check if two rects overlap
    function isOverlapping(rect1, rect2) {
        return !(
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom ||
            rect1.right < rect2.left ||
            rect1.left > rect2.right
        );
    }

    let hide = false;

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

// Initial check
checkPanelOverlap();