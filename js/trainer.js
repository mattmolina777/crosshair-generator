/* =========================================================
   CROSSHAIR GENERATOR V3
   AIM TRAINER - GRIDSHOT

   A mira criada no editor acompanha o mouse
   dentro da arena.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const trainerCard =
        document.querySelector(".trainer-card");

    const arena =
        document.getElementById("trainerArena");

    const startScreen =
        document.getElementById("trainerStartScreen");

    const startButton =
        document.getElementById("startTrainerButton");

    const countdown =
        document.getElementById("trainerCountdown");

    const targetsLayer =
        document.getElementById("targetsLayer");

    const statusText =
        document.getElementById("trainerStatusText");

    const scoreElement =
        document.getElementById("trainerScore");

    const hitsElement =
        document.getElementById("trainerHits");

    const missesElement =
        document.getElementById("trainerMisses");

    const accuracyElement =
        document.getElementById("trainerAccuracy");

    const timeElement =
        document.getElementById("trainerTime");

    const comboElement =
        document.getElementById("trainerCombo");

    const resultScreen =
        document.getElementById("trainerResult");

    const resultScore =
        document.getElementById("resultScore");

    const resultHits =
        document.getElementById("resultHits");

    const resultMisses =
        document.getElementById("resultMisses");

    const resultAccuracy =
        document.getElementById("resultAccuracy");

    const resultCombo =
        document.getElementById("resultCombo");

    const restartButton =
        document.getElementById("restartTrainerButton");

    const fullscreenButton =
        document.getElementById("fullscreenTrainerButton");


    /* =====================================================
       MIRA
    ===================================================== */

    const trainerCrosshairWrapper =
        document.getElementById("trainerCrosshairWrapper");

    const trainerCrosshair =
        document.getElementById("trainerCrosshair");

    const trainerCrosshairDot =
        document.getElementById("trainerCrosshairDot");


    const trainerTop =
        trainerCrosshair
            ? trainerCrosshair.querySelector(".trainer-top")
            : null;

    const trainerBottom =
        trainerCrosshair
            ? trainerCrosshair.querySelector(".trainer-bottom")
            : null;

    const trainerLeft =
        trainerCrosshair
            ? trainerCrosshair.querySelector(".trainer-left")
            : null;

    const trainerRight =
        trainerCrosshair
            ? trainerCrosshair.querySelector(".trainer-right")
            : null;


    /* =====================================================
       CONTROLES DO EDITOR
    ===================================================== */

    const editor = {

        color:
            document.getElementById("crosshairColor"),

        size:
            document.getElementById("crosshairSize"),

        thickness:
            document.getElementById("crosshairThickness"),

        gap:
            document.getElementById("crosshairGap"),

        alpha:
            document.getElementById("crosshairAlpha"),

        dot:
            document.getElementById("crosshairDotToggle"),

        dotSize:
            document.getElementById("dotSize"),

        outline:
            document.getElementById("crosshairOutlineToggle"),

        outlineThickness:
            document.getElementById("outlineThickness"),

        style:
            document.getElementById("crosshairStyle"),

        fixedGap:
            document.getElementById("fixedGap")

    };


    /* =====================================================
       CONFIGURAÇÃO
    ===================================================== */

    const GAME_DURATION = 30;

    const TARGET_COUNT = 3;

    const TARGET_SIZE = 72;

    const TARGET_PADDING = 45;


    /* =====================================================
       ESTADO
    ===================================================== */

    let gameRunning = false;

    let score = 0;

    let hits = 0;

    let misses = 0;

    let combo = 0;

    let bestCombo = 0;

    let timeLeft =
        GAME_DURATION;

    let animationFrame =
        null;

    let lastFrameTime =
        0;


    /*
        Posição atual da mira dentro da arena.
    */

    let aimX = 0;

    let aimY = 0;


    /* =====================================================
       VERIFICAÇÃO
    ===================================================== */

    if (
        !arena ||
        !trainerCrosshairWrapper ||
        !trainerCrosshair ||
        !targetsLayer
    ) {

        console.error(
            "Aim Trainer: elementos necessários não encontrados."
        );

        return;

    }


    /* =====================================================
       PEGAR MIRA CRIADA PELO PLAYER
    ===================================================== */

    function getPlayerCrosshair() {

        const color =
            editor.color
                ? editor.color.value
                : "#FFFFFF";


        const size =
            editor.size
                ? Number(editor.size.value)
                : 5;


        const thickness =
            editor.thickness
                ? Number(editor.thickness.value)
                : 1;


        const gap =
            editor.gap
                ? Number(editor.gap.value)
                : -2;


        const alpha =
            editor.alpha
                ? Number(editor.alpha.value)
                : 255;


        const dot =
            editor.dot
                ? editor.dot.checked
                : true;


        const dotSize =
            editor.dotSize
                ? Number(editor.dotSize.value)
                : 2;


        const outline =
            editor.outline
                ? editor.outline.checked
                : false;


        const outlineThickness =
            editor.outlineThickness
                ? Number(editor.outlineThickness.value)
                : 1;


        return {

            color,
            size,
            thickness,
            gap,
            alpha,
            dot,
            dotSize,
            outline,
            outlineThickness

        };

    }


    /* =====================================================
       SINCRONIZAR MIRA COM O EDITOR

       Mesma conversão visual usada no app.js.
    ===================================================== */

    function syncCrosshair() {

        const crosshair =
            getPlayerCrosshair();


        const visualSize =
            Math.max(
                0,
                crosshair.size * 4
            );


        const visualThickness =
            Math.max(
                1,
                crosshair.thickness * 2
            );


        const visualGap =
            Math.max(
                0,
                (crosshair.gap + 30) * 0.55
            );


        const opacity =
            crosshair.alpha / 255;


        const shadow =
            crosshair.outline

                ? `0 0 0 ${Math.max(
                    1,
                    crosshair.outlineThickness
                )}px #000`

                : "none";


        const lines = [

            trainerTop,
            trainerBottom,
            trainerLeft,
            trainerRight

        ];


        lines.forEach(line => {

            if (!line) {
                return;
            }


            line.style.position =
                "absolute";


            line.style.background =
                crosshair.color;


            line.style.opacity =
                opacity;


            line.style.boxShadow =
                shadow;


            line.style.display =
                visualSize === 0
                    ? "none"
                    : "block";

        });


        /* CIMA */

        if (trainerTop) {

            trainerTop.style.width =
                `${visualThickness}px`;

            trainerTop.style.height =
                `${visualSize}px`;

            trainerTop.style.left =
                `${-(visualThickness / 2)}px`;

            trainerTop.style.bottom =
                `${visualGap}px`;

        }


        /* BAIXO */

        if (trainerBottom) {

            trainerBottom.style.width =
                `${visualThickness}px`;

            trainerBottom.style.height =
                `${visualSize}px`;

            trainerBottom.style.left =
                `${-(visualThickness / 2)}px`;

            trainerBottom.style.top =
                `${visualGap}px`;

        }


        /* ESQUERDA */

        if (trainerLeft) {

            trainerLeft.style.width =
                `${visualSize}px`;

            trainerLeft.style.height =
                `${visualThickness}px`;

            trainerLeft.style.right =
                `${visualGap}px`;

            trainerLeft.style.top =
                `${-(visualThickness / 2)}px`;

        }


        /* DIREITA */

        if (trainerRight) {

            trainerRight.style.width =
                `${visualSize}px`;

            trainerRight.style.height =
                `${visualThickness}px`;

            trainerRight.style.left =
                `${visualGap}px`;

            trainerRight.style.top =
                `${-(visualThickness / 2)}px`;

        }


        /* DOT */

        if (trainerCrosshairDot) {

            if (crosshair.dot) {

                trainerCrosshairDot.style.display =
                    "block";


                trainerCrosshairDot.style.width =
                    `${crosshair.dotSize}px`;


                trainerCrosshairDot.style.height =
                    `${crosshair.dotSize}px`;


                trainerCrosshairDot.style.background =
                    crosshair.color;


                trainerCrosshairDot.style.opacity =
                    opacity;


                trainerCrosshairDot.style.boxShadow =
                    shadow;

            } else {

                trainerCrosshairDot.style.display =
                    "none";

            }

        }

    }


    /* =====================================================
       ATUALIZAR MIRA QUANDO EDITOR MUDAR
    ===================================================== */

    const editorControls = [

        editor.color,
        editor.size,
        editor.thickness,
        editor.gap,
        editor.alpha,
        editor.dot,
        editor.dotSize,
        editor.outline,
        editor.outlineThickness

    ];


    editorControls.forEach(control => {

        if (!control) {
            return;
        }


        control.addEventListener(
            "input",
            syncCrosshair
        );


        control.addEventListener(
            "change",
            syncCrosshair
        );

    });


    /* =====================================================
       BOTÕES QUE ALTERAM A MIRA
    ===================================================== */

    const specialButtons = [

        document.getElementById("randomButton"),

        document.getElementById("resetButton"),

        document.getElementById("importButton"),

        ...document.querySelectorAll(".preset-card"),

        ...document.querySelectorAll(".quick-color")

    ];


    specialButtons.forEach(button => {

        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            () => {

                requestAnimationFrame(
                    syncCrosshair
                );

            }
        );

    });


    /* =====================================================
       POSICIONAR MIRA
    ===================================================== */

    function setAimPosition(x, y) {

        aimX = x;

        aimY = y;


        trainerCrosshairWrapper.style.left =
            `${aimX}px`;


        trainerCrosshairWrapper.style.top =
            `${aimY}px`;


        trainerCrosshairWrapper.style.right =
            "auto";


        trainerCrosshairWrapper.style.bottom =
            "auto";


        trainerCrosshairWrapper.style.transform =
            "translate(-50%, -50%)";

    }


    /* =====================================================
       CENTRALIZAR MIRA
    ===================================================== */

    function centerCrosshair() {

        const width =
            arena.clientWidth;


        const height =
            arena.clientHeight;


        setAimPosition(
            width / 2,
            height / 2
        );

    }


    /* =====================================================
       MOVER MIRA COM O MOUSE
    ===================================================== */

    arena.addEventListener(
        "mousemove",
        event => {

            if (!gameRunning) {
                return;
            }


            const rect =
                arena.getBoundingClientRect();


            /*
                Posição real do mouse
                dentro da arena.
            */

            const x =
                event.clientX -
                rect.left;


            const y =
                event.clientY -
                rect.top;


            setAimPosition(
                x,
                y
            );

        }
    );


    /* =====================================================
       ESCONDER CURSOR NORMAL
    ===================================================== */

    arena.addEventListener(
        "mouseenter",
        () => {

            if (gameRunning) {

                arena.style.cursor =
                    "none";

            }

        }
    );


    arena.addEventListener(
        "mouseleave",
        () => {

            arena.style.cursor =
                "default";

        }
    );


    /* =====================================================
       ACCURACY
    ===================================================== */

    function calculateAccuracy() {

        const shots =
            hits + misses;


        if (shots === 0) {

            return 100;

        }


        return Math.round(
            (hits / shots) * 100
        );

    }


    /* =====================================================
       HUD
    ===================================================== */

    function updateHUD() {

        if (scoreElement) {

            scoreElement.textContent =
                score.toLocaleString("pt-BR");

        }


        if (hitsElement) {

            hitsElement.textContent =
                hits;

        }


        if (missesElement) {

            missesElement.textContent =
                misses;

        }


        if (accuracyElement) {

            accuracyElement.textContent =
                `${calculateAccuracy()}%`;

        }

    }


    /* =====================================================
       COMBO
    ===================================================== */

    function updateCombo() {

        if (!comboElement) {
            return;
        }


        if (combo < 2) {

            comboElement.classList.add(
                "hidden"
            );

            return;

        }


        comboElement.textContent =
            `${combo}X COMBO`;


        comboElement.classList.remove(
            "hidden"
        );

    }


    /* =====================================================
       RESET
    ===================================================== */

    function resetGame() {

        gameRunning =
            false;

        score =
            0;

        hits =
            0;

        misses =
            0;

        combo =
            0;

        bestCombo =
            0;

        timeLeft =
            GAME_DURATION;


        if (animationFrame) {

            cancelAnimationFrame(
                animationFrame
            );

            animationFrame =
                null;

        }


        if (scoreElement) {

            scoreElement.textContent =
                "0";

        }


        if (hitsElement) {

            hitsElement.textContent =
                "0";

        }


        if (missesElement) {

            missesElement.textContent =
                "0";

        }


        if (accuracyElement) {

            accuracyElement.textContent =
                "100%";

        }


        if (timeElement) {

            timeElement.textContent =
                GAME_DURATION.toFixed(1);

        }


        if (comboElement) {

            comboElement.classList.add(
                "hidden"
            );

        }


        if (resultScreen) {

            resultScreen.classList.add(
                "hidden"
            );

        }


        targetsLayer.innerHTML =
            "";


        arena.style.cursor =
            "default";


        if (trainerCard) {

            trainerCard.classList.remove(
                "playing"
            );

        }


        if (statusText) {

            statusText.textContent =
                "AGUARDANDO";

        }


        syncCrosshair();

        centerCrosshair();

    }


    /* =====================================================
       POSIÇÃO ALEATÓRIA DO ALVO
    ===================================================== */

    function randomTargetPosition() {

        const width =
            arena.clientWidth;


        const height =
            arena.clientHeight;


        const minX =
            TARGET_PADDING;


        const maxX =
            Math.max(
                minX,
                width -
                TARGET_SIZE -
                TARGET_PADDING
            );


        const minY =
            TARGET_PADDING;


        const maxY =
            Math.max(
                minY,
                height -
                TARGET_SIZE -
                TARGET_PADDING
            );


        return {

            x:
                minX +
                Math.random() *
                (maxX - minX),

            y:
                minY +
                Math.random() *
                (maxY - minY)

        };

    }


    /* =====================================================
       CRIAR ALVO
    ===================================================== */

    function createTarget() {

        if (!gameRunning) {
            return;
        }


        const target =
            document.createElement(
                "div"
            );


        target.className =
            "aim-target";


        const position =
            randomTargetPosition();


        target.style.left =
            `${position.x}px`;


        target.style.top =
            `${position.y}px`;


        /*
            A detecção será feita pela posição
            da mira, não pelo clique no elemento.
        */

        target.style.pointerEvents =
            "none";


        targetsLayer.appendChild(
            target
        );

    }


    /* =====================================================
       CRIAR ALVOS
    ===================================================== */

    function createInitialTargets() {

        targetsLayer.innerHTML =
            "";


        for (
            let i = 0;
            i < TARGET_COUNT;
            i++
        ) {

            createTarget();

        }

    }


    /* =====================================================
       ENCONTRAR ALVO SOB A MIRA
    ===================================================== */

    function findTargetUnderCrosshair() {

        /*
            Converte a posição da mira para
            coordenadas da tela.
        */

        const arenaRect =
            arena.getBoundingClientRect();


        const crosshairX =
            arenaRect.left +
            aimX;


        const crosshairY =
            arenaRect.top +
            aimY;


        const targets =
            targetsLayer.querySelectorAll(
                ".aim-target"
            );


        let hitTarget =
            null;


        targets.forEach(target => {

            if (hitTarget) {
                return;
            }


            const rect =
                target.getBoundingClientRect();


            const centerX =
                rect.left +
                rect.width / 2;


            const centerY =
                rect.top +
                rect.height / 2;


            const deltaX =
                crosshairX -
                centerX;


            const deltaY =
                crosshairY -
                centerY;


            const distance =
                Math.sqrt(
                    deltaX * deltaX +
                    deltaY * deltaY
                );


            const radius =
                rect.width / 2;


            if (
                distance <= radius
            ) {

                hitTarget =
                    target;

            }

        });


        return hitTarget;

    }


    /* =====================================================
       HIT
    ===================================================== */

    function registerHit(target) {

        hits++;

        combo++;


        if (
            combo > bestCombo
        ) {

            bestCombo =
                combo;

        }


        const comboBonus =
            Math.min(
                combo * 5,
                100
            );


        score +=
            100 +
            comboBonus;


        createHitmarker();


        target.remove();


        createTarget();


        updateHUD();

        updateCombo();

    }


    /* =====================================================
       MISS
    ===================================================== */

    function registerMiss() {

        misses++;

        combo =
            0;


        updateHUD();

        updateCombo();

    }


    /* =====================================================
       ATIRAR
    ===================================================== */

    function shoot() {

        if (!gameRunning) {
            return;
        }


        const target =
            findTargetUnderCrosshair();


        if (target) {

            registerHit(
                target
            );

        } else {

            registerMiss();

        }


        createShotEffect();

    }


    /* =====================================================
       CLIQUE ESQUERDO = TIRO
    ===================================================== */

    arena.addEventListener(
        "mousedown",
        event => {

            if (
                !gameRunning ||
                event.button !== 0
            ) {

                return;

            }


            /*
                Atualiza a posição uma última vez
                exatamente no ponto clicado.
            */

            const rect =
                arena.getBoundingClientRect();


            setAimPosition(

                event.clientX -
                rect.left,

                event.clientY -
                rect.top

            );


            shoot();

        }
    );


    /* =====================================================
       HITMARKER
    ===================================================== */

    function createHitmarker() {

        const hitmarker =
            document.createElement(
                "div"
            );


        hitmarker.className =
            "fps-hitmarker";


        /*
            Hitmarker aparece onde a mira está.
        */

        hitmarker.style.left =
            `${aimX}px`;


        hitmarker.style.top =
            `${aimY}px`;


        hitmarker.innerHTML = `
            <span class="hit-line hit-1"></span>
            <span class="hit-line hit-2"></span>
            <span class="hit-line hit-3"></span>
            <span class="hit-line hit-4"></span>
        `;


        arena.appendChild(
            hitmarker
        );


        requestAnimationFrame(
            () => {

                hitmarker.classList.add(
                    "show"
                );

            }
        );


        setTimeout(
            () => {

                hitmarker.remove();

            },
            160
        );

    }


    /* =====================================================
       EFEITO DO DISPARO
    ===================================================== */

    function createShotEffect() {

        trainerCrosshair.style.transform =
            "scale(1.18)";


        setTimeout(
            () => {

                trainerCrosshair.style.transform =
                    "scale(1)";

            },
            55
        );

    }


    /* =====================================================
       COUNTDOWN
    ===================================================== */

    function startCountdown() {

        if (!countdown) {

            beginGame();

            return;

        }


        countdown.classList.remove(
            "hidden"
        );


        let number =
            3;


        countdown.textContent =
            "3";


        const timer =
            setInterval(
                () => {

                    number--;


                    if (
                        number > 0
                    ) {

                        countdown.textContent =
                            number;

                        return;

                    }


                    if (
                        number === 0
                    ) {

                        countdown.textContent =
                            "GO!";

                        return;

                    }


                    clearInterval(
                        timer
                    );


                    countdown.classList.add(
                        "hidden"
                    );


                    beginGame();

                },
                700
            );

    }


    /* =====================================================
       PREPARAR PARTIDA
    ===================================================== */

    function prepareGame() {

        if (gameRunning) {
            return;
        }


        resetGame();


        /*
            Pega novamente a mira que o
            jogador acabou de criar.
        */

        syncCrosshair();

        centerCrosshair();


        if (startScreen) {

            startScreen.classList.add(
                "hidden"
            );

        }


        if (resultScreen) {

            resultScreen.classList.add(
                "hidden"
            );

        }


        startCountdown();

    }


    /* =====================================================
       COMEÇAR PARTIDA
    ===================================================== */

    function beginGame() {

        syncCrosshair();

        centerCrosshair();


        gameRunning =
            true;


        if (trainerCard) {

            trainerCard.classList.add(
                "playing"
            );

        }


        arena.style.cursor =
            "none";


        if (statusText) {

            statusText.textContent =
                "AO VIVO";

        }


        createInitialTargets();


        timeLeft =
            GAME_DURATION;


        lastFrameTime =
            performance.now();


        animationFrame =
            requestAnimationFrame(
                updateTimer
            );

    }


    /* =====================================================
       TIMER
    ===================================================== */

    function updateTimer(timestamp) {

        if (!gameRunning) {
            return;
        }


        const delta =
            (
                timestamp -
                lastFrameTime
            ) / 1000;


        lastFrameTime =
            timestamp;


        timeLeft -=
            delta;


        if (
            timeLeft <= 0
        ) {

            timeLeft =
                0;


            if (timeElement) {

                timeElement.textContent =
                    "0.0";

            }


            finishGame();

            return;

        }


        if (timeElement) {

            timeElement.textContent =
                timeLeft.toFixed(1);

        }


        animationFrame =
            requestAnimationFrame(
                updateTimer
            );

    }


    /* =====================================================
       FINALIZAR
    ===================================================== */

    function finishGame() {

        gameRunning =
            false;


        if (animationFrame) {

            cancelAnimationFrame(
                animationFrame
            );

            animationFrame =
                null;

        }


        arena.style.cursor =
            "default";


        if (trainerCard) {

            trainerCard.classList.remove(
                "playing"
            );

        }


        targetsLayer.innerHTML =
            "";


        if (comboElement) {

            comboElement.classList.add(
                "hidden"
            );

        }


        if (statusText) {

            statusText.textContent =
                "FINALIZADO";

        }


        if (resultScore) {

            resultScore.textContent =
                score.toLocaleString(
                    "pt-BR"
                );

        }


        if (resultHits) {

            resultHits.textContent =
                hits;

        }


        if (resultMisses) {

            resultMisses.textContent =
                misses;

        }


        if (resultAccuracy) {

            resultAccuracy.textContent =
                `${calculateAccuracy()}%`;

        }


        if (resultCombo) {

            resultCombo.textContent =
                `${bestCombo}X`;

        }


        if (resultScreen) {

            resultScreen.classList.remove(
                "hidden"
            );

        }

    }


    /* =====================================================
       INICIAR
    ===================================================== */

    if (startButton) {

        startButton.addEventListener(
            "click",
            prepareGame
        );

    }


    /* =====================================================
       JOGAR NOVAMENTE
    ===================================================== */

    if (restartButton) {

        restartButton.addEventListener(
            "click",
            prepareGame
        );

    }


    /* =====================================================
       FULLSCREEN
    ===================================================== */

    if (fullscreenButton) {

        fullscreenButton.addEventListener(
            "click",
            async () => {

                try {

                    if (
                        !document.fullscreenElement
                    ) {

                        await trainerCard
                            .requestFullscreen();

                    } else {

                        await document
                            .exitFullscreen();

                    }

                } catch (error) {

                    console.error(
                        "Erro ao abrir tela cheia:",
                        error
                    );

                }

            }
        );

    }


    /* =====================================================
       TEXTO FULLSCREEN
    ===================================================== */

    document.addEventListener(
        "fullscreenchange",
        () => {

            if (!fullscreenButton) {
                return;
            }


            fullscreenButton.textContent =
                document.fullscreenElement

                    ? "✕ SAIR DA TELA CHEIA"

                    : "⛶ TELA CHEIA";

        }
    );


    /* =====================================================
       REDIMENSIONAMENTO
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (!gameRunning) {

                centerCrosshair();

            }

        }
    );


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    syncCrosshair();

    resetGame();

});
