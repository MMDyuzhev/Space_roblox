// Создание звёзд
const starsContainer = document.getElementById('stars');
for (let i = 0; i < 200; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.width = (Math.random() * 3 + 1) + 'px';
    star.style.height = star.style.width;
    star.style.animationDelay = Math.random() * 2 + 's';
    starsContainer.appendChild(star);
}

// Создание метеоритов
function createMeteor() {
    const meteor = document.createElement('div');
    meteor.className = 'meteor';
    meteor.style.left = Math.random() * 100 + '%';
    meteor.style.top = Math.random() * 50 + '%';
    meteor.style.animationDelay = Math.random() * 2 + 's';
    document.body.appendChild(meteor);

    setTimeout(() => meteor.remove(), 3000);
}

setInterval(createMeteor, 2000);
