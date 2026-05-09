// Space Effects - Stars, Planets, and Starships
class SpaceScene {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.planets = [];
        this.starships = [];
        this.shootingStars = [];
        this.init();
    }

    init() {
        // Set up canvas
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
        window.addEventListener('resize', () => this.resize());

        // Create stars
        this.createStars(150);
        
        // Create planets
        this.createPlanets();
        
        // Create starships
        this.createStarship();
        
        // Create initial shooting star
        this.createShootingStar();
        
        // Start animation
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createStars(count) {
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2.5 + 0.5,
                baseSize: Math.random() * 2.5 + 0.5,
                speed: Math.random() * 0.5 + 0.1,
                glowPhase: Math.random() * Math.PI * 2,
                glowSpeed: Math.random() * 0.02 + 0.01,
                opacity: Math.random() * 0.5 + 0.5
            });
        }
    }

    createPlanets() {
        const planetTypes = [
            { colors: ['#ff6b35', '#f7931e', '#fdc830'], size: 80, hasRings: false },
            { colors: ['#4facfe', '#00f2fe'], size: 100, hasRings: true },
            { colors: ['#fa709a', '#fee140'], size: 60, hasRings: false },
            { colors: ['#30cfd0', '#330867'], size: 90, hasRings: false },
            { colors: ['#a8edea', '#fed6e3'], size: 70, hasRings: false }
        ];

        // Create 3-5 planets at random positions
        const planetCount = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < planetCount; i++) {
            const type = planetTypes[Math.floor(Math.random() * planetTypes.length)];
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            
            this.planets.push({
                x: x,
                y: y,
                baseX: x,
                baseY: y,
                size: type.size,
                colors: type.colors,
                hasRings: type.hasRings,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.002,
                floatPhase: Math.random() * Math.PI * 2,
                floatSpeed: Math.random() * 0.001 + 0.0005
            });
        }
    }

    createStarship() {
        const startY = Math.random() * this.canvas.height;
        this.starships.push({
            x: -100,
            y: startY,
            width: 60,
            height: 25,
            speed: Math.random() * 3 + 2,
            trailOpacity: 1,
            angle: (Math.random() - 0.5) * 0.3
        });
    }

    drawStar(star) {
        const glowIntensity = (Math.sin(star.glowPhase) + 1) / 2;
        star.size = star.baseSize * (0.8 + glowIntensity * 0.4);
        
        this.ctx.save();
        
        // Outer glow
        const gradient = this.ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * glowIntensity * 0.8})`);
        gradient.addColorStop(0.3, `rgba(200, 220, 255, ${star.opacity * glowIntensity * 0.4})`);
        gradient.addColorStop(1, 'rgba(150, 180, 255, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Core star
        this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Twinkle effect
        if (glowIntensity > 0.7) {
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${(glowIntensity - 0.7) * star.opacity})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(star.x - star.size * 3, star.y);
            this.ctx.lineTo(star.x + star.size * 3, star.y);
            this.ctx.moveTo(star.x, star.y - star.size * 3);
            this.ctx.lineTo(star.x, star.y + star.size * 3);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
        
        star.glowPhase += star.glowSpeed;
    }

    drawPlanet(planet) {
        this.ctx.save();
        
        // Floating animation
        const floatOffset = Math.sin(planet.floatPhase) * 10;
        const currentX = planet.baseX;
        const currentY = planet.baseY + floatOffset;
        
        // Shadow/glow behind planet
        const shadowGradient = this.ctx.createRadialGradient(
            currentX, currentY, planet.size * 0.8,
            currentX, currentY, planet.size * 1.5
        );
        shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
        
        this.ctx.fillStyle = shadowGradient;
        this.ctx.beginPath();
        this.ctx.arc(currentX + 5, currentY + 5, planet.size * 1.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Planet body
        const planetGradient = this.ctx.createRadialGradient(
            currentX - planet.size * 0.3, currentY - planet.size * 0.3, planet.size * 0.1,
            currentX, currentY, planet.size
        );
        
        planet.colors.forEach((color, i) => {
            planetGradient.addColorStop(i / (planet.colors.length - 1), color);
        });
        
        this.ctx.fillStyle = planetGradient;
        this.ctx.beginPath();
        this.ctx.arc(currentX, currentY, planet.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Rings if applicable
        if (planet.hasRings) {
            this.ctx.save();
            this.ctx.translate(currentX, currentY);
            this.ctx.rotate(planet.rotation);
            
            const ringGradient = this.ctx.createLinearGradient(0, -planet.size * 1.5, 0, planet.size * 1.5);
            ringGradient.addColorStop(0, 'rgba(200, 200, 220, 0)');
            ringGradient.addColorStop(0.3, 'rgba(200, 200, 220, 0.6)');
            ringGradient.addColorStop(0.5, 'rgba(220, 220, 240, 0.8)');
            ringGradient.addColorStop(0.7, 'rgba(200, 200, 220, 0.6)');
            ringGradient.addColorStop(1, 'rgba(200, 200, 220, 0)');
            
            this.ctx.fillStyle = ringGradient;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, planet.size * 1.6, planet.size * 0.3, 0, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        }
        
        // Atmospheric glow
        const glowGradient = this.ctx.createRadialGradient(
            currentX, currentY, planet.size * 0.95,
            currentX, currentY, planet.size * 1.1
        );
        glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = glowGradient;
        this.ctx.beginPath();
        this.ctx.arc(currentX, currentY, planet.size * 1.1, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
        
        planet.rotation += planet.rotationSpeed;
        planet.floatPhase += planet.floatSpeed;
    }

    drawStarship(ship) {
        this.ctx.save();
        this.ctx.translate(ship.x, ship.y);
        this.ctx.rotate(ship.angle);
        
        // Engine trail
        const trailGradient = this.ctx.createLinearGradient(-50, 0, 0, 0);
        trailGradient.addColorStop(0, 'rgba(100, 150, 255, 0)');
        trailGradient.addColorStop(0.5, `rgba(150, 200, 255, ${ship.trailOpacity * 0.5})`);
        trailGradient.addColorStop(1, `rgba(255, 255, 255, ${ship.trailOpacity})`);
        
        this.ctx.fillStyle = trailGradient;
        this.ctx.fillRect(-50, -5, 50, 10);
        
        // Additional trail particles
        for (let i = 0; i < 3; i++) {
            const offset = i * 15;
            const particleGradient = this.ctx.createRadialGradient(-offset - 20, 0, 0, -offset - 20, 0, 8);
            particleGradient.addColorStop(0, `rgba(150, 200, 255, ${ship.trailOpacity * 0.6})`);
            particleGradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
            
            this.ctx.fillStyle = particleGradient;
            this.ctx.beginPath();
            this.ctx.arc(-offset - 20, Math.sin(Date.now() * 0.01 + i) * 3, 8, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Starship body
        this.ctx.fillStyle = '#c0c0c0';
        this.ctx.beginPath();
        this.ctx.moveTo(ship.width / 2, 0);
        this.ctx.lineTo(-ship.width / 2, -ship.height / 2);
        this.ctx.lineTo(-ship.width / 3, 0);
        this.ctx.lineTo(-ship.width / 2, ship.height / 2);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Cockpit window
        this.ctx.fillStyle = '#4facfe';
        this.ctx.beginPath();
        this.ctx.arc(ship.width / 4, 0, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Wing highlights
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(ship.width / 2, 0);
        this.ctx.lineTo(0, 0);
        this.ctx.stroke();
        
        this.ctx.restore();
        
        // Update position
        ship.x += ship.speed;
    }

    createShootingStar() {
        const startX = Math.random() * this.canvas.width;
        const startY = Math.random() * this.canvas.height * 0.6;
        const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 8 + 4;
        
        this.shootingStars.push({
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            length: Math.random() * 80 + 40,
            brightness: 1,
            tail: []
        });
    }

    drawShootingStar(star) {
        this.ctx.save();
        
        // Add current position to tail
        star.tail.push({ x: star.x, y: star.y });
        if (star.tail.length > 15) {
            star.tail.shift();
        }
        
        // Draw glowing trail
        star.tail.forEach((pos, i) => {
            const progress = i / star.tail.length;
            const opacity = progress * star.brightness;
            const size = (3 + progress * 4) * star.brightness;
            
            // Outer glow
            const glowGradient = this.ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size * 3);
            glowGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.8})`);
            glowGradient.addColorStop(0.3, `rgba(200, 230, 255, ${opacity * 0.5})`);
            glowGradient.addColorStop(0.6, `rgba(150, 200, 255, ${opacity * 0.2})`);
            glowGradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
            
            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, size * 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Core
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, size * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw bright head
        const headGradient = this.ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 12);
        headGradient.addColorStop(0, `rgba(255, 255, 255, ${star.brightness})`);
        headGradient.addColorStop(0.2, `rgba(255, 255, 255, ${star.brightness * 0.8})`);
        headGradient.addColorStop(0.5, `rgba(200, 230, 255, ${star.brightness * 0.4})`);
        headGradient.addColorStop(1, 'rgba(150, 200, 255, 0)');
        
        this.ctx.fillStyle = headGradient;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, 12, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
        
        // Update position
        star.x += star.vx;
        star.y += star.vy;
        
        // Fade out as it travels
        star.brightness *= 0.98;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars
        this.stars.forEach(star => this.drawStar(star));
        
        // Draw planets
        this.planets.forEach(planet => this.drawPlanet(planet));
        
        // Draw and update starships
        this.starships = this.starships.filter(ship => ship.x < this.canvas.width + 100);
        this.starships.forEach(ship => this.drawStarship(ship));
        
        // Draw and update shooting stars
        this.shootingStars = this.shootingStars.filter(star => 
            star.brightness > 0.05 && 
            star.x < this.canvas.width + 100 && 
            star.y < this.canvas.height + 100 &&
            star.x > -100 && star.y > -100
        );
        this.shootingStars.forEach(star => this.drawShootingStar(star));
        
        // Randomly create new starships
        if (Math.random() < 0.005 && this.starships.length < 2) {
            this.createStarship();
        }
        
        // Randomly create new shooting stars
        if (Math.random() < 0.01 && this.shootingStars.length < 3) {
            this.createShootingStar();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SpaceScene();
    });
} else {
    new SpaceScene();
}
