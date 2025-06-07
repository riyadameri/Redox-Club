// Initialize AOS animations
AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-in-out-cubic'
});

// Initialize GSAP animations
gsap.registerPlugin(ScrollTrigger);

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

// Show professional success message
function showSuccessMessage(message) {
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    const successMessage = document.getElementById('successMessage');
    
    // Adjust message based on screen size
    if (window.innerWidth < 768) {
        // Mobile-friendly shorter message
        message = message.replace(/! We will contact you soon/g, '!');
        message = message.replace(/successfully/g, 'done');
    }
    
    successMessage.textContent = message;
    successModal.show();
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        successModal.hide();
    }, 3000);
}

// Registration Form Submission
const registrationForm = document.getElementById('registrationForm');
if (registrationForm) {
    registrationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading indicator
        const submitBtn = document.getElementById('submitBtn');
        const submitLoader = document.getElementById('submitLoader');
        submitBtn.disabled = true;
        submitLoader.style.display = 'inline-block';
        
        // Collect form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            UniversityId: document.getElementById('universityId').value,
            StudentName: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
            StudentLevel: document.getElementById('studyLevel').value,
            PrimaryDepartment: document.getElementById('department').value,
            SpecificTeamInterest: document.getElementById('team').value,
            SkillsAndExperience: document.getElementById('skills').value,
            MotivationForJoining: document.getElementById('motivation').value
        };

        try {
            const response = await fetch('https://redox-club.onrender.com/api/club-signals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // Show professional success message
            showSuccessMessage('Your application has been submitted successfully! We will contact you soon.');
            
            // Reset form
            registrationForm.reset();
        } catch (error) {
            console.error('Error:', error);
            showSuccessMessage('There was an error submitting your application. Please try again later.');
        } finally {
            // Hide loader
            submitBtn.disabled = false;
            submitLoader.style.display = 'none';
        }
    });
}

// Contact Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading indicator
        const submitBtn = document.getElementById('contactSubmitBtn');
        const submitLoader = document.getElementById('contactLoader');
        submitBtn.disabled = true;
        submitLoader.style.display = 'inline-block';
        
        // Collect form data
        const formData = {
            Name: document.getElementById('contactName').value,
            Email: document.getElementById('contactEmail').value,
            Subject: document.getElementById('contactSubject').value,
            Message: document.getElementById('contactMessage').value
        };

        try {
            const response = await fetch('https://redox-club.onrender.com/api/club-signals/SendUsMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // Show professional success message
            showSuccessMessage('Your message has been sent successfully! We will respond within 24 hours.');
            
            // Reset form
            contactForm.reset();
        } catch (error) {
            console.error('Error:', error);
            showSuccessMessage('There was an error sending your message. Please try again later or contact us directly.');
        } finally {
            // Hide loader
            submitBtn.disabled = false;
            submitLoader.style.display = 'none';
        }
    });
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

// Animate elements on scroll wiFth GSAP
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