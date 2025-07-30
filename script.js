// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const konamiBanner = document.getElementById('konamiBanner');
const gameOverlay = document.getElementById('gameOverlay');
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const exitGame = document.getElementById('exitGame');
const scrollProgressBar = document.getElementById('scrollProgressBar');
const companyLogo = document.getElementById('companyLogo');

// Create audio context for sound effects
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Play click sound
function playClickSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Dark Mode Toggle
function initDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', isDarkMode);
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    playClickSound();
});

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    playClickSound();
});

// Logo Animation
companyLogo.addEventListener('click', (e) => {
    e.preventDefault();
    playClickSound();

    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (anchor !== companyLogo) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            // Close mobile menu if open
            navLinks.classList.remove('active');

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                playClickSound();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    }
});

// Scroll Progress Bar
function updateScrollProgress() {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;

    // Update progress bar from right to left
    scrollProgressBar.style.width = scrolled + '%';
}

window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('resize', updateScrollProgress);

// Testimonial Slider
let currentSlide = 0;

function showSlide(index) {
    testimonialSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    currentSlide = index;
}

prevBtn.addEventListener('click', () => {
    let newIndex = currentSlide - 1;
    if (newIndex < 0) newIndex = testimonialSlides.length - 1;
    showSlide(newIndex);
    playClickSound();
});

nextBtn.addEventListener('click', () => {
    let newIndex = currentSlide + 1;
    if (newIndex >= testimonialSlides.length) newIndex = 0;
    showSlide(newIndex);
    playClickSound();
});

// Konami Code Easter Egg
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;

        if (konamiIndex === konamiCode.length) {
            // Konami code completed
            konamiBanner.classList.add('show');

            // Start the game after a delay
            setTimeout(() => {
                startBugGame();
            }, 1000);

            // Hide banner after 7 seconds
            setTimeout(() => {
                konamiBanner.classList.remove('show');
            }, 7000);

            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// Bug Squash Game
let score = 0;
let bugs = [];

function startBugGame() {
    // Reset game state
    score = 0;
    scoreDisplay.textContent = score;
    gameArea.innerHTML = '';
    bugs = [];

    // Show game overlay
    gameOverlay.classList.add('active');

    // Create initial bugs
    for (let i = 0; i < 10; i++) {
        createBug();
    }
}

function createBug() {
    const bug = document.createElement('div');
    bug.classList.add('bug');
    bug.innerHTML = '🐛';

    // Random position
    const x = Math.random() * (gameArea.offsetWidth - 40);
    const y = Math.random() * (gameArea.offsetHeight - 40);

    bug.style.left = `${x}px`;
    bug.style.top = `${y}px`;

    // Random movement
    const speed = 0.5 + Math.random() * 1.5;
    const angle = Math.random() * Math.PI * 2;

    let dx = Math.cos(angle) * speed;
    let dy = Math.sin(angle) * speed;

    // Click event
    bug.addEventListener('click', () => {
        // Play sound
        playClickSound();

        // Remove bug
        bug.remove();

        // Increase score
        score++;
        scoreDisplay.textContent = score;

        // Create new bug
        createBug();
    });

    // Movement logic
    function move() {
        let currentX = parseFloat(bug.style.left);
        let currentY = parseFloat(bug.style.top);

        // Bounce off walls
        if (currentX <= 0 || currentX >= gameArea.offsetWidth - 40) dx *= -1;
        if (currentY <= 0 || currentY >= gameArea.offsetHeight - 40) dy *= -1;

        // Update position
        bug.style.left = `${currentX + dx}px`;
        bug.style.top = `${currentY + dy}px`;

        requestAnimationFrame(move);
    }

    move();

    gameArea.appendChild(bug);
    bugs.push(bug);
}

exitGame.addEventListener('click', () => {
    gameOverlay.classList.remove('active');
    playClickSound();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    updateScrollProgress();

    // Add animation to service cards on scroll
    const serviceCards = document.querySelectorAll('.service-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }, 150 * index);
            }
        });
    }, { threshold: 0.1 });

    serviceCards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});


// Add hover effects to IT icons
document.querySelectorAll('.it-icon').forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        playClickSound();

        // Add a temporary animation boost
        icon.style.animationDuration = '0.5s';

        setTimeout(() => {
            icon.style.animationDuration = '';
        }, 500);
    });
});


// Add floating animation to contact icons on hover
document.querySelectorAll('.contact-method').forEach(method => {
    method.addEventListener('mouseenter', () => {
        method.querySelector('.contact-icon').style.transform = 'scale(1.1)';
    });

    method.addEventListener('mouseleave', () => {
        method.querySelector('.contact-icon').style.transform = 'scale(1)';
    });
});

// Add animation to the submit button
const submitBtn = document.querySelector('.btn');
submitBtn.addEventListener('mouseenter', () => {
    submitBtn.style.background = 'linear-gradient(to right, #4f46e5, #2563eb)';
});

submitBtn.addEventListener('mouseleave', () => {
    submitBtn.style.background = 'linear-gradient(to right, #2563eb, #4f46e5)';
});

// Contact Form Submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show sending state
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Play sound
    playClickSound();

    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const issue = formData.get('issue');

    try {
        // Send email using EmailJS
        const response = await emailjs.send(
            'service_1go09ca', // EmailJS service ID
            'template_8h42845', // EmailJS template ID
            {
                from_name: name,
                from_email: email,
                message: issue,
                to_name: 'ClickFix.cloud Team'
            },
            'ySH2WUlutvJlB5DTS' // Replace with your actual EmailJS public key
        );

        // Success
        contactForm.reset();
        formMessage.textContent = 'Message sent successfully! We\'ll get back to you ASAP. 🚀';
        formMessage.classList.add('success');

    } catch (error) {
        // Error handling
        console.error('Email sending failed:', error);
        formMessage.textContent = 'Oops! Something went wrong. Please try again or contact us directly.';
        formMessage.classList.add('error');
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.classList.remove('success', 'error');
        }, 5000);
    }
});