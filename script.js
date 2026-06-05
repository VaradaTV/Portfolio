/**
 * Varada T V - Portfolio Website Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSubTextTicker();
    initContactForm();
    initAmbientGlowFollower();
    initProfileImageUpload();
    initProfileImageDrag();
    initThemeToggle();
});

/* ==========================================================================
   NAVIGATION & MOBILE MENU
   ========================================================================== */
function initNavigation() {
    const header = document.querySelector('.navbar-container');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const navLogo = document.getElementById('nav-logo');

    // Scroll state for navbar background transparency
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        highlightActiveSection();
    });

    // Mobile Menu Toggle
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
        // Prevent body scrolling when menu is open
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : 'auto';
    });

    // Smooth scroll to top for logo click
    if (navLogo) {
        navLogo.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Close menu when clicking navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Mobile menu cleanups
            mobileToggle.classList.remove('open');
            navMenu.classList.remove('open');
            document.body.style.overflow = 'auto';

            // Smooth scrolling offset adjust
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                
                if (targetId === '#about') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    return;
                }

                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const navbar = document.querySelector('.navbar-container');
                    const navbarHeight = navbar ? navbar.offsetHeight : 80;
                    const sectionTop = targetSection.getBoundingClientRect().top + window.scrollY;
                    const sectionHeight = targetSection.offsetHeight;
                    const viewportHeight = window.innerHeight;

                    const isMobile = window.innerWidth <= 768;
                    let targetScroll;
                    if (!isMobile && sectionHeight < (viewportHeight - navbarHeight + 160)) {
                        // Center the section in the remaining viewport area below the navbar
                        targetScroll = sectionTop - navbarHeight - (viewportHeight - navbarHeight - sectionHeight) / 2;
                    } else {
                        // Align the top of the section with the bottom of the navbar
                        targetScroll = sectionTop - navbarHeight;
                    }

                    window.scrollTo({
                        top: targetScroll,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ScrollSpy: Highlight active link on scroll based on viewport center
    function highlightActiveSection() {
        const viewportCenter = window.scrollY + window.innerHeight / 2;
        let activeSectionId = null;

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top + window.scrollY;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (viewportCenter >= sectionTop && viewportCenter < sectionTop + sectionHeight) {
                activeSectionId = sectionId;
            }
        });

        // Force 'about' active at the very top of page
        if (window.scrollY < 50) {
            activeSectionId = 'about';
        }

        if (activeSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${activeSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    }

    // Trigger on load
    highlightActiveSection();
}

/* ==========================================================================
   TERMINAL TYPING EFFECT
   ========================================================================== */
/* ==========================================================================
   DYNAMIC SUBTEXT TICKER (TYPING MOTION)
   ========================================================================== */
function initSubTextTicker() {
    const words = [
        "Aspiring Software Developer",
        "AI Explorer"
    ];
    const textEl = document.getElementById('ticker-text');
    if (!textEl) return;

    let wordIdx = 0;
    let charIdx = 0;

    function type() {
        const currentWord = words[wordIdx];
        
        if (charIdx <= currentWord.length) {
            textEl.textContent = currentWord.substring(0, charIdx) || "\u00A0";
            charIdx++;
            setTimeout(type, 100); // Speed of character typing
        } else {
            // Full word completed. Wait for 2 seconds, then clear and start the next word.
            setTimeout(() => {
                textEl.textContent = "\u00A0"; 
                charIdx = 0; // Reset character index
                wordIdx = (wordIdx + 1) % words.length; // Move to next word
                setTimeout(type, 500); // Pause before next word typing begins
            }, 2000); // Pause showing the full word
        }
    }

    setTimeout(type, 1000); // Initial delay before typing first word
}

/* ==========================================================================
   AMBIENT GLOW MOUSE TRACKING
   ========================================================================== */
function initAmbientGlowFollower() {
    const glows = document.querySelectorAll('.ambient-glow');
    if (glows.length === 0) return;

    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Calculate translation relative to screen dimensions
        const pctX = mouseX / window.innerWidth - 0.5;
        const pctY = mouseY / window.innerHeight - 0.5;

        // Move each glow blob slightly differently to create depth
        glows.forEach((glow, idx) => {
            const multiplier = (idx + 1) * 35; // Shifting factor
            const moveX = pctX * multiplier;
            const moveY = pctY * multiplier;
            
            glow.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

/* ==========================================================================
   CONTACT FORM SUBMISSION
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-status');
    const submitBtn = document.getElementById('btn-submit');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // UI Feedback: Loading state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin icon-right"></i>';
        submitBtn.disabled = true;
        
        statusMsg.className = 'form-message-status';
        statusMsg.textContent = '';

        // Extract input fields
        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const message = document.getElementById('form-message').value.trim();

        // Simple validation check
        if (!name || !email || !message) {
            statusMsg.classList.add('error');
            statusMsg.textContent = 'Please fill in all the required fields.';
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            return;
        }

        // Simulate API post request delay (1.5 seconds)
        setTimeout(() => {
            statusMsg.classList.add('success');
            statusMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, ${name}! Your message has been sent. Varada will respond to you at ${email} soon.`;
            
            // Clear inputs
            form.reset();

            // Reset button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;

            // Clear status after 8 seconds
            setTimeout(() => {
                statusMsg.style.transition = 'opacity 1s';
                statusMsg.style.opacity = '0';
                setTimeout(() => {
                    statusMsg.className = 'form-message-status';
                    statusMsg.style.opacity = '1';
                    statusMsg.textContent = '';
                }, 1000);
            }, 8000);

        }, 1500);
    });
}

/* ==========================================================================
   PROFILE IMAGE LOCAL DISPLAY PREVIEW
   ========================================================================== */
function initProfileImageUpload() {
    const uploadInput = document.getElementById('profile-upload');
    const displayImg = document.getElementById('profile-display-img');
    const placeholder = document.getElementById('image-placeholder');

    if (!displayImg || !placeholder) return;

    // Check if there is a persistently saved photo & position in localStorage
    const savedPhoto = localStorage.getItem('profile_photo');
    const savedPosition = localStorage.getItem('profile_photo_position');

    if (savedPosition) {
        displayImg.style.objectPosition = savedPosition;
    }

    if (savedPhoto) {
        displayImg.src = savedPhoto;
        displayImg.style.display = 'block';
        const avatarIcon = placeholder.querySelector('.placeholder-avatar');
        if (avatarIcon) {
            avatarIcon.style.display = 'none';
        }
    } else {
        // Fallback: Try to load 'profile.jpeg' from the local project folder
        displayImg.src = 'profile.jpeg';
        
        displayImg.onload = () => {
            displayImg.style.display = 'block';
            const avatarIcon = placeholder.querySelector('.placeholder-avatar');
            if (avatarIcon) {
                avatarIcon.style.display = 'none';
            }
        };

        displayImg.onerror = () => {
            displayImg.style.display = 'none';
            const avatarIcon = placeholder.querySelector('.placeholder-avatar');
            if (avatarIcon) {
                avatarIcon.style.display = 'block';
            }
        };
    }

    // Allow user to upload a custom photo and save it persistently inside LocalStorage
    if (uploadInput) {
        uploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const img = new Image();
                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        
                        // Scale image down to max 800px width/height to easily fit LocalStorage quota
                        const maxDim = 800;
                        let width = img.width;
                        let height = img.height;
                        
                        if (width > height) {
                            if (width > maxDim) {
                                height = Math.round((height * maxDim) / width);
                                width = maxDim;
                            }
                        } else {
                            if (height > maxDim) {
                                width = Math.round((width * maxDim) / height);
                                height = maxDim;
                            }
                        }
                        
                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        try {
                            // Compress as JPEG to make the file size extremely small
                            const base64Image = canvas.toDataURL('image/jpeg', 0.85);
                            localStorage.setItem('profile_photo', base64Image);
                            
                            // Reset positioning coordinates on new image upload
                            displayImg.style.objectPosition = '50% 50%';
                            localStorage.setItem('profile_photo_position', '50% 50%');
                            
                            displayImg.src = base64Image;
                            displayImg.style.display = 'block';
                            
                            const avatarIcon = placeholder.querySelector('.placeholder-avatar');
                            if (avatarIcon) {
                                avatarIcon.style.display = 'none';
                            }
                        } catch (err) {
                            console.error('LocalStorage save failed:', err);
                            // Fallback to temporary session URL
                            const imageUrl = URL.createObjectURL(file);
                            displayImg.src = imageUrl;
                            displayImg.style.display = 'block';
                        }
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

/* ==========================================================================
   PROFILE IMAGE DRAG CROP POSITIONING
   ========================================================================== */
function initProfileImageDrag() {
    const container = document.querySelector('.profile-image-container');
    const displayImg = document.getElementById('profile-display-img');
    if (!container || !displayImg) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    
    // Read initial drag coordinates from localStorage to avoid visual jumping when dragging resumes
    const savedPosition = localStorage.getItem('profile_photo_position');
    let currentPosX = 50;
    let currentPosY = 50;
    if (savedPosition) {
        const parts = savedPosition.split(' ');
        if (parts.length === 2) {
            currentPosX = parseFloat(parts[0]) || 50;
            currentPosY = parseFloat(parts[1]) || 50;
        }
    }

    // Change cursor style on hover over photo
    container.addEventListener('mouseenter', () => {
        if (displayImg.style.display !== 'none' && !displayImg.src.includes('placeholder')) {
            container.style.cursor = 'move';
        }
    });

    container.addEventListener('mousedown', (e) => {
        // Only allow drag if a custom image is currently loaded
        if (displayImg.style.display === 'none' || displayImg.src.includes('placeholder')) return;
        
        isDragging = true;
        container.style.cursor = 'grabbing';
        startX = e.clientX;
        startY = e.clientY;
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        // Map pixel drag distance to percentage shift.
        let nextPosX = currentPosX - (deltaX / 3.5);
        let nextPosY = currentPosY - (deltaY / 3.5);
        
        // Keep within 0% to 100% bounds
        nextPosX = Math.max(0, Math.min(100, nextPosX));
        nextPosY = Math.max(0, Math.min(100, nextPosY));
        
        displayImg.style.objectPosition = `${nextPosX}% ${nextPosY}%`;
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            container.style.cursor = 'move';
            
            // Extract and save the current position percentages
            const pos = displayImg.style.objectPosition;
            if (pos) {
                const parts = pos.split(' ');
                if (parts.length === 2) {
                    currentPosX = parseFloat(parts[0]);
                    currentPosY = parseFloat(parts[1]);
                    // Save drag position persistently
                    localStorage.setItem('profile_photo_position', pos);
                }
            }
        }
    });

    // Touch support for mobile devices
    container.addEventListener('touchstart', (e) => {
        if (displayImg.style.display === 'none' || displayImg.src.includes('placeholder')) return;
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaX = e.touches[0].clientX - startX;
        const deltaY = e.touches[0].clientY - startY;
        
        let nextPosX = currentPosX - (deltaX / 3.5);
        let nextPosY = currentPosY - (deltaY / 3.5);
        
        nextPosX = Math.max(0, Math.min(100, nextPosX));
        nextPosY = Math.max(0, Math.min(100, nextPosY));
        
        displayImg.style.objectPosition = `${nextPosX}% ${nextPosY}%`;
    }, { passive: true });
    window.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;
            const pos = displayImg.style.objectPosition;
            if (pos) {
                const parts = pos.split(' ');
                if (parts.length === 2) {
                    currentPosX = parseFloat(parts[0]);
                    currentPosY = parseFloat(parts[1]);
                    // Save drag position persistently
                    localStorage.setItem('profile_photo_position', pos);
                }
            }
        }
    });
}

/* ==========================================================================
   THEME TOGGLE (LIGHT & DARK MODE)
   ========================================================================== */
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme preference on page load
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}
