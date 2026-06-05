const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const targetSelect = document.getElementById('targetSelect');
const resetBtn = document.getElementById('resetBtn');
const solutionBtn = document.getElementById('solutionBtn');

// Scaling factor for display
const SCALE = 2;

// =====================================================
// Bilingual Support & Translations
// =====================================================
let currentLang = 'en';
const translations = {
    en: {
        title: "T-Puzzle Challenge",
        intro1: "The T-Puzzle is a classic four-piece tangram. Use just four irregular pieces to form hundreds of shapes—the ultimate challenge is the letter 'T'.",
        intro2: "Sharpen your spatial imagination, observation skills, and logical thinking. Ready for the challenge?",
        labelTarget: "Select Target:",
        optNone: "None (Free Play)",
        labelPlay: "How to Play:",
        liDrag: "<strong>Drag</strong> to move pieces.",
        liRotate: "Press <strong>'R'</strong> or use <strong>Rotate</strong> button (22.5°).",
        liFlip: "Press <strong>'F'</strong>, <strong>Double-Click</strong>, or use <strong>Flip</strong> button.",
        labelHint: "Target Hint:",
        hintDefault: "Select a target from the list above. A ghost silhouette will appear on the canvas.",
        resetBtn: "Reset Pieces",
        rotateBtn: "Rotate",
        flipBtn: "Flip",
        viewSolution: "💡 View Solution",
        resetSolution: "⏱️ Reset Pieces",
        winMessage: "SOLVED!",
        footer: "© {year} Qiping Yan/严启平. All rights reserved.",
        shapes: {
            "T": "The Letter T",
            "rectangle": "Rectangle",
            "letter_l": "Letter L",
            "number_7": "Number 7",
            "axe": "Axe",
            "diamond": "Diamond",
            "stairs": "Stairs"
        }
    },
    cn: {
        title: "四巧板挑战 (T字之谜)",
        intro1: "四巧板是一种经典的四片式智力拼图。仅用四块形状各异的板子就能拼出上百种图案，而其中最具挑战性的便是字母 'T'。",
        intro2: "在游戏中锻炼你的空间想象力、观察力和逻辑思维。准备好接受挑战了吗？",
        labelTarget: "选择目标：",
        optNone: "无（自由模式）",
        labelPlay: "玩法说明：",
        liDrag: "<strong>拖拽</strong> 移动方块。",
        liRotate: "按 <strong>'R'</strong> 键 或使用 <strong>旋转</strong> 按钮 (22.5°)。",
        liFlip: "按 <strong>'F'</strong> 键、<strong>双击</strong> 或使用 <strong>翻转</strong> 按钮。",
        labelHint: "目标提示：",
        hintDefault: "从上方列表选择目标，预览将在此显示。",
        resetBtn: "重置方块",
        rotateBtn: "旋转",
        flipBtn: "翻转",
        viewSolution: "💡 查看答案",
        resetSolution: "⏱️ 重置方块",
        winMessage: "挑战成功！",
        footer: "© {year} 严启平。保留所有权利。",

        shapes: {
            "T": "字母 T",
            "rectangle": "长方形",
            "letter_l": "字母 L",
            "number_7": "数字 7",
            "axe": "斧头",
            "diamond": "菱形",
            "stairs": "阶梯"
        }
    }
};

function updateLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];
    
    if (document.getElementById('ui-title')) document.getElementById('ui-title').textContent = t.title;
    if (document.getElementById('ui-intro-1')) document.getElementById('ui-intro-1').innerHTML = t.intro1;
    if (document.getElementById('ui-intro-2')) document.getElementById('ui-intro-2').textContent = t.intro2;
    if (document.getElementById('ui-label-target')) document.getElementById('ui-label-target').textContent = t.labelTarget;
    if (document.getElementById('ui-opt-none')) document.getElementById('ui-opt-none').textContent = t.optNone;
    if (document.getElementById('ui-label-play')) document.getElementById('ui-label-play').textContent = t.labelPlay;
    if (document.getElementById('ui-li-drag')) document.getElementById('ui-li-drag').innerHTML = t.liDrag;
    if (document.getElementById('ui-li-rotate')) document.getElementById('ui-li-rotate').innerHTML = t.liRotate;
    if (document.getElementById('ui-li-flip')) document.getElementById('ui-li-flip').innerHTML = t.liFlip;
    if (document.getElementById('ui-label-hint')) document.getElementById('ui-label-hint').textContent = t.labelHint;
    
    const hint = document.getElementById('targetHint');
    if (targetSelect && targetSelect.value === 'none') {
        if (hint) hint.textContent = t.hintDefault;
    }
    
    if (resetBtn) resetBtn.textContent = t.resetBtn;
    if (document.getElementById('rotateBtn')) document.getElementById('rotateBtn').textContent = t.rotateBtn;
    if (document.getElementById('flipBtn')) document.getElementById('flipBtn').textContent = t.flipBtn;
    if (document.getElementById('winMessage')) document.getElementById('winMessage').textContent = t.winMessage;
    
    const year = new Date().getFullYear();
    const footer = document.getElementById('ui-footer');
    if (footer) footer.innerHTML = t.footer.replace('{year}', year);
    
    if (solutionBtn) {
        if (solutionBtn.textContent.includes('Solution') || solutionBtn.textContent.includes('查看')) {
            solutionBtn.innerHTML = t.viewSolution;
        } else {
            solutionBtn.innerHTML = t.resetSolution;
        }
    }

    // Update Dropdown Options
    if (targetSelect) {
        const currentVal = targetSelect.value;
        targetSelect.innerHTML = '';
        const noneOpt = document.createElement('option');
        noneOpt.value = 'none';
        noneOpt.id = 'ui-opt-none';
        noneOpt.textContent = t.optNone;
        targetSelect.appendChild(noneOpt);

        populateDropdown();
        targetSelect.value = currentVal;
    }
}

// --- Target Selection Initialization ---
let selectedTargetKeys = [];

function initializeTargetList() {
    if (typeof allShapes === 'undefined') return;
    
    // Get all valid shape keys (excluding 'scattered' and 'T' for now)
    const allKeys = Object.keys(allShapes).filter(k => k !== 'scattered' && k !== 'T');
    
    // Shuffle and pick 14
    const shuffled = allKeys.sort(() => 0.5 - Math.random());
    const random14 = shuffled.slice(0, 14);
    
    // Always put 'T' at the very top
    selectedTargetKeys = ['T', ...random14.sort((a, b) => a.localeCompare(b))];
}

// Call once at startup
initializeTargetList();

function populateDropdown() {
    const t = translations[currentLang];
    
    selectedTargetKeys.forEach(key => {
        const option = document.createElement('option');
        option.value = 'allShapes:' + key;

        let displayName = (t.shapes && t.shapes[key]) || key.replace('shape', 'Shape ').replace('_', ' ');
        option.textContent = displayName;
        targetSelect.appendChild(option);
    });
}

// =====================================================
// Piece Class & Logic
// =====================================================
class Piece {
    constructor(id, points, color, x, y) {
        this.id = id;
        
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        points.forEach(p => {
            minX = Math.min(minX, p.x);
            maxX = Math.max(maxX, p.x);
            minY = Math.min(minY, p.y);
            maxY = Math.max(maxY, p.y);
        });
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        this.basePoints = points.map(p => ({
            x: p.x - centerX,
            y: p.y - centerY
        }));

        this.color = color;
        this.x = x;
        this.y = y;
        this.rotation = 0; 
        this.isFlipped = false;
        this.isDragging = false;
    }

    getPoints() {
        return this.basePoints.map(p => {
            let px = p.x;
            let py = p.y;
            if (this.isFlipped) px = -px;
            const rad = (this.rotation * Math.PI) / 180;
            const rx = px * Math.cos(rad) - py * Math.sin(rad);
            const ry = px * Math.sin(rad) + py * Math.cos(rad);
            return { x: this.x + rx, y: this.y + ry };
        });
    }

    draw(ctx, isSelected) {
        const points = this.getPoints();
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#ff0000' : '#333';
        ctx.lineWidth = isSelected ? 3 : 1;
        ctx.stroke();
        if (isSelected) {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    containsPoint(px, py) {
        const points = this.getPoints();
        let inside = false;
        for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
            const xi = points[i].x, yi = points[i].y;
            const xj = points[j].x, yj = points[j].y;
            const intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    rotate(angle = 45) {
        this.rotation = (this.rotation + angle) % 360;
        this.constrainToCanvas();
    }

    flip() {
        this.isFlipped = !this.isFlipped;
        this.constrainToCanvas();
    }

    constrainToCanvas() {
        const bounds = this.getBounds();
        const buffer = 10;
        if (bounds.minX < buffer) this.x += (buffer - bounds.minX);
        if (bounds.maxX > canvas.width - buffer) this.x -= (bounds.maxX - (canvas.width - buffer));
        if (bounds.minY < buffer) this.y += (buffer - bounds.minY);
        if (bounds.maxY > canvas.height - buffer) this.y -= (bounds.maxY - (canvas.height - buffer));
    }

    randomize() {
        this.x = 100 + Math.random() * (canvas.width - 200);
        this.y = 100 + Math.random() * (canvas.height - 200);
        this.rotation = Math.floor(Math.random() * 8) * 45;
        this.isFlipped = Math.random() > 0.5;
    }

    getBounds() {
        const points = this.getPoints();
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        points.forEach(p => {
            minX = Math.min(minX, p.x);
            maxX = Math.max(maxX, p.x);
            minY = Math.min(minY, p.y);
            maxY = Math.max(maxY, p.y);
        });
        return { minX, maxX, minY, maxY };
    }
}

function isOverlapping(p1, p2) {
    const b1 = p1.getBounds();
    const b2 = p2.getBounds();
    const buffer = 20;
    return !(b1.maxX + buffer < b2.minX || b1.minX - buffer > b2.maxX || b1.maxY + buffer < b2.minY || b1.minY - buffer > b2.maxY);
}

function randomizeAllPieces(pieces) {
    pieces.forEach((p, i) => {
        let attempts = 0, hasOverlap = true;
        while (hasOverlap && attempts < 150) {
            p.randomize();
            hasOverlap = false;
            const bounds = p.getBounds();
            if (bounds.minX < 20 || bounds.maxX > canvas.width - 20 || bounds.minY < 20 || bounds.maxY > canvas.height - 20) hasOverlap = true;
            if (!hasOverlap) {
                for (let j = 0; j < i; j++) {
                    if (isOverlapping(p, pieces[j])) { hasOverlap = true; break; }
                }
            }
            attempts++;
        }
    });
}

// =====================================================
// Game Setup & Dimensions
// =====================================================
const H = 28 * SCALE;
const A = 52 * SCALE;
const B = 80 * SCALE;
const C = 28 * 2 ** 0.5 * SCALE;
const D = 14 * 2 ** 0.5 * SCALE;

const piece1 = new Piece(1, [{ x: 0, y: 0 }, { x: A, y: 0 }, { x: A + H, y: H }, { x: 0, y: H }], '#AEEA00', 0, 0);
const piece2 = new Piece(2, [{ x: 0, y: 0 }, { x: B, y: 0 }, { x: B - D, y: D }, { x: B + H - 2 * D, y: H }, { x: H, y: H}], '#2EAD4A', 0, 0);
const piece3 = new Piece(3, [{ x: 0, y: 0 }, { x: C, y: 0 }, { x: C + H - D, y: H - D }, { x: H, y: H }], '#33AA44', 0, 0);
const piece4 = new Piece(4, [{ x: 0, y: 0 }, { x: H, y: 0 }, { x: H, y: H }], '#D6FF00', 0, 0);

const pieces = [piece1, piece2, piece3, piece4];
const targetSilhouettes = {
    t_shape: [{ x: 0, y: 0 }, { x: B + H, y: 0 }, { x: B + H, y: H }, { x: (B + H) / 2 + H / 2, y: H }, { x: (B + H) / 2 + H / 2, y: H + A }, { x: (B + H) / 2 - H / 2, y: H + A }, { x: (B + H) / 2 - H / 2, y: H }, { x: 0, y: H }],
    rectangle: [{ x: 0, y: 0 }, { x: A + B + H, y: 0 }, { x: A + B + H, y: H }, { x: 0, y: H }],
    letter_l: [{ x: 0, y: 0 }, { x: H, y: 0 }, { x: H, y: A }, { x: A + B + H, y: A }, { x: A + B + H, y: A + H }, { x: 0, y: A + H }],
    number_7: [{ x: 0, y: 0 }, { x: B + H, y: 0 }, { x: B + H, y: H }, { x: H, y: A + H }, { x: 0, y: A + H }, { x: B, y: H }, { x: 0, y: H }],
    axe: [{ x: 0, y: 0 }, { x: B, y: 0 }, { x: B, y: H }, { x: H, y: H }, { x: H, y: A + H }, { x: 0, y: A + H }],
    diamond: [{ x: (A + B) / 2, y: 0 }, { x: A + B, y: H }, { x: (A + B) / 2, y: H * 2 }, { x: 0, y: H }],
    stairs: [{ x: 0, y: 0 }, { x: H, y: 0 }, { x: H, y: H }, { x: H * 2, y: H }, { x: H * 2, y: H * 2 }, { x: H * 3, y: H * 2 }, { x: H * 3, y: H * 3 }, { x: 0, y: H * 3 }],
    volcano: [{ x: H, y: 0 }, { x: B, y: 0 }, { x: A + B, y: H }, { x: 0, y: H }],
    truph: [{ x: 0, y: H * 2 }, { x: B + H, y: H * 2 }, { x: B + H, y: 0 }, { x: B, y: H }, { x: B - D, y: H - D }, { x: B + H - 2 * D, y: 0 }, { x: H, y: 0 }, { x: 0, y: H }]
};

// =====================================================
// Core Game Loop & Interactions
// =====================================================
let selectedPiece = null;
let dragOffset = { x: 0, y: 0 };

function getPointsFromState(stateKey) {
    if (typeof allShapes === 'undefined' || !allShapes[stateKey]) return [];
    const state = allShapes[stateKey];
    const defs = {
        p1: { w: 320, h: 80, pts: [{x:0,y:0}, {x:104,y:0}, {x:160,y:56}, {x:0,y:56}] },
        p2: { w: 320, h: 80, pts: [{x:0,y:0}, {x:160,y:0}, {x:118,y:42}, {x:132,y:56}, {x:56,y:56}] },
        p3: { w: 80, h: 220, pts: [{x:0,y:0}, {x:79.2,y:0}, {x:95.6,y:16.4}, {x:56,y:56}] },
        p4: { w: 70, h: 70, pts: [{x:0,y:0}, {x:56,y:0}, {x:56,y:56}] }
    };
    const result = [];
    for (const [id, pos] of Object.entries(state)) {
        const def = defs[id];
        if (!def) continue;
        const cx = def.w / 2, cy = def.h / 2;
        const rad = (pos.rotate || 0) * Math.PI / 180, sx = pos.scaleX || 1;
        result.push(def.pts.map(p => {
            let px = (p.x - cx) * sx, py = (p.y - cy);
            return { x: px * Math.cos(rad) - py * Math.sin(rad) + cx + pos.left, y: px * Math.sin(rad) + py * Math.cos(rad) + cy + pos.top };
        }));
    }
    return result;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvas.width; i += 20) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
    for (let i = 0; i <= canvas.height; i += 20) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke(); }
    pieces.forEach(p => p.draw(ctx, p === selectedPiece));
    requestAnimationFrame(draw);
}

function distToSegment(p, v, w) {
    const l2 = (v.x - w.x)**2 + (v.y - w.y)**2;
    if (l2 === 0) return Math.sqrt((p.x - v.x)**2 + (p.y - v.y)**2);
    let t = Math.max(0, Math.min(1, ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2));
    return Math.sqrt((p.x - (v.x + t * (w.x - v.x)))**2 + (p.y - (v.y + t * (w.y - v.y)))**2);
}

function checkWin() {
    const val = targetSelect.value;
    if (val === 'none') return false;
    let targetPolygons = val.startsWith('allShapes:') ? getPointsFromState(val.split(':')[1]) : [targetSilhouettes[val]];
    const allTargetPoints = targetPolygons.flat();
    
    let pMinX = Infinity, pMaxX = -Infinity, pMinY = Infinity, pMaxY = -Infinity;
    pieces.forEach(piece => piece.getPoints().forEach(pt => { pMinX = Math.min(pMinX, pt.x); pMaxX = Math.max(pMaxX, pt.x); pMinY = Math.min(pMinY, pt.y); pMaxY = Math.max(pMaxY, pt.y); }));
    const pCenterX = (pMinX + pMaxX) / 2, pCenterY = (pMinY + pMaxY) / 2;

    let tMinX = Infinity, tMaxX = -Infinity, tMinY = Infinity, tMaxY = -Infinity;
    allTargetPoints.forEach(pt => { tMinX = Math.min(tMinX, pt.x); tMaxX = Math.max(tMaxX, pt.x); tMinY = Math.min(tMinY, pt.y); tMaxY = Math.max(tMaxY, pt.y); });
    const tCenterX = (tMinX + tMaxX) / 2, tCenterY = (tMinY + tMaxY) / 2;

    let totalPointsChecked = 0, pointsInside = 0;
    pieces.forEach(piece => {
        const pts = piece.getPoints();
        const samples = [...pts];
        let cX = 0, cY = 0;
        pts.forEach(p => { cX += p.x; cY += p.y; });
        samples.push({ x: cX / pts.length, y: cY / pts.length });
        samples.forEach(pt => {
            totalPointsChecked++;
            const relX = pt.x - pCenterX + tCenterX, relY = pt.y - pCenterY + tCenterY;
            let inside = false;
            for (const targetPoints of targetPolygons) {
                for (let i = 0, j = targetPoints.length - 1; i < targetPoints.length; j = i++) {
                    if (((targetPoints[i].y > relY) !== (targetPoints[j].y > relY)) && (relX < (targetPoints[j].x - targetPoints[i].x) * (relY - targetPoints[i].y) / (targetPoints[j].y - targetPoints[i].y) + targetPoints[i].x)) inside = !inside;
                }
                if (inside) break;
            }
            if (!inside) {
                for (const targetPoints of targetPolygons) {
                    for (let i = 0, j = targetPoints.length - 1; i < targetPoints.length; j = i++) {
                        if (distToSegment({x: relX, y: relY}, targetPoints[i], targetPoints[j]) < 12) { inside = true; break; }
                    }
                    if (inside) break;
                }
            }
            if (inside) pointsInside++;
        });
    });
    if (pointsInside / totalPointsChecked >= 0.95) {
        const msg = document.getElementById('winMessage');
        if (msg) { msg.style.display = 'block'; setTimeout(() => msg.style.display = 'none', 3000); }
    }
}

function updateTargetHint(val) {
    const hintContainer = document.getElementById('silhouette-container'), hintText = document.getElementById('targetHint');
    if (val === 'none') { hintText.style.display = 'block'; const existingSvg = hintContainer.querySelector('svg'); if (existingSvg) existingSvg.remove(); return; }
    hintText.style.display = 'none';
    let targetPolygons = val.startsWith('allShapes:') ? getPointsFromState(val.split(':')[1]) : [targetSilhouettes[val]];
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    targetPolygons.flat().forEach(p => { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); });
    const width = maxX - minX, height = maxY - minY, padding = 20;
    const svgNS = "http://www.w3.org/2000/svg";
    let svg = hintContainer.querySelector('svg');
    if (!svg) { svg = document.createElementNS(svgNS, 'svg'); hintContainer.appendChild(svg); }
    svg.setAttribute('width', '100%'); svg.setAttribute('height', '120'); svg.setAttribute('viewBox', `${minX - padding} ${minY - padding} ${width + padding * 2} ${height + padding * 2}`);
    svg.innerHTML = '';
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('fill', '#555'); g.setAttribute('opacity', '0.3'); svg.appendChild(g);
    targetPolygons.forEach(points => {
        const polygon = document.createElementNS(svgNS, 'polygon');
        polygon.setAttribute('points', points.map(p => `${p.x},${p.y}`).join(' '));
        polygon.setAttribute('stroke', '#555'); polygon.setAttribute('stroke-width', '3'); polygon.setAttribute('stroke-linejoin', 'round');
        g.appendChild(polygon);
    });
}

// =====================================================
// Event Listeners
// =====================================================
let isDragging = false;

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

canvas.addEventListener('pointerdown', (e) => {
    const pos = getMousePos(e);
    selectedPiece = null;
    for (let i = pieces.length - 1; i >= 0; i--) {
        if (pieces[i].containsPoint(pos.x, pos.y)) {
            e.preventDefault(); // Stop browser from scrolling
            selectedPiece = pieces[i];
            isDragging = true;
            dragOffset.x = pos.x - selectedPiece.x;
            dragOffset.y = pos.y - selectedPiece.y;
            
            // Move to front
            pieces.splice(i, 1);
            pieces.push(selectedPiece);
            
            canvas.setPointerCapture(e.pointerId);
            break;
        }
    }
});

canvas.addEventListener('pointermove', (e) => {
    if (isDragging && selectedPiece) {
        e.preventDefault(); // Explicitly prevent scroll while dragging
        const pos = getMousePos(e);
        selectedPiece.x = pos.x - dragOffset.x;
        selectedPiece.y = pos.y - dragOffset.y;
        selectedPiece.constrainToCanvas();
    }
});

canvas.addEventListener('pointerup', (e) => { 
    if (isDragging) {
        isDragging = false;
        checkWin();
        canvas.releasePointerCapture(e.pointerId);
    } 
});

canvas.addEventListener('pointercancel', (e) => {
    isDragging = false;
    if (e.pointerId) canvas.releasePointerCapture(e.pointerId);
});

canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (selectedPiece) { selectedPiece.rotate(45); checkWin(); }
});

canvas.addEventListener('dblclick', (e) => { 
    if (selectedPiece) { selectedPiece.flip(); checkWin(); } 
});

window.addEventListener('keydown', (e) => {
    if (!selectedPiece) return;
    if (e.key.toLowerCase() === 'r') { selectedPiece.rotate(22.5); checkWin(); }
    else if (e.key.toLowerCase() === 'f') { selectedPiece.flip(); checkWin(); }
});

resetBtn.addEventListener('click', () => randomizeAllPieces(pieces));

const rotateBtn = document.getElementById('rotateBtn');
const flipBtn = document.getElementById('flipBtn');

if (rotateBtn) {
    rotateBtn.addEventListener('click', () => {
        if (selectedPiece) { selectedPiece.rotate(22.5); checkWin(); }
    });
}

if (flipBtn) {
    flipBtn.addEventListener('click', () => {
        if (selectedPiece) { selectedPiece.flip(); checkWin(); }
    });
}

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateLanguage(btn.dataset.lang);
    });
});

targetSelect.addEventListener('change', () => {
    const val = targetSelect.value;
    updateTargetHint(val);
    randomizeAllPieces(pieces);
    if (solutionBtn) {
        if (val === 'allShapes:T') solutionBtn.style.display = 'inline-flex';
        else { solutionBtn.style.display = 'none'; stopSolutionAnimation(); }
    }
});

// Solution Animation
let animationFrameId = null, isAnimating = false;
if (solutionBtn) {
    solutionBtn.addEventListener('click', () => {
        if (isAnimating || solutionBtn.textContent.includes('Reset') || solutionBtn.textContent.includes('重置')) { stopSolutionAnimation(); return; }
        startSolutionAnimation();
    });
}

function startSolutionAnimation() {
    isAnimating = true;
    const t = translations[currentLang];
    solutionBtn.textContent = t.resetSolution;
    solutionBtn.style.backgroundColor = '#ea4335';
    
    if (typeof allShapes === 'undefined' || !allShapes['T']) { isAnimating = false; return; }
    const targetPolygons = getPointsFromState('T');
    const startState = pieces.map(p => ({ x: p.x, y: p.y, rotation: p.rotation, isFlipped: p.isFlipped }));
    
    // Calculate centering offset based on targetPolygons
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    targetPolygons.flat().forEach(p => { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); });
    const offsetX = canvas.width / 2 - (minX + maxX) / 2;
    const offsetY = canvas.height / 2 - (minY + maxY) / 2;

    const defs = {
        p1: { w: 320, h: 80, pts: [{x:0,y:0}, {x:104,y:0}, {x:160,y:56}, {x:0,y:56}] },
        p2: { w: 320, h: 80, pts: [{x:0,y:0}, {x:160,y:0}, {x:118,y:42}, {x:132,y:56}, {x:56,y:56}] },
        p3: { w: 80, h: 220, pts: [{x:0,y:0}, {x:79.2,y:0}, {x:95.6,y:16.4}, {x:56,y:56}] },
        p4: { w: 70, h: 70, pts: [{x:0,y:0}, {x:56,y:0}, {x:56,y:56}] }
    };

    const finalState = pieces.map(p => {
        const id = 'p' + p.id, pos = allShapes['T'][id], def = defs[id];
        
        // 1. Calculate the piece's base center (matching the Piece constructor logic)
        let pminX = Infinity, pmaxX = -Infinity, pminY = Infinity, pmaxY = -Infinity;
        def.pts.forEach(pt => { 
            pminX = Math.min(pminX, pt.x); 
            pmaxX = Math.max(pmaxX, pt.x); 
            pminY = Math.min(pminY, pt.y); 
            pmaxY = Math.max(pmaxY, pt.y); 
        });
        const pieceBaseCenterX = (pminX + pmaxX) / 2;
        const pieceBaseCenterY = (pminY + pmaxY) / 2;

        // 2. Transform this center using the coordinate system from shapes_data.js
        const cx = def.w / 2;
        const cy = def.h / 2;
        const rad = (pos.rotate || 0) * Math.PI / 180;
        const sx = pos.scaleX || 1;

        let px = (pieceBaseCenterX - cx) * sx;
        let py = (pieceBaseCenterY - cy);

        const rx = px * Math.cos(rad) - py * Math.sin(rad);
        const ry = px * Math.sin(rad) + py * Math.cos(rad);

        return { 
            x: rx + cx + pos.left + offsetX, 
            y: ry + cy + pos.top + offsetY, 
            rotation: pos.rotate || 0, 
            isFlipped: pos.scaleX === -1 
        };
    });

    let frame = 0; const totalFrames = 60;
    function animateLoop() {
        if (!isAnimating) return;
        frame++; const t = frame / totalFrames, ease = t * (2 - t);
        pieces.forEach((p, i) => {
            const start = startState[i], end = finalState[i];
            p.x = start.x + (end.x - start.x) * ease; p.y = start.y + (end.y - start.y) * ease;
            let diff = (end.rotation - start.rotation) % 360;
            if (diff > 180) diff -= 360; if (diff < -180) diff += 360;
            p.rotation = start.rotation + diff * ease;
            if (t >= 0.5) p.isFlipped = end.isFlipped;
        });
        if (frame < totalFrames) animationFrameId = requestAnimationFrame(animateLoop);
        else isAnimating = false;
    }
    animateLoop();
}

function stopSolutionAnimation() {
    isAnimating = false; if (animationFrameId) cancelAnimationFrame(animationFrameId);
    const t = translations[currentLang];
    if (solutionBtn) { solutionBtn.innerHTML = t.viewSolution; solutionBtn.style.backgroundColor = '#34a853'; }
    randomizeAllPieces(pieces);
}

// =====================================================
// Initialization
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    randomizeAllPieces(pieces);
    updateLanguage('en');
    draw();
});
