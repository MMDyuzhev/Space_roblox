// Факты о космосе
const spaceFacts = [
    { icon: '🌌', text: 'Наша галактика Млечный Путь содержит от 100 до 400 миллиардов звёзд!' },
    { icon: '🚀', text: 'Свет от Солнца достигает Земли за 8 минут и 20 секунд.' },
    { icon: '⭐', text: 'Нейтронные звёзды настолько плотные, что одна чайная ложка их вещества весит 6 миллиардов тонн.' },
    { icon: '🌑', text: 'На Луне есть места, где никогда не было солнечного света — там может быть лёд.' },
    { icon: '🪐', text: 'Сатурн имеет более 80 спутников, включая Титан — единственный спутник с атмосферой.' },
    { icon: '☄️', text: 'Кометы состоят из льда, пыли и камней. Их хвост всегда направлен от Солнца.' },
    { icon: '🌟', text: 'Самая большая известная звезда — UY Scuti. Её диаметр в 1700 раз больше Солнца!' },
    { icon: '🛰️', text: 'На орбите Земли находится более 3000 неработающих спутников — космический мусор.' },
    { icon: '🌠', text: 'Метеоры сгорают в атмосфере на высоте около 100 км.' },
    { icon: '🔭', text: 'Телескоп Хаббл сделал более 1.5 миллиона наблюдений за 30 лет работы.' },
    { icon: '🌍', text: 'Земля — единственная планета, названная не в честь бога. И единственная с жизнью!' },
    { icon: '🔴', text: 'Марс красный из-за оксида железа — ржавчины — в его почве.' },
    { icon: '☀️', text: 'Солнце составляет 99.86% всей массы Солнечной системы.' },
    { icon: '🌙', text: 'Луна удаляется от Земли на 3.8 см каждый год.' },
    { icon: '💫', text: 'В космосе полная тишина — там нет воздуха для распространения звука.' },
    { icon: '🛸', text: 'Астрономы нашли тысячи экзопланет. Некоторые из них могут быть обитаемы.' },
    { icon: '🕳️', text: 'Чёрная дыра в центре нашей галактики в 4 миллиона раз массивнее Солнца.' },
    { icon: '✨', text: 'Сверхновая звезда может светить ярче целой галактики в течение нескольких недель.' },
    { icon: '🔮', text: 'Вселенная расширяется с ускорением. За это отвечает тёмная энергия.' },
    { icon: '👨‍🚀', text: 'Первый человек в космосе — Юрий Гагарин. Он полетел 12 апреля 1961 года.' }
];

let currentFactIndex = 0;

// Переменные для рисовалки
let isDrawing = false;
let isEraser = false;
let lastX = 0;
let lastY = 0;
let canvas, ctx, colorPicker, brushSize, eraserBtn, clearCanvasBtn, saveCanvasBtn, toggleDrawingsBtn, drawingsGrid, savedDrawingsSection;
let modal, closeModal;

// Переменные игры
let gameCanvas, gameCtx;
let gameModal, closeGameModal, startGameBtn, restartGameBtn;
let startScreen, gameOverScreen;
let gameTimeEl, meteorCountEl, comboCountEl, bestScoreEl, scoreDisplayEl;
let finalTimeEl, finalMeteorsEl, finalComboEl, finalBestEl;
let achievementsPanel, achievementsList, achievementsUnlocked;
let gameMusic;

let gameRunning = false;
let gameLoopId = null;
let startTime = 0;
let elapsedTime = 0;
let meteorsDodged = 0;
let combo = 1;
let comboTimer = null;

let rocket = { x: 0, y: 0, size: 40 };
let meteors = [];
let particles = [];
let lastMeteorTime = 0;
let meteorSpawnRate = 1000;
let difficultyMultiplier = 1;

let bestScore = 0;
let unlockedAchievements = [];

// Достижения
const achievements = [
    { id: 'first_10s', name: '🥉 Новичок', desc: 'Выжить 10 секунд', condition: (s) => s >= 10, unlocked: false },
    { id: 'first_30s', name: '🥈 Опытный', desc: 'Выжить 30 секунд', condition: (s) => s >= 30, unlocked: false },
    { id: 'first_60s', name: '🥇 Мастер', desc: 'Выжить 60 секунд', condition: (s) => s >= 60, unlocked: false },
    { id: 'dodge_25', name: '⭐ Ловкач', desc: 'Уклониться от 25 метеоритов', condition: (_, m) => m >= 25, unlocked: false },
    { id: 'dodge_50', name: '💫 Виртуоз', desc: 'Уклониться от 50 метеоритов', condition: (_, m) => m >= 50, unlocked: false },
    { id: 'combo_10', name: '🔥 Комбо-мастер', desc: 'Набрать комбо x10', condition: (s, m, c) => c >= 10, unlocked: false },
    { id: 'score_100', name: '🏆 Чемпион', desc: 'Набрать 100 очков', condition: (s) => s >= 100, unlocked: false }
];

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
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

    // Добавление анимаций уведомлений
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    initFacts();
    initDrawing();
    initGame();
    initAllCardsModal();
});

// Инициализация фактов
function initFacts() {
    const robotCard = document.getElementById('robotCard');
    const factsModal = document.getElementById('factsModal');
    const closeFactsModal = document.getElementById('closeFactsModal');
    const nextFactBtn = document.getElementById('nextFactBtn');
    const factText = document.getElementById('factText');
    const factNumber = document.getElementById('factNumber');

    if (!robotCard || !factsModal) return;

    robotCard.addEventListener('click', () => {
        factsModal.classList.add('active');
        const factIcon = factsModal.querySelector('.fact-icon');
        if (factIcon) factIcon.textContent = '🚀';
        if (factText) factText.textContent = spaceFacts[0].text;
        if (factNumber) factNumber.textContent = `1 / ${spaceFacts.length}`;
        currentFactIndex = 0;
    });

    closeFactsModal.addEventListener('click', () => {
        factsModal.classList.remove('active');
    });

    factsModal.addEventListener('click', (e) => {
        if (e.target === factsModal) {
            factsModal.classList.remove('active');
        }
    });

    nextFactBtn.addEventListener('click', () => {
        currentFactIndex = (currentFactIndex + 1) % spaceFacts.length;
        const factIcon = factsModal.querySelector('.fact-icon');
        if (factIcon) factIcon.textContent = spaceFacts[currentFactIndex].icon;
        if (factText) {
            factText.style.opacity = '0';
            setTimeout(() => {
                factText.textContent = spaceFacts[currentFactIndex].text;
                factText.style.opacity = '1';
            }, 300);
        }
        if (factNumber) factNumber.textContent = `${currentFactIndex + 1} / ${spaceFacts.length}`;
    });
}

// Инициализация рисовалки
function initDrawing() {
    modal = document.getElementById('drawingModal');
    closeModal = document.getElementById('closeModal');
    canvas = document.getElementById('drawingCanvas');
    ctx = canvas.getContext('2d');
    colorPicker = document.getElementById('colorPicker');
    brushSize = document.getElementById('brushSize');
    eraserBtn = document.getElementById('eraser');
    clearCanvasBtn = document.getElementById('clearCanvas');
    saveCanvasBtn = document.getElementById('saveCanvas');
    toggleDrawingsBtn = document.getElementById('toggleDrawings');
    drawingsGrid = document.getElementById('drawingsGrid');
    savedDrawingsSection = document.getElementById('savedDrawings');

    const engineerCard = document.getElementById('engineerCard');

    if (!engineerCard) return;

    resizeCanvas();

    engineerCard.addEventListener('click', () => {
        modal.classList.add('active');
        resizeCanvas();
        loadSavedDrawings();
    });

    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    saveCanvasBtn.addEventListener('click', saveDrawing);
    toggleDrawingsBtn.addEventListener('click', toggleDrawings);
    eraserBtn.addEventListener('click', toggleEraser);
    clearCanvasBtn.addEventListener('click', clearCanvas);

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
}

function resizeCanvas() {
    const maxWidth = Math.min(window.innerWidth * 0.85, 800);
    const maxHeight = Math.min(window.innerHeight * 0.5, 400);
    canvas.width = maxWidth;
    canvas.height = maxHeight;
    ctx.fillStyle = '#1e1e3f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getCoordinates(e);
}

function draw(e) {
    if (!isDrawing) return;

    const [x, y] = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.lineWidth = brushSize.value;

    if (isEraser) {
        ctx.strokeStyle = '#1e1e3f';
    } else {
        ctx.strokeStyle = colorPicker.value;
    }

    ctx.stroke();
    [lastX, lastY] = [x, y];
}

function stopDrawing() {
    isDrawing = false;
}

function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
        return [
            e.touches[0].clientX - rect.left,
            e.touches[0].clientY - rect.top
        ];
    }
    return [e.offsetX, e.offsetY];
}

function handleTouchStart(e) {
    e.preventDefault();
    startDrawing(e);
}

function handleTouchMove(e) {
    e.preventDefault();
    draw(e);
}

function saveDrawing() {
    const dataURL = canvas.toDataURL('image/png');
    const drawings = getSavedDrawings();
    drawings.push({
        id: Date.now(),
        data: dataURL,
        date: new Date().toLocaleString('ru-RU')
    });
    localStorage.setItem('engineerDrawings', JSON.stringify(drawings));
    loadSavedDrawings();
    showNotification('✅ Чертеж сохранён!');
}

function toggleDrawings() {
    savedDrawingsSection.classList.toggle('visible');
    if (savedDrawingsSection.classList.contains('visible')) {
        loadSavedDrawings();
    }
}

function toggleEraser() {
    isEraser = !isEraser;
    eraserBtn.style.background = isEraser
        ? 'linear-gradient(90deg, #f9ca24, #f0932b)'
        : 'linear-gradient(90deg, #667eea, #764ba2)';
}

function clearCanvas() {
    ctx.fillStyle = '#1e1e3f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function getSavedDrawings() {
    const stored = localStorage.getItem('engineerDrawings');
    return stored ? JSON.parse(stored) : [];
}

function loadSavedDrawings() {
    const drawings = getSavedDrawings();
    drawingsGrid.innerHTML = '';

    if (drawings.length === 0) {
        drawingsGrid.innerHTML = '<p style="color: #a29bfe; grid-column: 1/-1; text-align: center;">Нет сохранённых чертежей</p>';
        return;
    }

    drawings.forEach(drawing => {
        const item = document.createElement('div');
        item.className = 'drawing-item';
        item.innerHTML = `
            <img src="${drawing.data}" alt="Чертеж от ${drawing.date}">
            <button class="delete-btn" data-id="${drawing.id}">×</button>
        `;

        item.addEventListener('click', (e) => {
            if (!e.target.classList.contains('delete-btn')) {
                loadDrawingToCanvas(drawing.data);
            }
        });

        item.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteDrawing(drawing.id);
        });

        drawingsGrid.appendChild(item);
    });
}

function loadDrawingToCanvas(dataURL) {
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = dataURL;
}

function deleteDrawing(id) {
    let drawings = getSavedDrawings();
    drawings = drawings.filter(d => d.id !== id);
    localStorage.setItem('engineerDrawings', JSON.stringify(drawings));
    loadSavedDrawings();
    showNotification('🗑️ Чертеж удалён');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// МОДАЛЬНОЕ ОКНО: ВСЕ ПЕРСОНАЖИ
function initAllCardsModal() {
    const starCard = document.getElementById('starCard');
    const allCardsModal = document.getElementById('allCardsModal');
    const closeAllCardsModal = document.getElementById('closeAllCardsModal');

    if (starCard && allCardsModal) {
        starCard.addEventListener('click', () => {
            allCardsModal.classList.add('active');
        });

        closeAllCardsModal.addEventListener('click', () => {
            allCardsModal.classList.remove('active');
        });

        allCardsModal.addEventListener('click', (e) => {
            if (e.target === allCardsModal) {
                allCardsModal.classList.remove('active');
            }
        });
    }
}

// Инициализация игры
function initGame() {
    gameModal = document.getElementById('gameModal');
    closeGameModal = document.getElementById('closeGameModal');
    gameCanvas = document.getElementById('gameCanvas');
    gameCtx = gameCanvas.getContext('2d');
    startGameBtn = document.getElementById('startGameBtn');
    restartGameBtn = document.getElementById('restartGameBtn');
    startScreen = document.getElementById('startScreen');
    gameOverScreen = document.getElementById('gameOverScreen');
    gameTimeEl = document.getElementById('gameTime');
    meteorCountEl = document.getElementById('meteorCount');
    comboCountEl = document.getElementById('comboCount');
    bestScoreEl = document.getElementById('bestScore');
    scoreDisplayEl = document.getElementById('scoreDisplay');
    finalTimeEl = document.getElementById('finalTime');
    finalMeteorsEl = document.getElementById('finalMeteors');
    finalComboEl = document.getElementById('finalCombo');
    finalBestEl = document.getElementById('finalBest');
    achievementsPanel = document.getElementById('achievementsPanel');
    achievementsList = document.getElementById('achievementsList');
    achievementsUnlocked = document.getElementById('achievementsUnlocked');
    gameMusic = document.getElementById('gameMusic');

    const pilotCard = document.getElementById('pilotCard');

    if (!pilotCard) return;

    bestScore = parseFloat(localStorage.getItem('gameBestScore')) || 0;
    bestScoreEl.textContent = bestScore.toFixed(1) + 'с';

    resizeGameCanvas();

    pilotCard.addEventListener('click', () => {
        gameModal.classList.add('active');
        resizeGameCanvas();
        loadAchievements();
    });

    closeGameModal.addEventListener('click', () => {
        if (gameRunning) stopGame();
        gameModal.classList.remove('active');
        // Останавливаем музыку при закрытии
        if (gameMusic) {
            gameMusic.pause();
            gameMusic.currentTime = 0;
        }
    });

    gameModal.addEventListener('click', (e) => {
        if (e.target === gameModal) {
            if (gameRunning) stopGame();
            gameModal.classList.remove('active');
            // Останавливаем музыку при закрытии
            if (gameMusic) {
                gameMusic.pause();
                gameMusic.currentTime = 0;
            }
        }
    });

    startGameBtn.addEventListener('click', startGame);
    restartGameBtn.addEventListener('click', restartGame);

    gameCanvas.addEventListener('mousemove', handleMouseMove);
    gameCanvas.addEventListener('touchmove', handleTouchMoveGame, { passive: false });
    gameCanvas.addEventListener('touchstart', handleTouchStartGame, { passive: false });
}

function resizeGameCanvas() {
    const maxWidth = Math.min(window.innerWidth * 0.85, 800);
    const maxHeight = Math.min(window.innerHeight * 0.6, 500);
    gameCanvas.width = maxWidth;
    gameCanvas.height = maxHeight;

    if (!gameRunning) {
        rocket.x = gameCanvas.width / 2;
        rocket.y = gameCanvas.height - 80;
    }

    drawGame();
}

function handleMouseMove(e) {
    if (!gameRunning) return;
    const rect = gameCanvas.getBoundingClientRect();
    rocket.x = e.clientX - rect.left;
    rocket.y = e.clientY - rect.top;

    rocket.x = Math.max(rocket.size / 2, Math.min(gameCanvas.width - rocket.size / 2, rocket.x));
    rocket.y = Math.max(rocket.size / 2, Math.min(gameCanvas.height - rocket.size / 2, rocket.y));
}

function handleTouchStartGame(e) {
    e.preventDefault();
    if (!gameRunning) return;
    handleTouchMoveGame(e);
}

function handleTouchMoveGame(e) {
    e.preventDefault();
    if (!gameRunning) return;
    const rect = gameCanvas.getBoundingClientRect();
    rocket.x = e.touches[0].clientX - rect.left;
    rocket.y = e.touches[0].clientY - rect.top;

    rocket.x = Math.max(rocket.size / 2, Math.min(gameCanvas.width - rocket.size / 2, rocket.x));
    rocket.y = Math.max(rocket.size / 2, Math.min(gameCanvas.height - rocket.size / 2, rocket.y));
}

function startGame() {
    gameRunning = true;
    startTime = Date.now();
    elapsedTime = 0;
    meteorsDodged = 0;
    combo = 1;
    meteors = [];
    particles = [];
    meteorSpawnRate = 1000;
    difficultyMultiplier = 1;
    lastMeteorTime = performance.now();

    achievements.forEach(a => a.unlocked = false);

    startScreen.style.display = 'none';
    gameOverScreen.classList.remove('active');
    achievementsPanel.style.display = 'block';

    rocket.x = gameCanvas.width / 2;
    rocket.y = gameCanvas.height - 80;

    // Запускаем музыку
    if (gameMusic) {
        gameMusic.volume = 0.5;
        gameMusic.play().catch(e => console.log('Автовоспроизведение заблокировано:', e));
    }

    updateUI();
    gameLoop();
}

function restartGame() {
    startGame();
}

function stopGame() {
    gameRunning = false;
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }
    if (comboTimer) {
        clearTimeout(comboTimer);
        comboTimer = null;
    }
    // Останавливаем музыку
    if (gameMusic) {
        gameMusic.pause();
        gameMusic.currentTime = 0;
    }
}

function gameLoop() {
    if (!gameRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - lastMeteorTime;

    elapsedTime = (Date.now() - startTime) / 1000;

    if (deltaTime >= meteorSpawnRate) {
        spawnMeteor();
        lastMeteorTime = currentTime;

        difficultyMultiplier += 0.02;
        meteorSpawnRate = Math.max(300, 1000 / difficultyMultiplier);
    }

    updateMeteors();
    checkCollisions();
    drawGame();
    updateUI();
    checkAchievements();

    gameLoopId = requestAnimationFrame(gameLoop);
}

function spawnMeteor() {
    const sizes = [
        { size: 30, speed: 3, points: 10 },
        { size: 45, speed: 4, points: 20 },
        { size: 60, speed: 5, points: 30 }
    ];

    const type = sizes[Math.floor(Math.random() * sizes.length)];
    const meteor = {
        x: Math.random() * (gameCanvas.width - type.size) + type.size / 2,
        y: -type.size,
        size: type.size,
        speed: type.speed * difficultyMultiplier,
        points: type.points,
        angle: Math.random() * 30 - 15
    };

    meteors.push(meteor);
}

function updateMeteors() {
    for (let i = meteors.length - 1; i >= 0; i--) {
        const meteor = meteors[i];
        meteor.y += meteor.speed;
        meteor.x += Math.sin(meteor.y * 0.02) * 2;

        if (meteor.y > gameCanvas.height + meteor.size) {
            meteors.splice(i, 1);
            meteorsDodged++;

            combo = Math.min(combo + 1, 20);
            resetComboTimer();
        }
    }
}

function resetComboTimer() {
    if (comboTimer) clearTimeout(comboTimer);
    comboTimer = setTimeout(() => {
        combo = 1;
    }, 3000);
}

function checkCollisions() {
    for (let meteor of meteors) {
        const dx = rocket.x - meteor.x;
        const dy = rocket.y - meteor.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (rocket.size / 2 + meteor.size / 2) * 0.8) {
            gameOver();
            return;
        }
    }
}

function gameOver() {
    gameRunning = false;

    createExplosion(rocket.x, rocket.y);
    drawGame();

    if (elapsedTime > bestScore) {
        bestScore = elapsedTime;
        localStorage.setItem('gameBestScore', bestScore.toString());
    }

    finalTimeEl.textContent = elapsedTime.toFixed(1) + 'с';
    finalMeteorsEl.textContent = meteorsDodged;
    finalComboEl.textContent = 'x' + combo;
    finalBestEl.textContent = bestScore.toFixed(1) + 'с';

    const newlyUnlocked = achievements.filter(a => a.unlocked);
    achievementsUnlocked.innerHTML = newlyUnlocked
        .map(a => `<span class="achievement-item">${a.name}</span>`)
        .join('');

    setTimeout(() => {
        gameOverScreen.classList.add('active');
        achievementsPanel.style.display = 'none';
    }, 500);

    saveAchievements();
}

function drawGame() {
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    drawStars();
    drawRocket();
    drawMeteors();
    drawParticles();
}

function drawStars() {
    gameCtx.fillStyle = 'white';
    for (let i = 0; i < 50; i++) {
        const x = (Math.sin(i * 132) * gameCanvas.width + gameCanvas.width) % gameCanvas.width;
        const y = (Math.cos(i * 78) * gameCanvas.height + gameCanvas.height) % gameCanvas.height;
        const size = Math.random() * 2 + 0.5;
        gameCtx.globalAlpha = Math.random() * 0.5 + 0.3;
        gameCtx.beginPath();
        gameCtx.arc(x, y, size, 0, Math.PI * 2);
        gameCtx.fill();
    }
    gameCtx.globalAlpha = 1;
}

function drawRocket() {
    gameCtx.font = `${rocket.size}px Arial`;
    gameCtx.textAlign = 'center';
    gameCtx.textBaseline = 'middle';
    gameCtx.fillText('🚀', rocket.x, rocket.y);
}

function drawMeteors() {
    for (let meteor of meteors) {
        gameCtx.font = `${meteor.size}px Arial`;
        gameCtx.textAlign = 'center';
        gameCtx.textBaseline = 'middle';
        gameCtx.fillText('☄️', meteor.x, meteor.y);
    }
}

function createExplosion(x, y) {
    const colors = ['#ff6b6b', '#f9ca24', '#ff793f', '#e55039'];
    for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2 / 30) * i;
        const speed = Math.random() * 5 + 3;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1
        });
    }
}

function drawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        gameCtx.globalAlpha = p.life;
        gameCtx.fillStyle = p.color;
        gameCtx.beginPath();
        gameCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        gameCtx.fill();
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) particles.splice(i, 1);
    }
    gameCtx.globalAlpha = 1;
}

function updateUI() {
    gameTimeEl.textContent = elapsedTime.toFixed(1) + 'с';
    meteorCountEl.textContent = meteorsDodged;
    comboCountEl.textContent = 'x' + combo;
    bestScoreEl.textContent = bestScore.toFixed(1) + 'с';
    scoreDisplayEl.textContent = meteorsDodged * combo;
}

function checkAchievements() {
    achievements.forEach(a => {
        if (!a.unlocked && a.condition(elapsedTime, meteorsDodged, combo)) {
            a.unlocked = true;
            showAchievement(a);
        }
    });
}

function showAchievement(achievement) {
    const el = document.createElement('div');
    el.className = 'achievement-popup';
    el.textContent = achievement.name;
    el.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        font-weight: bold;
        color: #f9ca24;
        text-shadow: 0 0 20px rgba(249, 202, 36, 0.8);
        pointer-events: none;
        animation: comboFloat 1s ease-out forwards;
    `;
    gameCanvas.parentElement.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}

function saveAchievements() {
    localStorage.setItem('gameAchievements', JSON.stringify(achievements));
}

function loadAchievements() {
    const stored = localStorage.getItem('gameAchievements');
    if (stored) {
        const saved = JSON.parse(stored);
        saved.forEach((s, i) => {
            if (s.unlocked) achievements[i].unlocked = true;
        });
    }
    updateAchievementsUI();
}

function updateAchievementsUI() {
    const unlocked = achievements.filter(a => a.unlocked);
    achievementsList.innerHTML = unlocked
        .map(a => `<span class="achievement-item">${a.name}</span>`)
        .join('');
}

// ========================================
// ВИКТОРИНА ПО ТАБЛИЦЕ УМНОЖЕНИЯ
// ========================================

let correctAnswers = 0;
let wrongAnswers = 0;
let currentQuestion = {};
let canAnswer = true;

function initQuiz() {
    const commanderCard = document.querySelector('.character-card:first-child');
    const quizModal = document.getElementById('quizModal');
    const closeQuizModal = document.getElementById('closeQuizModal');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    const quizAnswers = document.getElementById('quizAnswers');
    const quizFeedback = document.getElementById('quizFeedback');

    if (!commanderCard || !quizModal) return;

    // Открытие викторины при клике на карточку Командир Блок
    commanderCard.addEventListener('click', () => {
        quizModal.classList.add('active');
        generateQuestion();
        updateQuizStats();
    });

    closeQuizModal.addEventListener('click', () => {
        quizModal.classList.remove('active');
    });

    quizModal.addEventListener('click', (e) => {
        if (e.target === quizModal) {
            quizModal.classList.remove('active');
        }
    });

    nextQuestionBtn.addEventListener('click', () => {
        generateQuestion();
        quizFeedback.textContent = '';
        quizFeedback.className = 'quiz-feedback';
        nextQuestionBtn.style.display = 'none';
    });

    // Генерация первого вопроса при открытии
    generateQuestion();
}

function generateQuestion() {
    const num1 = Math.floor(Math.random() * 9) + 2; // 2-10
    const num2 = Math.floor(Math.random() * 9) + 2; // 2-10
    const correctAnswer = num1 * num2;

    currentQuestion = {
        num1,
        num2,
        correctAnswer
    };

    // Обновление текста вопроса
    const questionText = document.getElementById('questionText');
    if (questionText) {
        questionText.textContent = `${num1} × ${num2} = ?`;
    }

    // Генерация вариантов ответов
    generateAnswerOptions(correctAnswer);
    canAnswer = true;
}

function generateAnswerOptions(correctAnswer) {
    const quizAnswers = document.getElementById('quizAnswers');
    if (!quizAnswers) return;

    quizAnswers.innerHTML = '';

    // Создаем массив с правильным ответом и 3 неправильными
    const options = new Set([correctAnswer]);

    while (options.size < 4) {
        // Генерируем неправильные ответы, близкие к правильному
        const offset = Math.floor(Math.random() * 10) - 5; // -5 до +5
        const wrongAnswer = correctAnswer + offset;
        if (wrongAnswer > 0 && wrongAnswer !== correctAnswer) {
            options.add(wrongAnswer);
        }
    }

    // Преобразуем Set в массив и перемешиваем
    const optionsArray = Array.from(options).sort(() => Math.random() - 0.5);

    // Создаем кнопки ответов
    optionsArray.forEach(answer => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = answer;
        btn.addEventListener('click', () => checkAnswer(answer, btn));
        quizAnswers.appendChild(btn);
    });
}

function checkAnswer(selectedAnswer, btn) {
    if (!canAnswer) return;
    canAnswer = false;

    const quizFeedback = document.getElementById('quizFeedback');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    const answerBtns = document.querySelectorAll('.answer-btn');

    if (selectedAnswer === currentQuestion.correctAnswer) {
        // Правильный ответ
        btn.classList.add('correct');
        correctAnswers++;
        quizFeedback.textContent = '✅ Правильно! Молодец!';
        quizFeedback.className = 'quiz-feedback correct';
    } else {
        // Неправильный ответ
        btn.classList.add('wrong');
        wrongAnswers++;
        quizFeedback.textContent = `❌ Неправильно! Правильный ответ: ${currentQuestion.correctAnswer}`;
        quizFeedback.className = 'quiz-feedback wrong';

        // Показываем правильный ответ
        answerBtns.forEach(button => {
            if (parseInt(button.textContent) === currentQuestion.correctAnswer) {
                button.classList.add('correct');
            }
        });
    }

    updateQuizStats();
    nextQuestionBtn.style.display = 'block';
}

function updateQuizStats() {
    const correctCount = document.getElementById('correctCount');
    const wrongCount = document.getElementById('wrongCount');
    const quizScore = document.getElementById('quizScore');

    if (correctCount) correctCount.textContent = correctAnswers;
    if (wrongCount) wrongCount.textContent = wrongAnswers;
    if (quizScore) quizScore.textContent = correctAnswers - wrongAnswers;
}

// Инициализация викторины
document.addEventListener('DOMContentLoaded', initQuiz);

// ========================================
// МОДАЛЬНОЕ ОКНО С ВЫБОРОМ ИГР
// ========================================

let gamesModal, closeGamesModal, backToGames, closeCurrentGame;
let gameContainer, currentGameTitle, gameCanvas2, gameCtx2, gameControls;
let currentGame = null;
let gameInterval = null;
let score = 0;

// Переменные для Тетриса
let tetrisBoard = [];
let tetrisPiece = null;
let tetrisNextPiece = null;
let tetrisScore = 0;
let tetrisGameOver = false;
const TETRIS_ROWS = 20;
const TETRIS_COLS = 10;
const TETRIS_BLOCK_SIZE = 25;

// Переменные для Змейки
let snake = [];
let snakeDirection = 'right';
let snakeFood = { x: 0, y: 0 };
let snakeScore = 0;
let snakeGameOver = false;
const SNAKE_GRID_SIZE = 20;

// Переменные для Гонок
let playerCar = { x: 0, y: 0 };
let enemyCars = [];
let roadLines = [];
let racingScore = 0;
let racingSpeed = 5;
let racingGameOver = false;

// Переменные для Понга
let pongPaddle1 = { y: 0 };
let pongPaddle2 = { y: 0 };
let pongBall = { x: 0, y: 0, dx: 0, dy: 0 };
let pongScore1 = 0;
let pongScore2 = 0;
const PADDLE_HEIGHT = 80;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 10;

// Переменные для Кликера
let clickerScore = 0;
let clickerMultiplier = 1;
let clickerButton = { x: 0, y: 0, radius: 60 };

document.addEventListener('DOMContentLoaded', () => {
    initGamesModal();
});

function initGamesModal() {
    gamesModal = document.getElementById('gamesModal');
    closeGamesModal = document.getElementById('closeGamesModal');
    backToGames = document.getElementById('backToGames');
    closeCurrentGame = document.getElementById('closeCurrentGame');
    gameContainer = document.getElementById('gameContainer');
    currentGameTitle = document.getElementById('currentGameTitle');
    gameCanvas2 = document.getElementById('gameCanvas2');
    gameControls = document.getElementById('gameControls');
    
    const gamesCard = document.getElementById('gamesCard');
    
    if (!gamesCard) return;
    
    gamesCard.addEventListener('click', () => {
        gamesModal.classList.add('active');
        gameContainer.classList.remove('active');
        backToGames.classList.remove('visible');
    });
    
    closeGamesModal.addEventListener('click', () => {
        stopCurrentGame();
        gamesModal.classList.remove('active');
    });
    
    gamesModal.addEventListener('click', (e) => {
        if (e.target === gamesModal) {
            stopCurrentGame();
            gamesModal.classList.remove('active');
        }
    });
    
    // Обработчики выбора игр
    document.querySelectorAll('.game-item').forEach(item => {
        item.addEventListener('click', () => {
            const game = item.dataset.game;
            startGame(game);
        });
    });
    
    backToGames.addEventListener('click', () => {
        stopCurrentGame();
        gameContainer.classList.remove('active');
        backToGames.classList.remove('visible');
    });
    
    closeCurrentGame.addEventListener('click', () => {
        stopCurrentGame();
        gameContainer.classList.remove('active');
        backToGames.classList.remove('visible');
    });
}

function startGame(gameName) {
    stopCurrentGame();
    currentGame = gameName;
    gameContainer.classList.add('active');
    backToGames.classList.add('visible');
    
    // Настройка canvas
    gameCanvas2.width = 400;
    gameCanvas2.height = 500;
    gameCtx2 = gameCanvas2.getContext('2d');
    
    switch(gameName) {
        case 'tetris':
            currentGameTitle.textContent = '🧱 Тетрис';
            initTetris();
            break;
        case 'snake':
            currentGameTitle.textContent = '🐍 Змейка';
            initSnake();
            break;
        case 'racing':
            currentGameTitle.textContent = '🏎️ Гонка Машин';
            initRacing();
            break;
        case 'pong':
            currentGameTitle.textContent = '🏓 Понг';
            initPong();
            break;
        case 'clicker':
            currentGameTitle.textContent = '👆 Кликер';
            initClicker();
            break;
    }
}

function stopCurrentGame() {
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
    currentGame = null;
    gameControls.innerHTML = '';
}

// ========================================
// ТЕТРИС
// ========================================

const TETRIS_PIECES = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]], // J
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]]  // Z
];

const TETRIS_COLORS = ['#00f0f0', '#f0f000', '#a000f0', '#f0a000', '#0000f0', '#00f000', '#f00000'];

function initTetris() {
    tetrisBoard = Array(TETRIS_ROWS).fill().map(() => Array(TETRIS_COLS).fill(0));
    tetrisScore = 0;
    tetrisGameOver = false;
    tetrisPiece = getRandomPiece();
    tetrisNextPiece = getRandomPiece();
    tetrisPiece.x = Math.floor(TETRIS_COLS / 2) - Math.floor(tetrisPiece.shape[0].length / 2);
    tetrisPiece.y = 0;
    
    gameControls.innerHTML = `
        <button id="tetrisLeft">⬅️ Влево</button>
        <button id="tetrisRight">➡️ Вправо</button>
        <button id="tetrisRotate">🔄 Поворот</button>
        <button id="tetrisDown">⬇️ Вниз</button>
    `;
    
    document.getElementById('tetrisLeft').addEventListener('click', () => moveTetris(-1, 0));
    document.getElementById('tetrisRight').addEventListener('click', () => moveTetris(1, 0));
    document.getElementById('tetrisRotate').addEventListener('click', rotateTetris);
    document.getElementById('tetrisDown').addEventListener('click', () => moveTetris(0, 1));
    
    document.addEventListener('keydown', handleTetrisKeys);
    
    gameInterval = setInterval(updateTetris, 500);
}

function getRandomPiece() {
    const index = Math.floor(Math.random() * TETRIS_PIECES.length);
    return {
        shape: TETRIS_PIECES[index],
        color: TETRIS_COLORS[index],
        x: 0,
        y: 0
    };
}

function handleTetrisKeys(e) {
    if (currentGame !== 'tetris') return;
    switch(e.key) {
        case 'ArrowLeft': moveTetris(-1, 0); break;
        case 'ArrowRight': moveTetris(1, 0); break;
        case 'ArrowDown': moveTetris(0, 1); break;
        case 'ArrowUp': rotateTetris(); break;
    }
}

function moveTetris(dx, dy) {
    if (tetrisGameOver) return;
    tetrisPiece.x += dx;
    tetrisPiece.y += dy;
    if (checkTetrisCollision()) {
        tetrisPiece.x -= dx;
        tetrisPiece.y -= dy;
        if (dy > 0) {
            lockTetrisPiece();
            clearTetrisLines();
            tetrisPiece = tetrisNextPiece;
            tetrisNextPiece = getRandomPiece();
            tetrisPiece.x = Math.floor(TETRIS_COLS / 2) - Math.floor(tetrisPiece.shape[0].length / 2);
            tetrisPiece.y = 0;
            if (checkTetrisCollision()) {
                tetrisGameOver = true;
                showGameOver('Тетрис', tetrisScore);
            }
        }
    }
    drawTetris();
}

function rotateTetris() {
    if (tetrisGameOver) return;
    const rotated = tetrisPiece.shape[0].map((_, i) =>
        tetrisPiece.shape.map(row => row[i]).reverse()
    );
    const oldShape = tetrisPiece.shape;
    tetrisPiece.shape = rotated;
    if (checkTetrisCollision()) {
        tetrisPiece.shape = oldShape;
    }
    drawTetris();
}

function checkTetrisCollision() {
    for (let y = 0; y < tetrisPiece.shape.length; y++) {
        for (let x = 0; x < tetrisPiece.shape[y].length; x++) {
            if (tetrisPiece.shape[y][x]) {
                const newX = tetrisPiece.x + x;
                const newY = tetrisPiece.y + y;
                if (newX < 0 || newX >= TETRIS_COLS || newY >= TETRIS_ROWS ||
                    (newY >= 0 && tetrisBoard[newY][newX])) {
                    return true;
                }
            }
        }
    }
    return false;
}

function lockTetrisPiece() {
    for (let y = 0; y < tetrisPiece.shape.length; y++) {
        for (let x = 0; x < tetrisPiece.shape[y].length; x++) {
            if (tetrisPiece.shape[y][x] && tetrisPiece.y + y >= 0) {
                tetrisBoard[tetrisPiece.y + y][tetrisPiece.x + x] = tetrisPiece.color;
            }
        }
    }
}

function clearTetrisLines() {
    for (let y = TETRIS_ROWS - 1; y >= 0; y--) {
        if (tetrisBoard[y].every(cell => cell !== 0)) {
            tetrisBoard.splice(y, 1);
            tetrisBoard.unshift(Array(TETRIS_COLS).fill(0));
            tetrisScore += 100;
            y++;
        }
    }
}

function updateTetris() {
    if (!tetrisGameOver) {
        moveTetris(0, 1);
    }
}

function drawTetris() {
    gameCtx2.fillStyle = '#0a0a1a';
    gameCtx2.fillRect(0, 0, gameCanvas2.width, gameCanvas2.height);
    
    // Рисуем поле
    const offsetX = (gameCanvas2.width - TETRIS_COLS * TETRIS_BLOCK_SIZE) / 2;
    for (let y = 0; y < TETRIS_ROWS; y++) {
        for (let x = 0; x < TETRIS_COLS; x++) {
            if (tetrisBoard[y][x]) {
                gameCtx2.fillStyle = tetrisBoard[y][x];
                gameCtx2.fillRect(
                    offsetX + x * TETRIS_BLOCK_SIZE,
                    y * TETRIS_BLOCK_SIZE,
                    TETRIS_BLOCK_SIZE - 1,
                    TETRIS_BLOCK_SIZE - 1
                );
            }
        }
    }
    
    // Рисуем текущую фигуру
    if (tetrisPiece) {
        gameCtx2.fillStyle = tetrisPiece.color;
        for (let y = 0; y < tetrisPiece.shape.length; y++) {
            for (let x = 0; x < tetrisPiece.shape[y].length; x++) {
                if (tetrisPiece.shape[y][x] && tetrisPiece.y + y >= 0) {
                    gameCtx2.fillRect(
                        offsetX + (tetrisPiece.x + x) * TETRIS_BLOCK_SIZE,
                        (tetrisPiece.y + y) * TETRIS_BLOCK_SIZE,
                        TETRIS_BLOCK_SIZE - 1,
                        TETRIS_BLOCK_SIZE - 1
                    );
                }
            }
        }
    }
    
    // Счёт
    gameCtx2.fillStyle = '#f9ca24';
    gameCtx2.font = '16px Arial';
    gameCtx2.fillText(`Счёт: ${tetrisScore}`, 10, 20);
}

// ========================================
// ЗМЕЙКА
// ========================================

function initSnake() {
    snake = [{ x: 10, y: 10 }];
    snakeDirection = 'right';
    snakeScore = 0;
    snakeGameOver = false;
    spawnSnakeFood();
    
    gameControls.innerHTML = `
        <button id="snakeUp">⬆️ Вверх</button>
        <button id="snakeDown">⬇️ Вниз</button>
        <button id="snakeLeft">⬅️ Влево</button>
        <button id="snakeRight">➡️ Вправо</button>
    `;
    
    document.getElementById('snakeUp').addEventListener('click', () => setSnakeDirection('up'));
    document.getElementById('snakeDown').addEventListener('click', () => setSnakeDirection('down'));
    document.getElementById('snakeLeft').addEventListener('click', () => setSnakeDirection('left'));
    document.getElementById('snakeRight').addEventListener('click', () => setSnakeDirection('right'));
    
    document.addEventListener('keydown', handleSnakeKeys);
    
    gameInterval = setInterval(updateSnake, 150);
}

function setSnakeDirection(dir) {
    const opposite = { up: 'down', down: 'up', left: 'right', right: 'left' };
    if (opposite[dir] !== snakeDirection) {
        snakeDirection = dir;
    }
}

function handleSnakeKeys(e) {
    if (currentGame !== 'snake') return;
    switch(e.key) {
        case 'ArrowUp': setSnakeDirection('up'); break;
        case 'ArrowDown': setSnakeDirection('down'); break;
        case 'ArrowLeft': setSnakeDirection('left'); break;
        case 'ArrowRight': setSnakeDirection('right'); break;
    }
}

function spawnSnakeFood() {
    snakeFood = {
        x: Math.floor(Math.random() * (gameCanvas2.width / SNAKE_GRID_SIZE)),
        y: Math.floor(Math.random() * (gameCanvas2.height / SNAKE_GRID_SIZE))
    };
}

function updateSnake() {
    if (snakeGameOver) return;
    
    const head = { ...snake[0] };
    switch(snakeDirection) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // Проверка столкновений
    if (head.x < 0 || head.x >= gameCanvas2.width / SNAKE_GRID_SIZE ||
        head.y < 0 || head.y >= gameCanvas2.height / SNAKE_GRID_SIZE ||
        snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        snakeGameOver = true;
        showGameOver('Змейка', snakeScore);
        return;
    }
    
    snake.unshift(head);
    
    // Проверка еды
    if (head.x === snakeFood.x && head.y === snakeFood.y) {
        snakeScore += 10;
        spawnSnakeFood();
    } else {
        snake.pop();
    }
    
    drawSnake();
}

function drawSnake() {
    gameCtx2.fillStyle = '#0a0a1a';
    gameCtx2.fillRect(0, 0, gameCanvas2.width, gameCanvas2.height);
    
    // Еда
    gameCtx2.fillStyle = '#ff0000';
    gameCtx2.beginPath();
    gameCtx2.arc(
        snakeFood.x * SNAKE_GRID_SIZE + SNAKE_GRID_SIZE / 2,
        snakeFood.y * SNAKE_GRID_SIZE + SNAKE_GRID_SIZE / 2,
        SNAKE_GRID_SIZE / 2,
        0,
        Math.PI * 2
    );
    gameCtx2.fill();
    
    // Змейка
    gameCtx2.fillStyle = '#00f000';
    snake.forEach((seg, i) => {
        gameCtx2.fillRect(
            seg.x * SNAKE_GRID_SIZE,
            seg.y * SNAKE_GRID_SIZE,
            SNAKE_GRID_SIZE - 1,
            SNAKE_GRID_SIZE - 1
        );
    });
    
    // Счёт
    gameCtx2.fillStyle = '#f9ca24';
    gameCtx2.font = '16px Arial';
    gameCtx2.fillText(`Счёт: ${snakeScore}`, 10, 20);
}

// ========================================
// ГОНКА МАШИН
// ========================================

function initRacing() {
    playerCar = { x: gameCanvas2.width / 2, y: gameCanvas2.height - 80 };
    enemyCars = [];
    roadLines = [];
    racingScore = 0;
    racingSpeed = 5;
    racingGameOver = false;
    
    for (let i = 0; i < 10; i++) {
        roadLines.push({ y: i * 60 });
    }
    
    gameControls.innerHTML = `
        <button id="raceLeft">⬅️ Влево</button>
        <button id="raceRight">➡️ Вправо</button>
    `;
    
    document.getElementById('raceLeft').addEventListener('click', () => { playerCar.x -= 60; });
    document.getElementById('raceRight').addEventListener('click', () => { playerCar.x += 60; });
    
    document.addEventListener('keydown', handleRaceKeys);
    
    gameInterval = setInterval(updateRacing, 50);
}

function handleRaceKeys(e) {
    if (currentGame !== 'racing') return;
    if (e.key === 'ArrowLeft') playerCar.x -= 60;
    if (e.key === 'ArrowRight') playerCar.x += 60;
}

function updateRacing() {
    if (racingGameOver) return;
    
    // Движение дороги
    roadLines.forEach(line => {
        line.y += racingSpeed;
        if (line.y > gameCanvas2.height) line.y = -60;
    });
    
    // Спавн врагов
    if (Math.random() < 0.02) {
        enemyCars.push({
            x: Math.random() * (gameCanvas2.width - 50),
            y: -60,
            width: 40,
            height: 70
        });
    }
    
    // Движение врагов
    enemyCars.forEach(car => {
        car.y += racingSpeed;
    });
    
    // Удаление прошедших врагов
    enemyCars = enemyCars.filter(car => {
        if (car.y > gameCanvas2.height) {
            racingScore += 10;
            racingSpeed += 0.1;
            return false;
        }
        return true;
    });
    
    // Проверка столкновений
    enemyCars.forEach(car => {
        if (playerCar.x < car.x + car.width &&
            playerCar.x + 40 > car.x &&
            playerCar.y < car.y + car.height &&
            playerCar.y + 70 > car.y) {
            racingGameOver = true;
            showGameOver('Гонка Машин', racingScore);
        }
    });
    
    // Ограничение игрока
    playerCar.x = Math.max(50, Math.min(gameCanvas2.width - 90, playerCar.x));
    
    drawRacing();
}

function drawRacing() {
    gameCtx2.fillStyle = '#333';
    gameCtx2.fillRect(0, 0, gameCanvas2.width, gameCanvas2.height);
    
    // Дорога
    gameCtx2.fillStyle = '#555';
    gameCtx2.fillRect(50, 0, gameCanvas2.width - 100, gameCanvas2.height);
    
    // Разметка
    gameCtx2.fillStyle = '#fff';
    roadLines.forEach(line => {
        gameCtx2.fillRect(gameCanvas2.width / 2 - 5, line.y, 10, 30);
    });
    
    // Игрок
    gameCtx2.fillStyle = '#0066ff';
    gameCtx2.fillRect(playerCar.x, playerCar.y, 40, 70);
    
    // Враги
    gameCtx2.fillStyle = '#ff3300';
    enemyCars.forEach(car => {
        gameCtx2.fillRect(car.x, car.y, car.width, car.height);
    });
    
    // Счёт
    gameCtx2.fillStyle = '#f9ca24';
    gameCtx2.font = '16px Arial';
    gameCtx2.fillText(`Счёт: ${racingScore}`, 60, 30);
}

// ========================================
// ПОНГ
// ========================================

function initPong() {
    pongPaddle1 = { y: gameCanvas2.height / 2 - PADDLE_HEIGHT / 2 };
    pongPaddle2 = { y: gameCanvas2.height / 2 - PADDLE_HEIGHT / 2 };
    resetPongBall();
    pongScore1 = 0;
    pongScore2 = 0;
    
    gameControls.innerHTML = `
        <button id="pongUp">⬆️ Вверх</button>
        <button id="pongDown">⬇️ Вниз</button>
    `;
    
    document.getElementById('pongUp').addEventListener('click', () => {
        pongPaddle1.y = Math.max(0, pongPaddle1.y - 40);
        drawPong();
    });
    document.getElementById('pongDown').addEventListener('click', () => {
        pongPaddle1.y = Math.min(gameCanvas2.height - PADDLE_HEIGHT, pongPaddle1.y + 40);
        drawPong();
    });
    
    document.addEventListener('keydown', handlePongKeys);
    
    gameInterval = setInterval(updatePong, 16);
}

function handlePongKeys(e) {
    if (currentGame !== 'pong') return;
    if (e.key === 'ArrowUp') {
        pongPaddle1.y = Math.max(0, pongPaddle1.y - 40);
        drawPong();
    }
    if (e.key === 'ArrowDown') {
        pongPaddle1.y = Math.min(gameCanvas2.height - PADDLE_HEIGHT, pongPaddle1.y + 40);
        drawPong();
    }
}

function resetPongBall() {
    pongBall = {
        x: gameCanvas2.width / 2,
        y: gameCanvas2.height / 2,
        dx: (Math.random() > 0.5 ? 5 : -5),
        dy: (Math.random() > 0.5 ? 3 : -3)
    };
}

function updatePong() {
    pongBall.x += pongBall.dx;
    pongBall.y += pongBall.dy;
    
    // Отскок от верха/низа
    if (pongBall.y <= 0 || pongBall.y >= gameCanvas2.height - BALL_SIZE) {
        pongBall.dy *= -1;
    }
    
    // Отскок от ракеток
    if (pongBall.x <= PADDLE_WIDTH + 10 &&
        pongBall.y >= pongPaddle1.y &&
        pongBall.y <= pongPaddle1.y + PADDLE_HEIGHT) {
        pongBall.dx = Math.abs(pongBall.dx);
    }
    
    if (pongBall.x >= gameCanvas2.width - PADDLE_WIDTH - BALL_SIZE - 10 &&
        pongBall.y >= pongPaddle2.y &&
        pongBall.y <= pongPaddle2.y + PADDLE_HEIGHT) {
        pongBall.dx = -Math.abs(pongBall.dx);
    }
    
    // Гол
    if (pongBall.x < 0) {
        pongScore2++;
        resetPongBall();
    }
    if (pongBall.x > gameCanvas2.width) {
        pongScore1++;
        resetPongBall();
    }
    
    // ИИ противника
    const paddleCenter = pongPaddle2.y + PADDLE_HEIGHT / 2;
    if (paddleCenter < pongBall.y - 30) {
        pongPaddle2.y = Math.min(gameCanvas2.height - PADDLE_HEIGHT, pongPaddle2.y + 3);
    } else if (paddleCenter > pongBall.y + 30) {
        pongPaddle2.y = Math.max(0, pongPaddle2.y - 3);
    }
    
    drawPong();
}

function drawPong() {
    gameCtx2.fillStyle = '#0a0a1a';
    gameCtx2.fillRect(0, 0, gameCanvas2.width, gameCanvas2.height);
    
    // Сетка посередине
    gameCtx2.setLineDash([10, 10]);
    gameCtx2.strokeStyle = '#333';
    gameCtx2.beginPath();
    gameCtx2.moveTo(gameCanvas2.width / 2, 0);
    gameCtx2.lineTo(gameCanvas2.width / 2, gameCanvas2.height);
    gameCtx2.stroke();
    gameCtx2.setLineDash([]);
    
    // Ракетки
    gameCtx2.fillStyle = '#00f0f0';
    gameCtx2.fillRect(10, pongPaddle1.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    gameCtx2.fillRect(gameCanvas2.width - PADDLE_WIDTH - 10, pongPaddle2.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    
    // Мяч
    gameCtx2.fillStyle = '#fff';
    gameCtx2.beginPath();
    gameCtx2.arc(pongBall.x, pongBall.y, BALL_SIZE / 2, 0, Math.PI * 2);
    gameCtx2.fill();
    
    // Счёт
    gameCtx2.fillStyle = '#f9ca24';
    gameCtx2.font = '24px Arial';
    gameCtx2.fillText(pongScore1, gameCanvas2.width / 4, 40);
    gameCtx2.fillText(pongScore2, 3 * gameCanvas2.width / 4, 40);
}

// ========================================
// КЛИКЕР
// ========================================

function initClicker() {
    clickerScore = 0;
    clickerMultiplier = 1;
    clickerButton = {
        x: gameCanvas2.width / 2,
        y: gameCanvas2.height / 2,
        radius: 60
    };
    
    gameControls.innerHTML = `
        <button id="clickerUpgrade">⬆️ Улучшить (10)</button>
        <button id="clickerReset">🔄 Сброс</button>
    `;
    
    document.getElementById('clickerUpgrade').addEventListener('click', () => {
        if (clickerScore >= 10) {
            clickerScore -= 10;
            clickerMultiplier += 1;
            drawClicker();
        }
    });
    
    document.getElementById('clickerReset').addEventListener('click', () => {
        clickerScore = 0;
        clickerMultiplier = 1;
        drawClicker();
    });
    
    gameCanvas2.addEventListener('click', handleClickerClick);
    
    drawClicker();
}

function handleClickerClick(e) {
    if (currentGame !== 'clicker') return;
    
    const rect = gameCanvas2.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const dist = Math.sqrt((x - clickerButton.x) ** 2 + (y - clickerButton.y) ** 2);
    if (dist <= clickerButton.radius) {
        clickerScore += clickerMultiplier;
        drawClicker();
    }
}

function drawClicker() {
    gameCtx2.fillStyle = '#0a0a1a';
    gameCtx2.fillRect(0, 0, gameCanvas2.width, gameCanvas2.height);
    
    // Кнопка
    const gradient = gameCtx2.createRadialGradient(
        clickerButton.x, clickerButton.y, 0,
        clickerButton.x, clickerButton.y, clickerButton.radius
    );
    gradient.addColorStop(0, '#f9ca24');
    gradient.addColorStop(1, '#f0932b');
    
    gameCtx2.fillStyle = gradient;
    gameCtx2.beginPath();
    gameCtx2.arc(clickerButton.x, clickerButton.y, clickerButton.radius, 0, Math.PI * 2);
    gameCtx2.fill();
    
    // Тень
    gameCtx2.strokeStyle = '#e55039';
    gameCtx2.lineWidth = 3;
    gameCtx2.stroke();
    
    // Счёт
    gameCtx2.fillStyle = '#fff';
    gameCtx2.font = '24px Arial';
    gameCtx2.textAlign = 'center';
    gameCtx2.fillText(`Счёт: ${clickerScore}`, clickerButton.x, clickerButton.y - 10);
    gameCtx2.fillText(`Множитель: x${clickerMultiplier}`, clickerButton.x, clickerButton.y + 20);
    gameCtx2.textAlign = 'left';
    
    // Инфо
    gameCtx2.fillStyle = '#a29bfe';
    gameCtx2.font = '14px Arial';
    gameCtx2.fillText('Кликай по кнопке!', 10, 30);
    gameCtx2.fillText('Улучшение: +1 к множителю (10 очков)', 10, 50);
}

// ========================================
// ЭКРАН GAME OVER
// ========================================

function showGameOver(gameName, finalScore) {
    const gameOverScreen = document.createElement('div');
    gameOverScreen.className = 'game-over-screen active';
    gameOverScreen.innerHTML = `
        <h3>💥 Игра Окончена!</h3>
        <p>Игра: ${gameName}</p>
        <p>Ваш счёт: <strong style="color: #f9ca24;">${finalScore}</strong></p>
        <button id="restartGameBtn2">🔄 Играть снова</button>
    `;
    
    gameContainer.appendChild(gameOverScreen);
    
    document.getElementById('restartGameBtn2').addEventListener('click', () => {
        gameOverScreen.remove();
        startGame(currentGame);
    });
}
