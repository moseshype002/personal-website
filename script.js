let deferredPrompt;
const pwaBanner = document.getElementById('install-banner');
const pwaButton = document.getElementById('banner-install-btn');

// 1. The Browser sends a "Signal" when it's ready to install
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // Stop the browser's default small bar
    deferredPrompt = e; // Save the signal in our variable
    
    // NOW the banner shows up because we have the "Key" to install
    if (pwaBanner) {
        pwaBanner.style.display = 'flex'; 
        console.log("Install signal received!");
    }
});

// 2. When the customer clicks your "Install Now" button
if (pwaButton) {
    pwaButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            // This opens the real Google Install Window
            deferredPrompt.prompt();
            
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response: ${outcome}`);
            
            // Clean up
            deferredPrompt = null;
            pwaBanner.style.display = 'none';
        } else {
            // Backup instruction if the signal hasn't arrived yet
            alert("To install M.Cyrex: Tap the 3 dots (⋮) in Chrome and select 'Install app'!");
        }
    });
}

// This function handles the "Remembrance"
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
}

// Run it immediately so the user doesn't see a "flash" of the wrong color
applySavedTheme();

// Also make sure your toggle button updates the memory
const themeBtn = document.getElementById('theme-toggle'); 
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        // Save the current state
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}


/* --- DARK MODE (At the very top of script.js) --- */
(function() {
    const toggle = document.querySelector('#checkbox');
    const root = document.documentElement;

    if (toggle) {
        // Load saved theme
        const saved = localStorage.getItem('theme');
        if (saved) {
            root.setAttribute('data-theme', saved);
            toggle.checked = saved === 'dark';
        }

        // Listen for switch
        toggle.addEventListener('change', () => {
            const theme = toggle.checked ? 'dark' : 'light';
            root.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            console.log("Theme changed to:", theme);
        });
    }
})();

/* --- REST OF YOUR CODE (AOS, Gallery, etc.) --- */
try {
    AOS.init({ duration: 1000 });
} catch (e) {
    console.log("AOS failed to load, but the rest of the site is fine!");
}



document.addEventListener('DOMContentLoaded', function() {

// --- 1. MOBILE MENU TOGGLE ---
const menuToggle = document.querySelector('#mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('is-active');
    });
}
// This makes the whole box clickable
document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('click', function() {
        this.querySelector('.card-inner').classList.toggle('is-flipped');
    });
});
// --- 2. SWIPER INITIALIZATION ---
// We initialize both your project swiper and your future feedback swiper
var projectSwiper = new Swiper(".mySwiper", {
    pagination: { el: ".swiper-pagination", clickable: true },
    autoplay: { delay: 3000 },
    loop: true
});

 // --- 3. FEEDBACK SWIPER (The New One) ---
    // This is the "Engine" that was missing!
    if (document.querySelector(".feedbackSwiper")) {
        new Swiper(".feedbackSwiper", {
            loop: true,
            speed: 800, // Smooth transition speed
            autoplay: { 
                delay: 4000,
                disableOnInteraction: false 
            },
            pagination: { 
                el: ".swiper-pagination", 
                clickable: true 
            },
            // This ensures it looks good on both phone and laptop
            slidesPerView: 1,
            spaceBetween: 30
        });
    }

// --- 4. COUNTER ANIMATION LOGIC (Re-reads every time) ---
const counters = document.querySelectorAll('.counter');

const countToTarget = (counter) => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const speed = 100; // Adjust for smoothness
    const inc = target / speed;

    if (count < target) {
        counter.innerText = Math.ceil(count + inc);
        setTimeout(() => countToTarget(counter), 20);
    } else {
        counter.innerText = target;
    }
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            countToTarget(entry.target);
        } else {
            entry.target.innerText = "0"; // Resets so it counts up again
        }
    });
}, { threshold: 0.5 });

counters.forEach(c => statsObserver.observe(c));
});


document.addEventListener("DOMContentLoaded", function () {
    const nextButton = document.getElementById("next-btn");
    const prevButton = document.getElementById("prev-btn");
    const papers = document.querySelectorAll(".paper");

    if (nextButton && prevButton && papers.length > 0) {
        let currentPage = 0;
        const totalPages = papers.length;

        // Automatically set the stacking order
        papers.forEach((paper, index) => {
            paper.style.zIndex = totalPages - index;
        });

        window.goNextPage = function() {
            if (currentPage < totalPages) {
                papers[currentPage].classList.add("flipped");
                papers[currentPage].style.zIndex = currentPage + 1;
                currentPage++;
            }
        }

        window.goPrevPage = function() {
            if (currentPage > 0) {
                currentPage--;
                papers[currentPage].classList.remove("flipped");
                papers[currentPage].style.zIndex = totalPages - currentPage;
            }
        }

        nextButton.addEventListener("click", window.goNextPage);
        prevButton.addEventListener("click", window.goPrevPage);
        
        console.log("Catalogue Engine: ONLINE");
    }
});


// --- MIRROR SLIDER START ---
try {
    const mirrorItems = document.querySelectorAll('.mirror-item');
    const mNext = document.getElementById('m-next');
    const mPrev = document.getElementById('m-prev');

    if (mirrorItems.length > 0 && mNext && mPrev) {
        let currentPos = 1;
        
        function updateMirror() {
            mirrorItems.forEach((item, i) => {
                item.classList.remove('active', 'prev', 'next');
                const prevIndex = (currentPos - 1 + mirrorItems.length) % mirrorItems.length;
                const nextIndex = (currentPos + 1) % mirrorItems.length;

                if (i === currentPos) item.classList.add('active');
                else if (i === prevIndex) item.classList.add('prev');
                else if (i === nextIndex) item.classList.add('next');
            });
        }

        mNext.onclick = () => {
            currentPos = (currentPos + 1) % mirrorItems.length;
            updateMirror();
        };

        mPrev.onclick = () => {
            currentPos = (currentPos - 1 + mirrorItems.length) % mirrorItems.length;
            updateMirror();
        };

        updateMirror();
        console.log("Gallery initialized successfully.");
    }
} catch (e) {
    console.error("Gallery failed but continuing script:", e);
}
// --- MIRROR SLIDER END ---

function startClock() {
    const clockElement = document.getElementById('digital-clock');
    if (!clockElement) return;

    setInterval(() => {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();

        // Adding leading zeros
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        clockElement.textContent = hours + ":" + minutes + ":" + seconds;
    }, 1000);
}

// Run the clock
startClock();


// Function for Smart Weather (Fixed String Concatenation)
function initSmartWeather() {
    const weatherBox = document.getElementById('local-weather');
    const weatherKey = "1f62cf5b43ce33cdfa238100c81f20fe";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {
            var lat = pos.coords.latitude;
            var lon = pos.coords.longitude;
            
            // Fixed the URL and HTML strings to avoid those TypeScript errors
            var url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + weatherKey;

            fetch(url)
                .then(function(res) { return res.json(); })
                .then(function(data) {
                    var temp = Math.round(data.main.temp);
                    var city = data.name;
                    var desc = data.weather[0].description;

                    weatherBox.innerHTML = '<h2 style="font-size:3rem; margin:0;">' + temp + '°C</h2>' +
                                           '<p style="color:#00ffcc; margin:5px 0;">' + city + '</p>' +
                                           '<small style="text-transform:capitalize;">' + desc + '</small>';
                })
                .catch(function() { weatherBox.innerText = "Weather Error"; });
        }, function() {
            weatherBox.innerText = "Location Denied (Check Abuja)";
        });
    }
}

// Function for Currency (Fixed String Concatenation)
async function initCurrencyConverter() {
    const amount = document.getElementById('amount');
    const from = document.getElementById('from-currency');
    const to = document.getElementById('to-currency');
    const result = document.getElementById('conversion-result');
    const currencyKey = "576e9c8a1d00bb5700913d76";

    async function calculate() {
        var fromVal = from.value;
        var toVal = to.value;
        var amtVal = amount.value || 1;

        // Fixed the URL construction
        var url = "https://v6.exchangerate-api.com/v6/" + currencyKey + "/latest/" + fromVal;

        try {
            const res = await fetch(url);
            const data = await res.json();
            const rate = data.conversion_rates[toVal];
            const total = (amtVal * rate).toLocaleString(undefined, {minimumFractionDigits: 2});
            
            var symbol = (toVal === 'NGN' ? '₦' : '');
            result.innerText = symbol + total;
        } catch (e) { 
            result.innerText = "Error"; 
        }
    }

    // Event listeners
    amount.addEventListener('input', calculate);
    from.addEventListener('change', calculate);
    to.addEventListener('change', calculate);
    
    calculate();
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', function() {
    initSmartWeather();
    initCurrencyConverter();
});


 AOS.init({
    // Global settings:
    duration: 1200,     // Smooth speed for all animations
    once: false,        // THIS is what makes it repeat EVERY time they scroll
    mirror: true,       // THIS makes it animate again when scrolling back UP
    offset: 120,        // Starts the move when the section is 120px into the screen
    anchorPlacement: 'top-bottom', // Ensures it triggers at the right moment
  });


  const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        // This prevents the page from refreshing immediately
        e.preventDefault(); 

        // If the browser says the form is valid (all 'required' fields filled)
        if (this.checkValidity()) {
            alert("✅ Success! M.Cyrex has received your message.");
            this.reset(); // This clears the form after they send it
        } else {
            alert("❌ Please fill in all fields correctly.");
        }
    });
}

