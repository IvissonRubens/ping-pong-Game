document.addEventListener('DOMContentLoaded', function() {

    const canvasEl = document.querySelector("canvas");
    const canvasCtx = canvasEl.getContext("2d");

    const LineWidth = 15;
    const gapX = 10;
    let score = { left: 0, right: 0 }; // Contagem de pontos
    let gamePaused = false; // Flag para controlar se o jogo está pausado

    const field = {
        w: window.innerWidth,
        h: window.innerHeight,
        draw: function() {
            // DESENHO DE CAMPO
            canvasCtx.fillStyle = "rgb(19, 100, 44)";
            canvasCtx.fillRect(0, 0, this.w, this.h);
        },
    }

    const line = {
        w: 15,
        h: field.h,
        draw: function() {
            // DESENHO DA LINHA DIVISORIA
            canvasCtx.fillStyle = "rgb(255, 255, 255)";
            canvasCtx.fillRect(
                window.innerWidth / 2 - LineWidth / 2, 
                0,
                this.w,
                this.h
            );
        }
    }

    const leftPaddle = {
        x: 0,
        y: field.h / 2,
        w: line.w,
        h: 100,
        _move: function () {
            this.y = ball.y
        },
        draw: function() {
            // DESENHO DAS RAQUETES (esquerda)
            canvasCtx.fillStyle = "rgb(255, 255, 198)";
            canvasCtx.fillRect(this.x, this.y, LineWidth, 100);

            this._move();
        }
    }

    const rightPaddle = {
        x: field.w - line.w - gapX,
        y: field.h / 2,
        w: line.w,
        h: 100,
        _move: function () {
            this.y = mouse.y
        },
        draw: function() {
            // DESENHO DAS RAQUETES (direita)
            canvasCtx.fillStyle = "rgb(255, 255, 198)";
            canvasCtx.fillRect(this.x, this.y, this.w, this.h);
        
            this._move();
        },
    };

    const ball = {
        x: field.h / 2,
        y: field.h / 2,
        r: 16,
        speed: 10,
        directionX: 1,
        directionY: 1,
        _move: function() {
            this.x += this.directionX * this.speed;
            this.y += this.directionY * this.speed;
        },
        _calcPosition: function() {
            if (this.y > field.h || this.y < 0) {
                this._reverseY();
            }
            if (this.x > field.w) {
                score.left++; // Incrementa o ponto para a esquerda
                this.speed++; // Aumenta a velocidade da bola
                this.reset();
            } else if (this.x < 0) {
                score.right++; // Incrementa o ponto para a direita
                this.speed++; // Aumenta a velocidade da bola
                this.reset();
            }
        },
        _reverseX: function () {
            this.directionX *= -1;
        },
        _reverseY: function () {
            this.directionY *= -1;
        },
        reset: function() {
            this.x = field.w / 2;
            this.y = field.h / 2;
        },
        draw: function() {
            // DESENHO DA BOLA
            canvasCtx.fillStyle = "rgb(255, 255, 0)";
            canvasCtx.beginPath();
            canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
            canvasCtx.fill();

            this._move();
            this._calcPosition();
            // Detecta colisão com as raquetes
            if (
                this.x < leftPaddle.x + leftPaddle.w &&
                this.x + this.r > leftPaddle.x &&
                this.y < leftPaddle.y + leftPaddle.h &&
                this.y + this.r > leftPaddle.y
            ) {
                this._reverseX();
            } else if (
                this.x < rightPaddle.x + rightPaddle.w &&
                this.x + this.r > rightPaddle.x &&
                this.y < rightPaddle.y + rightPaddle.h &&
                this.y + this.r > rightPaddle.y
            ) {
                this._reverseX();
            }
        }
        
    }
    
    const mouse = {};

    function setup() {
        canvasEl.width = window.innerWidth;
        canvasEl.height = window.innerHeight;
    }  

    function draw() {
        field.draw();
        line.draw();

        leftPaddle.draw();
        rightPaddle.draw();

        ball.draw();
        // Desenha a contagem de pontos
        canvasCtx.fillStyle = "white";
        canvasCtx.font = "30px Arial";
        canvasCtx.fillText("Left: " + score.left, 20, 50);
        canvasCtx.fillText("Right: " + score.right, field.w - 150, 50);
    }

    window.animateFrame = (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            return window.setTimeout(callback, 1000 / 60);
        }
    );

    function main() {
        if (!gamePaused) {
            animateFrame(main);
            draw();
        }
    }

    setup();
    main();

    canvasEl.addEventListener('mousemove', function(e) {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
    });

    // Adicionando evento de teclado para pausar o jogo
    document.addEventListener('keydown', function(event) {
        if (event.key === 'p') {
            gamePaused = !gamePaused; // Alterna entre pausado e não pausado
            if (!gamePaused) {
                main(); // Retoma o jogo se não estiver pausado
            }
        }
    });

});