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

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    initFacts();
    initDrawing();
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

    // Открытие модального окна фактов
    robotCard.addEventListener('click', () => {
        factsModal.classList.add('active');
        const factIcon = factsModal.querySelector('.fact-icon');
        if (factIcon) factIcon.textContent = '🚀';
        if (factText) factText.textContent = spaceFacts[0].text;
        if (factNumber) factNumber.textContent = `1 / ${spaceFacts.length}`;
        currentFactIndex = 0;
    });

    // Закрытие
    closeFactsModal.addEventListener('click', () => {
        factsModal.classList.remove('active');
    });

    factsModal.addEventListener('click', (e) => {
        if (e.target === factsModal) {
            factsModal.classList.remove('active');
        }
    });

    // Следующий факт
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
    // Получаем элементы
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

    // Находим карточку Инженера Гайки
    const engineerCard = document.getElementById('engineerCard');

    if (!engineerCard) return;

    // Настройка canvas
    resizeCanvas();

    // Открытие модального окна при клике на карточку
    engineerCard.addEventListener('click', () => {
        modal.classList.add('active');
        resizeCanvas();
        loadSavedDrawings();
    });

    // Закрытие модального окна
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Настройка кнопок
    saveCanvasBtn.addEventListener('click', saveDrawing);
    toggleDrawingsBtn.addEventListener('click', toggleDrawings);
    eraserBtn.addEventListener('click', toggleEraser);
    clearCanvasBtn.addEventListener('click', clearCanvas);

    // События рисования
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
}

// Настройка размера canvas
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

// Рисование
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

// Сохранение чертежа
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

// Показать/скрыть чертежи
function toggleDrawings() {
    savedDrawingsSection.classList.toggle('visible');
    if (savedDrawingsSection.classList.contains('visible')) {
        loadSavedDrawings();
    }
}

// Ластик
function toggleEraser() {
    isEraser = !isEraser;
    eraserBtn.style.background = isEraser
        ? 'linear-gradient(90deg, #f9ca24, #f0932b)'
        : 'linear-gradient(90deg, #667eea, #764ba2)';
}

// Очистка холста
function clearCanvas() {
    ctx.fillStyle = '#1e1e3f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Получение сохранённых чертежей
function getSavedDrawings() {
    const stored = localStorage.getItem('engineerDrawings');
    return stored ? JSON.parse(stored) : [];
}

// Загрузка сохранённых чертежей
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

// Загрузка чертежа на холст
function loadDrawingToCanvas(dataURL) {
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = dataURL;
}

// Удаление чертежа
function deleteDrawing(id) {
    let drawings = getSavedDrawings();
    drawings = drawings.filter(d => d.id !== id);
    localStorage.setItem('engineerDrawings', JSON.stringify(drawings));
    loadSavedDrawings();
    showNotification('🗑️ Чертеж удалён');
}

// Уведомление
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

// ============================================
// МОДАЛЬНОЕ ОКНО: ВСЕ ПЕРСОНАЖИ
// ============================================

function initAllCardsModal() {
    const starCard = document.getElementById('starCard');
    const allCardsModal = document.getElementById('allCardsModal');
    const closeAllCardsModal = document.getElementById('closeAllCardsModal');

    if (starCard && allCardsModal) {
        // Открытие окна при клике на Лейтенанта Звезду
        starCard.addEventListener('click', () => {
            allCardsModal.classList.add('active');
        });

        // Закрытие по кнопке
        closeAllCardsModal.addEventListener('click', () => {
            allCardsModal.classList.remove('active');
        });

        // Закрытие по клику вне окна
        allCardsModal.addEventListener('click', (e) => {
            if (e.target === allCardsModal) {
                allCardsModal.classList.remove('active');
            }
        });
    }
}

// ============================================
// МИНИ-ИГРА: КОСМИЧЕСКОЕ УКЛОНЕНИЕ
// ============================================

// Переменные игры
let gameCanvas, gameCtx;
let gameModal, closeGameModal, startGameBtn, restartGameBtn;
let startScreen, gameOverScreen;
let gameTimeEl, meteorCountEl, comboCountEl, bestScoreEl, scoreDisplayEl;
let finalTimeEl, finalMeteorsEl, finalComboEl, finalBestEl;
let achievementsPanel, achievementsList, achievementsUnlocked;

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

// Инициализация игры
document.addEventListener('DOMContentLoaded', () => {
    initFacts();
    initDrawing();
    initGame();
    initAllCardsModal();
});

function initGame() {
    // Получаем элементы
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

    // Находим карточку пилота
    const pilotCard = document.getElementById('pilotCard');

    if (!pilotCard) return;

    // Загрузка рекорда
    bestScore = parseFloat(localStorage.getItem('gameBestScore')) || 0;
    bestScoreEl.textContent = bestScore.toFixed(1) + 'с';

    // Настройка canvas
    resizeGameCanvas();

    // Открытие модального окна
    pilotCard.addEventListener('click', () => {
        gameModal.classList.add('active');
        resizeGameCanvas();
        loadAchievements();
    });

    // Закрытие
    closeGameModal.addEventListener('click', () => {
        if (gameRunning) stopGame();
        gameModal.classList.remove('active');
    });

    gameModal.addEventListener('click', (e) => {
        if (e.target === gameModal) {
            if (gameRunning) stopGame();
            gameModal.classList.remove('active');
        }
    });

    // Старт игры
    startGameBtn.addEventListener('click', startGame);
    restartGameBtn.addEventListener('click', restartGame);

    // Управление мышью
    gameCanvas.addEventListener('mousemove', handleMouseMove);
    gameCanvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    gameCanvas.addEventListener('touchstart', handleTouchStart, { passive: false });
}

function resizeGameCanvas() {
    const maxWidth = Math.min(window.innerWidth * 0.85, 800);
    const maxHeight = Math.min(window.innerHeight * 0.6, 500);
    gameCanvas.width = maxWidth;
    gameCanvas.height = maxHeight;
    
    // Центрируем ракету при изменении размера
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
    
    // Ограничение границ
    rocket.x = Math.max(rocket.size / 2, Math.min(gameCanvas.width - rocket.size / 2, rocket.x));
    rocket.y = Math.max(rocket.size / 2, Math.min(gameCanvas.height - rocket.size / 2, rocket.y));
}

function handleTouchStart(e) {
    e.preventDefault();
    if (!gameRunning) return;
    handleTouchMove(e);
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!gameRunning) return;
    const rect = gameCanvas.getBoundingClientRect();
    rocket.x = e.touches[0].clientX - rect.left;
    rocket.y = e.touches[0].clientY - rect.top;
    
    // Ограничение границ
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
    
    // Сброс достижений для текущей сессии
    achievements.forEach(a => a.unlocked = false);
    
    // Скрываем экраны
    startScreen.style.display = 'none';
    gameOverScreen.classList.remove('active');
    achievementsPanel.style.display = 'block';
    
    // Начальная позиция ракеты
    rocket.x = gameCanvas.width / 2;
    rocket.y = gameCanvas.height - 80;
    
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
}

function gameLoop() {
    if (!gameRunning) return;
    
    const currentTime = performance.now();
    const deltaTime = currentTime - lastMeteorTime;

    // Обновление времени
    elapsedTime = (Date.now() - startTime) / 1000;

    // Спавн метеоритов
    if (deltaTime >= meteorSpawnRate) {
        spawnMeteor();
        lastMeteorTime = currentTime;

        // Увеличение сложности
        difficultyMultiplier += 0.02;
        meteorSpawnRate = Math.max(300, 1000 / difficultyMultiplier);
    }

    // Обновление метеоритов
    updateMeteors();

    // Проверка столкновений
    checkCollisions();

    // Отрисовка
    drawGame();

    // Обновление UI
    updateUI();

    // Проверка достижений
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
        angle: Math.random() * 30 - 15 // Небольшой угол
    };
    
    meteors.push(meteor);
}

function updateMeteors() {
    for (let i = meteors.length - 1; i >= 0; i--) {
        const meteor = meteors[i];
        meteor.y += meteor.speed;
        meteor.x += Math.sin(meteor.y * 0.02) * 2; // Небольшое колебание
        
        // Если метеор ушёл за экран
        if (meteor.y > gameCanvas.height + meteor.size) {
            meteors.splice(i, 1);
            meteorsDodged++;
            
            // Комбо
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
        
        // Столкновение
        if (distance < (rocket.size / 2 + meteor.size / 2) * 0.8) {
            gameOver();
            return;
        }
    }
}

function gameOver() {
    gameRunning = false;
    
    // Эффект взрыва
    createExplosion(rocket.x, rocket.y);
    drawGame();
    
    // Сохранение рекорда
    if (elapsedTime > bestScore) {
        bestScore = elapsedTime;
        localStorage.setItem('gameBestScore', bestScore.toString());
    }
    
    // Показ экрана Game Over
    finalTimeEl.textContent = elapsedTime.toFixed(1) + 'с';
    finalMeteorsEl.textContent = meteorsDodged;
    finalComboEl.textContent = 'x' + combo;
    finalBestEl.textContent = bestScore.toFixed(1) + 'с';
    
    // Показ разблокированных достижений
    const newlyUnlocked = achievements.filter(a => a.unlocked);
    achievementsUnlocked.innerHTML = newlyUnlocked
        .map(a => `<span class="achievement-item">${a.name}</span>`)
        .join('');
    
    setTimeout(() => {
        gameOverScreen.classList.add('active');
        achievementsPanel.style.display = 'none';
    }, 500);
    
    // Сохранение достижений
    saveAchievements();
}

function drawGame() {
    // Очистка
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // Фон со звёздами
    drawStars();
    
    // Ракета
    drawRocket();
    
    // Метеориты
    drawMeteors();
    
    // Частицы
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
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        
        if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
        }
        
        gameCtx.globalAlpha = p.life;
        gameCtx.fillStyle = p.color;
        gameCtx.beginPath();
        gameCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        gameCtx.fill();
    }
    gameCtx.globalAlpha = 1;
}

function updateUI() {
    const score = meteorsDodged * combo;
    
    gameTimeEl.textContent = elapsedTime.toFixed(1) + 'с';
    meteorCountEl.textContent = meteorsDodged;
    comboCountEl.textContent = 'x' + combo;
    bestScoreEl.textContent = bestScore.toFixed(1) + 'с';
    scoreDisplayEl.textContent = score;
    
    // Анимация комбо
    if (combo > 1) {
        scoreDisplayEl.style.color = '#f9ca24';
    } else {
        scoreDisplayEl.style.color = '#4ecdc4';
    }
}

function checkAchievements() {
    const score = meteorsDodged * combo;
    
    for (let achievement of achievements) {
        if (!achievement.unlocked && achievement.condition(elapsedTime, meteorsDodged, combo, score)) {
            achievement.unlocked = true;
            showAchievementPopup(achievement);
        }
    }
}

function showAchievementPopup(achievement) {
    const popup = document.createElement('div');
    popup.className = 'achievement-item';
    popup.textContent = achievement.name + ': ' + achievement.desc;
    achievementsList.appendChild(popup);
    
    // Автопрокрутка
    achievementsList.scrollTop = achievementsList.scrollHeight;
}

function loadAchievements() {
    const stored = localStorage.getItem('gameAchievements');
    if (stored) {
        unlockedAchievements = JSON.parse(stored);
        // Восстанавливаем разблокированные достижения
        unlockedAchievements.forEach(id => {
            const achievement = achievements.find(a => a.id === id);
            if (achievement) achievement.unlocked = true;
        });
    }
}

function saveAchievements() {
    const unlocked = achievements.filter(a => a.unlocked).map(a => a.id);
    localStorage.setItem('gameAchievements', JSON.stringify(unlocked));
}
