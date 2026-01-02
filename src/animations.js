// Terminal Typing Animation
const terminalText = "Join the revolution. Experience the ASTRA ecosystem.";
const typedTextElement = document.getElementById('typed-text');
let charIndex = 0;

function typeText() {
    if (charIndex < terminalText.length) {
        typedTextElement.textContent += terminalText.charAt(charIndex);
        charIndex++;
        setTimeout(typeText, 50); // Typing speed
    }
}

// Start typing after page load
window.addEventListener('load', () => {
    setTimeout(typeText, 1000); // Delay before typing starts
});

// Active Navigation Indicator
const navLinks = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.content-section');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});
