// Performance page functionality for two videos with exact timing
let currentVideo = 1;
let totalVideos = 2;
let video1Ended = false;
let video2Ended = false;
let video1MaxTime = 0;
let video2MaxTime = 0;

// Video durations in seconds
const VIDEO_1_DURATION = 635; // 10 minutes 35 seconds
const VIDEO_2_DURATION = 445; // 7 minutes 25 seconds

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    setupVideoHandlers(1);
    setupVideoHandlers(2);
    
    // Hide loading indicator initially
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.classList.add('hidden');
    
    // Show video progress indicator
    const videoProgress = document.getElementById('video-progress');
    videoProgress.classList.remove('hidden');
    
    // Start floating hearts
    setInterval(createFloatingHeart, 1500);
    
    // Don't auto-play - wait for user interaction
    console.log('Page loaded. First video ready to play.');
});

// Format time from seconds to MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Setup video handlers for each video
function setupVideoHandlers(videoNum) {
    const video = document.getElementById(`love-video-${videoNum}`);
    const overlay = document.getElementById(`video-overlay-${videoNum}`);
    const maxDuration = videoNum === 1 ? VIDEO_1_DURATION : VIDEO_2_DURATION;
    
    // Update timer display
    video.addEventListener('timeupdate', function() {
        const currentTimeDisplay = document.getElementById(`current-time-${videoNum}`);
        if (currentTimeDisplay) {
            currentTimeDisplay.textContent = formatTime(this.currentTime);
        }
        
        // Enforce maximum duration
        if (videoNum === 1) {
            if (this.currentTime > video1MaxTime + 0.5) {
                this.currentTime = video1MaxTime;
            } else {
                video1MaxTime = Math.max(video1MaxTime, this.currentTime);
            }
            
            // Stop at exact duration
            if (this.currentTime >= VIDEO_1_DURATION && !video1Ended) {
                console.log('Video 1 reached maximum duration');
                this.pause();
                this.currentTime = VIDEO_1_DURATION;
                video1Ended = true;
                handleVideoEnd(1);
            }
        } else if (videoNum === 2) {
            if (this.currentTime > video2MaxTime + 0.5) {
                this.currentTime = video2MaxTime;
            } else {
                video2MaxTime = Math.max(video2MaxTime, this.currentTime);
            }
            
            // Stop at exact duration
            if (this.currentTime >= VIDEO_2_DURATION && !video2Ended) {
                console.log('Video 2 reached maximum duration');
                this.pause();
                this.currentTime = VIDEO_2_DURATION;
                video2Ended = true;
                handleVideoEnd(2);
            }
        }
    });
    
    // Prevent seeking via seeking event
    video.addEventListener('seeking', function() {
        const maxTime = videoNum === 1 ? video1MaxTime : video2MaxTime;
        if (this.currentTime > maxTime) {
            this.currentTime = maxTime;
        }
    });
    
    // Video event listeners
    video.addEventListener('loadstart', () => handleVideoLoadStart(videoNum));
    video.addEventListener('canplay', () => handleVideoCanPlay(videoNum));
    video.addEventListener('error', () => handleVideoError(videoNum));
    video.addEventListener('play', () => handleVideoPlay(videoNum));
    video.addEventListener('pause', () => handleVideoPause(videoNum));
    
    // Handle natural video end event
    video.addEventListener('ended', function() {
        if (videoNum === 1 && !video1Ended) {
            video1Ended = true;
            handleVideoEnd(1);
        } else if (videoNum === 2 && !video2Ended) {
            video2Ended = true;
            handleVideoEnd(2);
        }
    });
    
    // Disable right-click context menu on video
    video.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Click to play/pause
    video.addEventListener('click', function(e) {
        e.preventDefault();
        if (this.paused) {
            playVideo(videoNum);
        } else {
            this.pause();
        }
    });
    
    // Volume fade-in effect
    video.addEventListener('play', function() {
        this.volume = 0;
        const fadeIn = setInterval(() => {
            if (this.volume < 1) {
                this.volume = Math.min(this.volume + 0.1, 1);
            } else {
                clearInterval(fadeIn);
            }
        }, 100);
    });
    
    // Lock playback rate to 1x (prevent speed changes)
    video.addEventListener('ratechange', function() {
        if (this.playbackRate !== 1) {
            this.playbackRate = 1;
        }
    });
    
    // Prevent dragging of video element
    video.setAttribute('draggable', 'false');
}

// Handle video loading start
function handleVideoLoadStart(videoNum) {
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.classList.remove('hidden');
}

// Handle video ready to play
function handleVideoCanPlay(videoNum) {
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.classList.add('hidden');
}

// Handle video play
function handleVideoPlay(videoNum) {
    const overlay = document.getElementById(`video-overlay-${videoNum}`);
    overlay.classList.add('hidden');
    console.log(`Video ${videoNum} started playing`);
}

// Handle video pause
function handleVideoPause(videoNum) {
    const overlay = document.getElementById(`video-overlay-${videoNum}`);
    const video = document.getElementById(`love-video-${videoNum}`);
    const maxDuration = videoNum === 1 ? VIDEO_1_DURATION : VIDEO_2_DURATION;
    
    // Only show overlay if video hasn't reached max duration
    if (video.currentTime < maxDuration - 0.5) {
        overlay.classList.remove('hidden');
    }
}

// Play video function
function playVideo(videoNum) {
    const video = document.getElementById(`love-video-${videoNum}`);
    const overlay = document.getElementById(`video-overlay-${videoNum}`);
    const maxDuration = videoNum === 1 ? VIDEO_1_DURATION : VIDEO_2_DURATION;
    
    // Check if we're trying to play the wrong video
    if (videoNum !== currentVideo) {
        console.log(`Cannot play video ${videoNum}, currently on video ${currentVideo}`);
        return;
    }
    
    overlay.classList.add('hidden');
    
    // Check if video has reached max duration
    if (video.currentTime >= maxDuration - 0.5) {
        video.currentTime = 0;
        if (videoNum === 1) {
            video1MaxTime = 0;
            video1Ended = false;
        } else {
            video2MaxTime = 0;
            video2Ended = false;
        }
    }
    
    video.play().catch(e => {
        console.log(`Video ${videoNum} play failed:`, e);
        handleVideoError(videoNum);
    });
}

// Handle video end
function handleVideoEnd(videoNum) {
    console.log(`Video ${videoNum} ended at ${new Date().toLocaleTimeString()}`);
    
    const video = document.getElementById(`love-video-${videoNum}`);
    const overlay = document.getElementById(`video-overlay-${videoNum}`);
    
    // Keep overlay hidden when video ends
    overlay.classList.add('hidden');
    
    if (videoNum === 1 && video1Ended && !video2Ended) {
        // First video ended, transition to second video
        console.log('First video complete. Transitioning to video 2...');
        currentVideo = 2;
        setTimeout(() => {
            transitionToNextVideo();
        }, 1500);
    } else if (videoNum === 2 && video2Ended) {
        // Both videos ended, show final message
        console.log('Both videos completed, showing final message...');
        setTimeout(() => {
            showFinalMessage();
        }, 1500);
    }
}

// Transition from first video to second video
function transitionToNextVideo() {
    const container1 = document.getElementById('video-container-1');
    const container2 = document.getElementById('video-container-2');
    const progressDot1 = document.getElementById('dot-1');
    const progressDot2 = document.getElementById('dot-2');
    const currentVideoNum = document.getElementById('current-video-num');
    const video2 = document.getElementById('love-video-2');
    
    // Create transition effect
    createTransitionEffect();
    
    setTimeout(() => {
        // Hide first video container
        container1.classList.add('fade-out');
        
        setTimeout(() => {
            container1.classList.add('hidden');
            
            // Show second video container
            container2.classList.remove('hidden');
            container2.classList.add('fade-in');
            
            // Update progress indicator
            progressDot1.classList.remove('active');
            progressDot2.classList.add('active');
            currentVideoNum.textContent = '2';
            
            // Reset video 2 to beginning
            video2.currentTime = 0;
            video2MaxTime = 0;
            video2Ended = false;
            
            // Auto-play second video after a short delay
            setTimeout(() => {
                playVideo(2);
            }, 500);
        }, 500);
    }, 1000);
}

// Create transition effect between videos
function createTransitionEffect() {
    // Create hearts burst effect
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createFloatingHeart();
        }, i * 100);
    }
    
    // Flash effect
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, rgba(255, 105, 180, 0.3), rgba(255, 182, 193, 0.3));
        z-index: 20;
        animation: flashEffect 1s ease-out forwards;
        pointer-events: none;
    `;
    
    document.body.appendChild(flash);
    
    setTimeout(() => {
        if (flash.parentNode) {
            flash.parentNode.removeChild(flash);
        }
    }, 1000);
}

// Show final message after both videos
function showFinalMessage() {
    const loveMessage = document.getElementById('love-message');
    const container2 = document.getElementById('video-container-2');
    const videoProgress = document.getElementById('video-progress');
    
    // Hide video progress
    videoProgress.classList.add('hidden');
    
    // Show love message with animation
    setTimeout(() => {
        container2.classList.add('fade-out');
        
        setTimeout(() => {
            container2.classList.add('hidden');
            loveMessage.classList.remove('hidden');
            
            // Add sparkle effects
            createSparkleShow();
        }, 500);
    }, 1000);
}

// Handle video error
function handleVideoError(videoNum) {
    console.log(`Video ${videoNum} failed to load`);
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.classList.add('hidden');
    
    // If first video fails, try second video
    if (videoNum === 1 && !video1Ended) {
        video1Ended = true;
        setTimeout(() => {
            currentVideo = 2;
            transitionToNextVideo();
        }, 2000);
    } else if (videoNum === 2 && !video2Ended) {
        // If second video also fails, show final message
        video2Ended = true;
        setTimeout(() => {
            showFinalMessage();
        }, 2000);
    }
}

// Create floating hearts
function createFloatingHeart() {
    const hearts = ['💕', '💖', '💗', '💝', '💘', '❤️'];
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
    heart.style.fontSize = (Math.random() * 10 + 20) + 'px';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, 8000);
}

// Create sparkle show when message appears
function createSparkleShow() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createSparkle(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight
            );
        }, i * 200);
    }
    
    // Continue creating sparkles
    setInterval(() => {
        createSparkle(
            Math.random() * window.innerWidth,
            Math.random() * window.innerHeight
        );
    }, 1000);
}

// Create individual sparkle
function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        background: gold;
        border-radius: 50%;
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
        animation: sparkleAnimation 2s ease-out forwards;
        z-index: 30;
    `;
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 2000);
}

// Keyboard controls - disabled fast-forward
document.addEventListener('keydown', function(e) {
    const video1 = document.getElementById('love-video-1');
    const video2 = document.getElementById('love-video-2');
    const currentVideoElement = currentVideo === 1 ? video1 : video2;
    
    // Only control the currently visible video
    if (!document.getElementById(`video-container-${currentVideo}`).classList.contains('hidden')) {
        switch(e.key) {
            case ' ':
            case 'k':
                e.preventDefault();
                if (currentVideoElement.paused) {
                    playVideo(currentVideo);
                } else {
                    currentVideoElement.pause();
                }
                break;
            case 'f':
                e.preventDefault();
                if (currentVideoElement.requestFullscreen) {
                    currentVideoElement.requestFullscreen();
                }
                break;
            case 'Escape':
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
                break;
            case 'ArrowRight':
            case 'ArrowLeft':
            case 'ArrowUp':
            case 'ArrowDown':
                // Disable arrow keys to prevent seeking
                e.preventDefault();
                break;
        }
    }
});

// Prevent keyboard shortcuts for seeking
document.addEventListener('keypress', function(e) {
    // Prevent number keys and other shortcuts
    if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
    }
});

// Add video progress tracking for background changes
window.addEventListener('load', function() {
    const video1 = document.getElementById('love-video-1');
    const video2 = document.getElementById('love-video-2');
    
    // Track progress for background changes
    if (video1) {
        video1.addEventListener('timeupdate', function() {
            const progress = (this.currentTime / VIDEO_1_DURATION) * 100;
            if (progress > 50) {
                document.body.style.background = 'linear-gradient(135deg, #4a6741, #2c3e50)';
            }
        });
    }
    
    if (video2) {
        video2.addEventListener('timeupdate', function() {
            const progress = (this.currentTime / VIDEO_2_DURATION) * 100;
            if (progress > 50) {
                document.body.style.background = 'linear-gradient(135deg, #2c3e50, #ff69b4)';
            }
        });
    }
});