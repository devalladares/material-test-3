(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/components_f2484d5d._.js", {

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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$type$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Type$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/type.js [client] (ecmascript) <export default as Type>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$tool$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PenTool$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen-tool.js [client] (ecmascript) <export default as PenTool>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2d$2$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Undo2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/undo-2.js [client] (ecmascript) <export default as Undo2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
;
;
;
;
const ToolBar = ({ currentTool, setCurrentTool, handleUndo, clearCanvas, orientation = 'horizontal', onImageUpload })=>{
    const mainTools = [
        {
            id: 'pencil',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"],
            label: 'Pencil'
        },
        {
            id: 'pen',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$tool$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PenTool$3e$__["PenTool"],
            label: 'Pen'
        },
        {
            id: 'eraser',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eraser$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eraser$3e$__["Eraser"],
            label: 'Eraser'
        },
        {
            id: 'text',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$type$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Type$3e$__["Type"],
            label: 'Text'
        }
    ];
    const actions = [
        {
            id: 'upload',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"],
            label: 'Upload Image',
            onClick: ()=>{
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e)=>{
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event)=>{
                            onImageUpload(event.target.result);
                        };
                        reader.readAsDataURL(file);
                    }
                };
                input.click();
            }
        },
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
                            lineNumber: 59,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ToolBar.js",
                        lineNumber: 50,
                        columnNumber: 11
                    }, this)
                }, tool.id, false, {
                    fileName: "[project]/components/ToolBar.js",
                    lineNumber: 49,
                    columnNumber: 9
                }, this)),
            orientation === 'vertical' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-px bg-gray-200 my-2"
            }, void 0, false, {
                fileName: "[project]/components/ToolBar.js",
                lineNumber: 64,
                columnNumber: 38
            }, this),
            orientation === 'horizontal' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-px bg-gray-200 mx-2"
            }, void 0, false, {
                fileName: "[project]/components/ToolBar.js",
                lineNumber: 65,
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
                        lineNumber: 74,
                        columnNumber: 11
                    }, this)
                }, action.id, false, {
                    fileName: "[project]/components/ToolBar.js",
                    lineNumber: 68,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ToolBar.js",
        lineNumber: 47,
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
        className: "flex flex-col gap-2 bg-white rounded-xl shadow-soft p-2 border border-gray-200",
        children: tools.map((tool)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
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
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ToolBar$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ToolBar.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$BottomToolBar$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/BottomToolBar.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
const Canvas = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ canvasRef, currentTool, isDrawing, startDrawing, draw, stopDrawing, handleCanvasClick, handlePenClick, handleGeneration, tempPoints, setTempPoints, handleUndo, clearCanvas, setCurrentTool, currentDimension, onImageUpload, onGenerate, isGenerating, currentColor, currentWidth, handleStrokeWidth }, ref)=>{
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
    };
    // Modified startDrawing handler
    const handleStartDrawing = (e)=>{
        console.log('Canvas onMouseDown', {
            currentTool,
            isDrawing
        });
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
    // Modified draw handler
    const handleDraw = (e)=>{
        if (currentTool === 'pen' && handleBezierMouseMove(e)) {
            return;
        }
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const { x, y } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$utils$2f$canvasUtils$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getCoordinates"])(e, canvas);
        draw(e);
    };
    // Modified stopDrawing handler
    const handleStopDrawing = (e)=>{
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
        if (currentTool === 'pencil' && isDrawing) {
            console.log(`${currentTool} tool condition met, will try to trigger generation`);
            // Small delay to ensure the drawing is complete
            setTimeout(()=>{
                console.log('Attempting to call handleGeneration after timeout');
                if (typeof handleGeneration === 'function') {
                    console.log('Calling handleGeneration function');
                    handleGeneration();
                } else {
                    console.error('handleGeneration is not a function:', handleGeneration);
                }
            }, 100);
        } else {
            console.log('Generation not triggered because:', {
                isPencilTool: currentTool === 'pencil',
                wasDrawing: isDrawing
            });
        }
    };
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
        // Trigger generation
        setTimeout(()=>{
            if (typeof handleGeneration === 'function') {
                handleGeneration();
            }
        }, 100);
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
    const handleImageUpload = (imageDataUrl)=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
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
            // Trigger generation with the uploaded image
            setTimeout(()=>{
                if (typeof handleGeneration === 'function') {
                    handleGeneration();
                }
            }, 100);
        };
        img.src = imageDataUrl;
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
        const reader = new FileReader();
        reader.onload = (event)=>{
            const img = new Image();
            img.onload = ()=>{
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                // Clear canvas
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                // Calculate dimensions to maintain aspect ratio
                const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width - img.width * scale) / 2;
                const y = (canvas.height - img.height * scale) / 2;
                // Draw image
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                // Process the uploaded image
                const imageData = canvas.toDataURL('image/png');
                onImageUpload(imageData);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-4 w-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-shrink-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ToolBar$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        currentTool: currentTool,
                        setCurrentTool: setCurrentTool,
                        handleUndo: handleUndo,
                        clearCanvas: clearCanvas,
                        orientation: "vertical",
                        onImageUpload: handleImageUpload,
                        currentWidth: currentWidth,
                        setStrokeWidth: handleStrokeWidth
                    }, void 0, false, {
                        fileName: "[project]/components/Canvas.js",
                        lineNumber: 599,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/Canvas.js",
                    lineNumber: 598,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative w-full flex justify-center",
                    children: [
                        currentTool === 'pen' && tempPoints.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: finalizeBezierCurve,
                            className: "absolute top-4 right-4 z-10 bg-gray-200 text-gray-700 rounded-full px-4 py-2 flex items-center hover:bg-gray-300 transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "mr-2 text-sm font-medium",
                                    children: "Draw Curve"
                                }, void 0, false, {
                                    fileName: "[project]/components/Canvas.js",
                                    lineNumber: 617,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2d$line$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PencilLine$3e$__["PencilLine"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/Canvas.js",
                                    lineNumber: 618,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Canvas.js",
                            lineNumber: 613,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative w-full",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                                    ref: canvasRef,
                                    width: currentDimension.width,
                                    height: currentDimension.height,
                                    className: "border border-gray-300 bg-white rounded-xl shadow-soft",
                                    style: {
                                        aspectRatio: `${currentDimension.width} / ${currentDimension.height}`,
                                        maxWidth: '100%',
                                        maxHeight: '800px',
                                        width: '100%',
                                        height: 'auto',
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
                                    lineNumber: 623,
                                    columnNumber: 13
                                }, this),
                                !hasDrawing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2d$line$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PencilLine$3e$__["PencilLine"], {
                                            className: "w-10 h-10 text-gray-300 mb-2"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Canvas.js",
                                            lineNumber: 652,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-500 text-lg font-medium",
                                            children: "Draw here"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Canvas.js",
                                            lineNumber: 653,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Canvas.js",
                                    lineNumber: 651,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute bottom-4 right-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$BottomToolBar$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/components/Canvas.js",
                                        lineNumber: 659,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/Canvas.js",
                                    lineNumber: 658,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Canvas.js",
                            lineNumber: 622,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Canvas.js",
                    lineNumber: 611,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/Canvas.js",
            lineNumber: 597,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Canvas.js",
        lineNumber: 596,
        columnNumber: 5
    }, this);
}, "34rvDioHcFfFF5Z/FwSk8x10eEA=")), "34rvDioHcFfFF5Z/FwSk8x10eEA=");
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
                onClick: handleSaveImage,
                className: "p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
                "aria-label": "Save Image",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
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
                onClick: onOpenHistory,
                className: "p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
                "aria-label": "View History",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"], {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$cw$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-cw.js [client] (ecmascript) <export default as RotateCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/maximize.js [client] (ecmascript) <export default as Maximize>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wand$2d$sparkles$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wand2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wand-sparkles.js [client] (ecmascript) <export default as Wand2>");
;
var _s = __turbopack_context__.k.signature();
;
;
const REFINEMENT_SUGGESTIONS = [
    {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$cw$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCw$3e$__["RotateCw"],
        label: 'Rotate',
        prompt: 'Rotate the image'
    },
    {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize$3e$__["Maximize"],
        label: 'Scale',
        prompt: 'Make it bigger'
    },
    {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wand$2d$sparkles$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wand2$3e$__["Wand2"],
        label: 'Enhance',
        prompt: 'Enhance the details'
    }
];
const ImageRefiner = ({ onRefine, isLoading, hasGeneratedContent })=>{
    _s();
    const [inputValue, setInputValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (!inputValue.trim()) return;
        onRefine(inputValue);
        setInputValue('');
    };
    const handleSuggestionClick = (suggestion)=>{
        onRefine(suggestion.prompt);
    };
    if (!hasGeneratedContent) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full mt-4 space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-2",
                children: REFINEMENT_SUGGESTIONS.map((suggestion)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>handleSuggestionClick(suggestion),
                        disabled: isLoading,
                        className: "flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(suggestion.icon, {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/components/ImageRefiner.js",
                                lineNumber: 42,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: suggestion.label
                            }, void 0, false, {
                                fileName: "[project]/components/ImageRefiner.js",
                                lineNumber: 43,
                                columnNumber: 13
                            }, this)
                        ]
                    }, suggestion.label, true, {
                        fileName: "[project]/components/ImageRefiner.js",
                        lineNumber: 36,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/ImageRefiner.js",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
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
                        lineNumber: 50,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: isLoading || !inputValue.trim(),
                        className: "p-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                            className: "w-5 h-5"
                        }, void 0, false, {
                            fileName: "[project]/components/ImageRefiner.js",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ImageRefiner.js",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ImageRefiner.js",
                lineNumber: 49,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ImageRefiner.js",
        lineNumber: 32,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ActionBar$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ActionBar.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ImageRefiner$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ImageRefiner.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const DisplayCanvas = ({ displayCanvasRef, isLoading, handleSaveImage, handleRegenerate, hasGeneratedContent = false, currentDimension, onOpenHistory, onRefineImage })=>{
    _s();
    // Use a local state that combines props with local state
    const [showPlaceholder, setShowPlaceholder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full flex justify-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                        ref: displayCanvasRef,
                        width: currentDimension.width,
                        height: currentDimension.height,
                        className: "border border-gray-300 bg-white rounded-xl shadow-soft",
                        style: {
                            aspectRatio: `${currentDimension.width} / ${currentDimension.height}`,
                            maxWidth: '100%',
                            maxHeight: '600px',
                            width: 'auto',
                            height: 'auto'
                        },
                        "aria-label": "Generated image canvas"
                    }, void 0, false, {
                        fileName: "[project]/components/DisplayCanvas.js",
                        lineNumber: 31,
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
                                lineNumber: 50,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/DisplayCanvas.js",
                            lineNumber: 49,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/DisplayCanvas.js",
                        lineNumber: 48,
                        columnNumber: 11
                    }, this),
                    showPlaceholder && !isLoading && !hasGeneratedContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__["ImageIcon"], {
                                className: "w-10 h-10 text-gray-300 mb-2"
                            }, void 0, false, {
                                fileName: "[project]/components/DisplayCanvas.js",
                                lineNumber: 58,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-500 text-lg font-medium",
                                children: "Generation will appear here"
                            }, void 0, false, {
                                fileName: "[project]/components/DisplayCanvas.js",
                                lineNumber: 59,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/DisplayCanvas.js",
                        lineNumber: 57,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/DisplayCanvas.js",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full flex justify-end",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ActionBar$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    handleSaveImage: handleSaveImage,
                    handleRegenerate: handleRegenerate,
                    onOpenHistory: onOpenHistory
                }, void 0, false, {
                    fileName: "[project]/components/DisplayCanvas.js",
                    lineNumber: 66,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/DisplayCanvas.js",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ImageRefiner$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                onRefine: onRefineImage,
                isLoading: isLoading,
                hasGeneratedContent: hasGeneratedContent
            }, void 0, false, {
                fileName: "[project]/components/DisplayCanvas.js",
                lineNumber: 74,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/DisplayCanvas.js",
        lineNumber: 29,
        columnNumber: 5
    }, this);
};
_s(DisplayCanvas, "2BRprZryj8IHQ/OmvP8Cnwp5xi4=");
_c = DisplayCanvas;
const __TURBOPACK__default__export__ = DisplayCanvas;
var _c;
__turbopack_context__.k.register(_c, "DisplayCanvas");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$ccw$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-ccw.js [client] (ecmascript) <export default as RefreshCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-help.js [client] (ecmascript) <export default as HelpCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
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
        prompt: "Transform this sketch into a honey-like substance. Render it as if made entirely of translucent, golden honey with characteristic viscous drips and flows. Add realistic liquid properties including surface tension, reflections, and light refraction. Use studio lighting to highlight the amber tones and glossy surface against a black background. Make it appear as if captured in a high-end commercial photography setup."
    },
    softbody: {
        name: "Soft Body",
        file: "softbody.jpeg",
        prompt: "Convert this drawing / text into a soft body physics render. Render it as if made of a soft, jelly-like material that responds to gravity and motion. Add realistic deformation, bounce, and squash effects typical of soft body dynamics. Use dramatic lighting against a black background to emphasize the material's translucency and surface properties. Make it look like a high-end 3D animation frame."
    },
    topographic: {
        name: "Topographic",
        file: "topographic.jpeg",
        prompt: "Transform this sketch into a sculptural form composed of precisely stacked, thin metallic rings or layers. Render it with warm copper/bronze tones with each layer maintaining equal spacing from adjacent layers, creating a topographic map effect. The form should appear to flow and undulate while maintaining the precise parallel structure. Use dramatic studio lighting against a pure black background to highlight the metallic luster and dimensional quality. Render it in a high-end 3D visualization style with perfect definition between each ring layer."
    },
    testMaterial: {
        name: "Test Material",
        file: "test-material.jpeg",
        prompt: "Transform this sketch into an experimental material with unique properties. Use dramatic studio lighting against a pure black background to showcase the material's characteristics. Render it in a high-end 3D style with professional lighting and composition."
    }
};
let styleOptions = {
    ...defaultStyleOptions
};
const getPromptForStyle = (styleMode)=>{
    return styleOptions[styleMode]?.prompt || styleOptions.material.prompt;
};
const generatePromptForMaterial = (materialName)=>{
    return `Transform this sketch into a ${materialName.toLowerCase()} material. Render it in a high-end 3D visualization style with professional studio lighting against a pure black background. Make it look like a premium product rendering with detailed material properties and characteristics.`;
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
    // Generate preview thumbnail automatically when material name or custom prompt changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StyleSelector.useEffect": ()=>{
            const generatePreviewThumbnail = {
                "StyleSelector.useEffect.generatePreviewThumbnail": async ()=>{
                    if (!newMaterialName.trim() || useCustomImage || isGeneratingThumbnail) return;
                    // Clear any existing preview if we're changing the prompt
                    const newPrompt = showCustomPrompt && customPrompt.trim() ? customPrompt : generatePromptForMaterial(newMaterialName);
                    // Don't regenerate if we're just showing the UI, need actual content changes
                    if (!newMaterialName || showCustomPrompt && !customPrompt.trim()) return;
                    // Set loading state
                    setIsGeneratingPreview(true);
                    try {
                        // Generate a thumbnail using the API
                        const response = await fetch("/api/generate", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                prompt: newPrompt
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
                }
            }["StyleSelector.useEffect.generatePreviewThumbnail"];
            // Add a small delay to avoid excessive API calls while typing
            const timeoutId = setTimeout({
                "StyleSelector.useEffect.timeoutId": ()=>{
                    generatePreviewThumbnail();
                }
            }["StyleSelector.useEffect.timeoutId"], 1500);
            return ({
                "StyleSelector.useEffect": ()=>clearTimeout(timeoutId)
            })["StyleSelector.useEffect"];
        }
    }["StyleSelector.useEffect"], [
        newMaterialName,
        useCustomImage,
        showCustomPrompt,
        customPrompt
    ]);
    // Save custom materials to local storage
    const saveCustomMaterials = ()=>{
        try {
            const customMaterials = {};
            Object.entries(styleOptions).forEach(([key, value])=>{
                if (!defaultStyleOptions[key]) {
                    customMaterials[key] = value;
                }
            });
            localStorage.setItem('customMaterials', JSON.stringify(customMaterials));
            const updatedMaterials = {
                ...defaultStyleOptions,
                ...customMaterials
            };
            styleOptions = updatedMaterials;
            setMaterials(updatedMaterials); // Update the state to trigger re-render
            console.log('Saved custom materials to local storage');
        } catch (error) {
            console.error('Error saving custom materials:', error);
        }
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
    const handleCreateMaterial = async ()=>{
        if (!newMaterialName.trim()) return;
        setIsGeneratingThumbnail(true);
        try {
            let imageData;
            // Check if we're editing an existing material
            const isEditing = recentlyAdded && styleOptions[recentlyAdded]?.isCustom;
            // Generate the prompt to use (either custom or generated)
            const generatedPrompt = showCustomPrompt && customPrompt.trim() ? customPrompt : generatePromptForMaterial(newMaterialName);
            if (useCustomImage && customImagePreview) {
                // Use the custom image data directly
                // If it's already a base64 string (from an existing material), extract just the data part
                if (customImagePreview.includes('base64,')) {
                    imageData = customImagePreview.split(',')[1]; // Extract base64 data
                } else {
                    imageData = customImagePreview;
                }
            } else if (previewThumbnail && !isEditing) {
                // Use the already generated preview thumbnail if available
                imageData = previewThumbnail.split(',')[1]; // Extract base64 data
            } else if (!isEditing) {
                // Only generate a new thumbnail if we're not editing with an existing image
                // and we don't have a preview thumbnail
                // Generate a thumbnail using the current API
                const response = await fetch("/api/generate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        prompt: generatedPrompt
                    })
                });
                const data = await response.json();
                if (!data.success || !data.imageData) {
                    throw new Error(data.error || "Failed to generate thumbnail");
                }
                imageData = data.imageData;
            } else {
                // When editing and not changing the image, keep the existing image
                imageData = styleOptions[recentlyAdded].imageData;
            }
            // Determine the material key to use
            const materialKey = isEditing ? recentlyAdded : newMaterialName.toLowerCase().replace(/\s+/g, '-');
            // Create a filename for the thumbnail
            const fileName = `${materialKey}.jpeg`;
            // Create or update the material
            styleOptions[materialKey] = {
                name: newMaterialName,
                file: fileName,
                prompt: generatedPrompt,
                imageData: imageData,
                isCustom: true,
                createdAt: isEditing ? styleOptions[materialKey].createdAt : new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            // Save to local storage
            saveCustomMaterials();
            // Set recently added to temporarily highlight the material
            if (!isEditing) {
                setRecentlyAdded(materialKey);
                setTimeout(()=>setRecentlyAdded(null), 3000);
            } else {
                // For edits, briefly highlight to show it was updated
                setRecentlyAdded(null);
                setTimeout(()=>{
                    setRecentlyAdded(materialKey);
                    setTimeout(()=>setRecentlyAdded(null), 1500);
                }, 100);
            }
            // Close the modal and reset state
            handleCloseModal();
            // Switch to the material
            setStyleMode(materialKey);
            // Generate with the material
            if (handleGenerate) {
                handleGenerate();
            }
        } catch (error) {
            console.error("Error creating/updating material:", error);
            alert("Error creating/updating material. Please try again.");
        } finally{
            setIsGeneratingThumbnail(false);
        }
    };
    // Add function to edit existing material and improve with regeneration functionality
    const handleEditMaterial = (event, key)=>{
        event.stopPropagation(); // Prevent triggering the parent button's onClick
        // Only allow editing custom materials
        if (styleOptions[key]?.isCustom) {
            const material = styleOptions[key];
            // Pre-fill the form with existing data
            setNewMaterialName(material.name);
            setCustomPrompt(material.prompt);
            setShowCustomPrompt(true);
            // If we have image data, show it
            if (material.imageData) {
                setUseCustomImage(true);
                setCustomImagePreview(`data:image/jpeg;base64,${material.imageData}`);
            }
            // Open the modal
            setShowAddMaterialModal(true);
            // Store the key to know we're editing not creating
            setRecentlyAdded(key);
        }
    };
    // Add function to regenerate thumbnail for existing material
    const handleRegenerateThumbnail = async ()=>{
        setIsGeneratingPreview(true);
        try {
            // Generate the prompt to use
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
                // Update the preview
                setPreviewThumbnail(`data:image/jpeg;base64,${data.imageData}`);
                // Switch to auto-generate mode
                setUseCustomImage(false);
            } else {
                throw new Error(data.error || "Failed to regenerate thumbnail");
            }
        } catch (error) {
            console.error("Error regenerating thumbnail:", error);
            alert("Failed to regenerate thumbnail. Please try again.");
        } finally{
            setIsGeneratingPreview(false);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap gap-1",
                    children: [
                        Object.entries(getSortedMaterials(materials)).map(([key, { name, file, imageData, isCustom }])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                className: "focus:outline-none focus:ring-2 focus:ring-gray-400 relative group",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `w-20 border ${key === 'testMaterial' ? 'border-purple-400 border-dashed' : isCustom ? 'border-blue-300' : 'border-gray-300'} overflow-hidden rounded-xl ${styleMode === key ? 'bg-white' : 'bg-gray-50'}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-full relative",
                                            style: {
                                                aspectRatio: '1/1'
                                            },
                                            children: [
                                                key === 'testMaterial' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-full h-full flex items-center justify-center bg-purple-50",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"], {
                                                        className: "w-8 h-8 text-purple-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/StyleSelector.js",
                                                        lineNumber: 489,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StyleSelector.js",
                                                    lineNumber: 488,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: imageData ? `data:image/jpeg;base64,${imageData}` : `/samples/${file}`,
                                                    alt: `${name} style example`,
                                                    className: "w-full h-full object-cover"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StyleSelector.js",
                                                    lineNumber: 492,
                                                    columnNumber: 21
                                                }, this),
                                                isCustom && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>handleEditMaterial(e, key),
                                                            className: "absolute top-1 right-1 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full w-5 h-5 flex items-center justify-center transition-opacity",
                                                            "aria-label": `Edit ${name} material`,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                                className: "w-2.5 h-2.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/StyleSelector.js",
                                                                lineNumber: 506,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/StyleSelector.js",
                                                            lineNumber: 501,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>handleDeleteMaterial(e, key),
                                                            className: "absolute top-1 left-1 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full w-5 h-5 flex items-center justify-center transition-opacity",
                                                            "aria-label": `Delete ${name} material`,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                className: "w-2.5 h-2.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/StyleSelector.js",
                                                                lineNumber: 513,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/StyleSelector.js",
                                                            lineNumber: 508,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/StyleSelector.js",
                                                    lineNumber: 500,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 486,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `px-1 py-1 text-left text-xs font-medium border-t ${key === 'testMaterial' ? 'border-purple-200' : isCustom ? 'border-blue-200' : 'border-gray-200'} ${styleMode === key ? key === 'testMaterial' ? 'bg-purple-800 text-white' : isCustom ? 'bg-blue-800 text-white' : 'bg-gray-800 text-white' : key === 'testMaterial' ? 'bg-purple-50 text-purple-600' : isCustom ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "truncate",
                                                children: name
                                            }, void 0, false, {
                                                fileName: "[project]/components/StyleSelector.js",
                                                lineNumber: 538,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 519,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/StyleSelector.js",
                                    lineNumber: 474,
                                    columnNumber: 15
                                }, this)
                            }, key, false, {
                                fileName: "[project]/components/StyleSelector.js",
                                lineNumber: 459,
                                columnNumber: 13
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleAddMaterial,
                            type: "button",
                            "aria-label": "Add new material",
                            className: "focus:outline-none focus:ring-2 focus:ring-gray-400",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-20 border border-dashed border-blue-400 overflow-hidden rounded-xl bg-blue-50 flex flex-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full relative",
                                        style: {
                                            aspectRatio: '1/1'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-center h-full",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "w-8 h-8 text-blue-500"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StyleSelector.js",
                                                lineNumber: 556,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 555,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/StyleSelector.js",
                                        lineNumber: 554,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-1 py-1 text-left text-xs font-medium border-t border-blue-200 bg-blue-100 text-blue-600 w-full",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "truncate",
                                            children: "Add Material"
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 560,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/StyleSelector.js",
                                        lineNumber: 559,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/StyleSelector.js",
                                lineNumber: 553,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/StyleSelector.js",
                            lineNumber: 547,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/StyleSelector.js",
                    lineNumber: 456,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/StyleSelector.js",
                lineNumber: 455,
                columnNumber: 7
            }, this),
            showAddMaterialModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 modalBackdrop",
                onClick: handleClickOutsideModal,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white p-6 rounded-xl shadow-medium max-w-2xl w-full",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold mb-4",
                            children: recentlyAdded && styleOptions[recentlyAdded] ? 'Edit Material' : 'Add Material'
                        }, void 0, false, {
                            fileName: "[project]/components/StyleSelector.js",
                            lineNumber: 579,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-6 items-start mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-gray-700 text-base mb-2",
                                            children: "Material Name"
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 586,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: newMaterialName,
                                            onChange: (e)=>setNewMaterialName(e.target.value),
                                            className: "w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                                            placeholder: "Enter material name"
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 587,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/StyleSelector.js",
                                    lineNumber: 585,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative w-[120px] h-[120px] rounded-lg overflow-hidden border border-gray-200",
                                    children: [
                                        previewThumbnail || customImagePreview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: useCustomImage ? customImagePreview : previewThumbnail,
                                            alt: "Material preview",
                                            className: "w-full h-full object-cover"
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 599,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-full h-full bg-gray-50 flex items-center justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-400 text-sm text-center px-4",
                                                children: isGeneratingPreview ? 'Generating...' : 'Preview'
                                            }, void 0, false, {
                                                fileName: "[project]/components/StyleSelector.js",
                                                lineNumber: 606,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 605,
                                            columnNumber: 19
                                        }, this),
                                        isGeneratingPreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 bg-black/5 flex items-center justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-white/90 rounded-full p-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                    className: "w-5 h-5 animate-spin text-gray-700"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StyleSelector.js",
                                                    lineNumber: 614,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/StyleSelector.js",
                                                lineNumber: 613,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 612,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/StyleSelector.js",
                                    lineNumber: 597,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/StyleSelector.js",
                            lineNumber: 584,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700",
                                            children: "Prompt"
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 624,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setShowCustomPrompt(!showCustomPrompt),
                                            className: "text-xs text-blue-600 hover:text-blue-800",
                                            children: showCustomPrompt ? 'Use Default Prompt' : 'Customize Prompt'
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 627,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/StyleSelector.js",
                                    lineNumber: 623,
                                    columnNumber: 15
                                }, this),
                                showCustomPrompt ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: customPrompt,
                                            onChange: (e)=>setCustomPrompt(e.target.value),
                                            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-32",
                                            placeholder: "Enter a custom prompt for your material..."
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 638,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-end mt-1",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: handleGenerateDefaultPrompt,
                                                className: "text-xs text-blue-600 hover:text-blue-800",
                                                disabled: !newMaterialName.trim(),
                                                children: "Generate Default"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StyleSelector.js",
                                                lineNumber: 645,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 644,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm text-gray-500",
                                            children: "Customize how your material is applied to drawings"
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 654,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-500",
                                    children: "Using auto-generated prompt based on the material name"
                                }, void 0, false, {
                                    fileName: "[project]/components/StyleSelector.js",
                                    lineNumber: 659,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/StyleSelector.js",
                            lineNumber: 622,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "block text-sm font-medium text-gray-700",
                                            children: "Material Preview"
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 668,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setUseCustomImage(!useCustomImage),
                                            type: "button",
                                            className: "text-xs text-gray-600 hover:text-gray-800",
                                            children: useCustomImage ? 'Use Auto-Generated' : 'Upload Custom Image'
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 672,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/StyleSelector.js",
                                    lineNumber: 667,
                                    columnNumber: 15
                                }, this),
                                useCustomImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border-2 border-dashed border-gray-300 rounded-md p-4 text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "file",
                                            accept: "image/*",
                                            ref: fileInputRef,
                                            onChange: handleFileChange,
                                            className: "hidden"
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 683,
                                            columnNumber: 19
                                        }, this),
                                        customImagePreview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative w-32 h-32 mx-auto",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: customImagePreview,
                                                        alt: "Material preview",
                                                        className: "w-full h-full object-cover"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/StyleSelector.js",
                                                        lineNumber: 694,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: triggerFileInput,
                                                        className: "absolute top-2 right-2 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full w-7 h-7 flex items-center justify-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                            className: "w-3.5 h-3.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/StyleSelector.js",
                                                            lineNumber: 703,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/StyleSelector.js",
                                                        lineNumber: 699,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/StyleSelector.js",
                                                lineNumber: 693,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 692,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            onClick: triggerFileInput,
                                            className: "flex flex-col items-center justify-center cursor-pointer py-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                    className: "w-8 h-8 text-gray-400 mb-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StyleSelector.js",
                                                    lineNumber: 712,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-500",
                                                    children: "Click to upload image"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StyleSelector.js",
                                                    lineNumber: 713,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 708,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/StyleSelector.js",
                                    lineNumber: 682,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border-2 border-gray-300 rounded-md p-4 text-center",
                                    children: previewThumbnail ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-2 relative",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-32 h-32 mx-auto",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: previewThumbnail,
                                                    alt: "Auto-generated preview",
                                                    className: "w-full h-full object-cover"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StyleSelector.js",
                                                    lineNumber: 724,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleRegenerateThumbnail,
                                                    disabled: isGeneratingPreview,
                                                    className: "absolute top-2 right-2 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full w-7 h-7 flex items-center justify-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$ccw$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCcw$3e$__["RefreshCcw"], {
                                                        className: "w-3.5 h-3.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/StyleSelector.js",
                                                        lineNumber: 734,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StyleSelector.js",
                                                    lineNumber: 729,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 723,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/StyleSelector.js",
                                        lineNumber: 722,
                                        columnNumber: 21
                                    }, this) : isGeneratingPreview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "py-8 flex flex-col items-center justify-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-2"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StyleSelector.js",
                                                lineNumber: 740,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500",
                                                children: "Generating preview..."
                                            }, void 0, false, {
                                                fileName: "[project]/components/StyleSelector.js",
                                                lineNumber: 741,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/StyleSelector.js",
                                        lineNumber: 739,
                                        columnNumber: 21
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "py-8 flex flex-col items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-500",
                                            children: newMaterialName ? "Preview will generate automatically" : "Enter a material name to generate a preview"
                                        }, void 0, false, {
                                            fileName: "[project]/components/StyleSelector.js",
                                            lineNumber: 745,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/StyleSelector.js",
                                        lineNumber: 744,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/StyleSelector.js",
                                    lineNumber: 720,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/StyleSelector.js",
                            lineNumber: 666,
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
                                    lineNumber: 758,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleCreateMaterial,
                                    disabled: isGeneratingThumbnail || !newMaterialName.trim(),
                                    className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50",
                                    children: "Create Material"
                                }, void 0, false, {
                                    fileName: "[project]/components/StyleSelector.js",
                                    lineNumber: 764,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/StyleSelector.js",
                            lineNumber: 757,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/StyleSelector.js",
                    lineNumber: 575,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/StyleSelector.js",
                lineNumber: 571,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/StyleSelector.js",
        lineNumber: 454,
        columnNumber: 5
    }, this);
};
_s(StyleSelector, "t3XmatHrG6ZlzkhthEYfnt5diac=");
_c = StyleSelector;
const __TURBOPACK__default__export__ = StyleSelector;
var _c;
__turbopack_context__.k.register(_c, "StyleSelector");
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
            className: "fixed inset-0 bg-black/30 flex items-center justify-center z-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white p-6 rounded-xl shadow-medium max-w-md w-full mx-4",
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
        className: "w-full flex items-center",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-start",
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
                    className: "text-gray-400",
                    children: [
                        "By ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "https://www.instagram.com/devethanvalladares/?hl=en/",
                            className: "underline hover:text-gray-600",
                            children: "Dev Valladares"
                        }, void 0, false, {
                            fileName: "[project]/components/Header.js",
                            lineNumber: 8,
                            columnNumber: 14
                        }, this),
                        " ",
                        "& ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "https://x.com/trudypainter",
                            className: "underline hover:text-gray-600",
                            children: "Trudy Painter"
                        }, void 0, false, {
                            fileName: "[project]/components/Header.js",
                            lineNumber: 9,
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
                className: "flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-full transition-opacity",
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
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10",
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
                                lineNumber: 73,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-gray-600 whitespace-nowrap",
                                children: dim.label
                            }, void 0, false, {
                                fileName: "[project]/components/DimensionSelector.js",
                                lineNumber: 74,
                                columnNumber: 17
                            }, this)
                        ]
                    }, dim.id, true, {
                        fileName: "[project]/components/DimensionSelector.js",
                        lineNumber: 66,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/DimensionSelector.js",
                lineNumber: 62,
                columnNumber: 9
            }, this)
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
        className: "fixed inset-0 bg-black/30 flex items-center justify-center z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white p-6 rounded-xl shadow-medium max-w-5xl w-full mx-4 max-h-[80vh] flex flex-col",
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
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "aspect-w-3 aspect-h-2 rounded-lg overflow-hidden border border-gray-200",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: item.imageUrl,
                                        alt: `Drawing history ${index + 1}`,
                                        className: "object-cover w-full h-full group-hover:opacity-90 transition-opacity"
                                    }, void 0, false, {
                                        fileName: "[project]/components/HistoryModal.js",
                                        lineNumber: 40,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/HistoryModal.js",
                                    lineNumber: 39,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity",
                                    children: new Date(item.timestamp).toLocaleString()
                                }, void 0, false, {
                                    fileName: "[project]/components/HistoryModal.js",
                                    lineNumber: 46,
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
        ctx.lineWidth = currentTool === 'eraser' ? 20 : penWidth;
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
            setIsLoading(true);
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
                const requestPayload = {
                    prompt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$StyleSelector$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getPromptForStyle"])(styleMode),
                    drawingData,
                    customApiKey
                };
                console.log('Making API request with style:', styleMode);
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
        currentDimension
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CanvasContainer.useEffect": ()=>{
            // Only trigger if we have something drawn (check if canvas is not empty)
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
                    if (hasDrawing) {
                        await handleGeneration();
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
        handleGeneration
    ]); // Added handleGeneration to dependency array
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
    const onImageUpload = (imageDataUrl)=>{
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
        className: "flex min-h-screen flex-col items-center justify-start bg-gray-50 p-2 md:p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-[1800px] mx-auto pb-32",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-shrink-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/components/CanvasContainer.js",
                                        lineNumber: 692,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/CanvasContainer.js",
                                    lineNumber: 691,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DimensionSelector$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            currentDimension: currentDimension,
                                            onDimensionChange: handleDimensionChange
                                        }, void 0, false, {
                                            fileName: "[project]/components/CanvasContainer.js",
                                            lineNumber: 695,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-gray-600 bg-gray-200 px-4 py-2 rounded-full whitespace-nowrap",
                                            children: "Using Gemini 2.0 Native Image Generation"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CanvasContainer.js",
                                            lineNumber: 699,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CanvasContainer.js",
                                    lineNumber: 694,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CanvasContainer.js",
                            lineNumber: 690,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-center w-full h-full",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Canvas$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
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
                                                onImageUpload: onImageUpload,
                                                isGenerating: isLoading
                                            }, void 0, false, {
                                                fileName: "[project]/components/CanvasContainer.js",
                                                lineNumber: 708,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/CanvasContainer.js",
                                            lineNumber: 707,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-center w-full h-full",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex w-full",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-shrink-0 w-[54px] mr-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$BottomToolBar$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                            fileName: "[project]/components/CanvasContainer.js",
                                                            lineNumber: 733,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CanvasContainer.js",
                                                        lineNumber: 732,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 border border-gray-300 bg-white rounded-xl shadow-soft",
                                                        style: {
                                                            aspectRatio: `${currentDimension.width} / ${currentDimension.height}`,
                                                            maxWidth: '100%',
                                                            maxHeight: '800px',
                                                            position: 'relative',
                                                            overflow: 'hidden'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute inset-0 flex items-start justify-start p-2",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$StyleSelector$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                                styleMode: styleMode,
                                                                setStyleMode: setStyleMode,
                                                                handleGenerate: handleGeneration
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/CanvasContainer.js",
                                                                lineNumber: 746,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CanvasContainer.js",
                                                            lineNumber: 745,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CanvasContainer.js",
                                                        lineNumber: 735,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/CanvasContainer.js",
                                                lineNumber: 731,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/CanvasContainer.js",
                                            lineNumber: 730,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CanvasContainer.js",
                                    lineNumber: 706,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-center w-full h-full",
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
                                            lineNumber: 759,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/CanvasContainer.js",
                                        lineNumber: 758,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/CanvasContainer.js",
                                    lineNumber: 757,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CanvasContainer.js",
                            lineNumber: 705,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/CanvasContainer.js",
                    lineNumber: 689,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/CanvasContainer.js",
                lineNumber: 688,
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
                lineNumber: 775,
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
                lineNumber: 783,
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
                lineNumber: 792,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/CanvasContainer.js",
        lineNumber: 687,
        columnNumber: 5
    }, this);
};
_s(CanvasContainer, "0UMGgjvIYQU0Yxi3VkgaUycJkeQ=");
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

//# sourceMappingURL=components_f2484d5d._.js.map