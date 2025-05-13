document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const initThemeToggle = () => {
        console.log("Initializing theme toggle"); // Debug log
        // Check for saved theme preference or use preferred color scheme
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        console.log("Saved theme:", savedTheme); // Debug log
        console.log("Prefers dark:", prefersDark); // Debug log
        
        // Set initial theme - using document.querySelector('html') to be explicit
        if (savedTheme) {
            document.querySelector('html').setAttribute('data-theme', savedTheme);
            console.log("Applied saved theme:", savedTheme); // Debug log
        } else if (prefersDark) {
            document.querySelector('html').setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            console.log("Applied system preferred dark theme"); // Debug log
        }
        
        // Create theme toggle if it doesn't exist
        if (!document.querySelector('.theme-toggle')) {
            const toggleBtn = document.createElement('div');
            toggleBtn.className = 'theme-toggle';
            toggleBtn.setAttribute('title', 'Toggle dark mode');
            toggleBtn.innerHTML = getCurrentTheme() === 'dark' ? 
                '<i class="fas fa-sun"></i>' : 
                '<i class="fas fa-moon"></i>';
            
            // Insert after nav
            const navContainer = document.querySelector('header .container');
            navContainer.appendChild(toggleBtn);
            
            // Add event listener
            toggleBtn.addEventListener('click', toggleTheme);
            console.log("Theme toggle button created"); // Debug log
        }
    };
    
    // Get current theme
    const getCurrentTheme = () => {
        return document.querySelector('html').getAttribute('data-theme') || 'light';
    };
    
    // Toggle theme
    const toggleTheme = () => {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        console.log("Toggling theme from", currentTheme, "to", newTheme); // Debug log
        
        // Set theme - using document.querySelector('html') to be explicit
        document.querySelector('html').setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update toggle icon
        const toggleBtn = document.querySelector('.theme-toggle');
        toggleBtn.innerHTML = newTheme === 'dark' ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
            
        console.log("Theme toggled to", newTheme); // Debug log
    };
    
    // Initialize theme toggle
    initThemeToggle();
    
    // Mobile Navigation Toggle
    const createMobileNav = () => {
        const header = document.querySelector('header');
        const nav = document.querySelector('nav');
        
        // Create mobile nav toggle button
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-nav-toggle';
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        header.querySelector('.container').appendChild(mobileToggle);
        
        // Add mobile class to nav
        nav.classList.add('mobile-nav');
        
        // Toggle mobile nav
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            if (nav.classList.contains('active')) {
                mobileToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    };
    
    // Only create mobile nav if screen width is less than 768px
    if (window.innerWidth < 768) {
        createMobileNav();
    }
    
    // Project Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                const filterValue = this.getAttribute('data-filter');
                
                // Filter projects
                projectCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Form Submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (name && email && subject && message) {
                // In a real application, you would send this data to a server
                // For this demo, we'll just show an alert
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
            } else {
                alert('Please fill in all fields.');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add mobile nav styles
    const addMobileNavStyles = () => {
        // Create a style element
        const style = document.createElement('style');
        style.textContent = `
            .mobile-nav-toggle {
                display: none;
                background: none;
                border: none;
                font-size: 1.5rem;
                color: var(--text-color);
                cursor: pointer;
            }
            
            @media (max-width: 768px) {
                .mobile-nav-toggle {
                    display: block;
                }
                
                .mobile-nav {
                    position: fixed;
                    top: 80px;
                    left: 0;
                    width: 100%;
                    background-color: var(--light-color);
                    color: var(--text-color);
                    box-shadow: var(--box-shadow);
                    padding: 20px;
                    transform: translateY(-150%);
                    transition: transform 0.3s ease;
                    z-index: 99;
                }
                
                .mobile-nav.active {
                    transform: translateY(0);
                }
                
                .mobile-nav ul {
                    flex-direction: column;
                    align-items: center;
                }
                
                .mobile-nav ul li {
                    margin: 10px 0;
                }
                
                .mobile-nav ul li a {
                    color: var(--text-color);
                }
            }
        `;
        document.head.appendChild(style);
    };
    
    addMobileNavStyles();
    
    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.project-card, .milestone-card, .timeline-item, .about-content');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(element => {
            observer.observe(element);
            // Add initial hidden state
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        
        // Add animation class
        document.head.insertAdjacentHTML('beforeend', `
            <style>
                .animate {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
            </style>
        `);
    };
    
    // Call animate function
    animateOnScroll();
}); 