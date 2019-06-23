
const TAU = Math.PI * 2;
const MIN_RADIUS = 20;
const MAX_RADIUS = 55;
const MIN_ANGLE = Math.PI / 6;
const MAX_ANGLE = Math.PI / 3;
const COUNT = 20;

class Gradient {

    /**
     * @param {CanvasRenderingContext2D} context
     * @param {Number} cx
     * @param {Number} cy
     */
    constructor (context, cx, cy) {
        this.context = context;
        this.cx = cx;
        this.cy = cy;
    }

    setFillStyle(r1, c1, r2, c2) {
        const grd1 = this.context.createRadialGradient(this.cx, this.cy, r1, this.cx, this.cy, r2);
        grd1.addColorStop(0, c1);
        grd1.addColorStop(1, c2);
        this.context.fillStyle = grd1;
    }
}

class App {

    constructor () {
        /** @type {HTMLCanvasElement} */
        this.canvas = document.createElement("canvas");
        /** @type {HTMLElement} */
        this.msg = document.getElementById("msg");
        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.canvas.getContext("2d");

        document.body.appendChild(this.canvas);

        window.addEventListener("keydown", event => {
            if (!this.isSpacePressed && event.key === " ") {
                this.isSpacePressed = true;
                this.msg.style.display = "none";
            }
        });
        window.addEventListener("keyup", event => {
            if (this.isSpacePressed && event.key === " ") {
                this.isSpacePressed = false;
            }
        });

        this.reset();

        this.updateFn = this.update.bind(this);
        this.update();
    }

    reset() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.setAttribute("width", this.width);
        this.canvas.setAttribute("height", this.height);

        this.cx = Math.floor(this.width / 2);
        this.cy = Math.floor(this.height / 2);
        this.gradient = new Gradient(this.ctx, this.cx, this.cy);

        this.ctx.clearRect(0, 0, this.width, this.height);

        // sink drain
        this.drawSinkDrain();
    }

    update() {
        requestAnimationFrame(this.updateFn);

        if (!this.isSpacePressed) {
            return;
        }

        const ctx = this.ctx;

        ctx.strokeStyle = "#101010";
        ctx.lineWidth = 0.6;

        for (let i = 0; i < COUNT; i++) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            const radius = MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS);
            const startAngle = Math.random() * TAU;
            const angle = MIN_ANGLE + (MAX_ANGLE - MIN_ANGLE) * ((MAX_RADIUS - radius) / (MAX_RADIUS - MIN_RADIUS));
            const endAngle = startAngle + angle;

            ctx.beginPath();
            ctx.arc(x, y, radius, startAngle, endAngle);
            ctx.stroke();
        }
    }

    drawSinkDrain() {
        const ctx = this.ctx;
        const cx = this.cx;
        const cy = this.cy;

        const HOLE_SIZE = 17;
        const HOLE_DISTANCE = 48;

        this.drawConcentricRings(
            [HOLE_SIZE, "#464944", "#333633"],
            [70, "#3d3a34", "#605c52"],
            [90, "#605b51", "#3d3a34"],
            [125, "#57544a", "#8f8f82"],
            [128, "#767365", "#8f8f82"],
        );

        this.ctx.fillStyle = "#51524a";
        ctx.beginPath();
        const SCREW_ROT = -Math.PI / 8;
        ctx.arc(this.cx, this.cy, HOLE_SIZE - 1, SCREW_ROT, SCREW_ROT + Math.PI / 8);
        ctx.arc(this.cx, this.cy, HOLE_SIZE - 1, SCREW_ROT + Math.PI, SCREW_ROT + Math.PI + Math.PI / 8);
        ctx.fill();

        // holes
        for (let i = 0; i < 6; i++) {
            const holeX = cx + Math.cos(i * TAU / 6) * HOLE_DISTANCE;
            const holeY = cy + Math.sin(i * TAU / 6) * HOLE_DISTANCE;

            ctx.fillStyle = "#1b1a17";
            ctx.beginPath();
            ctx.arc(holeX, holeY, HOLE_SIZE, 0, TAU);
            ctx.fill();
        }
    }

    drawConcentricRings(...rings) {
        for (let i = rings.length - 1; i >= 0; i--) {
            const outerRadius = rings[i][0];
            const innerRadius = i > 0 ? rings[i - 1][0] : 0;
            const c1 = rings[i][1];
            const c2 = rings[i][2];

            this.gradient.setFillStyle(innerRadius, c1, outerRadius, c2);
            this.ctx.beginPath();
            this.ctx.arc(this.cx, this.cy, outerRadius, 0, TAU);
            this.ctx.fill();
        }
    }
}

window.addEventListener("load", () => new App());
