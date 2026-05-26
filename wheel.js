 const WHEEL_COLORS = [
    "#e6194b", "#3cb44b", "#4363d8", "#f58231",
    "#911eb4", "#42d4f4", "#f032e6", "#bfef45",
    "#fabeb4", "#469990", "#dcbeff", "#9A6324",
    "#ffe119", "#aaffc3", "#ff6961", "#77dd77"
];

const WHEEL_FILL_COLOR = "#FFD600";
const WHEEL_STROKE_COLOR = "#000";

function getAppFontFamily() {
     
    const family = getComputedStyle(document.body).fontFamily;
    return family && family.trim() ? family : '"Doto", sans-serif';
}

function getUiScale() {
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--ui-scale");
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function getCssNumberVar(varName, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(varName);
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function getCssColorVar(varName, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return raw || fallback;
}

function getWheelFillColor() {
    return getCssColorVar("--wheel-fill-color", WHEEL_FILL_COLOR);
}

function getWheelStrokeColor() {
    return getCssColorVar("--wheel-stroke-color", WHEEL_STROKE_COLOR);
}

function getWheelTextColor() {
    return getCssColorVar("--wheel-text-color", "#000");
}

function getThemeForegroundColor() {
    return getComputedStyle(document.body).color || "#000";
}

function truncateToWidth(ctx, text, maxWidth) {
    const ellipsis = "..";

    if (ctx.measureText(text).width <= maxWidth) return text;
    if (ctx.measureText(ellipsis).width > maxWidth) return "";

    let low = 0;
    let high = text.length;
    while (low < high) {
        const mid = Math.ceil((low + high) / 2);
        const candidate = text.slice(0, mid) + ellipsis;
        if (ctx.measureText(candidate).width <= maxWidth) low = mid;
        else high = mid - 1;
    }
    return text.slice(0, Math.max(0, low)) + ellipsis;
}

 
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const resultDiv = document.getElementById("result");

 
let isSpinning = false;
let currentRotation = 0;  

 
function calculateSliceAngle() {
    if (items.length === 0) return 360;
    return 360 / items.length;
}


function renderWheel() {
    const sliceAngle = calculateSliceAngle();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 12;

     
    ctx.clearRect(0, 0, canvas.width, canvas.height);

     
    if (items.length === 0) {
        drawEmptyWheel(centerX, centerY, radius);
        return;
    }

     
    for (let i = 0; i < items.length; i++) {
        drawSlice(i, sliceAngle, centerX, centerY, radius);
    }

     
    for (let i = 0; i < items.length; i++) {
        drawSliceText(i, sliceAngle, centerX, centerY, radius);
    }

     
}

 
function drawSlice(index, sliceAngle, cx, cy, radius) {
     
    if (items.length === 1 || Math.abs(sliceAngle - 360) < 0.0001) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);

        ctx.fillStyle = getWheelFillColor();
        ctx.fill();

        ctx.strokeStyle = getWheelStrokeColor();
        ctx.lineWidth = 2;
        ctx.stroke();
        return;
    }

     
    const startRad = (index * sliceAngle - 90) * (Math.PI / 180);
    const endRad = ((index + 1) * sliceAngle - 90) * (Math.PI / 180);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startRad, endRad);
    ctx.closePath();

     
    ctx.fillStyle = getWheelFillColor();
    ctx.fill();

    ctx.strokeStyle = getWheelStrokeColor();
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawSliceText(index, sliceAngle, cx, cy, radius) {
    const fontSize = getWheelFontSize();
    const uiScale = getUiScale();
    const wheelTextScale = getCssNumberVar("--wheel-text-scale", 1);

     
    const maxChars = 7;  
    let rawLabel = items[index].trim();
    if (rawLabel.length > maxChars) {
    rawLabel = rawLabel.slice(0, maxChars) + "..";
}

    ctx.save();
    ctx.translate(cx, cy);

    const midAngleDeg = index * sliceAngle + sliceAngle / 2 - 90;
    const midAngleRad = midAngleDeg * (Math.PI / 180);
    
    const normalizedDeg = ((midAngleDeg % 360) + 360) % 360;
    const isLeftSide = normalizedDeg > 90 && normalizedDeg < 270;

     
    if (items.length === 1) {
        ctx.font = `400 ${Math.round(fontSize * uiScale * wheelTextScale)}px "PP Mondwest"`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = getWheelTextColor();
        
         
        const singleMaxW = radius * 1.8; 
        const label = truncateToWidth(ctx, rawLabel, singleMaxW);
        
        ctx.fillText(label, 0, 0);
        ctx.restore();
        return;
    }

     
    ctx.rotate(midAngleRad + (isLeftSide ? Math.PI : 0));
    ctx.font = `400 ${Math.round(fontSize * uiScale * wheelTextScale)}px "PP Mondwest"`;
    ctx.textAlign = isLeftSide ? "left" : "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = getWheelTextColor();

    const textRadius = radius - 18;
    const sliceAngleRad = (sliceAngle * Math.PI) / 180;
    const maxWidth = Math.max(18, 2 * textRadius * Math.tan(sliceAngleRad / 2) - 10);
    
     
    const label = truncateToWidth(ctx, rawLabel, maxWidth);
    
    ctx.fillText(label, isLeftSide ? -textRadius : textRadius, 0);
    ctx.restore();
}

 
function drawCenterDot(cx, cy) {
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, 2 * Math.PI);
    ctx.fillStyle = getWheelStrokeColor();
    ctx.fill();
     
     
     
}

 
function drawEmptyWheel(cx, cy, radius) {
    ctx.save();
    const uiScale = getUiScale();
    const emptyFontSize = getCssNumberVar("--wheel-empty-font-size", 28);
    const fg = getWheelStrokeColor();

     
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = fg;
    ctx.lineWidth = 2;
    ctx.stroke();

     
    ctx.fillStyle = fg;
    ctx.font = `400 ${Math.round(emptyFontSize * uiScale)}px "PP Mondwest"`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("No items yet", cx, cy);
    ctx.restore();
}

 
function getWheelFontSize() {
    const n = items.length;
    if (n <= 4) return 30 * 1.5;
    if (n <= 8) return 20;
    if (n <= 12) return 16;
    return 13;
}

 
function truncateForWheel(text) {
    const n = items.length;
    let max;

    if (n <= 4) max = 18;
    else if (n <= 8) max = 12;
    else if (n <= 12) max = 8;
    else max = 5;

    const clean = text.trim();

    if (clean.length <= max) return clean;

    return clean.slice(0, max);
}



function spinWheel() {
    if (isSpinning) return;

     
    if (items.length < 2) {
        alert("Add at least 2 items to spin!");
        return;
    }

    isSpinning = true;
    spinButton.disabled = true;
    resultDiv.style.display = "none";

     
    const fullTurns = 5 + Math.floor(Math.random() * 6);
    const randomOffset = Math.random() * 360;
    const totalSpin = fullTurns * 360 + randomOffset;

     
     
    currentRotation += totalSpin;

     
    canvas.style.transition = "transform 4s cubic-bezier(0.15, 0.60, 0.07, 1.00)";
    canvas.style.transform = "rotate(" + currentRotation + "deg)";

     
    setTimeout(function () {
        isSpinning = false;
        spinButton.disabled = false;

        var winner = determineWinner(currentRotation);
        showResult(winner);

         
         
        canvas.style.transition = "none";
        currentRotation = currentRotation % 360;
        canvas.style.transform = "rotate(" + currentRotation + "deg)";
    }, 4200);  
}

function determineWinner(rotation) {
    var sliceAngle = calculateSliceAngle();
    var normalizedAngle = (360 - (rotation % 360)) % 360;
    var winnerIndex = Math.floor(normalizedAngle / sliceAngle);

     
    if (winnerIndex >= items.length) winnerIndex = items.length - 1;
    if (winnerIndex < 0) winnerIndex = 0;

    return items[winnerIndex];
}

 
function showResult(winnerName) {
    resultDiv.textContent = "Winner: " + winnerName;
    resultDiv.style.display = "block";
}

spinButton.addEventListener("click", spinWheel);
 
 
var itemsObserver = new MutationObserver(function () {
    renderWheel();
});
itemsObserver.observe(itemList, {
    childList: true,       
    subtree: true,         
    characterData: true    
});
 
document.fonts.ready.then(function () {
    renderWheel();
});

 
window.addEventListener("themechange", function () {
    requestAnimationFrame(renderWheel);
});

const navSpinBtn = document.getElementById("navSpinBtn");
if (navSpinBtn) navSpinBtn.addEventListener("click", spinWheel);