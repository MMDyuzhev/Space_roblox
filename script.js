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

// Переменные для рисовалки
let isDrawing = false;
let isEraser = false;
let lastX = 0;
let lastY = 0;
let canvas, ctx, colorPicker, brushSize, eraserBtn, clearCanvasBtn, saveCanvasBtn, toggleDrawingsBtn, drawingsGrid, savedDrawingsSection;
let modal, closeModal;

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
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
    const cards = document.querySelectorAll('.character-card');
    let engineerCard = null;
    cards.forEach(card => {
        const name = card.querySelector('.character-name');
        if (name && name.textContent.includes('Гайка')) {
            engineerCard = card;
        }
    });

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
});

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
