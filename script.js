const incrementButton = document.getElementById('increment');
const resetButton = document.getElementById('reset');
const countElement = document.getElementById('count');
const dayElement = document.getElementById('day');
const mala = document.getElementById('mala');
const jaap = document.getElementById('jaap');
const main = document.getElementById('main');
const backgroundImages = [
    'url("image1.webp")',
    'url("image2.jpeg")',
    'url("image3.jpeg")',
    'url("image4.jpeg")'
];

// Variable to track the current background image index
let currentImageIndex = 0;

// Load saved count from localStorage
let count = parseInt(localStorage.getItem('count')) || 0;
countElement.innerText = count;
 

let jaapCount = parseInt(localStorage.getItem('jaap')) || 0;
jaap.innerText = jaapCount;

let malaCount = parseInt(localStorage.getItem('mala')) || 0;
mala.innerText = malaCount;


// Function to save count
function saveCount() {
    const today = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
    dayElement.innerText = `Last Day Jaap : 0`; 
    localStorage.setItem('count', count);
    localStorage.setItem('mala', malaCount);
    localStorage.setItem('jaap', jaapCount);
    localStorage.setItem('lastSavedDate', today);
}

// Function to reset count every 24 hours
function checkResetTime() {
    const now = new Date();
    const istNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const today = istNow.toLocaleDateString('en-IN');
    const lastSavedDate = localStorage.getItem('lastSavedDate');

    // Check if the date has changed
    if (lastSavedDate !== today) {
        dayElement.innerText = `Last Day Jaap : ${count}`; 
        count = 0; // Reset the count
        countElement.innerText = count;
        jaapCount = 0; // Reset jaap count
        jaap.innerText = jaapCount;
        malaCount = 0; // Reset mala count
        mala.innerText = malaCount;
        saveCount(); // Save the reset count and update the date
    }
}

// Increment button functionality
incrementButton.addEventListener('click', () => {
    count++;
    countElement.innerText = count;

    // Change the background image
    currentImageIndex = (currentImageIndex + 1) % backgroundImages.length; // Cycle through images
    document.body.style.backgroundImage = backgroundImages[currentImageIndex];

    // Check if count reaches 108
    if (count === 108) {
        alert("Congratulations! You have completed 108 naam jaap.");
        malaCount++;
        mala.innerText = malaCount;
        count = 0; // Reset count for the next cycle
        countElement.innerText = count;
    }

    jaapCount++;
    jaap.innerText = jaapCount;

    saveCount();
});


// Reset button functionality
resetButton.addEventListener('click', () => {
    count = 0;
    countElement.innerText = count;
    jaapCount = 0;
    jaap.innerText = jaapCount;
    malaCount = 0;
    mala.innerText = malaCount;
    saveCount();
});

// Check reset time every minute
setInterval(checkResetTime, 60000);

// Initial save on page load
saveCount();