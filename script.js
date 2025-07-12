const countElement = document.getElementById('count');
const mala = document.getElementById('mala');
const jaap = document.getElementById('jaap');
const historyContainer = document.getElementById('history');

const incrementBtn = document.getElementById('increment');
const resetBtn = document.getElementById('reset');
const toggleBgBtn = document.getElementById('toggle-bg');

const backgroundImages = [
  'url("image1.webp")',
  'url("image2.jpeg")',
  'url("image3.jpeg")',
  'url("image4.jpeg")'
];

let count = parseInt(localStorage.getItem('count')) || 0;
let malaCount = parseInt(localStorage.getItem('mala')) || 0;
let jaapCount = parseInt(localStorage.getItem('jaap')) || 0;
let currentImageIndex = 0;

let dailyCounts = JSON.parse(localStorage.getItem('dailyCounts')) || [];
let lastSavedDate = localStorage.getItem('lastSavedDate')
  ? new Date(localStorage.getItem('lastSavedDate'))
  : new Date();

function checkAndResetDaily() {
  const now = new Date();
  const diff = now - new Date(lastSavedDate);
  if (diff >= 24 * 60 * 60 * 1000) {
    // Save old count
    dailyCounts.push({
      date: lastSavedDate.toISOString().split('T')[0],
      count: count
    });

    // Reset today's count
    count = 0;
    jaapCount = 0;
    malaCount = 0;
    lastSavedDate = now;

    localStorage.setItem('dailyCounts', JSON.stringify(dailyCounts));
    localStorage.setItem('lastSavedDate', now.toISOString());
    localStorage.setItem('count', count);
    localStorage.setItem('jaap', jaapCount);
    localStorage.setItem('mala', malaCount);
  }
}

function updateUI() {
  countElement.innerText = count;
  jaap.innerText = jaapCount;
  mala.innerText = malaCount;

  // Filter entries from last 30 days
  const now = new Date();
  const last30Days = dailyCounts.filter(entry => {
    const entryDate = new Date(entry.date);
    return (now - entryDate) <= 30 * 24 * 60 * 60 * 1000;
  });

  // Render entries
  historyContainer.innerHTML = '';
  last30Days.reverse().forEach(entry => {
    const div = document.createElement('div');
    div.className = 'history-entry fade-in';
    div.innerText = `${entry.date}: ${entry.count} Jaap`;
    historyContainer.appendChild(div);
  });
}


incrementBtn.addEventListener('click', () => {
  checkAndResetDaily();
  count++;
  jaapCount++;

  if (jaapCount >= 108) {
    malaCount++;
    jaapCount = 0;
  }

  localStorage.setItem('count', count);
  localStorage.setItem('jaap', jaapCount);
  localStorage.setItem('mala', malaCount);
  localStorage.setItem('lastSavedDate', new Date().toISOString());

  updateUI();
});

resetBtn.addEventListener('click', () => {
  count = 0;
  jaapCount = 0;
  malaCount = 0;
  localStorage.setItem('count', count);
  localStorage.setItem('jaap', jaapCount);
  localStorage.setItem('mala', malaCount);
  updateUI();
});

toggleBgBtn.addEventListener('click', () => {
  currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
  document.body.style.backgroundImage = backgroundImages[currentImageIndex];
});

// First time setup
checkAndResetDaily();
updateUI();
