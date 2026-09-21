const $ = (id) => document.getElementById(id);

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

    zoomLabel: $("zoomLabel")
};


const lines =
    document.querySelectorAll(".crosshair-line");


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

    if (!/^[0-9A-Fa-f]{6}$/.test(value)) {
        return null;
    }

    return {
        r: parseInt(value.slice(0, 2), 16),
        g: parseInt(value.slice(2, 4), 16),
        b: parseInt(value.slice(4, 6), 16)
    };

}


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


function syncPair(range, number) {

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


function update() {

    const color =
        el.color.value;

    const size =
        Number(el.size.value);

    const thickness =
        Number(el.thickness.value);

    const gap =
        Number(el.gap.value);

    const alpha =
        Number(el.alpha.value);

    const dotSize =
        Number(el.dotSize.value);

    const outlineThickness =
        Number(el.outlineThickness.value);


    const opacity =
        alpha / 255;


    el.colorValue.textContent =
        color.toUpperCase();


    /*
        Escala apenas para visualização.

        O código gerado continua usando
        os valores originais.
    */

    const visualSize =
        Math.max(
            0,
            size * 4
        );

    const visualThickness =
        Math.max(
            1,
            thickness * 2
        );

    const visualGap =
        Math.max(
            0,
            (gap + 30) * 0.55
        );


    const shadow =
        el.outline.checked
            ? `0 0 0 ${Math.max(
                1,
                outlineThickness
            )}px #000`
            : "none";


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


    top.style.width =
        visualThickness + "px";

    top.style.height =
        visualSize + "px";

    top.style.left =
        -(visualThickness / 2) + "px";

    top.style.bottom =
        visualGap + "px";


    bottom.style.width =
        visualThickness + "px";

    bottom.style.height =
        visualSize + "px";

    bottom.style.left =
        -(visualThickness / 2) + "px";

    bottom.style.top =
        visualGap + "px";


    left.style.width =
        visualSize + "px";

    left.style.height =
        visualThickness + "px";

    left.style.right =
        visualGap + "px";

    left.style.top =
        -(visualThickness / 2) + "px";


    right.style.width =
        visualSize + "px";

    right.style.height =
        visualThickness + "px";

    right.style.left =
        visualGap + "px";

    right.style.top =
        -(visualThickness / 2) + "px";


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


    generateCode();

}


function generateCode() {

    const rgb =
        hexToRgb(
            el.color.value
        );


    const command =

        `cl_crosshairalpha "${el.alpha.value}";` +

        `cl_crosshaircolor "5";` +

        `cl_crosshaircolor_b "${rgb.b}";` +

        `cl_crosshaircolor_r "${rgb.r}";` +

        `cl_crosshaircolor_g "${rgb.g}";` +

        `cl_crosshairdot "${el.dot.checked ? 1 : 0}";` +

        `cl_crosshairgap "${el.gap.value}";` +

        `cl_crosshairsize "${el.size.value}";` +

        `cl_crosshairstyle "${el.style.value}";` +

        `cl_crosshairusealpha "1";` +

        `cl_crosshairthickness "${el.thickness.value}";` +

        `cl_fixedcrosshairgap "${el.fixedGap.value}";` +

        `cl_crosshair_outlinethickness "${el.outline.checked ? el.outlineThickness.value : 0}";` +

        `cl_crosshair_drawoutline "${el.outline.checked ? 1 : 0}";`;


    el.code.textContent =
        command;

}


/* COLOR PICKER */

el.color.addEventListener(
    "input",
    () => {

        setColor(
            el.color.value
        );

        update();

    }
);


/* HEX */

el.hex.addEventListener(
    "input",
    () => {

        let value =
            el.hex.value.trim();

        if (!value.startsWith("#")) {
            value = "#" + value;
        }

        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {

            setColor(value);

            update();

        }

    }
);


/* RGB */

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
].forEach(input => {

    input.addEventListener(
        "input",
        updateFromRgb
    );

});


/* QUICK COLORS */

document
    .querySelectorAll(".quick-color")
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


/* TOGGLES + STYLE */

[
    el.dot,
    el.outline,
    el.style
].forEach(input => {

    input.addEventListener(
        "change",
        update
    );

});


/* BASIC / ADVANCED */

document
    .querySelectorAll(".mode-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".mode-button")
                    .forEach(item =>
                        item.classList.remove("active")
                    );

                button.classList.add("active");


                if (
                    button.dataset.mode ===
                    "advanced"
                ) {

                    document.body
                        .classList
                        .add("advanced-mode");

                } else {

                    document.body
                        .classList
                        .remove("advanced-mode");

                }

            }
        );

    });


/* BACKGROUNDS */

document
    .querySelectorAll(".bg-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".bg-button")
                    .forEach(item =>
                        item.classList.remove("active")
                    );

                button.classList.add("active");


                el.preview.classList.remove(
                    "light",
                    "red",
                    "blue"
                );


                const bg =
                    button.dataset.bg;


                if (bg !== "dark") {

                    el.preview
                        .classList
                        .add(bg);

                }

            }
        );

    });


/* ZOOM */

document
    .querySelectorAll(".zoom-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".zoom-button")
                    .forEach(item =>
                        item.classList.remove("active")
                    );

                button.classList.add("active");


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


/* RESET */

function resetCrosshair() {

    setColor("#FFFFFF");

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

    el.style.value =
        4;

    el.fixedGap.value =
    el.fixedGapNumber.value =
        -2;

    update();

}


el.reset.addEventListener(
    "click",
    resetCrosshair
);


/* RANDOM */

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
                random(0,255),
                random(0,255),
                random(0,255)
            );


        setColor(color);


        el.size.value =
        el.sizeNumber.value =
            random(1,8);


        el.thickness.value =
        el.thicknessNumber.value =
            random(1,3);


        el.gap.value =
        el.gapNumber.value =
            random(-15,5);


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


        update();

    }
);


/* COPY */

el.copy.addEventListener(
    "click",
    async () => {

        try {

            await navigator.clipboard.writeText(
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
);


/* IMPORT */

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
        text.match(expression);


    return result
        ? result[1]
        : null;

}


el.importButton.addEventListener(
    "click",
    () => {

        const text =
            el.importInput.value;


        if (!text.trim()) {

            el.importMessage.textContent =
                "Cole um código primeiro.";

            return;

        }


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
                rgbToHex(r,g,b)
            );

        }


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
            ([command, range, number]) => {

                const value =
                    readCommandValue(
                        text,
                        command
                    );


                if (value !== null) {

                    range.value =
                        value;

                    number.value =
                        value;

                }

            }
        );


        const dot =
            readCommandValue(
                text,
                "cl_crosshairdot"
            );


        if (dot !== null) {

            el.dot.checked =
                dot === "1";

        }


        const outline =
            readCommandValue(
                text,
                "cl_crosshair_drawoutline"
            );


        if (outline !== null) {

            el.outline.checked =
                outline === "1";

        }


        const style =
            readCommandValue(
                text,
                "cl_crosshairstyle"
            );


        if (style !== null) {

            el.style.value =
                style;

        }


        update();


        el.importMessage.textContent =
            "✓ Mira importada com sucesso";


        document
            .getElementById("editor")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


/* PRESETS */

const presets = {

    dot: {
        color: "#FFFFFF",
        size: 0,
        thickness: 1,
        gap: -20,
        dot: true,
        outline: false
    },

    classic: {
        color: "#A8FF1F",
        size: 5,
        thickness: 1,
        gap: -2,
        dot: false,
        outline: true
    },

    tight: {
        color: "#00FFFF",
        size: 3,
        thickness: 1,
        gap: -8,
        dot: true,
        outline: false
    },

    large: {
        color: "#FF3131",
        size: 8,
        thickness: 2,
        gap: 2,
        dot: false,
        outline: true
    }

};


document
    .querySelectorAll(".preset-card")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const preset =
                    presets[
                        button.dataset.preset
                    ];


                if (!preset) {
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


                update();


                document
                    .getElementById("editor")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    });


/* START */

setColor("#FFFFFF");
update();