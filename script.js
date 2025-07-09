document.addEventListener('DOMContentLoaded', function() {
    // ========== Dark Mode Toggle ==========
    const darkModeToggle = document.getElementById('darkModeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved user preference or use system preference
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    document.body.setAttribute('data-theme', currentTheme);
    
    // Update button icon based on current theme
    updateDarkModeIcon(currentTheme);
    
    // Toggle dark/light mode
    darkModeToggle.addEventListener('click', function() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateDarkModeIcon(newTheme);
    });
    
    function updateDarkModeIcon(theme) {
        const icon = darkModeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    }
    
    // ========== Mobile Menu Toggle ==========
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        mainNav.classList.toggle('show');
        this.classList.toggle('open');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('show');
            mobileMenuBtn.classList.remove('open');
        });
    });
    
    // ========== Smooth Scrolling ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // ========== Feature Card Interactions ==========
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('active');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('active');
        });
        
        // Click to keep expanded on mobile
        card.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                featureCards.forEach(c => c.classList.remove('expanded'));
                this.classList.toggle('expanded');
            }
        });
    });
    
    // ========== Initialize Mini Maps ==========
    const initializeMiniMaps = function() {
        const miniMaps = document.querySelectorAll('.mini-map');
        
        if (miniMaps.length > 0 && typeof L !== 'undefined') {
            miniMaps.forEach((mapEl, index) => {
                // Different coordinates for each mini map
                const locations = [
                    { lat: 27.9881, lng: 86.9250, zoom: 8 }, // Everest
                    { lat: 30.7333, lng: 79.0667, zoom: 10 }, // Valley of Flowers
                    { lat: 32.2799, lng: 77.1833, zoom: 9 }  // Hampta Pass
                ];
                
                const location = locations[index % locations.length];
                const map = L.map(mapEl).setView([location.lat, location.lng], location.zoom);
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    maxZoom: 13,
                    minZoom: 7
                }).addTo(map);
                
                // Add a simple marker
                L.marker([location.lat, location.lng]).addTo(map)
                    .bindPopup('Start Point')
                    .openPopup();
                
                // Disable dragging and zoom on mini maps
                map.dragging.disable();
                map.touchZoom.disable();
                map.doubleClickZoom.disable();
                map.scrollWheelZoom.disable();
                map.boxZoom.disable();
                map.keyboard.disable();
            });
        }
    };
    
    // Initialize maps when they come into view
    const mapObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initializeMiniMaps();
                mapObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.mini-map').forEach(map => {
        mapObserver.observe(map);
    });
    
    // ========== Search Functionality ==========
    const searchButton = document.querySelector('.search-bar button');
    const searchInput = document.querySelector('.search-bar input');
    
    searchButton.addEventListener('click', function() {
        performSearch();
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            // In a real implementation, this would filter content
            showSearchResults(query);
        } else {
            showToast('Please enter a search term');
        }
    }
    
    function showSearchResults(query) {
        // Create a modal with search results
        const modal = document.createElement('div');
        modal.className = 'search-modal';
        modal.innerHTML = `
            <div class="search-modal-content">
                <span class="close-search-modal">&times;</span>
                <h3>Search Results for "${query}"</h3>
                <div class="search-loading">
                    <div class="spinner"></div>
                    <p>Searching our trek database...</p>
                </div>
                <div class="search-results"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Close modal
        modal.querySelector('.close-search-modal').addEventListener('click', function() {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        });
        
        // Simulate API call with timeout
        setTimeout(() => {
            const loading = modal.querySelector('.search-loading');
            const results = modal.querySelector('.search-results');
            
            loading.style.display = 'none';
            
            // Mock results - in a real app this would come from an API
            const mockResults = [
                { 
                    title: 'Everest Base Camp Trek', 
                    type: 'Trek', 
                    match: 'Everest', 
                    snippet: 'The iconic trek to the base of the world\'s highest mountain...',
                    link: '#'
                },
                { 
                    title: 'Everest Weather Guide', 
                    type: 'Article', 
                    match: 'Everest', 
                    snippet: 'Complete weather information for the Everest region...',
                    link: '#'
                },
                { 
                    title: 'Packing for Everest Trek', 
                    type: 'Guide', 
                    match: 'Everest', 
                    snippet: 'Essential packing list for the Everest Base Camp trek...',
                    link: '#'
                }
            ].filter(item => item.title.toLowerCase().includes(query.toLowerCase()) || 
                           item.snippet.toLowerCase().includes(query.toLowerCase()));
            
            if (mockResults.length > 0) {
                results.innerHTML = mockResults.map(item => `
                    <div class="search-result-item">
                        <h4>${item.title} <span class="result-type">${item.type}</span></h4>
                        <p>${item.snippet}</p>
                        <a href="${item.link}" class="btn btn-small">View ${item.type}</a>
                    </div>
                `).join('');
            } else {
                results.innerHTML = `<p class="no-results">No results found for "${query}". Try different keywords.</p>`;
            }
        }, 1500);
    }
    
    // ========== Toast Notifications ==========
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // ========== Emergency Button Effects ==========
    const emergencyButtons = document.querySelectorAll('.btn-emergency');
    
    emergencyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show confirmation dialog
            const confirmed = confirm('Are you sure you want to call emergency services?');
            if (confirmed) {
                // In a real app, this would initiate a phone call
                showToast('Connecting to emergency services...', 'emergency');
                
                // Simulate call initiation
                setTimeout(() => {
                    showToast('Emergency call connected', 'success');
                }, 2000);
            }
        });
    });
    
    // ========== Trek Card Interactions ==========
    const trekCards = document.querySelectorAll('.trek-card');
    
    trekCards.forEach(card => {
        // Click on image to view full screen
        const image = card.querySelector('.trek-image');
        image.addEventListener('click', function() {
            viewFullScreenImage(this.style.backgroundImage.slice(5, -2));
        });
        
        // Save trek button
        const saveBtn = card.querySelector('.btn-outline');
        if (saveBtn) {
            saveBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                this.classList.toggle('saved');
                
                const trekTitle = card.querySelector('h3').textContent;
                if (this.classList.contains('saved')) {
                    this.innerHTML = '<i class="fas fa-check"></i> Saved';
                    showToast(`${trekTitle} added to your saved treks`, 'success');
                } else {
                    this.innerHTML = '<i class="fas fa-bookmark"></i> Save Trek';
                    showToast(`${trekTitle} removed from saved treks`, 'info');
                }
            });
        }
    });
    
    function viewFullScreenImage(imageUrl) {
        const overlay = document.createElement('div');
        overlay.className = 'image-overlay';
        overlay.innerHTML = `
            <div class="image-overlay-content">
                <span class="close-overlay">&times;</span>
                <img src="${imageUrl}" alt="Trek Photo">
            </div>
        `;
        
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        
        overlay.querySelector('.close-overlay').addEventListener('click', function() {
            document.body.removeChild(overlay);
            document.body.style.overflow = '';
        });
    }
    
    // ========== Weather Widget Animation ==========
    function animateWeatherWidgets() {
        const weatherIcons = document.querySelectorAll('.weather-icon');
        
        weatherIcons.forEach(icon => {
            if (icon.classList.contains('sunny')) {
                // Make sun rays pulse gently
                setInterval(() => {
                    icon.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        icon.style.transform = 'scale(1)';
                    }, 1000);
                }, 2000);
            } else if (icon.classList.contains('rainy')) {
                // Make rain drops fall
                const drops = document.createElement('div');
                drops.className = 'rain-drops';
                icon.parentNode.appendChild(drops);
            }
        });
    }
    
    // Initialize weather animations when they come into view
    const weatherObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateWeatherWidgets();
                weatherObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.weather-widget').forEach(widget => {
        weatherObserver.observe(widget);
    });
    
    // ========== Altitude Calculator Preview ==========
    const altitudeBars = document.querySelectorAll('.altitude-bar');
    
    altitudeBars.forEach(bar => {
        // Animate altitude bar on scroll into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    bar.style.height = '100%';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(bar.parentElement);
    });
    
    // ========== Packing List Interactions ==========
    document.querySelectorAll('.packing-item').forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('checked');
        });
    });
});