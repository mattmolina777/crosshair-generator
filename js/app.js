const $ = (id) => document.getElementById(id);


/* =========================================================
   ELEMENTOS
   ========================================================= */

const el = {

    color: $("crosshairColor"),
    hex: $("hexInput"),

    red: $("redInput"),
    green: $("greenInput"),
    blue: $("blueInput"),

    size: $("crosshairSize"),
    sizeNumber: $("sizeNumber"),

    thickness: $("crosshairThickness"),
    thicknessNumber: $("thicknessNumber"),

    gap: $("crosshairGap"),
    gapNumber: $("gapNumber"),

    alpha: $("crosshairAlpha"),
    alphaNumber: $("alphaNumber"),

    dot: $("crosshairDotToggle"),

    dotSize: $("dotSize"),
    dotSizeNumber: $("dotSizeNumber"),

    outline: $("crosshairOutlineToggle"),

    outlineThickness: $("outlineThickness"),
    outlineNumber: $("outlineNumber"),

    style: $("crosshairStyle"),

    fixedGap: $("fixedGap"),
    fixedGapNumber: $("fixedGapNumber"),

    code: $("crosshairCode"),

    preview: $("previewArea"),
    wrapper: $("crosshairWrapper"),

    dotElement: $("crosshairDot"),

    colorValue: $("colorValue"),

    copy: $("copyButton"),

    reset: $("resetButton"),

    random: $("randomButton"),

    importInput: $("importInput"),
    importButton: $("importButton"),
    importMessage: $("importMessage"),

    zoomLabel: $("zoomLabel"),

    /* RESOLUÇÃO */

    gameResolution: $("gameResolution"),

    customResolution: $("customResolution"),

    customResolutionWidth:
        $("customResolutionWidth"),

    customResolutionHeight:
        $("customResolutionHeight"),

    resolutionPreviewLabel:
        $("resolutionPreviewLabel")
};


const lines =
    document.querySelectorAll(
        ".crosshair-line"
    );


/* =========================================================
   UTILIDADES
   ========================================================= */

function clamp(value, min, max) {

    value = Number(value);

    if (Number.isNaN(value)) {
        return min;
    }

    return Math.min(
        Math.max(value, min),
        max
    );

}


function componentToHex(value) {

    return clamp(value, 0, 255)
        .toString(16)
        .padStart(2, "0")
        .toUpperCase();

}


function rgbToHex(r, g, b) {

    return (
        "#" +
        componentToHex(r) +
        componentToHex(g) +
        componentToHex(b)
    );

}


function hexToRgb(hex) {

    const value =
        hex.replace("#", "");

    if (
        !/^[0-9A-Fa-f]{6}$/.test(value)
    ) {
        return null;
    }

    return {

        r: parseInt(
            value.slice(0, 2),
            16
        ),

        g: parseInt(
            value.slice(2, 4),
            16
        ),

        b: parseInt(
            value.slice(4, 6),
            16
        )

    };

}


/* =========================================================
   COR
   ========================================================= */

function setColor(hex) {

    const rgb =
        hexToRgb(hex);

    if (!rgb) {
        return;
    }

    const normalized =
        rgbToHex(
            rgb.r,
            rgb.g,
            rgb.b
        );

    el.color.value =
        normalized;

    el.hex.value =
        normalized;

    el.red.value =
        rgb.r;

    el.green.value =
        rgb.g;

    el.blue.value =
        rgb.b;

}


/* =========================================================
   SINCRONIZA RANGE + NUMBER
   ========================================================= */

function syncPair(range, number) {

    if (!range || !number) {
        return;
    }

    range.addEventListener(
        "input",
        () => {

            number.value =
                range.value;

            update();

        }
    );


    number.addEventListener(
        "input",
        () => {

            const min =
                Number(number.min);

            const max =
                Number(number.max);

            const value =
                clamp(
                    number.value,
                    min,
                    max
                );

            range.value =
                value;

            number.value =
                value;

            update();

        }
    );

}


syncPair(
    el.size,
    el.sizeNumber
);

syncPair(
    el.thickness,
    el.thicknessNumber
);

syncPair(
    el.gap,
    el.gapNumber
);

syncPair(
    el.alpha,
    el.alphaNumber
);

syncPair(
    el.dotSize,
    el.dotSizeNumber
);

syncPair(
    el.outlineThickness,
    el.outlineNumber
);

syncPair(
    el.fixedGap,
    el.fixedGapNumber
);


/* =========================================================
   RESOLUÇÃO DO JOGO
   ========================================================= */

/*
    IMPORTANTE:

    A resolução NÃO altera o comando do FiveM.

    Ela existe para calibrarmos o PREVIEW
    de acordo com a resolução usada pelo jogador.

    Neste momento todos os fatores estão em 1.

    Quando fizermos os testes reais no FiveM,
    alteraremos somente esses fatores.
*/

const resolutionProfiles = {

    "1280x720": 1,

    "1366x768": 1,

    "1600x900": 1,

    "1920x1080": 1,

    "2560x1440": 1,

    "3840x2160": 1,

    "custom": 1

};


/* =========================================================
   PEGAR RESOLUÇÃO SELECIONADA
   ========================================================= */

function getSelectedResolution() {

    /*
        Segurança para caso o HTML antigo
        ainda esteja sendo usado.
    */

    if (!el.gameResolution) {

        return {

            key:
                "1920x1080",

            width:
                1920,

            height:
                1080,

            factor:
                1

        };

    }


    const selected =
        el.gameResolution.value;


    /*
        RESOLUÇÃO PERSONALIZADA
    */

    if (
        selected === "custom"
    ) {

        const width =
            clamp(
                el.customResolutionWidth
                    ? el.customResolutionWidth.value
                    : 1920,
                640,
                7680
            );


        const height =
            clamp(
                el.customResolutionHeight
                    ? el.customResolutionHeight.value
                    : 1080,
                480,
                4320
            );


        return {

            key:
                "custom",

            width,

            height,

            factor:
                resolutionProfiles.custom

        };

    }


    /*
        RESOLUÇÕES PRÉ-DEFINIDAS
    */

    const parts =
        selected.split("x");


    const width =
        Number(parts[0]);


    const height =
        Number(parts[1]);


    return {

        key:
            selected,

        width,

        height,

        factor:
            resolutionProfiles[selected] ?? 1

    };

}


/* =========================================================
   ATUALIZAR INFORMAÇÕES DE RESOLUÇÃO
   ========================================================= */

function updateResolutionUI() {

    if (!el.gameResolution) {
        return;
    }


    const isCustom =
        el.gameResolution.value ===
        "custom";


    /*
        MOSTRAR / ESCONDER CAMPOS
        DE RESOLUÇÃO PERSONALIZADA
    */

    if (el.customResolution) {

        el.customResolution
            .classList
            .toggle(
                "hidden",
                !isCustom
            );

    }


    const resolution =
        getSelectedResolution();


    /*
        TEXTO ABAIXO DO PREVIEW
    */

    if (
        el.resolutionPreviewLabel
    ) {

        el.resolutionPreviewLabel
            .textContent =
            `PREVIEW • ${resolution.width}×${resolution.height}`;

    }


    update();

}


/* =========================================================
   EVENTOS DE RESOLUÇÃO
   ========================================================= */

if (el.gameResolution) {

    el.gameResolution
        .addEventListener(
            "change",
            updateResolutionUI
        );

}


[
    el.customResolutionWidth,
    el.customResolutionHeight
]
    .filter(Boolean)
    .forEach(input => {

        input.addEventListener(
            "input",
            updateResolutionUI
        );

    });


/* =========================================================
   PREVIEW
   ========================================================= */

function update() {

    const color =
        el.color.value;


    const size =
        Number(
            el.size.value
        );


    const thickness =
        Number(
            el.thickness.value
        );


    const gap =
        Number(
            el.gap.value
        );


    const alpha =
        Number(
            el.alpha.value
        );


    const dotSize =
        Number(
            el.dotSize.value
        );


    const outlineThickness =
        Number(
            el.outlineThickness.value
        );


    const opacity =
        alpha / 255;


    el.colorValue.textContent =
        color.toUpperCase();


    /*
        =====================================================
        RESOLUÇÃO
        =====================================================

        Por enquanto o fator é 1.0.

        Portanto mudar a resolução NÃO modifica
        visualmente a mira ainda.

        Isso é proposital.

        Vamos calibrar depois dos testes reais.
    */

    const resolution =
        getSelectedResolution();


    const resolutionFactor =
        resolution.factor;


    /*
        =====================================================
        TAMANHO
        =====================================================

        Calibração atual do preview:

        size * 3

        A resolução será aplicada em cima dessa
        calibração quando tivermos os testes.
    */

    const visualSize =
        Math.max(
            0,
            size *
            3 *
            resolutionFactor
        );


    /*
        =====================================================
        ESPESSURA
        =====================================================
    */

    const visualThickness =
        Math.max(
            1,
            thickness *
            2 *
            resolutionFactor
        );


    /*
        =====================================================
        GAP
        =====================================================

        Calibração atual:

        gap 0  -> 5px
        gap -2 -> 3px

        Valores muito negativos fecham a mira.
    */

    const visualGap =
        Math.max(
            0,
            (gap + 5) *
            resolutionFactor
        );


    /*
        CONTORNO
    */

    const shadow =
        el.outline.checked
            ? `0 0 0 ${Math.max(
                1,
                outlineThickness
            )}px #000`
            : "none";


    /*
        CONFIGURA TODAS AS LINHAS
    */

    lines.forEach(line => {

        line.style.background =
            color;

        line.style.opacity =
            opacity;

        line.style.boxShadow =
            shadow;

        line.style.display =
            size === 0
                ? "none"
                : "block";

    });


    /*
        PEGAMOS AS QUATRO HASTES
    */

    const top =
        document.querySelector(
            ".crosshair-line.top"
        );


    const bottom =
        document.querySelector(
            ".crosshair-line.bottom"
        );


    const left =
        document.querySelector(
            ".crosshair-line.left"
        );


    const right =
        document.querySelector(
            ".crosshair-line.right"
        );


    /*
        CIMA
    */

    top.style.width =
        visualThickness + "px";

    top.style.height =
        visualSize + "px";

    top.style.left =
        -(visualThickness / 2) +
        "px";

    top.style.bottom =
        visualGap + "px";


    /*
        BAIXO
    */

    bottom.style.width =
        visualThickness + "px";

    bottom.style.height =
        visualSize + "px";

    bottom.style.left =
        -(visualThickness / 2) +
        "px";

    bottom.style.top =
        visualGap + "px";


    /*
        ESQUERDA
    */

    left.style.width =
        visualSize + "px";

    left.style.height =
        visualThickness + "px";

    left.style.right =
        visualGap + "px";

    left.style.top =
        -(visualThickness / 2) +
        "px";


    /*
        DIREITA
    */

    right.style.width =
        visualSize + "px";

    right.style.height =
        visualThickness + "px";

    right.style.left =
        visualGap + "px";

    right.style.top =
        -(visualThickness / 2) +
        "px";


    /*
        PONTO CENTRAL
    */

    el.dotElement.style.display =
        el.dot.checked
            ? "block"
            : "none";


    el.dotElement.style.width =
        dotSize + "px";


    el.dotElement.style.height =
        dotSize + "px";


    el.dotElement.style.background =
        color;


    el.dotElement.style.opacity =
        opacity;


    el.dotElement.style.boxShadow =
        shadow;


    /*
        ATUALIZA CÓDIGO
    */

    generateCode();

}


/* =========================================================
   GERADOR DO CÓDIGO FIVEM
   ========================================================= */

function generateCode() {

    const rgb =
        hexToRgb(
            el.color.value
        );


    /*
        A resolução NÃO aparece aqui.

        O código FiveM continua utilizando
        exatamente os valores configurados
        pelo jogador.

        STYLE 4 permanece fixo.
    */

    const command =

        `cl_crosshairalpha "${el.alpha.value}";` +

        `cl_crosshaircolor "5";` +

        `cl_crosshaircolor_b "${rgb.b}";` +

        `cl_crosshaircolor_r "${rgb.r}";` +

        `cl_crosshaircolor_g "${rgb.g}";` +

        `cl_crosshairdot "${el.dot.checked ? 1 : 0}";` +

        `cl_crosshairgap "${el.gap.value}";` +

        `cl_crosshairsize "${el.size.value}";` +

        `cl_crosshairstyle "4";` +

        `cl_crosshairusealpha "1";` +

        `cl_crosshairthickness "${el.thickness.value}";` +

        `cl_fixedcrosshairgap "${el.fixedGap.value}";` +

        `cl_crosshair_outlinethickness "${el.outline.checked ? el.outlineThickness.value : 0}";` +

        `cl_crosshair_drawoutline "${el.outline.checked ? 1 : 0}";`;


    el.code.textContent =
        command;

}


/* =========================================================
   COLOR PICKER
   ========================================================= */

el.color.addEventListener(
    "input",
    () => {

        setColor(
            el.color.value
        );

        update();

    }
);


/* =========================================================
   HEX
   ========================================================= */

el.hex.addEventListener(
    "input",
    () => {

        let value =
            el.hex.value.trim();


        if (
            !value.startsWith("#")
        ) {

            value =
                "#" + value;

        }


        if (
            /^#[0-9A-Fa-f]{6}$/.test(
                value
            )
        ) {

            setColor(value);

            update();

        }

    }
);


/* =========================================================
   RGB
   ========================================================= */

function updateFromRgb() {

    const hex =
        rgbToHex(
            el.red.value,
            el.green.value,
            el.blue.value
        );


    setColor(hex);

    update();

}


[
    el.red,
    el.green,
    el.blue
]
    .forEach(input => {

        input.addEventListener(
            "input",
            updateFromRgb
        );

    });


/* =========================================================
   CORES RÁPIDAS
   ========================================================= */

document
    .querySelectorAll(
        ".quick-color"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                setColor(
                    button.dataset.color
                );

                update();

            }
        );

    });


/* =========================================================
   TOGGLES
   ========================================================= */

[
    el.dot,
    el.outline
]
    .forEach(input => {

        input.addEventListener(
            "change",
            update
        );

    });


/* =========================================================
   STYLE
   ========================================================= */

/*
    O gerador continua trabalhando
    com Style 4 nesta versão.

    A questão de resolução será testada
    separadamente depois.
*/

if (el.style) {

    el.style.value =
        4;


    el.style.addEventListener(
        "change",
        () => {

            el.style.value =
                4;

            update();

        }
    );

}


/* =========================================================
   BÁSICO / AVANÇADO
   ========================================================= */

document
    .querySelectorAll(
        ".mode-button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".mode-button"
                    )
                    .forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });


                button.classList.add(
                    "active"
                );


                if (
                    button.dataset.mode ===
                    "advanced"
                ) {

                    document.body
                        .classList
                        .add(
                            "advanced-mode"
                        );

                } else {

                    document.body
                        .classList
                        .remove(
                            "advanced-mode"
                        );

                }

            }
        );

    });


/* =========================================================
   BACKGROUNDS
   ========================================================= */

document
    .querySelectorAll(
        ".bg-button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".bg-button"
                    )
                    .forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });


                button.classList.add(
                    "active"
                );


                el.preview.classList.remove(
                    "light",
                    "red",
                    "blue"
                );


                const bg =
                    button.dataset.bg;


                if (
                    bg !== "dark"
                ) {

                    el.preview
                        .classList
                        .add(bg);

                }

            }
        );

    });


/* =========================================================
   ZOOM
   ========================================================= */

document
    .querySelectorAll(
        ".zoom-button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".zoom-button"
                    )
                    .forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });


                button.classList.add(
                    "active"
                );


                const zoom =
                    Number(
                        button.dataset.zoom
                    );


                el.wrapper.style.transform =
                    `scale(${zoom})`;


                el.zoomLabel.textContent =
                    `ZOOM ${zoom}X`;

            }
        );

    });


/* =========================================================
   RESET
   ========================================================= */

function resetCrosshair() {

    setColor(
        "#FFFFFF"
    );


    el.size.value =
    el.sizeNumber.value =
        5;


    el.thickness.value =
    el.thicknessNumber.value =
        1;


    el.gap.value =
    el.gapNumber.value =
        -2;


    el.alpha.value =
    el.alphaNumber.value =
        255;


    el.dot.checked =
        true;


    el.dotSize.value =
    el.dotSizeNumber.value =
        2;


    el.outline.checked =
        false;


    el.outlineThickness.value =
    el.outlineNumber.value =
        1;


    if (el.style) {

        el.style.value =
            4;

    }


    el.fixedGap.value =
    el.fixedGapNumber.value =
        -2;


    update();

}


el.reset.addEventListener(
    "click",
    resetCrosshair
);


/* =========================================================
   MIRA ALEATÓRIA
   ========================================================= */

el.random.addEventListener(
    "click",
    () => {

        const random =
            (min, max) =>

                Math.floor(
                    Math.random() *
                    (max - min + 1)
                ) + min;


        const color =
            rgbToHex(

                random(
                    0,
                    255
                ),

                random(
                    0,
                    255
                ),

                random(
                    0,
                    255
                )

            );


        setColor(color);


        el.size.value =
        el.sizeNumber.value =
            random(
                2,
                8
            );


        el.thickness.value =
        el.thicknessNumber.value =
            random(
                1,
                3
            );


        el.gap.value =
        el.gapNumber.value =
            random(
                -5,
                3
            );


        el.alpha.value =
        el.alphaNumber.value =
            255;


        el.dot.checked =
            Math.random() > .5;


        el.outline.checked =
            Math.random() > .65;


        el.fixedGap.value =
        el.fixedGapNumber.value =
            el.gap.value;


        if (el.style) {

            el.style.value =
                4;

        }


        update();

    }
);


/* =========================================================
   COPIAR CÓDIGO
   ========================================================= */

el.copy.addEventListener(
    "click",
    async () => {

        try {

            await navigator.clipboard
                .writeText(
                    el.code.textContent
                );


            el.copy.textContent =
                "✓ CÓDIGO COPIADO";


            setTimeout(
                () => {

                    el.copy.textContent =
                        "COPIAR CÓDIGO";

                },
                1600
            );


        } catch {

            el.copy.textContent =
                "ERRO AO COPIAR";

        }

    }
);/* =========================================================
   IMPORTAÇÃO
   ========================================================= */

function readCommandValue(
    text,
    command
) {

    const expression =
        new RegExp(

            command +
            '\\s+"([^"]+)"',

            "i"

        );


    const result =
        text.match(
            expression
        );


    return result
        ? result[1]
        : null;

}


/* =========================================================
   BOTÃO IMPORTAR
   ========================================================= */

el.importButton.addEventListener(
    "click",
    () => {

        const text =
            el.importInput.value;


        if (
            !text.trim()
        ) {

            el.importMessage.textContent =
                "Cole um código primeiro.";

            return;

        }


        /*
            COR RGB
        */

        const r =
            readCommandValue(
                text,
                "cl_crosshaircolor_r"
            );


        const g =
            readCommandValue(
                text,
                "cl_crosshaircolor_g"
            );


        const b =
            readCommandValue(
                text,
                "cl_crosshaircolor_b"
            );


        if (
            r !== null &&
            g !== null &&
            b !== null
        ) {

            setColor(
                rgbToHex(
                    r,
                    g,
                    b
                )
            );

        }


        /*
            VALORES NUMÉRICOS
        */

        const mappings = [

            [
                "cl_crosshairalpha",
                el.alpha,
                el.alphaNumber
            ],

            [
                "cl_crosshairsize",
                el.size,
                el.sizeNumber
            ],

            [
                "cl_crosshairthickness",
                el.thickness,
                el.thicknessNumber
            ],

            [
                "cl_crosshairgap",
                el.gap,
                el.gapNumber
            ],

            [
                "cl_fixedcrosshairgap",
                el.fixedGap,
                el.fixedGapNumber
            ],

            [
                "cl_crosshair_outlinethickness",
                el.outlineThickness,
                el.outlineNumber
            ]

        ];


        mappings.forEach(
            (
                [
                    command,
                    range,
                    number
                ]
            ) => {

                const value =
                    readCommandValue(
                        text,
                        command
                    );


                if (
                    value !== null
                ) {

                    range.value =
                        value;

                    number.value =
                        value;

                }

            }
        );


        /*
            PONTO CENTRAL
        */

        const dot =
            readCommandValue(
                text,
                "cl_crosshairdot"
            );


        if (
            dot !== null
        ) {

            el.dot.checked =
                dot === "1";

        }


        /*
            CONTORNO
        */

        const outline =
            readCommandValue(
                text,
                "cl_crosshair_drawoutline"
            );


        if (
            outline !== null
        ) {

            el.outline.checked =
                outline === "1";

        }


        /*
            STYLE

            Nesta versão mantemos Style 4.
            O teste de resolução é independente.
        */

        if (el.style) {

            el.style.value =
                4;

        }


        update();


        el.importMessage.textContent =
            "✓ Mira importada com sucesso";


        document
            .getElementById(
                "editor"
            )
            .scrollIntoView({

                behavior:
                    "smooth"

            });

    }
);


/* =========================================================
   PRESETS
   ========================================================= */

const presets = {

    dot: {

        color:
            "#FFFFFF",

        size:
            0,

        thickness:
            1,

        gap:
            -5,

        dot:
            true,

        outline:
            false

    },


    classic: {

        color:
            "#A8FF1F",

        size:
            5,

        thickness:
            1,

        gap:
            -2,

        dot:
            false,

        outline:
            true

    },


    tight: {

        color:
            "#00FFFF",

        size:
            3,

        thickness:
            1,

        gap:
            -4,

        dot:
            true,

        outline:
            false

    },


    large: {

        color:
            "#FF3131",

        size:
            8,

        thickness:
            2,

        gap:
            1,

        dot:
            false,

        outline:
            true

    }

};


/* =========================================================
   APLICAR PRESET
   ========================================================= */

document
    .querySelectorAll(
        ".preset-card"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const preset =
                        presets[
                            button.dataset.preset
                        ];


                    if (
                        !preset
                    ) {

                        return;

                    }


                    setColor(
                        preset.color
                    );


                    el.size.value =
                    el.sizeNumber.value =
                        preset.size;


                    el.thickness.value =
                    el.thicknessNumber.value =
                        preset.thickness;


                    el.gap.value =
                    el.gapNumber.value =
                        preset.gap;


                    el.fixedGap.value =
                    el.fixedGapNumber.value =
                        preset.gap;


                    el.dot.checked =
                        preset.dot;


                    el.outline.checked =
                        preset.outline;


                    el.alpha.value =
                    el.alphaNumber.value =
                        255;


                    /*
                        STYLE 4
                    */

                    if (el.style) {

                        el.style.value =
                            4;

                    }


                    update();


                    document
                        .getElementById(
                            "editor"
                        )
                        .scrollIntoView({

                            behavior:
                                "smooth"

                        });

                }
            );

        }
    );


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

/*
    CONFIGURAÇÃO INICIAL DA MIRA
*/

setColor(
    "#FFFFFF"
);


/*
    STYLE 4
*/

if (el.style) {

    el.style.value =
        4;

}


/*
    RESOLUÇÃO PADRÃO

    1920 × 1080 será nossa resolução
    de referência para a calibração.
*/

if (el.gameResolution) {

    el.gameResolution.value =
        "1920x1080";

}


/*
    GARANTE QUE OS CAMPOS DA
    RESOLUÇÃO PERSONALIZADA
    COMECEM ESCONDIDOS.
*/

if (el.customResolution) {

    el.customResolution
        .classList
        .add(
            "hidden"
        );

}


/*
    TEXTO INICIAL DO PREVIEW
*/

if (
    el.resolutionPreviewLabel
) {

    el.resolutionPreviewLabel
        .textContent =
        "PREVIEW • 1920×1080";

}


/*
    PRIMEIRA ATUALIZAÇÃO
*/

update();
