(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/components_56173da0._.js", {

"[project]/components/utils/canvasUtils.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// Get the correct coordinates based on canvas scaling
__turbopack_context__.s({
    "createAnchorPoint": (()=>createAnchorPoint),
    "drawBezierCurve": (()=>drawBezierCurve),
    "drawBezierGuides": (()=>drawBezierGuides),
    "drawImageToCanvas": (()=>drawImageToCanvas),
    "getCoordinates": (()=>getCoordinates),
    "initializeCanvas": (()=>initializeCanvas),
    "isNearHandle": (()=>isNearHandle),
    "updateHandle": (()=>updateHandle)
});
const getCoordinates = (e, canvas)=>{
    const rect = canvas.getBoundingClientRect();
    // Calculate the scaling factor between the internal canvas size and displayed size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    // Apply the scaling to get accurate coordinates
    return {
        x: (e.nativeEvent.offsetX || e.nativeEvent.touches?.[0]?.clientX - rect.left) * scaleX,
        y: (e.nativeEvent.offsetY || e.nativeEvent.touches?.[0]?.clientY - rect.top) * scaleY
    };
};
const initializeCanvas = (canvas)=>{
    const ctx = canvas.getContext("2d");
    // Fill canvas with white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};
const drawImageToCanvas = (canvas, backgroundImage)=>{
    if (!canvas || !backgroundImage) return;
    const ctx = canvas.getContext("2d");
    // Fill with white background first
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw the background image
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
};
const drawBezierCurve = (canvas, points)=>{
    const ctx = canvas.getContext('2d');
    if (!points || points.length < 2) {
        console.error('Need at least 2 points to draw a path');
        return;
    }
    ctx.beginPath();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    // Start at the first anchor point
    ctx.moveTo(points[0].x, points[0].y);
    // For each pair of anchor points (and their control points)
    for(let i = 0; i < points.length - 1; i++){
        const current = points[i];
        const next = points[i + 1];
        if (current.handleOut && next.handleIn) {
            // If both points have handles, draw a cubic bezier
            ctx.bezierCurveTo(current.x + (current.handleOut?.x || 0), current.y + (current.handleOut?.y || 0), next.x + (next.handleIn?.x || 0), next.y + (next.handleIn?.y || 0), next.x, next.y);
        } else {
            // If no handles, draw a straight line
            ctx.lineTo(next.x, next.y);
        }
    }
    ctx.stroke();
};
const drawBezierGuides = (ctx, points)=>{
    if (!points || points.length === 0) return;
    // Draw the path itself first (as a light preview)
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    // For each pair of anchor points (and their control points)
    for(let i = 0; i < points.length - 1; i++){
        const current = points[i];
        const next = points[i + 1];
        if (current.handleOut && next.handleIn) {
            // If both points have handles, draw a cubic bezier
            ctx.bezierCurveTo(current.x + (current.handleOut?.x || 0), current.y + (current.handleOut?.y || 0), next.x + (next.handleIn?.x || 0), next.y + (next.handleIn?.y || 0), next.x, next.y);
        } else {
            // If no handles, draw a straight line
            ctx.lineTo(next.x, next.y);
        }
    }
    ctx.stroke();
    ctx.restore();
    // Draw guide lines between anchor points and their handles
    ctx.strokeStyle = 'rgba(100, 100, 255, 0.5)';
    ctx.lineWidth = 1;
    for (const point of points){
        // Draw line from anchor to in-handle if it exists
        if (point.handleIn) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(point.x + point.handleIn.x, point.y + point.handleIn.y);
            ctx.stroke();
        }
        // Draw line from anchor to out-handle if it exists
        if (point.handleOut) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(point.x + point.handleOut.x, point.y + point.handleOut.y);
            ctx.stroke();
        }
    }
    // Draw anchor points (main points of the path)
    for (const point of points){
        // Draw the main anchor point
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Draw the handle points if they exist
        if (point.handleIn) {
            ctx.fillStyle = 'rgba(100, 100, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(point.x + point.handleIn.x, point.y + point.handleIn.y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        if (point.handleOut) {
            ctx.fillStyle = 'rgba(100, 100, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(point.x + point.handleOut.x, point.y + point.handleOut.y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
};
const createAnchorPoint = (x, y, prevPoint = null)=>{
    // By default, create a point with no handles
    const point = {
        x,
        y,
        handleIn: null,
        handleOut: null
    };
    // If there's a previous point, automatically add symmetric handles
    if (prevPoint) {
        // Calculate the default handle length (as a percentage of distance to previous point)
        const dx = x - prevPoint.x;
        const dy = y - prevPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const handleLength = distance * 0.3; // 30% of distance between points
        // Create handles perpendicular to the line between points
        // For a smooth curve, make the previous point's out handle opposite to this point's in handle
        const angle = Math.atan2(dy, dx);
        // Add an out handle to the previous point (if it doesn't already have one)
        if (!prevPoint.handleOut) {
            prevPoint.handleOut = {
                x: Math.cos(angle) * -handleLength,
                y: Math.sin(angle) * -handleLength
            };
        }
        // Add an in handle to the current point
        point.handleIn = {
            x: Math.cos(angle) * -handleLength,
            y: Math.sin(angle) * -handleLength
        };
    }
    return point;
};
const isNearHandle = (point, handleType, x, y, radius = 10)=>{
    if (!point || !point[handleType]) return false;
    const handleX = point.x + point[handleType].x;
    const handleY = point.y + point[handleType].y;
    const dx = handleX - x;
    const dy = handleY - y;
    return dx * dx + dy * dy <= radius * radius;
};
const updateHandle = (point, handleType, dx, dy, symmetric = true)=>{
    if (!point || !point[handleType]) return;
    // Update the target handle
    point[handleType].x += dx;
    point[handleType].y += dy;
    // If symmetric and the other handle exists, update it to be symmetrical
    if (symmetric) {
        const otherType = handleType === 'handleIn' ? 'handleOut' : 'handleIn';
        if (point[otherType]) {
            point[otherType].x = -point[handleType].x;
            point[otherType].y = -point[handleType].y;
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/ToolBar.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eraser$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eraser$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eraser.js [client] (ecmascript) <export default as Eraser>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mouse$2d$pointer$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MousePointer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mouse-pointer.js [client] (ecmascript) <export default as MousePointer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2d$2$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Undo2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/undo-2.js [client] (ecmascript) <export default as Undo2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
;
;
;
;
const ToolBar = ({ currentTool, setCurrentTool, handleUndo, clearCanvas, orientation = 'horizontal', currentWidth, setStrokeWidth })=>{
    const mainTools = [
        {
            id: 'selection',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mouse$2d$pointer$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MousePointer$3e$__["MousePointer"],
            label: 'Selection'
        },
        {
            id: 'pencil',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"],
            label: 'Pencil'
        },
        // { id: 'pen', icon: PenTool, label: 'Pen' },
        {
            id: 'eraser',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eraser$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eraser$3e$__["Eraser"],
            label: 'Eraser'
        }
    ];
    const actions = [
        {
            id: 'undo',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2d$2$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Undo2$3e$__["Undo2"],
            label: 'Undo',
            onClick: handleUndo
        },
        {
            id: 'clear',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"],
            label: 'Clear',
            onClick: clearCanvas
        }
    ];
    const containerClasses = orientation === 'vertical' ? 'flex flex-col gap-2 bg-white rounded-xl shadow-soft p-2 border border-gray-200' : 'flex gap-2 bg-white rounded-xl shadow-soft p-2 border border-gray-200';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: containerClasses,
        children: [
            mainTools.map((tool)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setCurrentTool(tool.id),
                        className: `p-2 rounded-lg transition-colors ${currentTool === tool.id ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`,
                        title: tool.label,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(tool.icon, {
                            className: "w-5 h-5"
                        }, void 0, false, {
                            fileName: "[project]/components/ToolBar.js",
                            lineNumber: 45,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ToolBar.js",
                        lineNumber: 36,
                        columnNumber: 11
                    }, this)
                }, tool.id, false, {
                    fileName: "[project]/components/ToolBar.js",
                    lineNumber: 35,
                    columnNumber: 9
                }, this)),
            orientation === 'vertical' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-px bg-gray-200 my-2"
            }, void 0, false, {
                fileName: "[project]/components/ToolBar.js",
                lineNumber: 50,
                columnNumber: 38
            }, this),
            orientation === 'horizontal' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-px bg-gray-200 mx-2"
            }, void 0, false, {
                fileName: "[project]/components/ToolBar.js",
                lineNumber: 51,
                columnNumber: 40
            }, this),
            actions.map((action)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: action.onClick,
                    className: "p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
                    title: action.label,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(action.icon, {
                        className: "w-5 h-5"
                    }, void 0, false, {
                        fileName: "[project]/components/ToolBar.js",
                        lineNumber: 60,
                        columnNumber: 11
                    }, this)
                }, action.id, false, {
                    fileName: "[project]/components/ToolBar.js",
                    lineNumber: 54,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ToolBar.js",
        lineNumber: 33,
        columnNumber: 5
    }, this);
};
_c = ToolBar;
const __TURBOPACK__default__export__ = ToolBar;
var _c;
__turbopack_context__.k.register(_c, "ToolBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/StyleSelector.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "generatePromptForMaterial": (()=>generatePromptForMaterial),
    "getPromptForStyle": (()=>getPromptForStyle),
    "styleOptions": (()=>styleOptions)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$ccw$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-ccw.js [client] (ecmascript) <export default as RefreshCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-help.js [client] (ecmascript) <export default as HelpCircle>");
;
var _s = __turbopack_context__.k.signature();
;
;
// Define default style options with display names and prompts
const defaultStyleOptions = {
    material: {
        name: "Chrome",
        file: "chrome.jpeg",
        prompt: "Recreate this doodle as a physical chrome sculpture made of a chromium metal tubes or pipes in a professional studio setting. If it is typography, render it accordingly, but always always have a black background and studio lighting. Render it in Cinema 4D with Octane, using studio lighting against a pure black background. Make it look like a high-end product rendering of a sculptural piece. Flat Black background always"
    },
    honey: {
        name: "Honey",
        file: "honey.jpeg",
        prompt: "Transform this sketch into a honey. Render it as if made entirely of translucent, golden honey with characteristic viscous drips and flows. Add realistic liquid properties including surface tension, reflections, and light refraction. Render it in Cinema 4D with Octane, using studio lighting against a pure black background. Flat Black background always"
    },
    softbody: {
        name: "Soft Body",
        file: "softbody.jpeg",
        prompt: "Convert this drawing / text into a soft body physics render. Render it as if made of a soft, jelly-like material that responds to gravity and motion. Add realistic deformation, bounce, and squash effects typical of soft body dynamics. Use dramatic lighting against a black background to emphasize the material's translucency and surface properties. Render it in Cinema 4D with Octane, using studio lighting against a pure black background. Make it look like a high-end 3D animation frame."
    },
    topographic: {
        name: "Topographic",
        file: "topographic.jpeg",
        prompt: "Transform this sketch into a sculptural form composed of precisely stacked, thin metallic rings or layers. Render it with warm copper/bronze tones with each layer maintaining equal spacing from adjacent layers, creating a topographic map effect. The form should appear to flow and undulate while maintaining the precise parallel structure. Use dramatic studio lighting against a pure black background to highlight the metallic luster and dimensional quality. Render it in a high-end 3D visualization style with perfect definition between each ring layer."
    },
    testMaterial: {
        name: "Surprise Me!",
        file: "test-material.jpeg",
        prompt: "Transform this sketch into an experimental material with unique and unexpected properties. Each generation should be different and surprising - it could be crystalline, liquid, gaseous, organic, metallic, or something completely unexpected. Use dramatic studio lighting against a pure black background to showcase the material's unique characteristics. Render it in a high-end 3D style with professional lighting and composition, emphasizing the most interesting and unexpected qualities of the chosen material."
    }
};
let styleOptions = {
    ...defaultStyleOptions
};
// Define the base prompt template
const BASE_PROMPT = (materialName)=>`Transform this sketch into a ${materialName.toLowerCase()} material. Render it in a high-end 3D visualization style with professional studio lighting against a pure black background. Make it look like an elegant Cinema 4D and Octane rendering with detailed material properties and characteristics. The final result should be an elegant visualization with perfect studio lighting, crisp shadows, and high-end material definition.`;
_c = BASE_PROMPT;
const enhanceMaterialDetails = async (materialDescription)=>{
    console.log("Enhancing material:", materialDescription);
    try {
        const response = await fetch("/api/enhance-material", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                materialDescription
            })
        });
        const data = await response.json();
        console.log("Enhanced material data:", data);
        // If we have valid data, use it
        if (data.name && typeof data.details === 'string') {
            // Strictly combine base prompt with only the additional details
            const finalPrompt = data.details.trim() ? `${BASE_PROMPT(data.name)}. ${data.details.trim()}` : BASE_PROMPT(data.name);
            return {
                name: data.name,
                prompt: finalPrompt
            };
        }
        // If data is invalid, throw error to trigger fallback
        throw new Error('Invalid enhancement data received');
    } catch (error) {
        console.error("Error enhancing material details:", error);
        // Create a more sophisticated fallback that still provides value
        const capitalizedName = materialDescription.split(' ').map((word)=>word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        const fallbackPrompt = `${BASE_PROMPT(materialDescription)}. Emphasize the characteristic properties of ${materialDescription.toLowerCase()} with accurate surface texturing and physical behavior.`;
        return {
            name: `${capitalizedName} Material`,
            prompt: fallbackPrompt
        };
    }
};
const getPromptForStyle = (styleMode)=>{
    if (!styleMode || !styleOptions[styleMode]) {
        return styleOptions.material.prompt;
    }
    return styleOptions[styleMode].prompt || styleOptions.material.prompt;
};
const generatePromptForMaterial = (materialName)=>{
    return `Transform this sketch into a ${materialName.toLowerCase()} material. Render it in a high-end 3D visualization style with professional studio lighting against a pure black background. Make it look like a elegant Cinema 4D and octane rendering with detailed material properties and characteristics.`;
};
const StyleSelector = ({ styleMode, setStyleMode, handleGenerate })=>{
    _s();
    const [showAddMaterialModal, setShowAddMaterialModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newMaterialName, setNewMaterialName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isGeneratingThumbnail, setIsGeneratingThumbnail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [useCustomImage, setUseCustomImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [customImagePreview, setCustomImagePreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [customImageFile, setCustomImageFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [recentlyAdded, setRecentlyAdded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [customPrompt, setCustomPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showCustomPrompt, setShowCustomPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [previewThumbnail, setPreviewThumbnail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isGeneratingPreview, setIsGeneratingPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [materials, setMaterials] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(defaultStyleOptions);
    const [generatedMaterialName, setGeneratedMaterialName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [generatedPrompt, setGeneratedPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isGeneratingText, setIsGeneratingText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showMaterialNameEdit, setShowMaterialNameEdit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isGenerating, setIsGenerating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Load custom materials from local storage on component mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StyleSelector.useEffect": ()=>{
            loadCustomMaterials();
        }
    }["StyleSelector.useEffect"], []);
    // Extract loadCustomMaterials into its own named function
    const loadCustomMaterials = ()=>{
        try {
            const savedMaterials = localStorage.getItem('customMaterials');
            if (savedMaterials) {
                const parsedMaterials = JSON.parse(savedMaterials);
                // Update both the styleOptions and the state
                const updatedMaterials = {
                    ...defaultStyleOptions,
                    ...parsedMaterials
                };
                styleOptions = updatedMaterials;
                setMaterials(updatedMaterials);
                console.log('Loaded custom materials from local storage');
            }
        } catch (error) {
            console.error('Error loading custom materials:', error);
        }
    };
    // Modify the useEffect that handles thumbnail and text generation
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StyleSelector.useEffect": ()=>{
            const delayedGeneration = {
                "StyleSelector.useEffect.delayedGeneration": async ()=>{
                    // Skip automatic generation if we're editing (recentlyAdded exists)
                    if (!newMaterialName.trim() || recentlyAdded) return;
                    // Set loading states
                    if (!useCustomImage) {
                        setIsGeneratingPreview(true);
                    }
                    setIsGeneratingText(true);
                    try {
                        // Use our enhanced material details function
                        const enhanced = await enhanceMaterialDetails(newMaterialName);
                        setGeneratedMaterialName(enhanced.name);
                        setGeneratedPrompt(enhanced.prompt);
                        // Generate thumbnail with the enhanced prompt
                        if (!useCustomImage) {
                            try {
                                // Generate a thumbnail using the API with the enhanced prompt
                                const response = await fetch("/api/generate", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        prompt: enhanced.prompt
                                    })
                                });
                                const data = await response.json();
                                if (data.success && data.imageData) {
                                    // Set the preview thumbnail
                                    setPreviewThumbnail(`data:image/jpeg;base64,${data.imageData}`);
                                }
                            } catch (error) {
                                console.error("Error generating preview thumbnail:", error);
                            }
                        }
                    } catch (error) {
                        console.error('Error in material generation:', error);
                        // Fall back to basic generation if enhanced fails
                        setGeneratedMaterialName(`${newMaterialName} Material`);
                        setGeneratedPrompt(generatePromptForMaterial(newMaterialName));
                    } finally{
                        setIsGeneratingPreview(false);
                        setIsGeneratingText(false);
                    }
                }
            }["StyleSelector.useEffect.delayedGeneration"];
            // Delay generation to avoid too many API calls while typing
            const timeoutId = setTimeout(delayedGeneration, 1500);
            return ({
                "StyleSelector.useEffect": ()=>clearTimeout(timeoutId)
            })["StyleSelector.useEffect"];
        }
    }["StyleSelector.useEffect"], [
        newMaterialName,
        useCustomImage,
        recentlyAdded
    ]);
    // Helper function to resize and compress image data
    const compressImage = (dataUrl, maxWidth = 200)=>{
        return new Promise((resolve)=>{
            const img = new Image();
            img.onload = ()=>{
                // Create a canvas to resize the image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                // Calculate new dimensions
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = height * maxWidth / width;
                    width = maxWidth;
                }
                canvas.width = width;
                canvas.height = height;
                // Draw and export as JPEG with lower quality
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.src = dataUrl;
        });
    };
    // Function to debug storage usage
    const checkStorageUsage = ()=>{
        let totalSize = 0;
        let itemCount = 0;
        for(let i = 0; i < localStorage.length; i++){
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            const size = (key.length + value.length) * 2; // Approximate size in bytes (UTF-16)
            totalSize += size;
            itemCount++;
            console.log(`Item: ${key}, Size: ${(size / 1024).toFixed(2)}KB`);
        }
        console.log(`Total localStorage usage: ${(totalSize / 1024 / 1024).toFixed(2)}MB, Items: ${itemCount}`);
        return totalSize;
    };
    const handleAddMaterial = ()=>{
        setShowAddMaterialModal(true);
    };
    const handleCloseModal = ()=>{
        setShowAddMaterialModal(false);
        setNewMaterialName('');
        setUseCustomImage(false);
        setCustomImagePreview('');
        setCustomImageFile(null);
        setCustomPrompt('');
        setShowCustomPrompt(false);
        setPreviewThumbnail('');
    };
    // Handle clicking outside of the modal to close it
    const handleClickOutsideModal = (e)=>{
        // If the clicked element is the backdrop (has the modalBackdrop class)
        if (e.target.classList.contains('modalBackdrop')) {
            handleCloseModal();
        }
    };
    const handleFileChange = (e)=>{
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }
        const reader = new FileReader();
        reader.onload = ()=>{
            // When the file is loaded, create a temporary image to extract a square crop
            const img = new Image();
            img.onload = ()=>{
                // Create a canvas element to crop the image to a square
                const canvas = document.createElement('canvas');
                // Determine the size of the square (min of width and height)
                const size = Math.min(img.width, img.height);
                canvas.width = size;
                canvas.height = size;
                // Calculate the position to start drawing to center the crop
                const offsetX = (img.width - size) / 2;
                const offsetY = (img.height - size) / 2;
                // Draw the cropped image to the canvas
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);
                // Convert the canvas to a data URL
                const croppedImageDataUrl = canvas.toDataURL(file.type);
                setCustomImagePreview(croppedImageDataUrl);
                setCustomImageFile(file);
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    };
    const triggerFileInput = ()=>{
        fileInputRef.current.click();
    };
    const handleGenerateDefaultPrompt = ()=>{
        if (!newMaterialName.trim()) return;
        // Generate default prompt based on material name
        const defaultPrompt = generatePromptForMaterial(newMaterialName);
        setCustomPrompt(defaultPrompt);
        // Clear the preview so it will regenerate with the new prompt
        setPreviewThumbnail('');
    };
    // Add a helper function to read file as data URL
    const readFileAsDataURL = (file)=>{
        return new Promise((resolve, reject)=>{
            const reader = new FileReader();
            reader.onload = ()=>resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };
    // Option 1: Add function to compress images more aggressively before storage
    const compressImageForStorage = async (dataUrl)=>{
        // Use a smaller max width for storage
        const maxWidth = 100; // Reduce from 200 to 100
        const quality = 0.5; // Reduce quality from 0.7 to 0.5
        return new Promise((resolve)=>{
            const img = new Image();
            img.onload = ()=>{
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = height * maxWidth / width;
                    width = maxWidth;
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = dataUrl;
        });
    };
    // Option 2: Add function to manage storage limits
    const manageStorageLimit = async (newMaterial)=>{
        try {
            // Get current materials
            const savedMaterials = localStorage.getItem('customMaterials');
            if (!savedMaterials) return;
            const parsedMaterials = JSON.parse(savedMaterials);
            const customKeys = Object.keys(parsedMaterials).filter((key)=>!Object.keys(defaultStyleOptions).includes(key));
            // If we have too many custom materials, remove the oldest ones
            if (customKeys.length > 4) {
                // Sort by creation time (if you have that data) or just take the first ones
                const keysToRemove = customKeys.slice(0, customKeys.length - 4);
                keysToRemove.forEach((key)=>{
                    delete parsedMaterials[key];
                });
                // Save the reduced set back to localStorage
                localStorage.setItem('customMaterials', JSON.stringify(parsedMaterials));
            }
        } catch (error) {
            console.error('Error managing storage limit:', error);
        }
    };
    // Add a function to reset the form fields
    const resetMaterialForm = ()=>{
        setNewMaterialName('');
        setGeneratedMaterialName('');
        setGeneratedPrompt('');
        setCustomPrompt('');
        setPreviewThumbnail('');
        setUseCustomImage(false);
        setCustomImagePreview('');
        setShowCustomPrompt(false);
    };
    // Update the openAddMaterialModal function to reset form on open
    const openAddMaterialModal = ()=>{
        resetMaterialForm();
        setRecentlyAdded(null);
        setShowAddMaterialModal(true);
    };
    // Modify handleEditMaterial to keep thumbnail when editing
    const handleEditMaterial = (materialId)=>{
        const material = materials[materialId];
        if (!material) return;
        // Set form fields with existing data
        setNewMaterialName(material.originalDescription || ''); // Store original description if available
        setGeneratedMaterialName(material.name || '');
        // Set prompt with appropriate approach
        const materialPrompt = material.prompt || '';
        setGeneratedPrompt(materialPrompt);
        setCustomPrompt(materialPrompt);
        setShowCustomPrompt(false);
        // Set thumbnail without triggering regeneration
        if (material.thumbnail) {
            setPreviewThumbnail(material.thumbnail);
            setUseCustomImage(false);
        }
        setRecentlyAdded(materialId);
        setShowAddMaterialModal(true);
    };
    // Add a function to manually refresh the thumbnail
    const handleRefreshThumbnail = async (prompt)=>{
        if (!newMaterialName.trim() || useCustomImage) return;
        setIsGeneratingPreview(true);
        try {
            // Use the current prompt (either custom or default)
            const promptToUse = showCustomPrompt && customPrompt.trim() ? customPrompt : generatePromptForMaterial(newMaterialName);
            // Generate a new thumbnail using the API
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt: promptToUse
                })
            });
            const data = await response.json();
            if (data.success && data.imageData) {
                // Set the preview thumbnail
                setPreviewThumbnail(`data:image/jpeg;base64,${data.imageData}`);
            }
        } catch (error) {
            console.error("Error generating preview thumbnail:", error);
        } finally{
            setIsGeneratingPreview(false);
        }
    };
    // Add a function to manually refresh the text
    const handleRefreshText = async ()=>{
        if (!newMaterialName.trim()) return;
        setIsGeneratingText(true);
        try {
        // ... existing code for text generation ...
        // This can reuse the same code from the useEffect
        } catch (error) {
            console.error("Error generating material name and prompt:", error);
        } finally{
            setIsGeneratingText(false);
        }
    };
    const handleNewMaterialDescription = async (description)=>{
        if (!description.trim()) return;
        setIsGeneratingText(true);
        try {
            const enhanced = await enhanceMaterialDetails(description);
            setGeneratedMaterialName(enhanced.name);
            setGeneratedPrompt(enhanced.prompt);
            // Trigger thumbnail generation with the new prompt
            if (!useCustomImage) {
                handleRefreshThumbnail(enhanced.prompt);
            }
        } catch (error) {
            console.error("Error generating material:", error);
        } finally{
            setIsGeneratingText(false);
        }
    };
    const handleCreateMaterial = async ()=>{
        if (!newMaterialName.trim()) return;
        // Generate a unique ID for the material
        const materialId = recentlyAdded || `custom_${Date.now()}`;
        // Use the generated material name instead of the description
        const displayName = generatedMaterialName || `${newMaterialName} Material`;
        // Use the generated or custom prompt
        const materialPrompt = showCustomPrompt ? customPrompt : generatedPrompt || generatePromptForMaterial(newMaterialName);
        // Create the new material object
        const newMaterial = {
            name: displayName,
            prompt: materialPrompt,
            thumbnail: useCustomImage ? customImagePreview : previewThumbnail,
            originalDescription: newMaterialName,
            isCustom: true
        };
        // Update both our state and storage references
        const updatedMaterials = {
            ...materials,
            [materialId]: newMaterial
        };
        // Apply more aggressive compression before storing
        if (useCustomImage && customImagePreview) {
            newMaterial.thumbnail = await compressImageForStorage(customImagePreview);
        } else if (previewThumbnail) {
            newMaterial.thumbnail = await compressImageForStorage(previewThumbnail);
        }
        // Before trying to save, manage storage limit
        await manageStorageLimit(newMaterial);
        try {
            // Save to localStorage
            localStorage.setItem('customMaterials', JSON.stringify(updatedMaterials));
            // Update state and global reference
            styleOptions = updatedMaterials;
            setMaterials(updatedMaterials);
            // Set as recently added for highlight effect
            setRecentlyAdded(materialId);
            // Switch to the new material mode
            setStyleMode(materialId);
            // Close the modal
            setShowAddMaterialModal(false);
            // Reset form
            resetMaterialForm();
            console.log("Material created successfully:", materialId);
        } catch (error) {
            // If we still hit quota errors, implement fallback
            console.error('Storage error:', error);
            // Fallback: Store only the most recent materials
            const reducedMaterials = {};
            // Keep just the new material and the default ones
            reducedMaterials[materialId] = newMaterial;
            // Try to save just this one
            try {
                localStorage.setItem('customMaterials', JSON.stringify(reducedMaterials));
                styleOptions = {
                    ...defaultStyleOptions,
                    ...reducedMaterials
                };
                setMaterials(styleOptions);
            } catch (secondError) {
                // If even that fails, alert the user
                alert("Couldn't save your material due to storage limitations. Try clearing some browser data.");
            }
        }
    };
    const handleDeleteMaterial = (event, key)=>{
        event.stopPropagation(); // Prevent triggering the parent button's onClick
        // Only allow deleting custom materials
        if (styleOptions[key]?.isCustom) {
            if (window.confirm(`Are you sure you want to delete the "${styleOptions[key].name}" material?`)) {
                // If currently selected, switch to default material
                if (styleMode === key) {
                    setStyleMode('material');
                }
                // Delete the material
                const { [key]: deleted, ...remaining } = styleOptions;
                const updatedMaterials = {
                    ...defaultStyleOptions,
                    ...remaining
                };
                styleOptions = updatedMaterials;
                setMaterials(updatedMaterials);
                // Save the updated materials
                const customMaterials = {};
                Object.entries(remaining).forEach(([k, v])=>{
                    if (!defaultStyleOptions[k]) {
                        customMaterials[k] = v;
                    }
                });
                localStorage.setItem('customMaterials', JSON.stringify(customMaterials));
            }
        }
    };
    // Add a function to sort materials in the desired order
    const getSortedMaterials = (materials)=>{
        // 1. Get original materials (excluding Test Material)
        const originalMaterials = Object.entries(defaultStyleOptions).filter(([key])=>key !== 'testMaterial').reduce((acc, [key, value])=>({
                ...acc,
                [key]: value
            }), {});
        // 2. Get custom/locally saved materials (excluding Test Material)
        const customMaterials = Object.entries(materials).filter(([key])=>!defaultStyleOptions[key] && key !== 'testMaterial').reduce((acc, [key, value])=>({
                ...acc,
                [key]: value
            }), {});
        // 3. Get Test Material
        const testMaterial = materials.testMaterial ? {
            testMaterial: materials.testMaterial
        } : {};
        // Combine in desired order
        return {
            ...originalMaterials,
            ...customMaterials,
            ...testMaterial
        };
    };
    // Fix the reference image upload function
    const handleReferenceImageUpload = async (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        // Clear recentlyAdded to ensure we're not in edit mode
        setRecentlyAdded(null);
        // Set loading states
        setIsGeneratingText(true);
        setIsGeneratingPreview(true);
        try {
            // Process the image for preview
            const reader = new FileReader();
            reader.onloadend = async (event)=>{
                const imageDataUrl = event.target.result;
                // Set UI state for image
                setCustomImagePreview(imageDataUrl);
                setUseCustomImage(true);
                // Call the analyze-image API
                try {
                    const response = await fetch('/api/analyze-image', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            image: imageDataUrl
                        })
                    });
                    if (!response.ok) {
                        throw new Error(`API returned ${response.status}`);
                    }
                    const data = await response.json();
                    if (data.prompt && data.suggestedName) {
                        // Update the material information
                        setGeneratedMaterialName(data.suggestedName);
                        setNewMaterialName(data.suggestedName);
                        setGeneratedPrompt(data.prompt);
                        setCustomPrompt(data.prompt);
                        setShowCustomPrompt(true);
                    }
                } catch (error) {
                    console.error('Error analyzing reference image:', error);
                    // Set fallback values
                    setGeneratedMaterialName('Reference Material');
                    setNewMaterialName('Reference Material');
                    setGeneratedPrompt('Transform this reference into a 3D rendering with dramatic lighting on a black background.');
                    setCustomPrompt('Transform this reference into a 3D rendering with dramatic lighting on a black background.');
                } finally{
                    setIsGeneratingText(false);
                    setIsGeneratingPreview(false);
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error processing image:', error);
            setIsGeneratingText(false);
            setIsGeneratingPreview(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap gap-2 overflow-y-auto max-h-[35vh] pr-2 ",
                    children: [
                        Object.entries(getSortedMaterials(materials)).map(([key, { name, file, imageData, thumbnail, isCustom }])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: async ()=>{
                                    const isSameMaterial = styleMode === key;
                                    if (!isSameMaterial) {
                                        setStyleMode(key);
                                    } else {
                                        handleGenerate();
                                    }
                                },
                                type: "button",
                                "aria-label": `Select ${name} style`,
                                "aria-pressed": styleMode === key,
                                className: "focus:outline-none relative group",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `w-20 border ${key === 'testMaterial' ? styleMode === key ? 'border-blue-500' : 'border-gray-200 border-dashed' : styleMode === key ? 'border-blue-500' : 'border-gray-200'} overflow-hidden rounded-xl ${styleMode === key ? 'bg-white' : 'bg-gray-50'}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-full relative",
                                            style: {
                                                aspectRatio: '1/1'
                                            },
                                            children: [
                                                key === 'testMaterial' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-full h-full flex items-center justify-center bg-gray-50",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"], {
                                                        className: "w-8 h-8 text-gray-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/StyleSelector.js",
                                                        lineNumber: 737,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StyleSelector.js",
                                                    lineNumber: 736,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: imageData ? `data:image/jpeg;base64,${imageData}` : file ? `/samples/${file}` : thumbnail || '',
                                                    alt: `${name} style example`,
                                                    className: "w-full h-full object-cover",
                                                    onError: (e)=>{
                                                        console.error(`Error loading thumbnail for ${name}`);
                                                        e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StyleSelector.js",
                                                    lineNumber: 740,
                                                    columnNumber: 21
                                                }, this),
                                                isCustom && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "opacity-0 group-hover:opacity-100 transition-opacity",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: (e)=>{
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    handleEditMaterial(key);
                                                                },
                                                                className: "absolute top-1 right-1 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full w-5 h-5 flex items-center justify-center transition-opacity",
                                                                "aria-label": `Edit ${name} material`,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                                    className: "w-2.5 h-2.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/StyleSelector.js",
                                                                    lineNumber: 763,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/StyleSelector.js",
                                                                lineNumber: 754,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: (e)=>{
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    handleDeleteMaterial(e, key);
                                                                },
                                                                className: "absolute top-1 left-1 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full w-5 h-5 flex items-center justify-center transition-opacity",
                                                                "aria-label": `Delete ${name} material`,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                    className: "w-2.5 h-2.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/StyleSelector.js",
                                                                    lineNumber: 774,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/StyleSelector.js",
                                                                lineNumber: 765,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/StyleSelector.js",
                                                        lineNumber: 753,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StyleSelector.js",
                                                    lineNumber: 752,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 734,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `px-1 py-1 text-left text-xs font-medium border-t border-gray-200 ${styleMode === key ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "truncate",
                                                children: name
                                            }, void 0, false, {
                                                fileName: "[project]/components/StyleSelector.js",
                                                lineNumber: 786,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 781,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/StyleSelector.js",
                                    lineNumber: 724,
                                    columnNumber: 15
                                }, this)
                            }, key, false, {
                                fileName: "[project]/components/StyleSelector.js",
                                lineNumber: 709,
                                columnNumber: 13
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleAddMaterial,
                            type: "button",
                            "aria-label": "Add new material",
                            className: "focus:outline-none",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-20 border border-dashed border-gray-200 overflow-hidden rounded-xl bg-gray-50 flex flex-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full relative",
                                        style: {
                                            aspectRatio: '1/1'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-center h-full",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "w-8 h-8 text-gray-400"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StyleSelector.js",
                                                lineNumber: 804,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 803,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/StyleSelector.js",
                                        lineNumber: 802,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-1 py-1 text-left text-xs font-medium border-t border-gray-200 bg-gray-100 text-gray-600 w-full",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "truncate",
                                            children: "Add Material"
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 808,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/StyleSelector.js",
                                        lineNumber: 807,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/StyleSelector.js",
                                lineNumber: 801,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/StyleSelector.js",
                            lineNumber: 795,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/StyleSelector.js",
                    lineNumber: 706,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/StyleSelector.js",
                lineNumber: 705,
                columnNumber: 7
            }, this),
            showAddMaterialModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 modalBackdrop overflow-y-auto p-4",
                onClick: handleClickOutsideModal,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white p-6 rounded-xl shadow-medium max-w-2xl w-full my-8",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-black",
                                children: "Add Material"
                            }, void 0, false, {
                                fileName: "[project]/components/StyleSelector.js",
                                lineNumber: 828,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/StyleSelector.js",
                            lineNumber: 827,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-6 items-start mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-black text-base mb-2",
                                                    children: "Describe your material"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StyleSelector.js",
                                                    lineNumber: 837,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: newMaterialName,
                                                    onChange: (e)=>setNewMaterialName(e.target.value),
                                                    className: "w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black",
                                                    placeholder: "Eg. Bubbles, glass etc"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StyleSelector.js",
                                                    lineNumber: 838,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 836,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative w-[120px] h-[120px] rounded-lg overflow-hidden border border-gray-200",
                                                children: [
                                                    previewThumbnail || customImagePreview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: useCustomImage ? customImagePreview : previewThumbnail,
                                                        alt: "Material preview",
                                                        className: "w-full h-full object-cover"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/StyleSelector.js",
                                                        lineNumber: 851,
                                                        columnNumber: 23
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full h-full bg-gray-50 flex items-center justify-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-gray-400 text-sm text-center px-4",
                                                            children: isGeneratingPreview ? 'Generating...' : 'Preview'
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/StyleSelector.js",
                                                            lineNumber: 858,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/StyleSelector.js",
                                                        lineNumber: 857,
                                                        columnNumber: 23
                                                    }, this),
                                                    isGeneratingPreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0 bg-black/5 flex items-center justify-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-white/90 rounded-full p-2",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                                className: "w-5 h-5 animate-spin text-gray-700"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/StyleSelector.js",
                                                                lineNumber: 866,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/StyleSelector.js",
                                                            lineNumber: 865,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/StyleSelector.js",
                                                        lineNumber: 864,
                                                        columnNumber: 23
                                                    }, this),
                                                    (previewThumbnail || customImagePreview) && !isGeneratingPreview && !useCustomImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleRefreshThumbnail(customPrompt),
                                                        className: "absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white transition-colors",
                                                        title: "Refresh thumbnail",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$ccw$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCcw$3e$__["RefreshCcw"], {
                                                            className: "w-4 h-4 text-gray-600"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/StyleSelector.js",
                                                            lineNumber: 878,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/StyleSelector.js",
                                                        lineNumber: 873,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/StyleSelector.js",
                                                lineNumber: 849,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 848,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/StyleSelector.js",
                                    lineNumber: 834,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-black text-base mb-2",
                                            children: "Or upload a reference image"
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 887,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors",
                                            onClick: ()=>fileInputRef.current?.click(),
                                            style: {
                                                height: "100px"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-row items-center gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                            className: "w-8 h-8 text-gray-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/StyleSelector.js",
                                                            lineNumber: 894,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-gray-500",
                                                            children: "Upload"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/StyleSelector.js",
                                                            lineNumber: 895,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/StyleSelector.js",
                                                    lineNumber: 893,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    ref: fileInputRef,
                                                    type: "file",
                                                    accept: "image/*",
                                                    className: "hidden",
                                                    onChange: handleReferenceImageUpload
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StyleSelector.js",
                                                    lineNumber: 897,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 888,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/StyleSelector.js",
                                    lineNumber: 886,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/StyleSelector.js",
                            lineNumber: 832,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-black font-medium",
                                            children: "Material Name"
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 911,
                                            columnNumber: 17
                                        }, this),
                                        !showMaterialNameEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowMaterialNameEdit(true),
                                            className: "p-1 text-gray-400 hover:text-gray-600 transition-colors",
                                            title: "Edit material name",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StyleSelector.js",
                                                lineNumber: 920,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 915,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/StyleSelector.js",
                                    lineNumber: 910,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        showMaterialNameEdit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: generatedMaterialName,
                                            onChange: (e)=>setGeneratedMaterialName(e.target.value),
                                            className: "w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                                            placeholder: "Enter material name"
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 926,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-full px-3 py-2 bg-gray-50 rounded-lg text-gray-700",
                                            children: generatedMaterialName || 'Generating material name...'
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 934,
                                            columnNumber: 19
                                        }, this),
                                        isGeneratingText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute right-3 top-1/2 transform -translate-y-1/2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                className: "w-4 h-4 animate-spin text-gray-400"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StyleSelector.js",
                                                lineNumber: 940,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 939,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/StyleSelector.js",
                                    lineNumber: 924,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/StyleSelector.js",
                            lineNumber: 909,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-black font-medium",
                                            children: "Prompt"
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 949,
                                            columnNumber: 17
                                        }, this),
                                        !showCustomPrompt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowCustomPrompt(true),
                                            className: "p-1 text-gray-400 hover:text-gray-600 transition-colors",
                                            title: "Edit prompt",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StyleSelector.js",
                                                lineNumber: 958,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 953,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/StyleSelector.js",
                                    lineNumber: 948,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        showCustomPrompt ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    value: customPrompt,
                                                    onChange: (e)=>setCustomPrompt(e.target.value),
                                                    className: "w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32",
                                                    placeholder: "Enter custom prompt"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StyleSelector.js",
                                                    lineNumber: 966,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-end mt-1",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>{
                                                            setCustomPrompt(generatedPrompt);
                                                            setShowCustomPrompt(false);
                                                        },
                                                        className: "text-xs text-blue-600 hover:text-blue-800",
                                                        children: "Reset to Generated"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/StyleSelector.js",
                                                        lineNumber: 973,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StyleSelector.js",
                                                    lineNumber: 972,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-full px-3 py-2 bg-gray-50 rounded-lg text-gray-700 h-32 overflow-y-auto",
                                            children: generatedPrompt || 'Generating prompt...'
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 986,
                                            columnNumber: 19
                                        }, this),
                                        isGeneratingText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute right-3 top-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                className: "w-4 h-4 animate-spin text-gray-400"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StyleSelector.js",
                                                lineNumber: 992,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 991,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/StyleSelector.js",
                                    lineNumber: 963,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/StyleSelector.js",
                            lineNumber: 947,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end gap-3 mt-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowAddMaterialModal(false),
                                    className: "px-4 py-2 text-gray-600 hover:text-gray-800",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/components/StyleSelector.js",
                                    lineNumber: 999,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleCreateMaterial,
                                    disabled: isGeneratingThumbnail || !newMaterialName.trim(),
                                    className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50",
                                    children: "Create Material"
                                }, void 0, false, {
                                    fileName: "[project]/components/StyleSelector.js",
                                    lineNumber: 1005,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/StyleSelector.js",
                            lineNumber: 998,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/StyleSelector.js",
                    lineNumber: 823,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/StyleSelector.js",
                lineNumber: 819,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/StyleSelector.js",
        lineNumber: 704,
        columnNumber: 5
    }, this);
};
_s(StyleSelector, "DAkfqZeApI9JCQJxihYen7a3l/w=");
_c1 = StyleSelector;
const __TURBOPACK__default__export__ = StyleSelector;
var _c, _c1;
__turbopack_context__.k.register(_c, "BASE_PROMPT");
__turbopack_context__.k.register(_c1, "StyleSelector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/Canvas.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/utils/canvasUtils.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2d$line$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PencilLine$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil-line.js [client] (ecmascript) <export default as PencilLine>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2d$plus$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImagePlus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image-plus.js [client] (ecmascript) <export default as ImagePlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LoaderCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [client] (ecmascript) <export default as LoaderCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ToolBar$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ToolBar.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$StyleSelector$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/StyleSelector.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
const Canvas = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ canvasRef, currentTool, isDrawing, startDrawing, draw, stopDrawing, handleCanvasClick, handlePenClick, handleGeneration, tempPoints, setTempPoints, handleUndo, clearCanvas, setCurrentTool, currentDimension, onImageUpload, onGenerate, isGenerating, setIsGenerating, currentColor, currentWidth, handleStrokeWidth, saveCanvasState, onDrawingChange, styleMode, setStyleMode }, ref)=>{
    _s();
    const [showBezierGuides, setShowBezierGuides] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [activePoint, setActivePoint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(-1);
    const [activeHandle, setActiveHandle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [symmetric, setSymmetric] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [lastMousePos, setLastMousePos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const [hasDrawing, setHasDrawing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [strokeCount, setStrokeCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [shapeStartPos, setShapeStartPos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [previewCanvas, setPreviewCanvas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isDoodleConverting, setIsDoodleConverting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [uploadedImages, setUploadedImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [draggingImage, setDraggingImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [resizingImage, setResizingImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [dragOffset, setDragOffset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    // Add touch event prevention function
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Canvas.useEffect": ()=>{
            // Function to prevent default touch behavior on canvas
            const preventTouchDefault = {
                "Canvas.useEffect.preventTouchDefault": (e)=>{
                    if (isDrawing) {
                        e.preventDefault();
                    }
                }
            }["Canvas.useEffect.preventTouchDefault"];
            // Add event listener when component mounts
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.addEventListener('touchstart', preventTouchDefault, {
                    passive: false
                });
                canvas.addEventListener('touchmove', preventTouchDefault, {
                    passive: false
                });
            }
            // Remove event listener when component unmounts
            return ({
                "Canvas.useEffect": ()=>{
                    if (canvas) {
                        canvas.removeEventListener('touchstart', preventTouchDefault);
                        canvas.removeEventListener('touchmove', preventTouchDefault);
                    }
                }
            })["Canvas.useEffect"];
        }
    }["Canvas.useEffect"], [
        isDrawing,
        canvasRef
    ]);
    // Add debugging info to console
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Canvas.useEffect": ()=>{
            console.log('Canvas tool changed or isDrawing changed:', {
                currentTool,
                isDrawing
            });
        }
    }["Canvas.useEffect"], [
        currentTool,
        isDrawing
    ]);
    // Add effect to rerender when uploadedImages change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Canvas.useEffect": ()=>{
            if (uploadedImages.length > 0) {
                renderCanvas();
            }
        }
    }["Canvas.useEffect"], [
        uploadedImages
    ]);
    // Redraw bezier guides and control points when tempPoints change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Canvas.useEffect": ()=>{
            if (currentTool === 'pen' && tempPoints.length > 0 && showBezierGuides) {
                redrawBezierGuides();
            }
        }
    }["Canvas.useEffect"], [
        tempPoints,
        showBezierGuides,
        currentTool
    ]);
    // Add useEffect to check if canvas has content
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Canvas.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            // Check if canvas has any non-white pixels (i.e., has a drawing)
            const hasNonWhitePixels = Array.from(imageData.data).some({
                "Canvas.useEffect.hasNonWhitePixels": (pixel, index)=>{
                    // Check only RGB values (skip alpha)
                    return index % 4 !== 3 && pixel !== 255;
                }
            }["Canvas.useEffect.hasNonWhitePixels"]);
            setHasDrawing(hasNonWhitePixels);
        }
    }["Canvas.useEffect"], [
        canvasRef
    ]);
    const handleKeyDown = (e)=>{
        // Add keyboard accessibility
        if (e.key === 'Enter' || e.key === ' ') {
            handleCanvasClick(e);
        }
        // Toggle symmetric handles with Shift key
        if (e.key === 'Shift') {
            setSymmetric(!symmetric);
        }
    };
    // Draw bezier control points and guide lines
    const redrawBezierGuides = ()=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        // Get the canvas context
        const ctx = canvas.getContext('2d');
        // Save the current canvas state to redraw later
        const canvasImage = new Image();
        canvasImage.src = canvas.toDataURL();
        canvasImage.onload = ()=>{
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Redraw the canvas content
            ctx.drawImage(canvasImage, 0, 0);
            // Draw the control points and guide lines
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["drawBezierGuides"])(ctx, tempPoints);
        };
    };
    // Function to draw a star shape
    const drawStar = (ctx, x, y, radius, points = 5)=>{
        ctx.beginPath();
        for(let i = 0; i <= points * 2; i++){
            const r = i % 2 === 0 ? radius : radius / 2;
            const angle = i * Math.PI / points;
            const xPos = x + r * Math.sin(angle);
            const yPos = y + r * Math.cos(angle);
            if (i === 0) ctx.moveTo(xPos, yPos);
            else ctx.lineTo(xPos, yPos);
        }
        ctx.closePath();
    };
    // Function to draw shapes
    const drawShape = (ctx, startPos, endPos, shape, isPreview = false)=>{
        if (!startPos || !endPos) return;
        const width = endPos.x - startPos.x;
        const height = endPos.y - startPos.y;
        const radius = Math.sqrt(width * width + height * height) / 2;
        ctx.strokeStyle = currentColor || '#000000';
        ctx.fillStyle = currentColor || '#000000';
        ctx.lineWidth = currentWidth || 2;
        switch(shape){
            case 'rect':
                if (isPreview) {
                    ctx.strokeRect(startPos.x, startPos.y, width, height);
                } else {
                    ctx.fillRect(startPos.x, startPos.y, width, height);
                }
                break;
            case 'circle':
                ctx.beginPath();
                ctx.ellipse(startPos.x + width / 2, startPos.y + height / 2, Math.abs(width / 2), Math.abs(height / 2), 0, 0, 2 * Math.PI);
                if (isPreview) {
                    ctx.stroke();
                } else {
                    ctx.fill();
                }
                break;
            case 'line':
                ctx.beginPath();
                ctx.lineCap = 'round';
                ctx.lineWidth = currentWidth * 2 || 4; // Make lines thicker
                ctx.moveTo(startPos.x, startPos.y);
                ctx.lineTo(endPos.x, endPos.y);
                ctx.stroke();
                break;
            case 'star':
                {
                    const centerX = startPos.x + width / 2;
                    const centerY = startPos.y + height / 2;
                    drawStar(ctx, centerX, centerY, radius);
                    if (isPreview) {
                        ctx.stroke();
                    } else {
                        ctx.fill();
                    }
                    break;
                }
        }
    };
    // Add this new renderCanvas function after handleFileChange
    const renderCanvas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Canvas.useCallback[renderCanvas]": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            // Store current canvas state in a temporary canvas to preserve drawings
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(canvas, 0, 0);
            // Clear canvas
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // Redraw original content
            ctx.drawImage(tempCanvas, 0, 0);
            // Draw all uploaded images
            for (const img of uploadedImages){
                const imageObj = new Image();
                imageObj.src = img.src;
                ctx.drawImage(imageObj, img.x, img.y, img.width, img.height);
                // Draw selection handles if dragging or resizing this image
                if (draggingImage === img.id || resizingImage === img.id) {
                    // Draw border
                    ctx.strokeStyle = '#0080ff';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(img.x, img.y, img.width, img.height);
                    // Draw corner resize handles
                    ctx.fillStyle = '#0080ff';
                    const handleSize = 8;
                    // Top-left
                    ctx.fillRect(img.x - handleSize / 2, img.y - handleSize / 2, handleSize, handleSize);
                    // Top-right
                    ctx.fillRect(img.x + img.width - handleSize / 2, img.y - handleSize / 2, handleSize, handleSize);
                    // Bottom-left
                    ctx.fillRect(img.x - handleSize / 2, img.y + img.height - handleSize / 2, handleSize, handleSize);
                    // Bottom-right
                    ctx.fillRect(img.x + img.width - handleSize / 2, img.y + img.height - handleSize / 2, handleSize, handleSize);
                }
            }
        }
    }["Canvas.useCallback[renderCanvas]"], [
        canvasRef,
        uploadedImages,
        draggingImage,
        resizingImage
    ]);
    // Handle mouse down for image interaction
    const handleImageMouseDown = (e)=>{
        if (currentTool !== 'selection') return false;
        const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getCoordinates"])(e, canvasRef.current);
        const handleSize = 8;
        // Check if clicked on any image handle first (for resizing)
        for(let i = uploadedImages.length - 1; i >= 0; i--){
            const img = uploadedImages[i];
            // Check if clicked on bottom-right resize handle
            if (x >= img.x + img.width - handleSize / 2 - 5 && x <= img.x + img.width + handleSize / 2 + 5 && y >= img.y + img.height - handleSize / 2 - 5 && y <= img.y + img.height + handleSize / 2 + 5) {
                setResizingImage(img.id);
                setDragOffset({
                    x: x - (img.x + img.width),
                    y: y - (img.y + img.height)
                });
                return true;
            }
        }
        // If not resizing, check if clicked on any image (for dragging)
        for(let i = uploadedImages.length - 1; i >= 0; i--){
            const img = uploadedImages[i];
            if (x >= img.x && x <= img.x + img.width && y >= img.y && y <= img.y + img.height) {
                setDraggingImage(img.id);
                setDragOffset({
                    x: x - img.x,
                    y: y - img.y
                });
                return true;
            }
        }
        return false;
    };
    // Handle mouse move for image interaction
    const handleImageMouseMove = (e)=>{
        if (!draggingImage && !resizingImage) return false;
        const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getCoordinates"])(e, canvasRef.current);
        if (draggingImage) {
            // Update position of dragged image
            setUploadedImages((prev)=>prev.map((img)=>{
                    if (img.id === draggingImage) {
                        return {
                            ...img,
                            x: x - dragOffset.x,
                            y: y - dragOffset.y
                        };
                    }
                    return img;
                }));
            renderCanvas();
            return true;
        }
        if (resizingImage) {
            // Update size of resized image
            setUploadedImages((prev)=>prev.map((img)=>{
                    if (img.id === resizingImage) {
                        // Calculate new width and height
                        const newWidth = Math.max(20, x - img.x - dragOffset.x + 10);
                        const newHeight = Math.max(20, y - img.y - dragOffset.y + 10);
                        // Option 1: Free resize
                        return {
                            ...img,
                            width: newWidth,
                            height: newHeight
                        };
                    // Option 2: Maintain aspect ratio (uncomment if needed)
                    /*
          const aspectRatio = img.originalWidth / img.originalHeight;
          const newHeight = newWidth / aspectRatio;
          return {
            ...img,
            width: newWidth,
            height: newHeight
          };
          */ }
                    return img;
                }));
            renderCanvas();
            return true;
        }
        return false;
    };
    // Handle mouse up for image interaction
    const handleImageMouseUp = ()=>{
        if (draggingImage || resizingImage) {
            setDraggingImage(null);
            setResizingImage(null);
            saveCanvasState();
            return true;
        }
        return false;
    };
    // Function to delete the selected image
    const deleteSelectedImage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Canvas.useCallback[deleteSelectedImage]": ()=>{
            if (draggingImage) {
                setUploadedImages({
                    "Canvas.useCallback[deleteSelectedImage]": (prev)=>prev.filter({
                            "Canvas.useCallback[deleteSelectedImage]": (img)=>img.id !== draggingImage
                        }["Canvas.useCallback[deleteSelectedImage]"])
                }["Canvas.useCallback[deleteSelectedImage]"]);
                setDraggingImage(null);
                renderCanvas();
                saveCanvasState();
            }
        }
    }["Canvas.useCallback[deleteSelectedImage]"], [
        draggingImage,
        renderCanvas,
        saveCanvasState
    ]);
    // Modify existing startDrawing to check for image interaction first
    const handleStartDrawing = (e)=>{
        console.log('Canvas onMouseDown', {
            currentTool,
            isDrawing
        });
        // Check if we're interacting with an image first
        if (handleImageMouseDown(e)) {
            return;
        }
        if (currentTool === 'pen') {
            if (!checkForPointOrHandle(e)) {
                handlePenToolClick(e);
            }
            return;
        }
        const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getCoordinates"])(e, canvasRef.current);
        if ([
            'rect',
            'circle',
            'line',
            'star'
        ].includes(currentTool)) {
            setShapeStartPos({
                x,
                y
            });
            // Create preview canvas if it doesn't exist
            if (!previewCanvas) {
                const canvas = document.createElement('canvas');
                canvas.width = canvasRef.current.width;
                canvas.height = canvasRef.current.height;
                setPreviewCanvas(canvas);
            }
        }
        startDrawing(e);
        setHasDrawing(true);
    };
    // Modify existing draw to handle image interaction
    const handleDraw = (e)=>{
        // Handle image dragging/resizing first
        if (handleImageMouseMove(e)) {
            return;
        }
        if (currentTool === 'pen' && handleBezierMouseMove(e)) {
            return;
        }
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getCoordinates"])(e, canvas);
        draw(e);
    };
    // Modify existing stopDrawing to handle image interaction
    const handleStopDrawing = (e)=>{
        // Handle image release first
        if (handleImageMouseUp()) {
            return;
        }
        console.log('handleStopDrawing called', {
            eventType: e?.type,
            currentTool,
            isDrawing,
            activePoint,
            activeHandle
        });
        // If we're using the pen tool with active point or handle
        if (currentTool === 'pen') {
            // If we were dragging a handle, just release it
            if (activeHandle) {
                setActiveHandle(null);
                return;
            }
            // If we were dragging an anchor point, just release it
            if (activePoint !== -1) {
                setActivePoint(-1);
                return;
            }
        }
        stopDrawing(e);
        // If using the pencil tool and we've just finished a drag, trigger generation
        if (currentTool === 'pencil' && isDrawing && !isGenerating) {
            console.log(`${currentTool} tool condition met, will try to trigger generation`);
            // Set generating flag to prevent multiple calls
            if (typeof setIsGenerating === 'function') {
                setIsGenerating(true);
            }
            // Generate immediately - no timeout needed
            console.log('Calling handleGeneration function');
            if (typeof handleGeneration === 'function') {
                handleGeneration();
            } else {
                console.error('handleGeneration is not a function:', handleGeneration);
            }
        } else {
            console.log('Generation not triggered because:', {
                isPencilTool: currentTool === 'pencil',
                wasDrawing: isDrawing,
                isGenerating
            });
        }
    };
    // Handle keyboard events for image deletion
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Canvas.useEffect": ()=>{
            const handleKeyDown = {
                "Canvas.useEffect.handleKeyDown": (e)=>{
                    if ((e.key === 'Delete' || e.key === 'Backspace') && draggingImage) {
                        deleteSelectedImage();
                    }
                }
            }["Canvas.useEffect.handleKeyDown"];
            window.addEventListener('keydown', handleKeyDown);
            return ({
                "Canvas.useEffect": ()=>{
                    window.removeEventListener('keydown', handleKeyDown);
                }
            })["Canvas.useEffect"];
        }
    }["Canvas.useEffect"], [
        draggingImage,
        deleteSelectedImage
    ]);
    // Check if we clicked on an existing point or handle
    const checkForPointOrHandle = (e)=>{
        if (currentTool !== 'pen' || !showBezierGuides || tempPoints.length === 0) {
            return false;
        }
        const canvas = canvasRef.current;
        const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getCoordinates"])(e, canvas);
        setLastMousePos({
            x,
            y
        });
        // Check if we clicked on a handle
        for(let i = 0; i < tempPoints.length; i++){
            const point = tempPoints[i];
            // Check for handleIn
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isNearHandle"])(point, 'handleIn', x, y)) {
                setActivePoint(i);
                setActiveHandle('handleIn');
                return true;
            }
            // Check for handleOut
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["isNearHandle"])(point, 'handleOut', x, y)) {
                setActivePoint(i);
                setActiveHandle('handleOut');
                return true;
            }
            // Check for the anchor point itself
            const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
            if (distance <= 10) {
                setActivePoint(i);
                setActiveHandle(null);
                return true;
            }
        }
        return false;
    };
    // Handle mouse move for bezier control point or handle dragging
    const handleBezierMouseMove = (e)=>{
        if (currentTool !== 'pen') {
            return false;
        }
        const canvas = canvasRef.current;
        const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getCoordinates"])(e, canvas);
        const dx = x - lastMousePos.x;
        const dy = y - lastMousePos.y;
        // If we're dragging a handle
        if (activePoint !== -1 && activeHandle) {
            const newPoints = [
                ...tempPoints
            ];
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["updateHandle"])(newPoints[activePoint], activeHandle, dx, dy, symmetric);
            setTempPoints(newPoints);
            setLastMousePos({
                x,
                y
            });
            return true;
        }
        // If we're dragging an anchor point
        if (activePoint !== -1) {
            const newPoints = [
                ...tempPoints
            ];
            newPoints[activePoint].x += dx;
            newPoints[activePoint].y += dy;
            // If this point has handles, move them with the point
            if (newPoints[activePoint].handleIn) {
            // No need to change the handle's offset, just move with the point
            }
            if (newPoints[activePoint].handleOut) {
            // No need to change the handle's offset, just move with the point
            }
            setTempPoints(newPoints);
            setLastMousePos({
                x,
                y
            });
            return true;
        }
        return false;
    };
    // Handle clicks for bezier curve tool
    const handlePenToolClick = (e)=>{
        const canvas = canvasRef.current;
        const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getCoordinates"])(e, canvas);
        // Add a new point
        if (tempPoints.length === 0) {
            // First point has no handles initially
            const newPoint = {
                x,
                y,
                handleIn: null,
                handleOut: null
            };
            setTempPoints([
                newPoint
            ]);
        } else {
            // Create a new point with handles relative to the last point
            const newPoint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createAnchorPoint"])(x, y, tempPoints[tempPoints.length - 1]);
            setTempPoints([
                ...tempPoints,
                newPoint
            ]);
        }
        // Always show guides when adding points
        setShowBezierGuides(true);
    };
    // Toggle bezier guide visibility
    const toggleBezierGuides = ()=>{
        setShowBezierGuides(!showBezierGuides);
        if (showBezierGuides) {
            redrawBezierGuides();
        }
    };
    // Draw the final bezier curve and clear control points
    const finalizeBezierCurve = ()=>{
        if (tempPoints.length < 2) {
            // Need at least 2 points for a path
            console.log('Need at least 2 control points to draw a path');
            return;
        }
        const canvas = canvasRef.current;
        // Draw the actual bezier curve
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["drawBezierCurve"])(canvas, tempPoints);
        // Hide guides and reset control points
        setShowBezierGuides(false);
        setTempPoints([]);
        // Trigger generation only if not already generating
        if (!isGenerating) {
            // Set generating flag to prevent multiple calls
            if (typeof setIsGenerating === 'function') {
                setIsGenerating(true);
            }
            if (typeof handleGeneration === 'function') {
                handleGeneration();
            }
        }
    };
    // Add control point to segment
    const addControlPoint = (e)=>{
        if (currentTool !== 'pen' || tempPoints.length < 2) return;
        const canvas = canvasRef.current;
        const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getCoordinates"])(e, canvas);
        // Find the closest segment to add a point to
        let closestDistance = Number.POSITIVE_INFINITY;
        let insertIndex = -1;
        for(let i = 0; i < tempPoints.length - 1; i++){
            const p1 = tempPoints[i];
            const p2 = tempPoints[i + 1];
            // Calculate distance from click to line between points
            // This is a simplified distance calculation for demo purposes
            const lineLength = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
            if (lineLength === 0) continue;
            // Project point onto line
            const t = ((x - p1.x) * (p2.x - p1.x) + (y - p1.y) * (p2.y - p1.y)) / (lineLength * lineLength);
            // If projection is outside the line segment, skip
            if (t < 0 || t > 1) continue;
            // Calculate closest point on line
            const closestX = p1.x + t * (p2.x - p1.x);
            const closestY = p1.y + t * (p2.y - p1.y);
            // Calculate distance to closest point
            const distance = Math.sqrt((x - closestX) ** 2 + (y - closestY) ** 2);
            if (distance < closestDistance && distance < 20) {
                closestDistance = distance;
                insertIndex = i + 1;
            }
        }
        if (insertIndex > 0) {
            // Create a new array with the new point inserted
            const newPoints = [
                ...tempPoints
            ];
            const prevPoint = newPoints[insertIndex - 1];
            const nextPoint = newPoints[insertIndex];
            // Create a new point at the click position with automatically calculated handles
            const newPoint = {
                x,
                y,
                // Calculate handles based on the positions of adjacent points
                handleIn: {
                    x: (prevPoint.x - x) * 0.25,
                    y: (prevPoint.y - y) * 0.25
                },
                handleOut: {
                    x: (nextPoint.x - x) * 0.25,
                    y: (nextPoint.y - y) * 0.25
                }
            };
            // Insert the new point
            newPoints.splice(insertIndex, 0, newPoint);
            setTempPoints(newPoints);
        }
    };
    // Add function to handle image upload
    const handleImageUpload = async (imageDataUrl)=>{
        console.log("handleImageUpload called with image data");
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error("Canvas ref is null");
            return;
        }
        // Set hasDrawing to true immediately
        setHasDrawing(true);
        if (typeof onDrawingChange === 'function') {
            onDrawingChange(true);
        }
        // First, let's convert to doodle
        try {
            console.log("Setting loading state...");
            setIsDoodleConverting(true);
            console.log("Making API call to convert to doodle...");
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: "can you convert this into a detailed black and white doodle <3\ndo not add or change this! follow it. just see that a black line was drawing this on a white background :)\nPlease add as much detail as you can. Include texture details, shading elements, and fine features from the original.",
                    drawingData: imageDataUrl.split(",")[1]
                })
            });
            console.log("API response received");
            const data = await response.json();
            console.log("Response data:", data);
            if (data.success && data.imageData) {
                console.log("Valid image data received, creating image...");
                // Draw the doodle version to the canvas
                const img = new Image();
                img.onload = ()=>{
                    console.log("Image loaded, drawing to canvas...");
                    const ctx = canvas.getContext('2d');
                    // Clear canvas
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    // Calculate dimensions
                    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
                    const x = (canvas.width - img.width * scale) / 2;
                    const y = (canvas.height - img.height * scale) / 2;
                    // Draw doodle
                    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                    // Set hasDrawing to true since we now have content
                    if (typeof onDrawingChange === 'function') {
                        onDrawingChange(true);
                    }
                    // Save canvas state
                    saveCanvasState();
                    // Automatically trigger 3D generation after a short delay, but only if not already generating
                    console.log("Setting timeout for automatic generation...");
                    setTimeout(()=>{
                        console.log("Timeout expired, checking if we can call handleGeneration...");
                        if (typeof handleGeneration === 'function' && !isGenerating) {
                            console.log("Calling handleGeneration and setting isGenerating flag...");
                            setIsGenerating(true);
                            handleGeneration();
                        } else {
                            console.log("Skipping generation because isGenerating is already true or handleGeneration is not available");
                        }
                    }, 1000);
                };
                img.src = `data:image/png;base64,${data.imageData}`;
            } else {
                console.error("Invalid response data:", data);
            }
        } catch (error) {
            console.error('Error converting image to doodle:', error);
        } finally{
            console.log("Setting loading state to false");
            setIsDoodleConverting(false);
        }
    };
    const handleGenerate = ()=>{
        const canvas = canvasRef.current;
        const imageData = canvas.toDataURL('image/png');
        onGenerate(imageData);
    };
    const handleUploadClick = ()=>{
        fileInputRef.current?.click();
    };
    const handleFileChange = (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        // Clear "Draw Here" message right away
        if (typeof onDrawingChange === 'function') {
            onDrawingChange(true);
        }
        // Also update local state immediately
        setHasDrawing(true);
        const reader = new FileReader();
        reader.onload = (event)=>{
            const imageUrl = event.target.result;
            const img = new Image();
            img.onload = ()=>{
                // Calculate appropriate dimensions while maintaining aspect ratio
                const maxWidth = canvasRef.current.width * 0.6; // Max 60% of canvas width
                const maxHeight = canvasRef.current.height * 0.6; // Max 60% of canvas height
                const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
                const width = img.width * scale;
                const height = img.height * scale;
                // Position in the center of the canvas
                const x = (canvasRef.current.width - width) / 2;
                const y = (canvasRef.current.height - height) / 2;
                // Add to uploaded images state
                const newImage = {
                    id: Date.now(),
                    src: imageUrl,
                    x,
                    y,
                    width,
                    height,
                    originalWidth: img.width,
                    originalHeight: img.height
                };
                setUploadedImages((prev)=>[
                        ...prev,
                        newImage
                    ]);
                // Render the image to the canvas
                renderCanvas();
                // Save canvas state
                saveCanvasState();
            };
            img.src = imageUrl;
        };
        reader.readAsDataURL(file);
    };
    // Add custom clearCanvas implementation
    const handleClearCanvas = ()=>{
        // Clear the canvas
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Re-render all images
        renderCanvas();
        // Save the new state
        saveCanvasState();
        // Call the original clearCanvas function but only for other side effects
        // like clearing the generated image
        clearCanvas();
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useImperativeHandle"])(ref, {
        "Canvas.useImperativeHandle": ()=>({
                handleClearCanvas
            })
    }["Canvas.useImperativeHandle"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full",
                style: {
                    aspectRatio: `${currentDimension.width} / ${currentDimension.height}`
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                        ref: canvasRef,
                        width: currentDimension.width,
                        height: currentDimension.height,
                        className: "absolute inset-0 w-full h-full border border-gray-300 bg-white rounded-xl shadow-soft",
                        style: {
                            touchAction: 'none'
                        },
                        onMouseDown: handleStartDrawing,
                        onMouseMove: handleDraw,
                        onMouseUp: handleStopDrawing,
                        onMouseLeave: handleStopDrawing,
                        onTouchStart: handleStartDrawing,
                        onTouchMove: handleDraw,
                        onTouchEnd: handleStopDrawing,
                        onClick: handleCanvasClick,
                        onKeyDown: handleKeyDown,
                        tabIndex: "0",
                        "aria-label": "Drawing canvas"
                    }, void 0, false, {
                        fileName: "[project]/components/Canvas.js",
                        lineNumber: 923,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleUploadClick,
                        className: "absolute bottom-4 right-4 z-10 bg-white border border-gray-200 text-gray-700 rounded-lg p-3 flex items-center justify-center shadow-soft hover:bg-gray-100 transition-colors",
                        "aria-label": "Upload image",
                        title: "Upload image",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2d$plus$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImagePlus$3e$__["ImagePlus"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/components/Canvas.js",
                                lineNumber: 952,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "file",
                                ref: fileInputRef,
                                onChange: handleFileChange,
                                className: "hidden",
                                accept: "image/*"
                            }, void 0, false, {
                                fileName: "[project]/components/Canvas.js",
                                lineNumber: 953,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Canvas.js",
                        lineNumber: 945,
                        columnNumber: 9
                    }, this),
                    isDoodleConverting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-xl z-50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white shadow-lg rounded-xl p-6 flex flex-col items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LoaderCircle$3e$__["LoaderCircle"], {
                                    className: "w-12 h-12 text-gray-700 animate-spin mb-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/Canvas.js",
                                    lineNumber: 966,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-900 font-medium text-lg",
                                    children: "Converting to doodle..."
                                }, void 0, false, {
                                    fileName: "[project]/components/Canvas.js",
                                    lineNumber: 967,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-500 text-sm mt-2",
                                    children: "This may take a moment"
                                }, void 0, false, {
                                    fileName: "[project]/components/Canvas.js",
                                    lineNumber: 968,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Canvas.js",
                            lineNumber: 965,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/Canvas.js",
                        lineNumber: 964,
                        columnNumber: 11
                    }, this),
                    !hasDrawing && !isDoodleConverting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2d$line$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PencilLine$3e$__["PencilLine"], {
                                className: "w-8 h-8 text-gray-400 mb-2"
                            }, void 0, false, {
                                fileName: "[project]/components/Canvas.js",
                                lineNumber: 976,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-400 text-lg font-medium",
                                children: "Draw here"
                            }, void 0, false, {
                                fileName: "[project]/components/Canvas.js",
                                lineNumber: 977,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Canvas.js",
                        lineNumber: 975,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Canvas.js",
                lineNumber: 922,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$StyleSelector$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    styleMode: styleMode,
                    setStyleMode: setStyleMode,
                    handleGenerate: handleGeneration
                }, void 0, false, {
                    fileName: "[project]/components/Canvas.js",
                    lineNumber: 984,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Canvas.js",
                lineNumber: 983,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Canvas.js",
        lineNumber: 920,
        columnNumber: 5
    }, this);
}, "cFJXWCzCRs9xm+aFDsN/1fhQghw=")), "cFJXWCzCRs9xm+aFDsN/1fhQghw=");
_c1 = Canvas;
Canvas.displayName = 'Canvas';
const __TURBOPACK__default__export__ = Canvas;
var _c, _c1;
__turbopack_context__.k.register(_c, "Canvas$forwardRef");
__turbopack_context__.k.register(_c1, "Canvas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/ActionBar.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/history.js [client] (ecmascript) <export default as History>");
;
;
const ActionBar = ({ handleSaveImage, handleRegenerate, onOpenHistory })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex gap-2 bg-white rounded-xl shadow-soft p-2 border border-gray-200",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onOpenHistory,
                className: "p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
                "aria-label": "View History",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"], {
                    className: "w-5 h-5"
                }, void 0, false, {
                    fileName: "[project]/components/ActionBar.js",
                    lineNumber: 12,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ActionBar.js",
                lineNumber: 6,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-px bg-gray-200 mx-1"
            }, void 0, false, {
                fileName: "[project]/components/ActionBar.js",
                lineNumber: 15,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: handleRegenerate,
                className: "p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
                "aria-label": "Regenerate",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                    className: "w-5 h-5"
                }, void 0, false, {
                    fileName: "[project]/components/ActionBar.js",
                    lineNumber: 23,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ActionBar.js",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-px bg-gray-200 mx-1"
            }, void 0, false, {
                fileName: "[project]/components/ActionBar.js",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: handleSaveImage,
                className: "p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
                "aria-label": "Save Image",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                    className: "w-5 h-5"
                }, void 0, false, {
                    fileName: "[project]/components/ActionBar.js",
                    lineNumber: 34,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ActionBar.js",
                lineNumber: 28,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ActionBar.js",
        lineNumber: 5,
        columnNumber: 5
    }, this);
};
_c = ActionBar;
const __TURBOPACK__default__export__ = ActionBar;
var _c;
__turbopack_context__.k.register(_c, "ActionBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/ImageRefiner.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [client] (ecmascript) <export default as Send>");
;
var _s = __turbopack_context__.k.signature();
;
;
const ImageRefiner = ({ onRefine, isLoading, hasGeneratedContent })=>{
    _s();
    const [inputValue, setInputValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (!inputValue.trim()) return;
        onRefine(inputValue);
        setInputValue('');
    };
    if (!hasGeneratedContent) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "flex gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "text",
                value: inputValue,
                onChange: (e)=>setInputValue(e.target.value),
                placeholder: "Type to refine the image...",
                disabled: isLoading,
                className: "flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            }, void 0, false, {
                fileName: "[project]/components/ImageRefiner.js",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "submit",
                disabled: isLoading || !inputValue.trim(),
                className: "p-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                    className: "w-5 h-5"
                }, void 0, false, {
                    fileName: "[project]/components/ImageRefiner.js",
                    lineNumber: 35,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ImageRefiner.js",
                lineNumber: 30,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ImageRefiner.js",
        lineNumber: 21,
        columnNumber: 5
    }, this);
};
_s(ImageRefiner, "SORcW8kVWUa8fZ+un8oXhp/OLnk=");
_c = ImageRefiner;
const __TURBOPACK__default__export__ = ImageRefiner;
var _c;
__turbopack_context__.k.register(_c, "ImageRefiner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/DisplayCanvas.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LoaderCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [client] (ecmascript) <export default as LoaderCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [client] (ecmascript) <export default as ImageIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$cw$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-cw.js [client] (ecmascript) <export default as RotateCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/maximize.js [client] (ecmascript) <export default as Maximize>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wand$2d$sparkles$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wand2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wand-sparkles.js [client] (ecmascript) <export default as Wand2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/palette.js [client] (ecmascript) <export default as Palette>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ActionBar$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ActionBar.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ImageRefiner$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ImageRefiner.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
// Update REFINEMENT_SUGGESTIONS with cleaner labels and full prompts
const REFINEMENT_SUGGESTIONS = [
    {
        label: 'Rotate',
        prompt: 'Can you rotate this by ',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$cw$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCw$3e$__["RotateCw"]
    },
    {
        label: 'Add light',
        prompt: 'Can you add a light from the ',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"]
    },
    {
        label: 'Add object',
        prompt: 'Can you add a ',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"]
    },
    {
        label: 'Background',
        prompt: 'Can you change the background to ',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"]
    },
    {
        label: 'Color',
        prompt: 'Can you make the color more ',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__["Palette"]
    },
    {
        label: 'Scale',
        prompt: 'Can you make this ',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize$3e$__["Maximize"]
    },
    {
        label: 'Lighting',
        prompt: 'Can you make the lighting more ',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"]
    },
    {
        label: 'Style',
        prompt: 'Can you make it look more ',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wand$2d$sparkles$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wand2$3e$__["Wand2"]
    },
    {
        label: 'Material',
        prompt: 'Can you change the material to ',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wand$2d$sparkles$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wand2$3e$__["Wand2"]
    }
];
const DisplayCanvas = ({ displayCanvasRef, isLoading, handleSaveImage, handleRegenerate, hasGeneratedContent = false, currentDimension, onOpenHistory, onRefineImage })=>{
    _s();
    // Use a local state that combines props with local state
    const [showPlaceholder, setShowPlaceholder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [inputValue, setInputValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Update placeholder visibility when loading or content prop changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DisplayCanvas.useEffect": ()=>{
            if (hasGeneratedContent) {
                setShowPlaceholder(false);
            } else if (isLoading) {
                setShowPlaceholder(true);
            }
        }
    }["DisplayCanvas.useEffect"], [
        isLoading,
        hasGeneratedContent
    ]);
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (!inputValue.trim()) return;
        onRefineImage(inputValue);
        setInputValue('');
    };
    const handleSuggestionClick = (suggestion)=>{
        // Use the full prompt when clicking the suggestion
        setInputValue(suggestion.prompt);
        // Optional: Focus the input after clicking suggestion
        document.querySelector('input[name="refiner"]').focus();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full",
                style: {
                    aspectRatio: `${currentDimension.width} / ${currentDimension.height}`
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                        ref: displayCanvasRef,
                        width: currentDimension.width,
                        height: currentDimension.height,
                        className: "absolute inset-0 w-full h-full border border-gray-300 bg-white rounded-xl shadow-soft",
                        "aria-label": "Generated image canvas"
                    }, void 0, false, {
                        fileName: "[project]/components/DisplayCanvas.js",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 flex items-center justify-center bg-black/5 rounded-xl",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white/90 rounded-full p-3 shadow-medium",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LoaderCircle$3e$__["LoaderCircle"], {
                                className: "w-8 h-8 animate-spin text-gray-700"
                            }, void 0, false, {
                                fileName: "[project]/components/DisplayCanvas.js",
                                lineNumber: 73,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/DisplayCanvas.js",
                            lineNumber: 72,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/DisplayCanvas.js",
                        lineNumber: 71,
                        columnNumber: 11
                    }, this),
                    showPlaceholder && !isLoading && !hasGeneratedContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__["ImageIcon"], {
                                className: "w-7 h-7 text-gray-400 mb-2"
                            }, void 0, false, {
                                fileName: "[project]/components/DisplayCanvas.js",
                                lineNumber: 81,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-400 text-lg font-medium",
                                children: "Generation will appear here"
                            }, void 0, false, {
                                fileName: "[project]/components/DisplayCanvas.js",
                                lineNumber: 82,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/DisplayCanvas.js",
                        lineNumber: 80,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-4 right-4 z-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ActionBar$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            handleSaveImage: handleSaveImage,
                            handleRegenerate: handleRegenerate,
                            onOpenHistory: onOpenHistory
                        }, void 0, false, {
                            fileName: "[project]/components/DisplayCanvas.js",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/DisplayCanvas.js",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/DisplayCanvas.js",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            hasGeneratedContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "flex",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 flex items-center bg-white rounded-xl shadow-soft p-2 border border-gray-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    name: "refiner",
                                    type: "text",
                                    value: inputValue,
                                    onChange: (e)=>setInputValue(e.target.value),
                                    placeholder: "Type to refine the image...",
                                    disabled: isLoading,
                                    className: "flex-1 px-2 bg-transparent border-none text-gray-600 placeholder-gray-300 focus:outline-none"
                                }, void 0, false, {
                                    fileName: "[project]/components/DisplayCanvas.js",
                                    lineNumber: 101,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: isLoading || !inputValue.trim(),
                                    className: "p-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                                    "aria-label": "Send refinement",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/DisplayCanvas.js",
                                        lineNumber: 116,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/DisplayCanvas.js",
                                    lineNumber: 110,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/DisplayCanvas.js",
                            lineNumber: 100,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/DisplayCanvas.js",
                        lineNumber: 99,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-1.5",
                        children: REFINEMENT_SUGGESTIONS.map((suggestion, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>handleSuggestionClick(suggestion),
                                className: "flex items-center gap-1.5 px-2 py-0.5 text-xs bg-white hover:bg-gray-50 rounded-full border border-gray-200 text-gray-400 opacity-60 hover:text-gray-600 hover:opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(suggestion.icon, {
                                        className: "w-3.5 h-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/DisplayCanvas.js",
                                        lineNumber: 130,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: suggestion.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/DisplayCanvas.js",
                                        lineNumber: 131,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, index, true, {
                                fileName: "[project]/components/DisplayCanvas.js",
                                lineNumber: 124,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/DisplayCanvas.js",
                        lineNumber: 122,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/DisplayCanvas.js",
                lineNumber: 98,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/DisplayCanvas.js",
        lineNumber: 58,
        columnNumber: 5
    }, this);
};
_s(DisplayCanvas, "xbZcm37El+Wlu1cG3bYE8vQMcRY=");
_c = DisplayCanvas;
const __TURBOPACK__default__export__ = DisplayCanvas;
var _c;
__turbopack_context__.k.register(_c, "DisplayCanvas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/ErrorModal.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [client] (ecmascript) <export default as X>");
;
;
const ErrorModal = ({ showErrorModal, closeErrorModal, customApiKey, setCustomApiKey, handleApiKeySubmit })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: showErrorModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 bg-black/30 flex items-center justify-center z-50 overflow-y-auto",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white p-6 rounded-xl shadow-medium max-w-md w-full mx-4 my-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-medium text-gray-800",
                                    children: "API Quota Exceeded"
                                }, void 0, false, {
                                    fileName: "[project]/components/ErrorModal.js",
                                    lineNumber: 17,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: closeErrorModal,
                                    className: "text-gray-500 hover:text-gray-700",
                                    "aria-label": "Close",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ErrorModal.js",
                                        lineNumber: 24,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ErrorModal.js",
                                    lineNumber: 18,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ErrorModal.js",
                            lineNumber: 16,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-gray-600",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mb-2",
                                    children: "You've exceeded your API quota. You can:"
                                }, void 0, false, {
                                    fileName: "[project]/components/ErrorModal.js",
                                    lineNumber: 29,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "list-disc ml-5 mb-4 space-y-1 text-gray-600",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "Wait for your quota to reset"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ErrorModal.js",
                                            lineNumber: 33,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "Use your own API key"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ErrorModal.js",
                                            lineNumber: 34,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ErrorModal.js",
                                    lineNumber: 32,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ErrorModal.js",
                            lineNumber: 28,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleApiKeySubmit,
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "apiKey",
                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                            children: "Your Gemini API Key"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ErrorModal.js",
                                            lineNumber: 40,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "apiKey",
                                            type: "password",
                                            placeholder: "Enter your Gemini API key",
                                            value: customApiKey,
                                            onChange: (e)=>setCustomApiKey(e.target.value),
                                            className: "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ErrorModal.js",
                                            lineNumber: 46,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ErrorModal.js",
                                    lineNumber: 39,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end gap-3 pt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: closeErrorModal,
                                            className: "px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ErrorModal.js",
                                            lineNumber: 56,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            className: "px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors",
                                            children: "Use My Key"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ErrorModal.js",
                                            lineNumber: 63,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ErrorModal.js",
                                    lineNumber: 55,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ErrorModal.js",
                            lineNumber: 38,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ErrorModal.js",
                    lineNumber: 15,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ErrorModal.js",
                lineNumber: 14,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/ErrorModal.js",
            lineNumber: 13,
            columnNumber: 9
        }, this)
    }, void 0, false);
};
_c = ErrorModal;
const __TURBOPACK__default__export__ = ErrorModal;
var _c;
__turbopack_context__.k.register(_c, "ErrorModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/TextInput.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
;
const TextInput = ({ isTyping, textInputRef, textInput, setTextInput, handleTextInput, textPosition })=>{
    if (!isTyping) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute z-50 bg-white border border-gray-300 rounded-lg shadow-medium p-2",
        style: {
            top: textPosition.y,
            left: textPosition.x,
            transform: 'translateY(-100%)'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            ref: textInputRef,
            type: "text",
            value: textInput,
            onChange: (e)=>setTextInput(e.target.value),
            onKeyDown: handleTextInput,
            placeholder: "Type text...",
            className: "w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400",
            "aria-label": "Text input for canvas"
        }, void 0, false, {
            fileName: "[project]/components/TextInput.js",
            lineNumber: 24,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/TextInput.js",
        lineNumber: 16,
        columnNumber: 5
    }, this);
};
_c = TextInput;
const __TURBOPACK__default__export__ = TextInput;
var _c;
__turbopack_context__.k.register(_c, "TextInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/Header.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
;
const Header = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "w-full py-2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-lg font-medium tracking-[-0.2px] text-gray-800",
                    style: {
                        fontFamily: "'Google Sans Text', sans-serif"
                    },
                    children: "GEMINI 3D"
                }, void 0, false, {
                    fileName: "[project]/components/Header.js",
                    lineNumber: 5,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-gray-400",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "By"
                        }, void 0, false, {
                            fileName: "[project]/components/Header.js",
                            lineNumber: 8,
                            columnNumber: 11
                        }, this),
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "https://x.com/dev_valladares",
                            className: "hover:text-gray-600 transition-colors",
                            children: "Dev Valladares"
                        }, void 0, false, {
                            fileName: "[project]/components/Header.js",
                            lineNumber: 9,
                            columnNumber: 11
                        }, this),
                        " ",
                        "&",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "https://x.com/trudypainter",
                            className: "hover:text-gray-600 transition-colors",
                            children: "Trudy Painter"
                        }, void 0, false, {
                            fileName: "[project]/components/Header.js",
                            lineNumber: 11,
                            columnNumber: 11
                        }, this),
                        " ",
                        "• ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "https://aistudio.google.com/prompts/new_chat",
                            className: "hover:text-gray-600 transition-colors",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            children: "Google Creative Lab"
                        }, void 0, false, {
                            fileName: "[project]/components/Header.js",
                            lineNumber: 12,
                            columnNumber: 18
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Header.js",
                    lineNumber: 7,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/Header.js",
            lineNumber: 4,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Header.js",
        lineNumber: 3,
        columnNumber: 5
    }, this);
};
_c = Header;
const __TURBOPACK__default__export__ = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/DimensionSelector.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square.js [client] (ecmascript) <export default as Square>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rectangle$2d$vertical$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RectangleVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rectangle-vertical.js [client] (ecmascript) <export default as RectangleVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rectangle$2d$horizontal$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RectangleHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rectangle-horizontal.js [client] (ecmascript) <export default as RectangleHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
const dimensions = [
    {
        id: 'landscape',
        label: '3:2',
        width: 1500,
        height: 1000,
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rectangle$2d$horizontal$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RectangleHorizontal$3e$__["RectangleHorizontal"]
    },
    {
        id: 'portrait',
        label: '4:5',
        width: 1000,
        height: 1250,
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rectangle$2d$vertical$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RectangleVertical$3e$__["RectangleVertical"]
    },
    {
        id: 'square',
        label: '1:1',
        width: 1000,
        height: 1000,
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__["Square"]
    }
];
const DimensionSelector = ({ currentDimension = dimensions[0], onDimensionChange })=>{
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Replace click handlers with hover handlers
    const handleMouseEnter = ()=>setIsOpen(true);
    const handleMouseLeave = ()=>setIsOpen(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative z-50",
        ref: dropdownRef,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-full transition-all hover:bg-gray-50 hover:border-gray-300",
                style: {
                    opacity: isOpen ? 1 : 0.7
                },
                children: (()=>{
                    const current = dimensions.find((d)=>d.id === currentDimension.id) || dimensions[0];
                    const Icon = current.icon;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                className: "w-4 h-4 text-gray-600"
                            }, void 0, false, {
                                fileName: "[project]/components/DimensionSelector.js",
                                lineNumber: 53,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-gray-600",
                                children: current.label
                            }, void 0, false, {
                                fileName: "[project]/components/DimensionSelector.js",
                                lineNumber: 54,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true);
                })()
            }, void 0, false, {
                fileName: "[project]/components/DimensionSelector.js",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-x-0 h-2 -bottom-2"
                    }, void 0, false, {
                        fileName: "[project]/components/DimensionSelector.js",
                        lineNumber: 63,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute right-0 top-[calc(100%-1px)] bg-white rounded-lg shadow-lg border border-gray-200 z-10",
                        children: dimensions.map((dim)=>{
                            const Icon = dim.icon;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onDimensionChange(dim),
                                className: `w-full p-2 flex items-center gap-2 hover:bg-gray-50 transition-opacity ${currentDimension.id === dim.id ? 'opacity-100' : 'opacity-70'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        className: "w-4 h-4 text-gray-600"
                                    }, void 0, false, {
                                        fileName: "[project]/components/DimensionSelector.js",
                                        lineNumber: 75,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-gray-600 whitespace-nowrap",
                                        children: dim.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/DimensionSelector.js",
                                        lineNumber: 76,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, dim.id, true, {
                                fileName: "[project]/components/DimensionSelector.js",
                                lineNumber: 68,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/DimensionSelector.js",
                        lineNumber: 64,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/components/DimensionSelector.js",
        lineNumber: 37,
        columnNumber: 5
    }, this);
};
_s(DimensionSelector, "v6aRofkFxthF/ELiCPn67rqBUF4=");
_c = DimensionSelector;
const __TURBOPACK__default__export__ = DimensionSelector;
var _c;
__turbopack_context__.k.register(_c, "DimensionSelector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/HistoryModal.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [client] (ecmascript) <export default as X>");
;
;
const HistoryModal = ({ isOpen, onClose, history, onSelectImage, currentDimension })=>{
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/30 flex items-center justify-center z-50 overflow-y-auto p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white p-6 rounded-xl shadow-medium max-w-5xl w-full mx-auto my-8 max-h-[80vh] flex flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-medium text-gray-800",
                            children: "Drawing History"
                        }, void 0, false, {
                            fileName: "[project]/components/HistoryModal.js",
                            lineNumber: 16,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onClose,
                            className: "text-gray-500 hover:text-gray-700",
                            "aria-label": "Close",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/components/HistoryModal.js",
                                lineNumber: 23,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/HistoryModal.js",
                            lineNumber: 17,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/HistoryModal.js",
                    lineNumber: 15,
                    columnNumber: 9
                }, this),
                history.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 flex items-center justify-center text-gray-500",
                    children: "No history available yet. Start drawing to create some!"
                }, void 0, false, {
                    fileName: "[project]/components/HistoryModal.js",
                    lineNumber: 28,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2",
                    children: history.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative group cursor-pointer",
                            onClick: ()=>onSelectImage(item),
                            onKeyDown: (e)=>{
                                if (e.key === 'Enter' || e.key === ' ') {
                                    onSelectImage(item);
                                }
                            },
                            tabIndex: 0,
                            role: "button",
                            "aria-label": `Select drawing from ${new Date(item.timestamp).toLocaleString()}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "aspect-w-3 aspect-h-2 rounded-lg overflow-hidden border border-gray-200",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: item.imageUrl,
                                        alt: `Drawing history ${index + 1}`,
                                        className: "object-cover w-full h-full group-hover:opacity-90 transition-opacity"
                                    }, void 0, false, {
                                        fileName: "[project]/components/HistoryModal.js",
                                        lineNumber: 48,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/HistoryModal.js",
                                    lineNumber: 47,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity",
                                    children: new Date(item.timestamp).toLocaleString()
                                }, void 0, false, {
                                    fileName: "[project]/components/HistoryModal.js",
                                    lineNumber: 54,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, item.timestamp, true, {
                            fileName: "[project]/components/HistoryModal.js",
                            lineNumber: 34,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/HistoryModal.js",
                    lineNumber: 32,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/HistoryModal.js",
            lineNumber: 14,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/HistoryModal.js",
        lineNumber: 13,
        columnNumber: 5
    }, this);
};
_c = HistoryModal;
const __TURBOPACK__default__export__ = HistoryModal;
var _c;
__turbopack_context__.k.register(_c, "HistoryModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/BottomToolBar.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-help.js [client] (ecmascript) <export default as HelpCircle>");
;
;
const BottomToolBar = ()=>{
    const tools = [
        {
            id: 'add',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"],
            label: 'Add'
        },
        {
            id: 'help',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"],
            label: 'Help'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2 rounded-xl p-2 opacity-0",
        children: tools.map((tool)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "p-2 rounded-lg",
                    title: tool.label,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(tool.icon, {
                        className: "w-5 h-5"
                    }, void 0, false, {
                        fileName: "[project]/components/BottomToolBar.js",
                        lineNumber: 17,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/BottomToolBar.js",
                    lineNumber: 13,
                    columnNumber: 11
                }, this)
            }, tool.id, false, {
                fileName: "[project]/components/BottomToolBar.js",
                lineNumber: 12,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/BottomToolBar.js",
        lineNumber: 10,
        columnNumber: 5
    }, this);
};
_c = BottomToolBar;
const __TURBOPACK__default__export__ = BottomToolBar;
var _c;
__turbopack_context__.k.register(_c, "BottomToolBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/CanvasContainer.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Canvas$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Canvas.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DisplayCanvas$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DisplayCanvas.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ToolBar$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ToolBar.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$StyleSelector$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/StyleSelector.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ActionBar$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ActionBar.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ErrorModal$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ErrorModal.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TextInput$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/TextInput.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Header.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DimensionSelector$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DimensionSelector.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HistoryModal$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/HistoryModal.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$BottomToolBar$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/BottomToolBar.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/utils/canvasUtils.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const CanvasContainer = ()=>{
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const canvasComponentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const displayCanvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const backgroundImageRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [currentDimension, setCurrentDimension] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        id: 'landscape',
        label: '3:2',
        width: 1500,
        height: 1000
    });
    const [isDrawing, setIsDrawing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [penColor, setPenColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("#000000");
    const [penWidth, setPenWidth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(2);
    const colorInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [prompt, setPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [generatedImage, setGeneratedImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showErrorModal, setShowErrorModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [errorMessage, setErrorMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [customApiKey, setCustomApiKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [styleMode, setStyleMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('material');
    const [strokeCount, setStrokeCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const strokeTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [lastRequestTime, setLastRequestTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const MIN_REQUEST_INTERVAL = 2000; // Minimum 2 seconds between requests
    const [currentTool, setCurrentTool] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('pencil'); // 'pencil', 'pen', 'eraser', 'text', 'rect', 'circle', 'line', 'star'
    const [isTyping, setIsTyping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [undoStack, setUndoStack] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [bezierPoints, setBezierPoints] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [textInput, setTextInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [textPosition, setTextPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const textInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isPenDrawing, setIsPenDrawing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentBezierPath, setCurrentBezierPath] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [tempPoints, setTempPoints] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [hasGeneratedContent, setHasGeneratedContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [imageHistory, setImageHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasDrawing, setHasDrawing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Add a ref to track style changes that need regeneration
    const needsRegenerationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Load background image when generatedImage changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CanvasContainer.useEffect": ()=>{
            if (generatedImage && canvasRef.current) {
                // Use the window.Image constructor to avoid conflict with Next.js Image component
                const img = new window.Image();
                img.onload = ({
                    "CanvasContainer.useEffect": ()=>{
                        backgroundImageRef.current = img;
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["drawImageToCanvas"])(canvasRef.current, backgroundImageRef.current);
                    }
                })["CanvasContainer.useEffect"];
                img.src = generatedImage;
            }
        }
    }["CanvasContainer.useEffect"], [
        generatedImage
    ]);
    // Initialize canvas with white background when component mounts
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CanvasContainer.useEffect": ()=>{
            if (canvasRef.current) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["initializeCanvas"])(canvasRef.current);
            }
            // Also initialize the display canvas
            if (displayCanvasRef.current) {
                const displayCtx = displayCanvasRef.current.getContext('2d');
                displayCtx.fillStyle = '#FFFFFF';
                displayCtx.fillRect(0, 0, displayCanvasRef.current.width, displayCanvasRef.current.height);
            }
        }
    }["CanvasContainer.useEffect"], []);
    // Add an effect to sync canvas dimensions when they change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CanvasContainer.useEffect": ()=>{
            if (canvasRef.current && displayCanvasRef.current) {
                // Ensure both canvases have the same dimensions
                canvasRef.current.width = currentDimension.width;
                canvasRef.current.height = currentDimension.height;
                displayCanvasRef.current.width = currentDimension.width;
                displayCanvasRef.current.height = currentDimension.height;
                // Initialize both canvases with white backgrounds
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["initializeCanvas"])(canvasRef.current);
                const displayCtx = displayCanvasRef.current.getContext('2d');
                displayCtx.fillStyle = '#FFFFFF';
                displayCtx.fillRect(0, 0, displayCanvasRef.current.width, displayCanvasRef.current.height);
            }
        }
    }["CanvasContainer.useEffect"], [
        currentDimension
    ]);
    const startDrawing = (e)=>{
        const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getCoordinates"])(e, canvasRef.current);
        if (e.type === 'touchstart') {
            e.preventDefault();
        }
        console.log('startDrawing called', {
            currentTool,
            x,
            y
        });
        const ctx = canvasRef.current.getContext("2d");
        // Set up the line style at the start of drawing
        ctx.lineWidth = currentTool === 'eraser' ? 20 : penWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = currentTool === 'eraser' ? '#FFFFFF' : penColor;
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        setStrokeCount((prev)=>prev + 1);
        // Save canvas state before drawing
        saveCanvasState();
    };
    const draw = (e)=>{
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getCoordinates"])(e, canvas);
        // Occasionally log drawing activity
        if (Math.random() < 0.05) {
            console.log('draw called', {
                currentTool,
                isDrawing,
                x,
                y
            });
        }
        // Set up the line style before drawing
        ctx.lineWidth = currentTool === 'eraser' ? 60 : penWidth * 4; // Pen width now 4x original size
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (currentTool === 'eraser') {
            ctx.strokeStyle = '#FFFFFF';
        } else {
            ctx.strokeStyle = penColor;
        }
        if (currentTool === 'pen') {
            // Show preview line while moving
            if (tempPoints.length > 0) {
                const lastPoint = tempPoints[tempPoints.length - 1];
                ctx.beginPath();
                ctx.moveTo(lastPoint.x, lastPoint.y);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
        } else {
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };
    const stopDrawing = async (e)=>{
        console.log('stopDrawing called in CanvasContainer', {
            isDrawing,
            currentTool,
            hasEvent: !!e,
            eventType: e ? e.type : 'none'
        });
        if (!isDrawing) return;
        setIsDrawing(false);
        // Remove the timeout-based generation
        if (strokeTimeoutRef.current) {
            clearTimeout(strokeTimeoutRef.current);
            strokeTimeoutRef.current = null;
        }
        // The Canvas component will handle generation for pen and pencil tools directly
        // This function now primarily handles stroke counting for other tools
        // Only generate on mouse/touch up events when not using the pen or pencil tool
        // (since those are handled by the Canvas component)
        if (e && (e.type === 'mouseup' || e.type === 'touchend') && currentTool !== 'pen' && currentTool !== 'pencil') {
            console.log('stopDrawing: detected mouseup/touchend event', {
                strokeCount
            });
            // Check if we have enough strokes to generate (increased to 10 from 3)
            if (strokeCount >= 10) {
                console.log('stopDrawing: calling handleGeneration due to stroke count');
                await handleGeneration();
                setStrokeCount(0);
            }
        }
    };
    const clearCanvas = ()=>{
        // If we have a ref to our Canvas component, use its custom clear method
        if (canvasComponentRef.current?.handleClearCanvas) {
            canvasComponentRef.current.handleClearCanvas();
            return;
        }
        // Fallback to original implementation
        const canvas = canvasRef.current;
        if (!canvas) return;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["initializeCanvas"])(canvas);
        setGeneratedImage(null);
        backgroundImageRef.current = null;
        // Also clear the display canvas and reset generated content flag
        if (displayCanvasRef.current) {
            const displayCtx = displayCanvasRef.current.getContext('2d');
            displayCtx.clearRect(0, 0, displayCanvasRef.current.width, displayCanvasRef.current.height);
            displayCtx.fillStyle = '#FFFFFF';
            displayCtx.fillRect(0, 0, displayCanvasRef.current.width, displayCanvasRef.current.height);
            setHasGeneratedContent(false);
        }
        // Save empty canvas state
        saveCanvasState();
    };
    const handleGeneration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CanvasContainer.useCallback[handleGeneration]": async ()=>{
            console.log('handleGeneration called');
            const now = Date.now();
            if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
                console.log("Request throttled - too soon after last request");
                return;
            }
            setLastRequestTime(now);
            if (!canvasRef.current) return;
            console.log('Starting generation process');
            // Check if we're already in a loading state before setting it
            if (!isLoading) {
                setIsLoading(true);
            }
            try {
                const canvas = canvasRef.current;
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx.fillStyle = '#FFFFFF';
                tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                tempCtx.drawImage(canvas, 0, 0);
                const drawingData = tempCanvas.toDataURL("image/png").split(",")[1];
                const materialPrompt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$StyleSelector$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getPromptForStyle"])(styleMode);
                const requestPayload = {
                    prompt: materialPrompt,
                    drawingData,
                    customApiKey
                };
                console.log('Making API request with style:', styleMode);
                console.log(`Using prompt: ${materialPrompt.substring(0, 100)}...`);
                const response = await fetch("/api/generate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestPayload)
                });
                console.log('API response received, status:', response.status);
                const data = await response.json();
                if (data.success && data.imageData) {
                    console.log('Image generated successfully');
                    const imageUrl = `data:image/png;base64,${data.imageData}`;
                    // Draw the generated image to the display canvas
                    const displayCanvas = displayCanvasRef.current;
                    if (!displayCanvas) {
                        console.error('Display canvas ref is null');
                        return;
                    }
                    const displayCtx = displayCanvas.getContext('2d');
                    // Clear the display canvas first
                    displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
                    displayCtx.fillStyle = '#FFFFFF';
                    displayCtx.fillRect(0, 0, displayCanvas.width, displayCanvas.height);
                    // Create and load the new image
                    const img = new Image();
                    // Set up the onload handler before setting the src
                    img.onload = ({
                        "CanvasContainer.useCallback[handleGeneration]": ()=>{
                            console.log('Generated image loaded, drawing to display canvas');
                            displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
                            displayCtx.drawImage(img, 0, 0, displayCanvas.width, displayCanvas.height);
                            console.log('Image drawn to display canvas');
                            // Update our state to indicate we have generated content
                            setHasGeneratedContent(true);
                            // Add to history
                            setImageHistory({
                                "CanvasContainer.useCallback[handleGeneration]": (prev)=>[
                                        ...prev,
                                        {
                                            imageUrl,
                                            timestamp: Date.now(),
                                            drawingData: canvas.toDataURL(),
                                            styleMode,
                                            dimensions: currentDimension
                                        }
                                    ]
                            }["CanvasContainer.useCallback[handleGeneration]"]);
                        }
                    })["CanvasContainer.useCallback[handleGeneration]"];
                    // Set the src to trigger loading
                    img.src = imageUrl;
                } else {
                    console.error("Failed to generate image:", data.error);
                    // When generation fails, ensure display canvas is cleared
                    if (displayCanvasRef.current) {
                        const displayCtx = displayCanvasRef.current.getContext('2d');
                        displayCtx.clearRect(0, 0, displayCanvasRef.current.width, displayCanvasRef.current.height);
                        displayCtx.fillStyle = '#FFFFFF';
                        displayCtx.fillRect(0, 0, displayCanvasRef.current.width, displayCanvasRef.current.height);
                    }
                    // Make sure we mark that we don't have generated content
                    setHasGeneratedContent(false);
                    if (data.error && (data.error.includes("Resource has been exhausted") || data.error.includes("quota") || response.status === 429 || response.status === 500)) {
                        setErrorMessage(data.error);
                        setShowErrorModal(true);
                    }
                }
            } catch (error) {
                console.error("Error generating image:", error);
                setErrorMessage(error.message || "An unexpected error occurred.");
                setShowErrorModal(true);
                // When generation errors, ensure display canvas is cleared
                if (displayCanvasRef.current) {
                    const displayCtx = displayCanvasRef.current.getContext('2d');
                    displayCtx.clearRect(0, 0, displayCanvasRef.current.width, displayCanvasRef.current.height);
                    displayCtx.fillStyle = '#FFFFFF';
                    displayCtx.fillRect(0, 0, displayCanvasRef.current.width, displayCanvasRef.current.height);
                }
                // Make sure we mark that we don't have generated content
                setHasGeneratedContent(false);
            } finally{
                setIsLoading(false);
                console.log('Generation process completed');
            }
        }
    }["CanvasContainer.useCallback[handleGeneration]"], [
        lastRequestTime,
        styleMode,
        customApiKey,
        currentDimension,
        isLoading
    ]);
    // Close the error modal
    const closeErrorModal = ()=>{
        setShowErrorModal(false);
    };
    // Handle the custom API key submission
    const handleApiKeySubmit = (e)=>{
        e.preventDefault();
        setShowErrorModal(false);
    // Will use the customApiKey state in the next API call
    };
    // Add this function to handle undo
    const handleUndo = ()=>{
        if (undoStack.length > 0) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const previousState = undoStack[undoStack.length - 2]; // Get second to last state
            if (previousState) {
                const img = new Image();
                img.onload = ()=>{
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                };
                img.src = previousState;
            } else {
                // If no previous state, clear to white
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            setUndoStack((prev)=>prev.slice(0, -1));
        }
    };
    // Add this function to save canvas state
    const saveCanvasState = ()=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dataURL = canvas.toDataURL();
        setUndoStack((prev)=>[
                ...prev,
                dataURL
            ]);
    };
    // Add this function to handle text input
    const handleTextInput = (e)=>{
        if (e.key === 'Enter') {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.font = '24px Arial';
            ctx.fillStyle = '#000000';
            ctx.fillText(textInput, textPosition.x, textPosition.y);
            setTextInput('');
            setIsTyping(false);
            saveCanvasState();
        }
    };
    // Modify the canvas click handler to handle text placement
    const handleCanvasClick = (e)=>{
        if (currentTool === 'text') {
            const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getCoordinates"])(e, canvasRef.current);
            setTextPosition({
                x,
                y
            });
            setIsTyping(true);
            if (textInputRef.current) {
                textInputRef.current.focus();
            }
        }
    };
    // Handle pen click for bezier curve tool
    const handlePenClick = (e)=>{
        if (currentTool !== 'pen') return;
        // Note: Actual point creation is now handled in the Canvas component
        // This function is primarily used as a callback to inform the CanvasContainer
        // that a pen action happened
        console.log('handlePenClick called in CanvasContainer');
        // Set isDrawing flag to true when using pen tool
        // This ensures handleStopDrawing knows we're in drawing mode with the pen
        setIsDrawing(true);
        // Save canvas state when adding new points
        saveCanvasState();
    };
    // Add this new function near your other utility functions
    const handleSaveImage = ()=>{
        // For the generated image
        if (displayCanvasRef.current) {
            const link = document.createElement('a');
            link.download = 'chrome-study.png';
            link.href = displayCanvasRef.current.toDataURL('image/png');
            link.click();
        }
    };
    // Add this function to handle regeneration
    const handleRegenerate = async ()=>{
        if (canvasRef.current) {
            // Temporarily reset hasGeneratedContent so placeholder shows during loading
            setHasGeneratedContent(false);
            await handleGeneration();
        }
    };
    // Add useEffect to watch for styleMode changes and regenerate
    // eslint-disable-next-line react-hooks/exhaustive-deps
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CanvasContainer.useEffect": ()=>{
            // Only trigger if we have something drawn (check if canvas is not empty)
            // Note: handleGeneration is intentionally omitted from dependencies to prevent infinite loops
            const checkCanvasAndGenerate = {
                "CanvasContainer.useEffect.checkCanvasAndGenerate": async ()=>{
                    if (!canvasRef.current) return;
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext('2d');
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    // Check if canvas has any non-white pixels
                    const hasDrawing = Array.from(imageData.data).some({
                        "CanvasContainer.useEffect.checkCanvasAndGenerate.hasDrawing": (pixel, index)=>{
                            // Check only RGB values (skip alpha)
                            return index % 4 !== 3 && pixel !== 255;
                        }
                    }["CanvasContainer.useEffect.checkCanvasAndGenerate.hasDrawing"]);
                    // Only generate if there's a drawing AND we don't already have generated content
                    if (hasDrawing && !hasGeneratedContent) {
                        await handleGeneration();
                    } else if (hasDrawing) {
                        // Mark that regeneration is needed when style changes but we already have content
                        needsRegenerationRef.current = true;
                    }
                }
            }["CanvasContainer.useEffect.checkCanvasAndGenerate"];
            // Skip on first render
            if (styleMode) {
                checkCanvasAndGenerate();
            }
        }
    }["CanvasContainer.useEffect"], [
        styleMode,
        hasGeneratedContent
    ]); // Removed handleGeneration from dependencies to prevent loop
    // Add new useEffect to handle regeneration when hasGeneratedContent changes to false
    // eslint-disable-next-line react-hooks/exhaustive-deps
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CanvasContainer.useEffect": ()=>{
            // Note: handleGeneration is intentionally omitted from dependencies to prevent infinite loops
            // If we need regeneration and the generated content was cleared
            if (needsRegenerationRef.current && !hasGeneratedContent) {
                const checkDrawingAndRegenerate = {
                    "CanvasContainer.useEffect.checkDrawingAndRegenerate": async ()=>{
                        if (!canvasRef.current) return;
                        const canvas = canvasRef.current;
                        const ctx = canvas.getContext('2d');
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        // Check if canvas has any non-white pixels
                        const hasDrawing = Array.from(imageData.data).some({
                            "CanvasContainer.useEffect.checkDrawingAndRegenerate.hasDrawing": (pixel, index)=>{
                                // Check only RGB values (skip alpha)
                                return index % 4 !== 3 && pixel !== 255;
                            }
                        }["CanvasContainer.useEffect.checkDrawingAndRegenerate.hasDrawing"]);
                        if (hasDrawing) {
                            needsRegenerationRef.current = false;
                            await handleGeneration();
                        }
                    }
                }["CanvasContainer.useEffect.checkDrawingAndRegenerate"];
                checkDrawingAndRegenerate();
            }
        }
    }["CanvasContainer.useEffect"], [
        hasGeneratedContent
    ]);
    // Cleanup function - keep this to prevent memory leaks
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CanvasContainer.useEffect": ()=>{
            return ({
                "CanvasContainer.useEffect": ()=>{
                    if (strokeTimeoutRef.current) {
                        clearTimeout(strokeTimeoutRef.current);
                        strokeTimeoutRef.current = null;
                    }
                }
            })["CanvasContainer.useEffect"];
        }
    }["CanvasContainer.useEffect"], []);
    // Handle dimension change
    const handleDimensionChange = (newDimension)=>{
        console.log('Changing dimensions to:', newDimension);
        // Clear both canvases
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = newDimension.width;
            canvas.height = newDimension.height;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["initializeCanvas"])(canvas);
        }
        if (displayCanvasRef.current) {
            const displayCanvas = displayCanvasRef.current;
            displayCanvas.width = newDimension.width;
            displayCanvas.height = newDimension.height;
            const ctx = displayCanvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, displayCanvas.width, displayCanvas.height);
        }
        // Reset generation state
        setHasGeneratedContent(false);
        setGeneratedImage(null);
        backgroundImageRef.current = null;
        // Update dimension state AFTER canvas dimensions are updated
        setCurrentDimension(newDimension);
    };
    // Add new function to handle selecting a historical image
    const handleSelectHistoricalImage = (historyItem)=>{
        // Set the current dimension to match the historical image
        if (historyItem.dimensions) {
            setCurrentDimension(historyItem.dimensions);
        }
        // Draw the original drawing to the canvas
        const drawingImg = new Image();
        drawingImg.onload = ()=>{
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(drawingImg, 0, 0, canvas.width, canvas.height);
            }
        };
        drawingImg.src = historyItem.drawingData;
        // Draw the generated image to the display canvas
        const generatedImg = new Image();
        generatedImg.onload = ()=>{
            const displayCanvas = displayCanvasRef.current;
            if (displayCanvas) {
                const ctx = displayCanvas.getContext('2d');
                ctx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
                ctx.drawImage(generatedImg, 0, 0, displayCanvas.width, displayCanvas.height);
                setHasGeneratedContent(true);
            }
        };
        generatedImg.src = historyItem.imageUrl;
        // Close the history modal
        setIsHistoryModalOpen(false);
    };
    // Add new function to handle image refinement
    const handleImageRefinement = async (refinementPrompt)=>{
        if (!displayCanvasRef.current || !hasGeneratedContent) return;
        console.log('Starting image refinement with prompt:', refinementPrompt);
        setIsLoading(true);
        try {
            // Get the current image data
            const displayCanvas = displayCanvasRef.current;
            const imageData = displayCanvas.toDataURL("image/png").split(",")[1];
            const requestPayload = {
                prompt: refinementPrompt,
                imageData,
                customApiKey
            };
            console.log('Making refinement API request');
            const response = await fetch("/api/refine", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestPayload)
            });
            console.log('Refinement API response received, status:', response.status);
            const data = await response.json();
            if (data.success && data.imageData) {
                console.log('Image refined successfully');
                const imageUrl = `data:image/png;base64,${data.imageData}`;
                // Draw the refined image to the display canvas
                const displayCtx = displayCanvas.getContext('2d');
                const img = new Image();
                img.onload = ()=>{
                    console.log('Refined image loaded, drawing to display canvas');
                    displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
                    displayCtx.drawImage(img, 0, 0, displayCanvas.width, displayCanvas.height);
                    // Add to history
                    setImageHistory((prev)=>[
                            ...prev,
                            {
                                imageUrl,
                                timestamp: Date.now(),
                                drawingData: canvasRef.current.toDataURL(),
                                styleMode,
                                dimensions: currentDimension
                            }
                        ]);
                };
                img.src = imageUrl;
            } else {
                console.error("Failed to refine image:", data.error);
                setErrorMessage(data.error || "Failed to refine image. Please try again.");
                setShowErrorModal(true);
            }
        } catch (error) {
            console.error('Error during refinement:', error);
            setErrorMessage("An error occurred during refinement. Please try again.");
            setShowErrorModal(true);
        } finally{
            setIsLoading(false);
        }
    };
    // Add onImageUpload function
    const handleImageUpload = (imageDataUrl)=>{
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = ()=>{
            // Clear the canvas
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // Calculate dimensions to maintain aspect ratio and fit within canvas
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) / 2;
            // Draw the image centered and scaled
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            // Save canvas state after uploading image
            saveCanvasState();
            setHasGeneratedContent(true);
        };
        img.src = imageDataUrl;
    };
    // Add stroke width handler
    const handleStrokeWidth = (width)=>{
        setPenWidth(width);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen flex-col items-center justify-start bg-gray-50 p-2 md:p-4 overflow-y-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-[1800px] mx-auto pb-32",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-shrink-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/components/CanvasContainer.js",
                                        lineNumber: 746,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/CanvasContainer.js",
                                    lineNumber: 745,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col sm:flex-row items-start sm:items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "hidden sm:block",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DimensionSelector$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                currentDimension: currentDimension,
                                                onDimensionChange: handleDimensionChange
                                            }, void 0, false, {
                                                fileName: "[project]/components/CanvasContainer.js",
                                                lineNumber: 750,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/CanvasContainer.js",
                                            lineNumber: 749,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://aistudio.google.com/prompts/new_chat",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-full opacity-70 hover:opacity-100 hover:bg-gray-50 hover:border-gray-300 transition-all",
                                            children: "Using Gemini 2.0 Native Image Generation"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CanvasContainer.js",
                                            lineNumber: 755,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CanvasContainer.js",
                                    lineNumber: 748,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CanvasContainer.js",
                            lineNumber: 744,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col md:flex-row items-stretch gap-4 w-full",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full md:w-[60px] md:flex-shrink-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "block md:hidden w-fit",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ToolBar$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                currentTool: currentTool,
                                                setCurrentTool: setCurrentTool,
                                                handleUndo: handleUndo,
                                                clearCanvas: clearCanvas,
                                                orientation: "horizontal",
                                                currentWidth: penWidth,
                                                setStrokeWidth: handleStrokeWidth
                                            }, void 0, false, {
                                                fileName: "[project]/components/CanvasContainer.js",
                                                lineNumber: 772,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/CanvasContainer.js",
                                            lineNumber: 771,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "hidden md:block",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ToolBar$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                currentTool: currentTool,
                                                setCurrentTool: setCurrentTool,
                                                handleUndo: handleUndo,
                                                clearCanvas: clearCanvas,
                                                orientation: "vertical",
                                                currentWidth: penWidth,
                                                setStrokeWidth: handleStrokeWidth
                                            }, void 0, false, {
                                                fileName: "[project]/components/CanvasContainer.js",
                                                lineNumber: 785,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/CanvasContainer.js",
                                            lineNumber: 784,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CanvasContainer.js",
                                    lineNumber: 769,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 flex flex-col gap-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col md:flex-row gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 w-full relative",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Canvas$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                    ref: canvasComponentRef,
                                                    canvasRef: canvasRef,
                                                    currentTool: currentTool,
                                                    isDrawing: isDrawing,
                                                    startDrawing: startDrawing,
                                                    draw: draw,
                                                    stopDrawing: stopDrawing,
                                                    handleCanvasClick: handleCanvasClick,
                                                    handlePenClick: handlePenClick,
                                                    handleGeneration: handleGeneration,
                                                    tempPoints: tempPoints,
                                                    setTempPoints: setTempPoints,
                                                    handleUndo: handleUndo,
                                                    clearCanvas: clearCanvas,
                                                    setCurrentTool: setCurrentTool,
                                                    currentDimension: currentDimension,
                                                    currentColor: penColor,
                                                    currentWidth: penWidth,
                                                    onImageUpload: handleImageUpload,
                                                    onGenerate: handleGeneration,
                                                    isGenerating: isLoading,
                                                    setIsGenerating: setIsLoading,
                                                    saveCanvasState: saveCanvasState,
                                                    onDrawingChange: setHasDrawing,
                                                    styleMode: styleMode,
                                                    setStyleMode: setStyleMode
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CanvasContainer.js",
                                                    lineNumber: 803,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/CanvasContainer.js",
                                                lineNumber: 802,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 w-full",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DisplayCanvas$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                    displayCanvasRef: displayCanvasRef,
                                                    isLoading: isLoading,
                                                    handleSaveImage: handleSaveImage,
                                                    handleRegenerate: handleRegenerate,
                                                    hasGeneratedContent: hasGeneratedContent,
                                                    currentDimension: currentDimension,
                                                    onOpenHistory: ()=>setIsHistoryModalOpen(true),
                                                    onRefineImage: handleImageRefinement
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CanvasContainer.js",
                                                    lineNumber: 835,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/CanvasContainer.js",
                                                lineNumber: 834,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/CanvasContainer.js",
                                        lineNumber: 800,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/CanvasContainer.js",
                                    lineNumber: 798,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CanvasContainer.js",
                            lineNumber: 767,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/CanvasContainer.js",
                    lineNumber: 743,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/CanvasContainer.js",
                lineNumber: 742,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ErrorModal$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                showErrorModal: showErrorModal,
                closeErrorModal: closeErrorModal,
                customApiKey: customApiKey,
                setCustomApiKey: setCustomApiKey,
                handleApiKeySubmit: handleApiKeySubmit
            }, void 0, false, {
                fileName: "[project]/components/CanvasContainer.js",
                lineNumber: 852,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TextInput$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                isTyping: isTyping,
                textInputRef: textInputRef,
                textInput: textInput,
                setTextInput: setTextInput,
                handleTextInput: handleTextInput,
                textPosition: textPosition
            }, void 0, false, {
                fileName: "[project]/components/CanvasContainer.js",
                lineNumber: 860,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HistoryModal$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isHistoryModalOpen,
                onClose: ()=>setIsHistoryModalOpen(false),
                history: imageHistory,
                onSelectImage: handleSelectHistoricalImage,
                currentDimension: currentDimension
            }, void 0, false, {
                fileName: "[project]/components/CanvasContainer.js",
                lineNumber: 869,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/CanvasContainer.js",
        lineNumber: 741,
        columnNumber: 5
    }, this);
};
_s(CanvasContainer, "e/F2emyTabdxkcozTH1K8nsauGM=");
_c = CanvasContainer;
const __TURBOPACK__default__export__ = CanvasContainer;
var _c;
__turbopack_context__.k.register(_c, "CanvasContainer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/CanvasContainer.js [client] (ecmascript, next/dynamic entry)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/components/CanvasContainer.js [client] (ecmascript)"));
}}),
}]);

//# sourceMappingURL=components_56173da0._.js.map