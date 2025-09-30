// Performance page functionality
let currentVideo = 1;
let videosWatched = new Set();

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    startFloatingHearts();
    createInitialSparkles();
});

// Particle Canvas Animation
function initializeParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Play Video Function
function playVideo(videoNum) {
    const overlay = document.getElementById(`video-overlay-${videoNum}`);
    
    // Hide overlay
    overlay.classList.add('hidden');
    
    // Mark video as watched
    videosWatched.add(videoNum);
    
    // Create celebration effects
    createFloatingHeartsExplosion();
    createSparkleShow();
}

// Next Video Function
function nextVideo() {
    if (currentVideo === 1) {
        // Hide first video
        document.getElementById('video-container-1').classList.add('hidden');
        
        // Show second video
        document.getElementById('video-container-2').classList.remove('hidden');
        
        // Update current video
        currentVideo = 2;
        
        // Scroll to second video
        document.getElementById('video-container-2').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Create effects
        createSparkleShow();
        createFloatingHeartsExplosion();
    }
}

// Previous Video Function
function previousVideo() {
    if (currentVideo === 2) {
        // Hide second video
        document.getElementById('video-container-2').classList.add('hidden');
        
        // Show first video
        document.getElementById('video-container-1').classList.remove('hidden');
        
        // Update current video
        currentVideo = 1;
        
        // Scroll to first video
        document.getElementById('video-container-1').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Create effects
        createSparkleShow();
    }
}

// Show Final Love Message
function showFinalMessage() {
    const loveMessage = document.getElementById('love-message');
    const container1 = document.getElementById('video-container-1');
    const container2 = document.getElementById('video-container-2');
    
    // Hide video containers with animation
    container1.style.animation = 'fadeOut 1s ease-out forwards';
    container2.style.animation = 'fadeOut 1s ease-out forwards';
    
    setTimeout(() => {
        container1.style.display = 'none';
        container2.style.display = 'none';
        loveMessage.classList.remove('hidden');
        
        // Scroll to message
        loveMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Create massive celebration
        createFireworks();
        createMassiveSparkleShow();
        
        // Create continuous hearts
        setInterval(() => {
            createFloatingHeart();
            createFloatingHeart();
        }, 500);
    }, 1000);
}

// Create Floating Hearts Explosion
function createFloatingHeartsExplosion() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createFloatingHeart();
        }, i * 80);
    }
}

// Create Individual Sparkle
function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    
    const colors = ['gold', '#ff1493', '#ff69b4', '#fff', '#ffd700', '#ff6b9d'];
    sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
    sparkle.style.boxShadow = `0 0 20px ${colors[Math.floor(Math.random() * colors.length)]}`;
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 1500);
}

// Create Floating Heart
function createFloatingHeart() {
    const hearts = ['💕', '💖', '💗', '💝', '💘', '❤️', '💓', '💞', '💟'];
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 30 + 25) + 'px';
    heart.style.animationDuration = (Math.random() * 5 + 8) + 's';
    
    const heartsBackground = document.querySelector('.hearts-background');
    heartsBackground.appendChild(heart);
    
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, 13000);
}

// Start Floating Hearts Continuously
function startFloatingHearts() {
    setInterval(() => {
        createFloatingHeart();
    }, 2500);
}

// Create Initial Sparkles
function createInitialSparkles() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createSparkle(x, y);
        }, i * 150);
    }
}

// Create Sparkle Show
function createSparkleShow() {
    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createSparkle(x, y);
        }, i * 80);
    }
}

// Create Massive Sparkle Show
function createMassiveSparkleShow() {
    // Initial burst
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createSparkle(x, y);
        }, i * 50);
    }
    
    // Continuous sparkles
    const sparkleInterval = setInterval(() => {
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createSparkle(x, y);
        }
    }, 1000);
    
    // Stop after 30 seconds
    setTimeout(() => {
        clearInterval(sparkleInterval);
    }, 30000);
}

// Create Fireworks
function createFireworks() {
    const container = document.getElementById('fireworks-container');
    
    function launchFirework() {
        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight;
        
        const colors = ['#ff1493', '#ff69b4', '#ffd700', '#fff', '#ff6b9d', '#f093fb'];
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 100 + Math.random() * 100;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance - 200;
            
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            
            container.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1500);
        }
    }
    
    // Launch multiple fireworks
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            launchFirework();
        }, i * 500);
    }
    
    // Continue launching fireworks
    const fireworkInterval = setInterval(() => {
        launchFirework();
    }, 2000);
    
    // Stop after 30 seconds
    setTimeout(() => {
        clearInterval(fireworkInterval);
    }, 30000);
}

// Add touch feedback for mobile
if ('ontouchstart' in window) {
    document.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('touchstart', function() {
            this.querySelector('.play-icon').style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.querySelector('.play-icon').style.transform = '';
            }, 100);
        });
    });
}

// Log when page is ready
console.log('💖 Love Performance Page Loaded! 💖');
console.log('Use the navigation buttons to switch between videos!');