const incrementButton = document.getElementById('increment');
const decrementButton = document.getElementById('decrement');
const resetButton = document.getElementById('reset');
const countElement = document.getElementById('count');
const dayElement = document.getElementById('day');

// Load saved count from localStorage
let count = parseInt(localStorage.getItem('count')) || 0;
countElement.innerText = count;

// Function to save count
function saveCount() {
    const today = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
    dayElement.innerText = `Last Day: ${count}`;
    localStorage.setItem('count', count);
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
        count = 0; // Reset the count
        countElement.innerText = count;
        saveCount(); // Save the reset count and update the date
    }
}

// Increment button functionality
incrementButton.addEventListener('click', () => {
    count++;
    countElement.innerText = count;
    saveCount();
});

// Decrement button functionality
decrementButton.addEventListener('click', () => {
    count--;
    countElement.innerText = count;
    saveCount();
});

// Reset button functionality
resetButton.addEventListener('click', () => {
    count = 0;
    countElement.innerText = count;
    saveCount();
});

// Check reset time every minute
setInterval(checkResetTime, 60000);

// Initial save on page load
saveCount();