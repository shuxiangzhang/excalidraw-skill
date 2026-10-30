/**
 * @file icons.ts
 * @overview Small line icons built from native Excalidraw shapes. All coordinates
 * use a 24-unit grid, so icons scale consistently and stay editable in the drawing.
 */
const definitions = {
    download: [
        {
            kind: "line",
            points: [
                [4, 15],
                [4, 21],
                [20, 21],
                [20, 15],
            ],
        },
        {
            kind: "line",
            points: [
                [12, 3],
                [12, 15],
            ],
        },
        {
            kind: "line",
            points: [
                [7, 10],
                [12, 15],
                [17, 10],
            ],
        },
    ],
    folderPlus: [
        {
            kind: "line",
            points: [
                [3, 7],
                [3, 20],
                [21, 20],
                [21, 7],
                [12, 7],
                [10, 4],
                [3, 4],
                [3, 7],
            ],
        },
        {
            kind: "line",
            points: [
                [15, 10],
                [15, 17],
            ],
        },
        {
            kind: "line",
            points: [
                [11.5, 13.5],
                [18.5, 13.5],
            ],
        },
    ],
    code: [
        {
            kind: "line",
            points: [
                [7, 6],
                [2, 12],
                [7, 18],
            ],
        },
        {
            kind: "line",
            points: [
                [17, 6],
                [22, 12],
                [17, 18],
            ],
        },
        {
            kind: "line",
            points: [
                [14, 3],
                [10, 21],
            ],
        },
    ],
    check: [
        { kind: "ellipse", x: 2, y: 2, width: 20, height: 20 },
        {
            kind: "line",
            points: [
                [7, 12],
                [10, 15],
                [17, 8],
            ],
        },
    ],
    search: [
        { kind: "ellipse", x: 3, y: 3, width: 13, height: 13 },
        {
            kind: "line",
            points: [
                [14.5, 14.5],
                [21, 21],
            ],
        },
    ],
    package: [
        {
            kind: "line",
            points: [
                [12, 2],
                [22, 7],
                [22, 17],
                [12, 22],
                [2, 17],
                [2, 7],
                [12, 2],
            ],
        },
        {
            kind: "line",
            points: [
                [2, 7],
                [12, 12],
                [22, 7],
            ],
        },
        {
            kind: "line",
            points: [
                [12, 12],
                [12, 22],
            ],
        },
    ],
    file: [
        {
            kind: "line",
            points: [
                [5, 2],
                [15, 2],
                [20, 7],
                [20, 22],
                [5, 22],
                [5, 2],
            ],
        },
        {
            kind: "line",
            points: [
                [15, 2],
                [15, 7],
                [20, 7],
            ],
        },
        {
            kind: "line",
            points: [
                [9, 12],
                [16, 12],
            ],
        },
        {
            kind: "line",
            points: [
                [9, 17],
                [16, 17],
            ],
        },
    ],
    copy: [
        { kind: "rect", x: 8, y: 8, width: 13, height: 13 },
        {
            kind: "line",
            points: [
                [4, 16],
                [3, 16],
                [3, 3],
                [16, 3],
                [16, 4],
            ],
        },
    ],
    play: [
        {
            kind: "line",
            points: [
                [6, 3],
                [21, 12],
                [6, 21],
                [6, 3],
            ],
        },
    ],
    pencil: [
        {
            kind: "line",
            points: [
                [3, 21],
                [5, 15],
                [17, 3],
                [21, 7],
                [9, 19],
                [3, 21],
            ],
        },
        {
            kind: "line",
            points: [
                [14, 6],
                [18, 10],
            ],
        },
    ],
    save: [
        {
            kind: "line",
            points: [
                [3, 3],
                [18, 3],
                [21, 6],
                [21, 21],
                [3, 21],
                [3, 3],
            ],
        },
        {
            kind: "line",
            points: [
                [7, 3],
                [7, 9],
                [16, 9],
                [16, 3],
            ],
        },
        { kind: "rect", x: 7, y: 14, width: 10, height: 7 },
    ],
    monitorCheck: [
        { kind: "rect", x: 2, y: 3, width: 20, height: 14 },
        {
            kind: "line",
            points: [
                [12, 17],
                [12, 21],
            ],
        },
        {
            kind: "line",
            points: [
                [8, 21],
                [16, 21],
            ],
        },
        {
            kind: "line",
            points: [
                [7, 10],
                [10, 13],
                [16, 7],
            ],
        },
    ],
    refresh: [
        {
            kind: "line",
            points: [
                [20, 8],
                [17, 4],
                [12, 3],
                [7, 5],
                [4, 9],
            ],
        },
        {
            kind: "line",
            points: [
                [4, 4],
                [4, 9],
                [9, 9],
            ],
        },
        {
            kind: "line",
            points: [
                [4, 16],
                [7, 20],
                [12, 21],
                [17, 19],
                [20, 15],
            ],
        },
        {
            kind: "line",
            points: [
                [15, 15],
                [20, 15],
                [20, 20],
            ],
        },
    ],
    plus: [
        {
            kind: "line",
            points: [
                [12, 4],
                [12, 20],
            ],
        },
        {
            kind: "line",
            points: [
                [4, 12],
                [20, 12],
            ],
        },
    ],
};
/** Draw one icon and return its element IDs so callers can group it with its card. */
export function drawIcon(ea, name, at) {
    ea.setStyle({
        strokeColor: at.color,
        backgroundColor: "transparent",
        strokeWidth: 1.8,
        strokeStyle: "solid",
        roughness: 0,
        opacity: 100,
        roundness: null,
    });
    const scale = at.size / 24;
    return definitions[name].map((shape) => {
        if (shape.kind === "line") {
            return ea.addLine(shape.points.map(([x, y]) => [at.x + x * scale, at.y + y * scale]));
        }
        const bounds = [
            at.x + shape.x * scale,
            at.y + shape.y * scale,
            shape.width * scale,
            shape.height * scale,
        ];
        return shape.kind === "rect" ? ea.addRect(...bounds) : ea.addEllipse(...bounds);
    });
}

export const iconNames = Object.keys(definitions);
