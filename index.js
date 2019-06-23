
class App {

    constructor () {
        /** @type {HTMLCanvasElement} */
        this.canvas = document.createElement("canvas");
        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);

        window.addEventListener("resize", this.resize.bind(this));
        this.resize();

        // this.updateFn = this.update.bind(this);
        this.update();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.setAttribute("width", this.width);
        this.canvas.setAttribute("height", this.height);

        this.update();
    }

    update() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.strokeStyle = "#101010";
        ctx.lineWidth = 0.5;

        const MIN_RADIUS = 20;
        const MAX_RADIUS = 55;
        const MIN_ANGLE = Math.PI / 4;
        const MAX_ANGLE = Math.PI / 3;
        const TAU = Math.PI * 2;
        const COUNT = 20000;

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

        // requestAnimationFrame(this.updateFn);
    }
}

new App();
