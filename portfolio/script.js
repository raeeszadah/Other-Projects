// Portfolio Website JavaScript
// Main functionality with GSAP animations and interactive features

// Initialize GSAP ScrollTrigger with error handling
try {
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    } else {
        console.warn('GSAP not loaded, animations will be disabled');
    }
} catch (error) {
    console.warn('GSAP initialization failed:', error);
}

// Project data - hardcoded as per requirements
const projects = [
    {
        id: 1,
        title: "Microservices Architecture Platform",
        description: "A scalable microservices platform built with Spring Boot, Docker, and Kubernetes. Features service discovery, load balancing, and distributed tracing.",
        image: "from-indigo-500 to-purple-600",
        category: "web",
        technologies: ["Java", "Spring Boot", "Docker", "Kubernetes", "PostgreSQL"],
        liveUrl: "https://microservices-demo.com",
        githubUrl: "https://github.com/johndoe/microservices-platform",
        demoUrl: "https://demo.microservices-demo.com"
    },
    {
        id: 2,
        title: "Real-time Chat Application",
        description: "A real-time chat application with WebSocket support, user authentication, file sharing, and message encryption using Socket.io and Node.js.",
        image: "from-purple-500 to-pink-600",
        category: "web",
        technologies: ["Node.js", "Socket.io", "React", "MongoDB", "Redis"],
        liveUrl: "https://chat-app.com",
        githubUrl: "https://github.com/johndoe/chat-application",
        demoUrl: "https://demo.chat-app.com"
    },
    {
        id: 3,
        title: "AI-Powered Code Review Tool",
        description: "An intelligent code review system that uses machine learning to analyze code quality, detect bugs, and suggest improvements automatically.",
        image: "from-pink-500 to-rose-600",
        category: "web",
        technologies: ["Python", "TensorFlow", "FastAPI", "React", "PostgreSQL"],
        liveUrl: "https://code-review-ai.com",
        githubUrl: "https://github.com/johndoe/ai-code-review",
        demoUrl: "https://demo.code-review-ai.com"
    },
    {
        id: 4,
        title: "DevOps Pipeline Automation",
        description: "Complete CI/CD pipeline automation with Jenkins, Docker, and AWS. Includes automated testing, deployment, and monitoring solutions.",
        image: "from-cyan-500 to-blue-600",
        category: "design",
        technologies: ["Jenkins", "Docker", "AWS", "Terraform", "Ansible"],
        liveUrl: "https://devops-pipeline.com",
        githubUrl: "https://github.com/johndoe/devops-automation",
        demoUrl: "https://demo.devops-pipeline.com"
    },
    {
        id: 5,
        title: "Data Analytics Dashboard",
        description: "Comprehensive data analytics platform with real-time data processing, interactive visualizations, and machine learning insights.",
        image: "from-emerald-500 to-teal-600",
        category: "web",
        technologies: ["Python", "Django", "React", "Elasticsearch", "Apache Kafka"],
        liveUrl: "https://analytics-dashboard.com",
        githubUrl: "https://github.com/johndoe/data-analytics",
        demoUrl: "https://demo.analytics-dashboard.com"
    },
    {
        id: 6,
        title: "API Gateway & Management System",
        description: "Enterprise-grade API gateway with rate limiting, authentication, monitoring, and comprehensive API management features.",
        image: "from-violet-500 to-indigo-600",
        category: "web",
        technologies: ["Node.js", "Express", "Redis", "MongoDB", "Docker"],
        liveUrl: "https://api-gateway.com",
        githubUrl: "https://github.com/johndoe/api-gateway",
        demoUrl: "https://demo.api-gateway.com"
    }
];

// DOM Elements
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const projectsGrid = document.getElementById('projects-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const testimonialSlides = document.querySelectorAll('.testimonial-slide');

// Global variables
let currentTestimonial = 0;
let testimonialInterval;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio website loaded successfully!');
    
    // Ensure content is visible even if GSAP fails
    ensureContentVisibility();
    
    // Initialize all features
    initializeAnimations();
    initializeProjects();
    initializeTestimonials();
    initializeNavigation();
    initializeScrollEffects();
    initializeTypingEffect();
    
    // Ensure project cards are visible after a short delay
    setTimeout(() => {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        });
    }, 1000);
});

// Fallback function to ensure content is visible
function ensureContentVisibility() {
    // Make sure all content is visible by default
    const elements = document.querySelectorAll('.hero-content, .about-content, .about-image, .skill-item, .project-card, .service-card, .timeline-item, .certification-card, .blog-card, .social-link');
    elements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
    
    // Ensure project cards are visible
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
    });
}

// GSAP Animations Initialization
function initializeAnimations() {
    // Check if GSAP is available
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not available, skipping animations');
        return;
    }
    
    try {
        // Hero section animations
        const heroTl = gsap.timeline();
        heroTl
            .from('.hero-content', {
                duration: 1,
                opacity: 0,
                x: -50,
                ease: 'power3.out'
            })
            .from('.hero-illustration', {
                duration: 1.2,
                opacity: 0,
                x: 50,
                scale: 0.8,
                ease: 'back.out(1.7)'
            }, '-=0.5')
            .from('.floating-shape', {
                duration: 1.5,
                opacity: 0,
                scale: 0,
                stagger: 0.2,
                ease: 'back.out(1.7)'
            }, '-=0.8')
            .from('.hero-illustration .absolute', {
                duration: 0.8,
                opacity: 0,
                y: 30,
                stagger: 0.1,
                ease: 'power3.out'
            }, '-=0.5');

        // Section headers animation
        gsap.utils.toArray('h2').forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                opacity: 0,
                y: 30,
                ease: 'power3.out'
            });
        });

    // About section animations
    gsap.from('.about-content', {
        scrollTrigger: {
            trigger: '#about',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
        },
        duration: 1,
        opacity: 0,
        x: -50,
        ease: 'power3.out'
    });

    gsap.from('.about-image', {
        scrollTrigger: {
            trigger: '#about',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
        },
        duration: 1,
        opacity: 0,
        x: 50,
        ease: 'power3.out'
    });

    // Skill items staggered animation
    gsap.from('.skill-item', {
        scrollTrigger: {
            trigger: '.skill-item',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.6,
        opacity: 0,
        y: 20,
        stagger: 0.1,
        ease: 'power3.out'
    });

    // Service cards animation
    gsap.from('.service-card', {
        scrollTrigger: {
            trigger: '#services',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        opacity: 0,
        y: 30,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Timeline animations
    gsap.from('.timeline-item', {
        scrollTrigger: {
            trigger: '#experience',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        opacity: 0,
        y: 30,
        stagger: 0.3,
        ease: 'power3.out'
    });

    // Certification cards animation
    gsap.from('.certification-card', {
        scrollTrigger: {
            trigger: '#certifications',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        opacity: 0,
        y: 30,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Blog cards animation
    gsap.from('.blog-card', {
        scrollTrigger: {
            trigger: '#blog',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        opacity: 0,
        y: 30,
        stagger: 0.2,
        ease: 'power3.out'
    });

        // Social links animation
        gsap.from('.social-link', {
            scrollTrigger: {
                trigger: '#contact',
                start: 'top 70%',
                end: 'bottom 30%',
                toggleActions: 'play none none reverse'
            },
            duration: 0.6,
            opacity: 0,
            y: 20,
            stagger: 0.1,
            ease: 'power3.out'
        });
    } catch (error) {
        console.warn('GSAP animations failed:', error);
    }
}

// Initialize Projects
function initializeProjects() {
    renderProjects('all');
    setupProjectFilters();
}

// Render Projects
function renderProjects(category) {
    const filteredProjects = category === 'all' 
        ? projects 
        : projects.filter(project => project.category === category);

    console.log('Rendering projects:', filteredProjects.length, 'projects for category:', category);
    
    projectsGrid.innerHTML = '';

    filteredProjects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
    
    console.log('Project cards created:', document.querySelectorAll('.project-card').length);

    // Animate new project cards
    if (typeof gsap !== 'undefined') {
        gsap.from('.project-card', {
            duration: 0.6,
            opacity: 0,
            y: 30,
            stagger: 0.1,
            ease: 'power3.out',
            scale: 0.95
        });
    }
}

// Create Project Card
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card transform transition-all duration-500';
    card.innerHTML = `
        <div class="relative overflow-hidden">
            <div class="project-image bg-gradient-to-br ${project.image}"></div>
            <div class="project-overlay">
                <div class="project-links">
                    <a href="${project.liveUrl}" class="project-link" target="_blank">
                        <i class="fas fa-external-link-alt mr-2"></i>Live
                    </a>
                    <a href="${project.githubUrl}" class="project-link" target="_blank">
                        <i class="fab fa-github mr-2"></i>Code
                    </a>
                    <a href="${project.demoUrl}" class="project-link" target="_blank">
                        <i class="fas fa-play mr-2"></i>Demo
                    </a>
                </div>
            </div>
        </div>
        <div class="p-6">
            <h3 class="text-xl font-semibold mb-2 text-gray-100">${project.title}</h3>
            <p class="text-gray-300 mb-4">${project.description}</p>
                         <div class="flex flex-wrap gap-2 mb-4">
                 ${project.technologies.map(tech => 
                     `<span class="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm rounded-full border border-indigo-400">${tech}</span>`
                 ).join('')}
             </div>
            <div class="flex justify-between items-center">
                <span class="text-sm text-gray-400 capitalize">${project.category}</span>
                                 <div class="flex space-x-2">
                     <a href="${project.liveUrl}" class="text-indigo-400 hover:text-indigo-300 transition-colors">
                         <i class="fas fa-external-link-alt"></i>
                     </a>
                     <a href="${project.githubUrl}" class="text-gray-400 hover:text-gray-300 transition-colors">
                         <i class="fab fa-github"></i>
                     </a>
                 </div>
            </div>
        </div>
    `;
    return card;
}

// Setup Project Filters
function setupProjectFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter projects
            const category = this.getAttribute('data-filter');
            renderProjects(category);
        });
    });
}

// Initialize Testimonials
function initializeTestimonials() {
    showTestimonial(0);
    startTestimonialAutoPlay();
}

// Show Testimonial
function showTestimonial(index) {
    testimonialSlides.forEach((slide, i) => {
        slide.classList.remove('active', 'prev');
        if (i === index) {
            slide.classList.add('active');
        }
    });
    
    // Update dots
    const dots = document.querySelectorAll('.testimonial-dot');
    dots.forEach((dot, i) => {
        dot.classList.remove('active');
        if (i === index) {
            dot.classList.add('active');
        }
    });
    
    currentTestimonial = index;
}

// Change Testimonial with horizontal animation
function changeTestimonial(direction) {
    const totalSlides = testimonialSlides.length;
    const prevTestimonial = currentTestimonial;
    
    // Add prev class for animation
    testimonialSlides[currentTestimonial].classList.add('prev');
    
    let newIndex = currentTestimonial + direction;
    
    if (newIndex >= totalSlides) {
        newIndex = 0;
    } else if (newIndex < 0) {
        newIndex = totalSlides - 1;
    }
    
    // Delay the transition for smooth animation
    setTimeout(() => {
        testimonialSlides[prevTestimonial].classList.remove('prev');
        showTestimonial(newIndex);
    }, 100);
    
    resetTestimonialAutoPlay();
}

// Go to specific testimonial
function goToTestimonial(index) {
    if (index === currentTestimonial) return;
    
    const prevTestimonial = currentTestimonial;
    
    // Add prev class for animation
    testimonialSlides[currentTestimonial].classList.add('prev');
    
    // Delay the transition for smooth animation
    setTimeout(() => {
        testimonialSlides[prevTestimonial].classList.remove('prev');
        showTestimonial(index);
    }, 100);
    
    resetTestimonialAutoPlay();
}

// Start Auto Play
function startTestimonialAutoPlay() {
    testimonialInterval = setInterval(() => {
        changeTestimonial(1);
    }, 5000);
}

// Reset Auto Play
function resetTestimonialAutoPlay() {
    clearInterval(testimonialInterval);
    startTestimonialAutoPlay();
}

// Initialize Navigation
function initializeNavigation() {
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('open');
        const icon = this.querySelector('i');
        if (mobileMenu.classList.contains('open')) {
            icon.className = 'fas fa-times text-xl';
        } else {
            icon.className = 'fas fa-bars text-xl';
        }
    });

    // Close mobile menu when clicking on links
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('open');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars text-xl';
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize Scroll Effects
function initializeScrollEffects() {
    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('bg-white/95', 'shadow-lg');
        } else {
            navbar.classList.remove('bg-white/95', 'shadow-lg');
        }
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-blue-600');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-blue-600');
            }
        });
    });
}

// Initialize Typing Effect
function initializeTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;

    const text = typingText.textContent;
    typingText.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            typingText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };

    // Start typing effect after hero animation
    setTimeout(typeWriter, 1500);
}

// Utility Functions

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Intersection Observer for lazy loading
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
        observer.observe(el);
    });
}

// Performance optimization
const optimizedScrollHandler = throttle(() => {
    // Scroll-based animations and effects
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Initialize intersection observer
setupIntersectionObserver();

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Global functions for HTML onclick handlers
window.changeTestimonial = changeTestimonial;
window.goToTestimonial = goToTestimonial;

// Export functions for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        projects,
        renderProjects,
        changeTestimonial,
        initializeAnimations
    };
}
