let activeFireworks = 0;
const MAX_FIREWORKS = 10;  // safe performance limit

// Holiday decor mapping
const holidayDecor = {
    0: {
        panel: 'holiday-decor/decorations/new-year.png',
        items: { src: 'holiday-decor/decorations/firework.png', type: 'pop', count: 10 }
    },
    6: {
        panel: 'holiday-decor/decorations/july-4th.png',
        items: { src: 'holiday-decor/decorations/confetti.png', type: 'pop', count: 12 }
    },
    9: {
        panel: 'holiday-decor/decorations/halloween.png',
        items: { src: 'holiday-decor/decorations/pumpkin.png', type: 'rain', count: 20 }
    },
    10: {
        panel: 'holiday-decor/decorations/thanksgiving.png',
        items: { src: 'holiday-decor/decorations/maple-leaf.png', type: 'rain', count: 20 }
    },
    11: {
        panel: 'holiday-decor/decorations/christmas.png',
        items: { src: 'holiday-decor/decorations/snowflake.png', type: 'rain', count: 25 }
    }
};

const month = 10//new Date().getMonth();

if (holidayDecor[month]) {
    const { panel, items } = holidayDecor[month];

    // Add floating sidebar panel
    const panelEl = document.createElement('div');
    panelEl.className = 'holiday-panel';
    panelEl.innerHTML = `<img src="${panel}" alt="">`;
    document.body.appendChild(panelEl);

    function createDecorItem(src, type) {
        const el = document.createElement('img');
        el.src = src;
        el.className = 'holiday-decor-item';

        // random size (20–60px)
        const size = 60 + Math.random() * 100;
        el.style.width = `${size}px`;

        // random horizontal position
        el.style.left = `${Math.random() * window.innerWidth}px`;

        if (type === 'rain') {
            el.style.top = '-80px';
            el.style.animation = `rain ${5 + Math.random() * 5}s linear forwards`;
        } else if (type === 'pop') {
            // DO NOT create if we're at max fireworks
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
                activeFireworks--;   // IMPORTANT
            });

            setTimeout(() => createExplosion(x, height), 1300);
        }

        document.body.appendChild(el);

        // remove after animation
        el.addEventListener('animationend', () => el.remove());
    }

    function createExplosion(x, height) {
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

        if (items.type === 'pop') {
            setInterval(() => createDecorItem(items.src, 'pop'), 700);
        }
    }

    // Create multiple items
    for (let i = 0; i < items.count; i++) {
        setTimeout(() => createDecorItem(items.src, items.type), i * 400);
    }

    // ongoing rain
    if (items.type === 'rain') {
        setInterval(() => createDecorItem(items.src, 'rain'), 1200);
    }
}