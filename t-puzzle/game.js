const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const targetSelect = document.getElementById('targetSelect');
const resetBtn = document.getElementById('resetBtn');

// Scaling factor for display
const SCALE = 2;

class Piece {
    constructor(id, points, color, x, y) {
        this.id = id;
        
        // Calculate the center of the original points
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        points.forEach(p => {
            minX = Math.min(minX, p.x);
            maxX = Math.max(maxX, p.x);
            minY = Math.min(minY, p.y);
            maxY = Math.max(maxY, p.y);
        });
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        // Shift points so (0,0) is the center
        this.basePoints = points.map(p => ({
            x: p.x - centerX,
            y: p.y - centerY
        }));

        this.color = color;
        this.x = x;
        this.y = y;
        this.rotation = 0; // in degrees
        this.isFlipped = false;
        this.isDragging = false;
    }

    getPoints() {
        return this.basePoints.map(p => {
            let px = p.x;
            let py = p.y;

            if (this.isFlipped) {
                px = -px;
            }

            const rad = (this.rotation * Math.PI) / 180;
            const rx = px * Math.cos(rad) - py * Math.sin(rad);
            const ry = px * Math.sin(rad) + py * Math.cos(rad);

            return {
                x: this.x + rx,
                y: this.y + ry
            };
        });
    }

    draw(ctx, isSelected) {
        const points = this.getPoints();
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
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
            const intersect = ((yi > py) !== (yj > py)) &&
                (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
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
        this.rotation = Math.floor(Math.random() * 8) * 45; // Random 45 degree increments
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
    const buffer = 20; // Extra space between pieces
    return !(b1.maxX + buffer < b2.minX || 
             b1.minX - buffer > b2.maxX || 
             b1.maxY + buffer < b2.minY || 
             b1.minY - buffer > b2.maxY);
}

function randomizeAllPieces(pieces) {
    pieces.forEach((p, i) => {
        let attempts = 0;
        let hasOverlap = true;
        while (hasOverlap && attempts < 150) {
            p.randomize();
            hasOverlap = false;
            
            const bounds = p.getBounds();
            // Check canvas boundaries
            if (bounds.minX < 20 || bounds.maxX > canvas.width - 20 || 
                bounds.minY < 20 || bounds.maxY > canvas.height - 20) {
                hasOverlap = true;
            }
            
            // Check overlap with already placed pieces
            if (!hasOverlap) {
                for (let j = 0; j < i; j++) {
                    if (isOverlapping(p, pieces[j])) {
                        hasOverlap = true;
                        break;
                    }
                }
            }
            attempts++;
        }
    });
}

// =====================================================
// Correct 4巧板 dimensions from shapes3.png
// =====================================================

const H = 28 * SCALE;
const A = 52 * SCALE;
const B = 80 * SCALE;
const C = 28 * 2 ** 0.5 * SCALE;
const D = 14 * 2 ** 0.5 * SCALE;
const HALF_C = (28 / 2) * SCALE;

// -----------------------------------------------------
// Piece 1 - Left trapezoid
// Top edge = 52
// Bottom edge = 80
// Right side is a 45° diagonal
// -----------------------------------------------------
const piece1 = new Piece(1, [
    { x: 0, y: 0 },
    { x: A, y: 0 },
    { x: A + H, y: H },
    { x: 0, y: H }
], '#AEEA00', 0, 0);

const piece2 = new Piece(2, [
    { x: 0, y: 0 },
    { x: B, y: 0 },
    { x: B - D, y: D },
    { x: B + H - 2 * D, y: H },
    { x: H, y: H}
], '#2EAD4A', 0, 0);

const piece3 = new Piece(3, [
    { x: 0, y: 0 },
    { x: C, y: 0 },
    { x: C + H - D, y: H - D },
    { x: H, y: H }
], '#33AA44', 0, 0);

const piece4 = new Piece(4, [
    { x: 0, y: 0 },
    { x: H, y: 0 },
    { x: H, y: H }
], '#D6FF00', 0, 0);

let pieces = [piece1, piece2, piece3, piece4];
randomizeAllPieces(pieces);

let selectedPiece = null;
let dragOffset = { x: 0, y: 0 };

const targetSilhouettes = {
    t_shape: [
        { x: 0, y: 0 }, { x: B + H, y: 0 }, { x: B + H, y: H },
        { x: (B + H) / 2 + H / 2, y: H }, { x: (B + H) / 2 + H / 2, y: H + A },
        { x: (B + H) / 2 - H / 2, y: H + A }, { x: (B + H) / 2 - H / 2, y: H },
        { x: 0, y: H }
    ],
    rectangle: [
        { x: 0, y: 0 }, { x: A + B + H, y: 0 }, { x: A + B + H, y: H }, { x: 0, y: H }
    ],
    letter_l: [
        { x: 0, y: 0 }, { x: H, y: 0 }, { x: H, y: A }, { x: A + B + H, y: A },
        { x: A + B + H, y: A + H }, { x: 0, y: A + H }
    ],
    number_7: [
        { x: 0, y: 0 }, { x: B + H, y: 0 }, { x: B + H, y: H },
        { x: H, y: A + H }, { x: 0, y: A + H }, { x: B, y: H }, { x: 0, y: H }
    ],
    axe: [
        { x: 0, y: 0 }, { x: B, y: 0 }, { x: B, y: H }, { x: H, y: H },
        { x: H, y: A + H }, { x: 0, y: A + H }
    ],
    diamond: [
        { x: (A + B) / 2, y: 0 }, { x: A + B, y: H }, { x: (A + B) / 2, y: H * 2 }, { x: 0, y: H }
    ],
    stairs: [
        { x: 0, y: 0 }, { x: H, y: 0 }, { x: H, y: H }, { x: H * 2, y: H },
        { x: H * 2, y: H * 2 }, { x: H * 3, y: H * 2 }, { x: H * 3, y: H * 3 }, { x: 0, y: H * 3 }
    ],
    volcano: [
        { x: H, y: 0 }, { x: B, y: 0 }, { x: A + B, y: H }, { x: 0, y: H }
    ],
    truph: [
        { x: 0, y: H * 2 },
        { x: B + H, y: H * 2 },
        { x: B + H, y: 0 },
        { x: B, y: H },
        { x: B - D, y: H - D },
        { x: B + H - 2 * D, y: 0 },
        { x: H, y: 0 },
        { x: 0, y: H }
    ]
};

// Populate targets from allShapes (15 random)
const hardcodedKeys = Object.keys(targetSilhouettes);
const allShapeKeys = Object.keys(allShapes).filter(k => k !== 'scattered');

// Pick 15 random from allShapes
const shuffled = allShapeKeys.sort(() => 0.5 - Math.random());
const selectedKeys = shuffled.slice(0, 15);

// Add to dropdown
selectedKeys.sort().forEach(key => {
    const option = document.createElement('option');
    option.value = 'allShapes:' + key;
    option.textContent = key.replace('shape', 'Shape ');
    targetSelect.appendChild(option);
});

// Helper to get points for a shape from shapes_data.js configuration
function getPointsFromState(stateKey) {
    const state = allShapes[stateKey];
    if (!state) return [];
    
    // Exact definitions from T-animation.html / solution tools
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

        const cx = def.w / 2;
        const cy = def.h / 2;
        const rad = (pos.rotate || 0) * Math.PI / 180;
        const sx = pos.scaleX || 1;

        const transformed = def.pts.map(p => {
            // Transform logic matching CSS rotate() scaleX() on a centered container
            let px = (p.x - cx) * sx;
            let py = (p.y - cy);

            const rx = px * Math.cos(rad) - py * Math.sin(rad);
            const ry = px * Math.sin(rad) + py * Math.cos(rad);

            return {
                x: rx + cx + pos.left,
                y: ry + cy + pos.top
            };
        });
        result.push(transformed);
    }
    return result;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvas.width; i += 20) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (let i = 0; i <= canvas.height; i += 20) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    pieces.forEach(p => p.draw(ctx, p === selectedPiece));
    requestAnimationFrame(draw);
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    selectedPiece = null;
    for (let i = pieces.length - 1; i >= 0; i--) {
        if (pieces[i].containsPoint(mx, my)) {
            selectedPiece = pieces[i];
            dragOffset.x = mx - selectedPiece.x;
            dragOffset.y = my - selectedPiece.y;
            pieces.splice(i, 1);
            pieces.push(selectedPiece);
            break;
        }
    }
});

window.addEventListener('mousemove', (e) => {
    if (selectedPiece && (e.buttons & 1)) {
        const rect = canvas.getBoundingClientRect();
        selectedPiece.x = e.clientX - rect.left - dragOffset.x;
        selectedPiece.y = e.clientY - rect.top - dragOffset.y;
        selectedPiece.constrainToCanvas();
    }
});

window.addEventListener('mouseup', () => {
    if (selectedPiece) {
        checkWin();
    }
});

canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (selectedPiece) {
        selectedPiece.rotate(45);
        checkWin();
    }
});

canvas.addEventListener('dblclick', (e) => {
    if (selectedPiece) {
        selectedPiece.flip();
        checkWin();
    }
});

window.addEventListener('keydown', (e) => {
    if (!selectedPiece) return;
    if (e.key.toLowerCase() === 'r') {
        selectedPiece.rotate(22.5);
        checkWin();
    } else if (e.key.toLowerCase() === 'f') {
        selectedPiece.flip();
        checkWin();
    }
});

resetBtn.addEventListener('click', () => {
    randomizeAllPieces(pieces);
});

function checkWin() {
    const targetVal = targetSelect.value;
    if (targetVal === 'none') return false;

    let targetPolygons = [];
    if (targetVal.startsWith('allShapes:')) {
        const key = targetVal.split(':')[1];
        targetPolygons = getPointsFromState(key);
    } else {
        targetPolygons = [targetSilhouettes[targetVal]];
    }

    const allTargetPoints = targetPolygons.flat();
    
    // 1. Get user shape bounds and center
    let pMinX = Infinity, pMaxX = -Infinity, pMinY = Infinity, pMaxY = -Infinity;
    pieces.forEach(piece => {
        piece.getPoints().forEach(pt => {
            pMinX = Math.min(pMinX, pt.x);
            pMaxX = Math.max(pMaxX, pt.x);
            pMinY = Math.min(pMinY, pt.y);
            pMaxY = Math.max(pMaxY, pt.y);
        });
    });
    const pCenterX = (pMinX + pMaxX) / 2;
    const pCenterY = (pMinY + pMaxY) / 2;

    // 2. Get target bounds and center
    let tMinX = Infinity, tMaxX = -Infinity, tMinY = Infinity, tMaxY = -Infinity;
    allTargetPoints.forEach(pt => {
        tMinX = Math.min(tMinX, pt.x);
        tMaxX = Math.max(tMaxX, pt.x);
        tMinY = Math.min(tMinY, pt.y);
        tMaxY = Math.max(tMaxY, pt.y);
    });
    const tCenterX = (tMinX + tMaxX) / 2;
    const tCenterY = (tMinY + tMaxY) / 2;

    // 3. Fuzzy Check: Instead of all vertices, we check a grid of points inside the pieces
    // to see if they are mostly inside the target silhouette.
    let totalPointsChecked = 0;
    let pointsInside = 0;

    pieces.forEach(piece => {
        const pts = piece.getPoints();
        // Sample the center and vertices of each piece
        const samples = [...pts];
        
        // Add center point of the piece
        let cX = 0, cY = 0;
        pts.forEach(p => { cX += p.x; cY += p.y; });
        samples.push({ x: cX / pts.length, y: cY / pts.length });

        samples.forEach(pt => {
            totalPointsChecked++;
            
            // Translate point from user-space to target-space
            const relX = pt.x - pCenterX + tCenterX;
            const relY = pt.y - pCenterY + tCenterY;

            let inside = false;
            const tol = 12; // High tolerance for "near the edge"
            
            // Check against ANY of the target polygons
            for (const targetPoints of targetPolygons) {
                for (let i = 0, j = targetPoints.length - 1; i < targetPoints.length; j = i++) {
                    const xi = targetPoints[i].x, yi = targetPoints[i].y;
                    const xj = targetPoints[j].x, yj = targetPoints[j].y;
                    
                    if (((yi > relY) !== (yj > relY)) &&
                        (relX < (xj - xi) * (relY - yi) / (yj - yi) + xi)) {
                        inside = !inside;
                    }
                }
                if (inside) break; // Already found inside one polygon
            }
            
            if (inside) {
                pointsInside++;
            } else {
                // If not strictly inside, check if it's very close to any edge of any target polygon
                for (const targetPoints of targetPolygons) {
                    for (let i = 0, j = targetPoints.length - 1; i < targetPoints.length; j = i++) {
                        const dist = distToSegment(
                            {x: relX, y: relY}, 
                            {x: targetPoints[i].x, y: targetPoints[i].y}, 
                            {x: targetPoints[j].x, y: targetPoints[j].y}
                        );
                        if (dist < tol) {
                            inside = true;
                            break;
                        }
                    }
                    if (inside) break;
                }
                if (inside) pointsInside++;
            }
        });
    });

    const accuracy = pointsInside / totalPointsChecked;
    if (accuracy >= 0.95) { // 95% of sampled points are in or near the target
        showWinMessage();
    }
}

function distToSegment(p, v, w) {
    const l2 = (v.x - w.x)**2 + (v.y - w.y)**2;
    if (l2 === 0) return Math.sqrt((p.x - v.x)**2 + (p.y - v.y)**2);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.sqrt((p.x - (v.x + t * (w.x - v.x)))**2 + (p.y - (v.y + t * (w.y - v.y)))**2);
}

function showWinMessage() {
    const msg = document.getElementById('winMessage');
    if (msg) {
        msg.style.display = 'block';
        setTimeout(() => { msg.style.display = 'none'; }, 3000);
    } else {
        alert("Puzzle Solved!");
    }
}

function updateTargetHint(val) {
    const hintContainer = document.getElementById('silhouette-container');
    const hintText = document.getElementById('targetHint');
    
    if (val === 'none') {
        hintText.style.display = 'block';
        const existingSvg = hintContainer.querySelector('svg');
        if (existingSvg) existingSvg.remove();
        return;
    }

    hintText.style.display = 'none';
    
    let targetPolygons = [];
    if (val.startsWith('allShapes:')) {
        const key = val.split(':')[1];
        targetPolygons = getPointsFromState(key);
    } else {
        targetPolygons = [targetSilhouettes[val]];
    }

    // Find bounds to scale SVG
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    targetPolygons.flat().forEach(p => {
        minX = Math.min(minX, p.x);
        maxX = Math.max(maxX, p.x);
        minY = Math.min(minY, p.y);
        maxY = Math.max(maxY, p.y);
    });

    const width = maxX - minX;
    const height = maxY - minY;
    const padding = 20;

    // Create SVG preview
    const svgNS = "http://www.w3.org/2000/svg";
    let svg = hintContainer.querySelector('svg');
    if (!svg) {
        svg = document.createElementNS(svgNS, 'svg');
        hintContainer.appendChild(svg);
    }
    
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '120');
    svg.setAttribute('viewBox', `${minX - padding} ${minY - padding} ${width + padding * 2} ${height + padding * 2}`);

    // Clear old content
    svg.innerHTML = '';
    
    // Create a group to hold all pieces - this allows us to apply opacity
    // to the WHOLE shape at once, hiding internal overlaps.
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('fill', '#555');
    g.setAttribute('opacity', '0.3');
    svg.appendChild(g);
    
    targetPolygons.forEach(points => {
        const polygon = document.createElementNS(svgNS, 'polygon');
        const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');
        polygon.setAttribute('points', pointsStr);
        // Add a thicker matching stroke to bridge larger gaps between misaligned pieces
        polygon.setAttribute('stroke', '#555');
        polygon.setAttribute('stroke-width', '3');
        polygon.setAttribute('stroke-linejoin', 'round');
        g.appendChild(polygon);
    });
}

targetSelect.addEventListener('change', () => {
    const val = targetSelect.value;
    updateTargetHint(val);
    randomizeAllPieces(pieces);
});

draw();
