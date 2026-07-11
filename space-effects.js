// Seasonal background effects. Summer mode renders sun, clouds, waves, and beach objects.
class SeasonalScene {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.mode = 'summer';
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.stars = [];
        this.clouds = [];
        this.sparkles = [];
        this.waveLines = [];
        this.floaters = [];
        this.gulls = [];
        this.floaterImages = this.loadFloaterImages();

        this.init();
    }

    init() {
        this.canvas.id = 'space-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        document.body.insertBefore(this.canvas, document.body.firstChild);

        this.resize();
        this.mode = this.detectThemeMode();
        this.seedByMode();

        window.addEventListener('resize', () => {
            this.resize();
            this.seedByMode();
        });

        const observer = new MutationObserver(() => {
            const nextMode = this.detectThemeMode();
            if (nextMode !== this.mode) {
                this.mode = nextMode;
                this.seedByMode();
            }
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    detectThemeMode() {
        const bodyClass = document.body.className;
        if (bodyClass.includes('theme-original')) {
            return 'original';
        }
        if (bodyClass.includes('theme-winter')) {
            return 'winter';
        }
        if (bodyClass.includes('theme-autumn')) {
            return 'autumn';
        }
        if (bodyClass.includes('theme-spring')) {
            return 'spring';
        }
        return 'summer';
    }

    random(min, max) {
        return Math.random() * (max - min) + min;
    }

    loadFloaterImages() {
        const sources = {
            boat1: 'Images/season_icons/boat1.png',
            boat2: 'Images/season_icons/boat2.png',
            cocktail: 'Images/season_icons/cocktail.png',
            volleyball: 'Images/season_icons/volleyball.png'
        };

        const images = {};
        for (const [name, src] of Object.entries(sources)) {
            const img = new Image();
            img.src = src;
            images[name] = img;
        }

        return images;
    }

    seedByMode() {
        this.stars = [];
        this.clouds = [];
        this.sparkles = [];
        this.waveLines = [];
        this.floaters = [];
        this.gulls = [];

        if (this.mode === 'original') {
            this.seedOriginal();
            return;
        }

        const cloudCount = this.reducedMotion ? 4 : 8;
        for (let i = 0; i < cloudCount; i++) {
            this.clouds.push({
                x: this.random(-220, this.canvas.width + 220),
                y: this.random(40, this.canvas.height * 0.5),
                size: this.random(55, 130),
                speed: this.random(0.08, 0.24),
                alpha: this.random(0.2, 0.42)
            });
        }

        const sparkleCount = this.reducedMotion ? 18 : 42;
        for (let i = 0; i < sparkleCount; i++) {
            this.sparkles.push({
                x: this.random(0, this.canvas.width),
                y: this.random(this.canvas.height * 0.08, this.canvas.height * 0.95),
                r: this.random(1, 3),
                phase: this.random(0, Math.PI * 2),
                drift: this.random(0.08, 0.22)
            });
        }

        for (let i = 0; i < 3; i++) {
            this.waveLines.push({
                y: this.canvas.height * (0.7 + i * 0.06),
                amp: 6 + i * 3,
                len: 0.01 + i * 0.004,
                speed: 0.014 + i * 0.005,
                width: 1.4 + i
            });
        }

        const floaterCount = this.reducedMotion ? 4 : 8;
        const floaterKinds = ['boat1', 'boat2', 'cocktail', 'volleyball'];
        for (let i = 0; i < floaterCount; i++) {
            this.floaters.push({
                x: this.random(20, this.canvas.width - 20),
                y: this.random(this.canvas.height * 0.58, this.canvas.height * 0.9),
                size: this.random(12, 20),
                type: floaterKinds[i % floaterKinds.length],
                phase: this.random(0, Math.PI * 2),
                speed: this.random(0.008, 0.018),
                driftX: this.random(0.08, 0.28)
            });
        }

        const gullCount = this.reducedMotion ? 2 : 4;
        for (let i = 0; i < gullCount; i++) {
            this.gulls.push({
                x: this.random(-200, this.canvas.width),
                y: this.random(70, this.canvas.height * 0.35),
                speed: this.random(0.3, 0.7),
                flap: this.random(0, Math.PI * 2)
            });
        }
    }

    seedOriginal() {
        const starCount = this.reducedMotion ? 70 : 130;
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: this.random(0, this.canvas.width),
                y: this.random(0, this.canvas.height),
                size: this.random(0.5, 2.2),
                alpha: this.random(0.25, 0.95),
                phase: this.random(0, Math.PI * 2)
            });
        }
    }

    drawOriginal() {
        for (const star of this.stars) {
            const twinkle = (Math.sin(star.phase) + 1) * 0.5;
            this.ctx.fillStyle = `rgba(220, 238, 255, ${star.alpha * (0.45 + twinkle * 0.55)})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
            star.phase += 0.015;
        }
    }

    drawSun(time) {
        const x = this.canvas.width * 0.86;
        const y = this.canvas.height * 0.14;
        const pulse = 1 + Math.sin(time * 0.0014) * 0.04;
        const radius = Math.min(this.canvas.width, this.canvas.height) * 0.08 * pulse;

        const glow = this.ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius * 3.6);
        glow.addColorStop(0, 'rgba(255, 234, 143, 0.85)');
        glow.addColorStop(0.3, 'rgba(255, 204, 86, 0.45)');
        glow.addColorStop(1, 'rgba(255, 204, 86, 0)');
        this.ctx.fillStyle = glow;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * 3.6, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#ffd54f';
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawCloud(cloud) {
        this.ctx.save();
        this.ctx.fillStyle = `rgba(255, 255, 255, ${cloud.alpha})`;

        this.ctx.beginPath();
        this.ctx.arc(cloud.x, cloud.y, cloud.size * 0.48, 0, Math.PI * 2);
        this.ctx.arc(cloud.x + cloud.size * 0.36, cloud.y - cloud.size * 0.16, cloud.size * 0.36, 0, Math.PI * 2);
        this.ctx.arc(cloud.x + cloud.size * 0.72, cloud.y, cloud.size * 0.42, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();

        cloud.x += cloud.speed;
        if (cloud.x > this.canvas.width + cloud.size * 1.3) {
            cloud.x = -cloud.size * 1.4;
            cloud.y = this.random(40, this.canvas.height * 0.45);
        }
    }

    drawSparkles(time) {
        for (const sparkle of this.sparkles) {
            const shimmer = 0.5 + Math.sin(time * 0.002 + sparkle.phase) * 0.5;
            const r = sparkle.r * (0.75 + shimmer * 0.6);
            this.ctx.fillStyle = `rgba(255, 249, 214, ${0.12 + shimmer * 0.48})`;
            this.ctx.beginPath();
            this.ctx.arc(sparkle.x, sparkle.y, r, 0, Math.PI * 2);
            this.ctx.fill();

            sparkle.phase += sparkle.drift * 0.02;
            sparkle.y += Math.sin(sparkle.phase) * 0.1;
        }
    }

    drawWaves(time) {
        for (const wave of this.waveLines) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(201, 248, 255, ${0.22 + wave.width * 0.05})`;
            this.ctx.lineWidth = wave.width;

            for (let x = 0; x <= this.canvas.width; x += 6) {
                const y = wave.y + Math.sin(x * wave.len + time * wave.speed) * wave.amp;
                if (x === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }

            this.ctx.stroke();
        }
    }

    drawFloaters(time) {
        for (const floater of this.floaters) {
            const bob = Math.sin(time * floater.speed + floater.phase) * 6;
            const x = floater.x;
            const y = floater.y + bob;
            const img = this.floaterImages[floater.type];

            if (img && img.complete && img.naturalWidth > 0) {
                const aspect = img.naturalWidth / img.naturalHeight;
                const drawHeight = floater.size * 1.5;
                const drawWidth = drawHeight * aspect;

                this.ctx.save();
                this.ctx.globalAlpha = 0.72;
                this.ctx.drawImage(img, x - drawWidth / 2, y - drawHeight / 2, drawWidth, drawHeight);
                this.ctx.restore();
            }

            floater.x += floater.driftX;
            if (floater.x > this.canvas.width + floater.size * 2) {
                floater.x = -floater.size * 2;
                floater.y = this.random(this.canvas.height * 0.58, this.canvas.height * 0.9);
            }
        }
    }

    drawGulls(time) {
        for (const gull of this.gulls) {
            const flap = Math.sin(time * 0.008 + gull.flap) * 5;
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();
            this.ctx.moveTo(gull.x - 12, gull.y);
            this.ctx.quadraticCurveTo(gull.x - 6, gull.y - flap, gull.x, gull.y);
            this.ctx.quadraticCurveTo(gull.x + 6, gull.y - flap, gull.x + 12, gull.y);
            this.ctx.stroke();

            gull.x += gull.speed;
            if (gull.x > this.canvas.width + 20) {
                gull.x = -40;
                gull.y = this.random(60, this.canvas.height * 0.34);
            }
        }
    }

    drawSummer(time) {
        this.drawSun(time);
        this.clouds.forEach((cloud) => this.drawCloud(cloud));
        this.drawSparkles(time);
        this.drawWaves(time);
        this.drawFloaters(time);
        this.drawGulls(time);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const time = performance.now();
        if (this.mode === 'original') {
            this.drawOriginal();
        } else {
            this.drawSummer(time);
        }

        requestAnimationFrame(() => this.animate());
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SeasonalScene();
    });
} else {
    new SeasonalScene();
}
