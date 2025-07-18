document.addEventListener('DOMContentLoaded', () => {
  const countElement = document.getElementById('count');
  const mala = document.getElementById('mala');
  const jaap = document.getElementById('jaap');
  const historyContainer = document.getElementById('history');

  const incrementBtn = document.getElementById('increment');
  const toggleBgBtn = document.getElementById('toggle-bg');

  const backgroundImages = [
    'url("image1.webp")',
    'url("image2.jpeg")',
    'url("image3.jpeg")',
    'url("image4.jpeg")'
  ];

  // Permanent totals
  let jaapCount = parseInt(localStorage.getItem('jaap')) || 0;
  let malaCount = parseInt(localStorage.getItem('mala')) || 0;

  // Daily count (black bubble)
  let count = parseInt(localStorage.getItem('count')) || 0;

  let currentImageIndex = 0;
  let dailyCounts = JSON.parse(localStorage.getItem('dailyCounts')) || [];

  // 🔒 FIX: Properly parse lastSavedDate
  let savedDateStr = localStorage.getItem('lastSavedDate');
  let lastSavedDate = new Date(savedDateStr);
  let lastDateStr;

  if (!savedDateStr || isNaN(lastSavedDate.getTime())) {
    // fallback to today
    lastSavedDate = new Date();
    lastDateStr = lastSavedDate.toISOString().split('T')[0];
    localStorage.setItem('lastSavedDate', lastSavedDate.toISOString());
  } else {
    lastDateStr = lastSavedDate.toISOString().split('T')[0];
  }

  function checkAndResetDaily() {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // compare today vs last saved
    if (todayStr !== lastDateStr) {
      dailyCounts.push({
        date: lastDateStr,
        count: count
      });

      count = 0;
      lastSavedDate = now;
      lastDateStr = todayStr;

      localStorage.setItem('dailyCounts', JSON.stringify(dailyCounts));
      localStorage.setItem('lastSavedDate', now.toISOString());
      localStorage.setItem('count', count);
    }
  }

  function updateUI() {
    countElement.innerText = count;
    jaap.innerText = jaapCount;
    mala.innerText = malaCount;

    const now = new Date();
    const last30Days = dailyCounts.filter(entry => {
      const entryDate = new Date(entry.date);
      return (now - entryDate) <= 30 * 24 * 60 * 60 * 1000;
    });

    historyContainer.innerHTML = '';

    const len = dailyCounts.length;
    if (len >= 2) {
      const dayBeforeYesterday = dailyCounts[len - 2].count;
      const yesterday = dailyCounts[len - 1].count;
      const pastChants = dayBeforeYesterday - yesterday;

      const pastDiv = document.createElement('div');
      pastDiv.className = 'history-entry fade-in';
      pastDiv.style.color = 'white';
      pastDiv.innerText = `Past Chants : ${pastChants}`;
      historyContainer.appendChild(pastDiv);
    }

    last30Days.slice().reverse().forEach(entry => {
      const dayMala = Math.floor(entry.count / 108);
      const div = document.createElement('div');
      div.className = 'history-entry fade-in';
      div.innerText = `${entry.date}: ${entry.count} Jaap, ${dayMala} Mala`;
      historyContainer.appendChild(div);
    });
  }

  incrementBtn.addEventListener('click', () => {
    checkAndResetDaily();

    count++;
    jaapCount++;

    if (jaapCount % 108 === 0) {
      malaCount++;
    }

    localStorage.setItem('count', count);
    localStorage.setItem('jaap', jaapCount);
    localStorage.setItem('mala', malaCount);
    localStorage.setItem('lastSavedDate', new Date().toISOString());

    updateUI();
  });

  toggleBgBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
    document.body.style.backgroundImage = backgroundImages[currentImageIndex];
  });

  checkAndResetDaily();
  updateUI();
});
