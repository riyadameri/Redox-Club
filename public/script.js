        // Initialize AOS animations
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-in-out-cubic'
        });
        
        // Initialize GSAP animations
        gsap.registerPlugin(ScrollTrigger);
        
        // Animate elements on scroll with GSAP
        gsap.utils.toArray(".card-3d").forEach(card => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
        });
        
        // Particle.js initialization
        document.addEventListener('DOMContentLoaded', function() {
            // Main particles
            if (document.getElementById('particles-js')) {
                particlesJS('particles-js', {
                    "particles": {
                        "number": {
                            "value": 100,
                            "density": {
                                "enable": true,
                                "value_area": 800
                            }
                        },
                        "color": {
                            "value": "#ffffff"
                        },
                        "shape": {
                            "type": "circle",
                            "stroke": {
                                "width": 0,
                                "color": "#000000"
                            },
                            "polygon": {
                                "nb_sides": 5
                            }
                        },
                        "opacity": {
                            "value": 0.3,
                            "random": false,
                            "anim": {
                                "enable": false,
                                "speed": 1,
                                "opacity_min": 0.1,
                                "sync": false
                            }
                        },
                        "size": {
                            "value": 3,
                            "random": true,
                            "anim": {
                                "enable": false,
                                "speed": 40,
                                "size_min": 0.1,
                                "sync": false
                            }
                        },
                        "line_linked": {
                            "enable": true,
                            "distance": 150,
                            "color": "#ffffff",
                            "opacity": 0.2,
                            "width": 1
                        },
                        "move": {
                            "enable": true,
                            "speed": 2,
                            "direction": "none",
                            "random": false,
                            "straight": false,
                            "out_mode": "out",
                            "bounce": false,
                            "attract": {
                                "enable": false,
                                "rotateX": 600,
                                "rotateY": 1200
                            }
                        }
                    },
                    "interactivity": {
                        "detect_on": "canvas",
                        "events": {
                            "onhover": {
                                "enable": true,
                                "mode": "grab"
                            },
                            "onclick": {
                                "enable": true,
                                "mode": "push"
                            },
                            "resize": true
                        },
                        "modes": {
                            "grab": {
                                "distance": 140,
                                "line_linked": {
                                    "opacity": 1
                                }
                            },
                            "bubble": {
                                "distance": 400,
                                "size": 40,
                                "duration": 2,
                                "opacity": 8,
                                "speed": 3
                            },
                            "repulse": {
                                "distance": 200,
                                "duration": 0.4
                            },
                            "push": {
                                "particles_nb": 4
                            },
                            "remove": {
                                "particles_nb": 2
                            }
                        }
                    },
                    "retina_detect": true
                });
            }
            
            // Footer particles
            if (document.getElementById('particles-js-footer')) {
                particlesJS('particles-js-footer', {
                    "particles": {
                        "number": {
                            "value": 60,
                            "density": {
                                "enable": true,
                                "value_area": 800
                            }
                        },
                        "color": {
                            "value": "#ffffff"
                        },
                        "shape": {
                            "type": "circle",
                            "stroke": {
                                "width": 0,
                                "color": "#000000"
                            },
                            "polygon": {
                                "nb_sides": 5
                            }
                        },
                        "opacity": {
                            "value": 0.2,
                            "random": false,
                            "anim": {
                                "enable": false,
                                "speed": 1,
                                "opacity_min": 0.1,
                                "sync": false
                            }
                        },
                        "size": {
                            "value": 3,
                            "random": true,
                            "anim": {
                                "enable": false,
                                "speed": 40,
                                "size_min": 0.1,
                                "sync": false
                            }
                        },
                        "line_linked": {
                            "enable": true,
                            "distance": 150,
                            "color": "#ffffff",
                            "opacity": 0.1,
                            "width": 1
                        },
                        "move": {
                            "enable": true,
                            "speed": 1,
                            "direction": "none",
                            "random": false,
                            "straight": false,
                            "out_mode": "out",
                            "bounce": false,
                            "attract": {
                                "enable": false,
                                "rotateX": 600,
                                "rotateY": 1200
                            }
                        }
                    },
                    "interactivity": {
                        "detect_on": "canvas",
                        "events": {
                            "onhover": {
                                "enable": false,
                                "mode": "grab"
                            },
                            "onclick": {
                                "enable": false,
                                "mode": "push"
                            },
                            "resize": true
                        },
                        "modes": {
                            "grab": {
                                "distance": 140,
                                "line_linked": {
                                    "opacity": 1
                                }
                            },
                            "bubble": {
                                "distance": 400,
                                "size": 40,
                                "duration": 2,
                                "opacity": 8,
                                "speed": 3
                            },
                            "repulse": {
                                "distance": 200,
                                "duration": 0.4
                            },
                            "push": {
                                "particles_nb": 4
                            },
                            "remove": {
                                "particles_nb": 2
                            }
                        }
                    },
                    "retina_detect": true
                });
            }
            
            // Navbar scroll effect
            window.addEventListener('scroll', function() {
                const navbar = document.querySelector('.navbar');
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                // Back to top button
                const backToTop = document.getElementById('backToTop');
                if (window.scrollY > 300) {
                    backToTop.style.display = 'flex';
                    gsap.to(backToTop, { opacity: 1, duration: 0.3 });
                } else {
                    gsap.to(backToTop, { opacity: 0, duration: 0.3, onComplete: () => {
                        backToTop.style.display = 'none';
                    }});
                }
            });
            
            // Back to top button
            document.getElementById('backToTop').addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // Create floating particles
            const floatingParticles = document.getElementById('floatingParticles');
            if (floatingParticles) {
                for (let i = 0; i < 30; i++) {
                    const particle = document.createElement('div');
                    particle.classList.add('particle');
                    
                    // Random properties
                    const size = Math.random() * 5 + 3;
                    const posX = Math.random() * 100;
                    const posY = Math.random() * 100;
                    const delay = Math.random() * 10;
                    const duration = Math.random() * 20 + 10;
                    
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;
                    particle.style.left = `${posX}%`;
                    particle.style.top = `${posY}%`;
                    particle.style.animationDelay = `${delay}s`;
                    particle.style.animationDuration = `${duration}s`;
                    
                    floatingParticles.appendChild(particle);
                }
            }
            
            // Gallery functionality
            const galleryItems = [
                {
                    img: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?ixlib=rb-4.0.3',
                    title: 'Tech Workshop 2023',
                    description: 'Our annual tech workshop where members learn about the latest technologies and trends in the industry.',
                    date: 'May 15, 2023',
                    location: 'KMU Main Hall'
                },
                {
                    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3',
                    title: 'Team Building Event',
                    description: 'Quarterly team building activities to strengthen collaboration between different departments.',
                    date: 'April 2, 2023',
                    location: 'University Campus'
                },
                {
                    img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3',
                    title: 'Hackathon Winners',
                    description: 'Our team won first place in the national university hackathon competition.',
                    date: 'March 20, 2023',
                    location: 'Algiers'
                },
                {
                    img: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?ixlib=rb-4.0.3',
                    title: 'AI Conference',
                    description: 'Annual AI conference featuring guest speakers from Redox Institution and other tech companies.',
                    date: 'February 10, 2023',
                    location: 'KMU Conference Center'
                },
                {
                    img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3',
                    title: 'Team Meeting',
                    description: 'Monthly meeting of department heads to coordinate activities and projects.',
                    date: 'January 25, 2023',
                    location: 'Redox Club Office'
                },
                {
                    img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3',
                    title: 'Project Presentation',
                    description: 'Students presenting their semester projects to faculty and industry partners.',
                    date: 'December 15, 2022',
                    location: 'Engineering Building'
                }
            ];
            
            let currentGalleryIndex = 0;
            
            // Set up gallery modal
            const galleryModal = document.getElementById('galleryModal');
            if (galleryModal) {
                galleryModal.addEventListener('show.bs.modal', function(event) {
                    const clickedImage = event.relatedTarget;
                    const imgSrc = clickedImage.getAttribute('data-img');
                    currentGalleryIndex = galleryItems.findIndex(item => item.img === imgSrc);
                    
                    updateGalleryModal(currentGalleryIndex);
                });
                
                // Navigation buttons
                document.getElementById('prevImage').addEventListener('click', function() {
                    currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
                    updateGalleryModal(currentGalleryIndex);
                });
                
                document.getElementById('nextImage').addEventListener('click', function() {
                    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
                    updateGalleryModal(currentGalleryIndex);
                });
                
                function updateGalleryModal(index) {
                    const item = galleryItems[index];
                    document.getElementById('modalImage').src = item.img;
                    document.getElementById('galleryModalTitle').textContent = item.title;
                    document.getElementById('galleryModalDescription').textContent = item.description;
                    document.getElementById('galleryModalDate').textContent = item.date;
                    document.getElementById('galleryModalLocation').textContent = item.location;
                }
            }
            
            // Form rotation effect
            const formContainer = document.getElementById('formRotationContainer');
            const flipFormBtn = document.getElementById('flipFormBtn');
            const flipBackBtn = document.getElementById('flipBackBtn');
            
            if (flipFormBtn && flipBackBtn) {
                flipFormBtn.addEventListener('click', function() {
                    formContainer.classList.add('rotated');
                });
                
                flipBackBtn.addEventListener('click', function() {
                    formContainer.classList.remove('rotated');
                });
            }
            
            // Form submission
            const registrationForm = document.getElementById('registrationForm');
            if (registrationForm) {
                registrationForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Show loading indicator
                    const submitBtn = document.getElementById('submitBtn');
                    const submitLoader = document.getElementById('submitLoader');
                    submitBtn.disabled = true;
                    submitLoader.style.display = 'inline-block';
                    
                    // Simulate form submission
                    setTimeout(function() {
                        // Hide loader
                        submitBtn.disabled = false;
                        submitLoader.style.display = 'none';
                        
                        // Show success message
                        document.getElementById('successMessage').textContent = 
                            'Your application has been submitted successfully! We will contact you soon.';
                        
                        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
                        successModal.show();
                        
                        // Reset form
                        registrationForm.reset();
                        formContainer.classList.remove('rotated');
                    }, 2000);
                });
            }
            
            // Contact form submission
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Show loading indicator
                    const submitBtn = document.getElementById('contactSubmitBtn');
                    const submitLoader = document.getElementById('contactLoader');
                    submitBtn.disabled = true;
                    submitLoader.style.display = 'inline-block';
                    
                    // Simulate form submission
                    setTimeout(function() {
                        // Hide loader
                        submitBtn.disabled = false;
                        submitLoader.style.display = 'none';
                        
                        // Show success message
                        document.getElementById('successMessage').textContent = 
                            'Your message has been sent successfully! We will get back to you soon.';
                        
                        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
                        successModal.show();
                        
                        // Reset form
                        contactForm.reset();
                    }, 2000);
                });
            }
            
            // Interactive cursor
            const cursor = document.querySelector('.cursor');
            if (cursor) {
                document.addEventListener('mousemove', (e) => {
                    cursor.style.left = e.clientX + 'px';
                    cursor.style.top = e.clientY + 'px';
                });
                
                document.querySelectorAll('a, button, .hover-scale').forEach(el => {
                    el.addEventListener('mouseenter', () => {
                        cursor.classList.add('active');
                    });
                    
                    el.addEventListener('mouseleave', () => {
                        cursor.classList.remove('active');
                    });
                });
            }
            
            // 3D card tilt effect
            const cards = document.querySelectorAll('.card-3d');
            cards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
                    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
                    card.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
                });
                
                card.addEventListener('mouseenter', () => {
                    card.style.transition = 'none';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transition = 'all 0.5s ease';
                    card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
                });
            });
        });