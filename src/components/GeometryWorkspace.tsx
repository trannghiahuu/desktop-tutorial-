/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  MousePointer,
  RotateCcw,
  Hand,
  ZoomOut,
  ZoomIn,
  Ruler,
  Triangle,
  Compass,
  PenTool,
  Type,
  FileText,
  Eraser,
  Grid,
  HelpCircle,
  Trash2,
  X,
  RotateCw,
  Check,
  ChevronDown,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, DrawingElement, ToolType } from '../types';

interface GeometryWorkspaceProps {
  onBackToHome: () => void;
}

export default function GeometryWorkspace({ onBackToHome }: GeometryWorkspaceProps) {
  // Global Active Tool Type
  const [activeTool, setActiveTool] = useState<ToolType>('pen');
  
  // Mathematical Instruments Toggle & States
  const [showRuler, setShowRuler] = useState(true);
  const [rulerPos, setRulerPos] = useState<Point>({ x: 200, y: 550 });
  const [rulerRot, setRulerRot] = useState<number>(0);
  const [rulerLength, setRulerLength] = useState<number>(800); //px

  const [showProtractor, setShowProtractor] = useState(false);
  const [protractorPos, setProtractorPos] = useState<Point>({ x: 350, y: 400 });
  const [protractorRot, setProtractorRot] = useState<number>(0);
  const [protractorSize, setProtractorSize] = useState<number>(360); //px diameter

  const [showEke, setShowEke] = useState(false);
  const [ekePos, setEkePos] = useState<Point>({ x: 500, y: 350 });
  const [ekeRot, setEkeRot] = useState<number>(0);
  const [ekeSize, setEkeSize] = useState<number>(300); //px base legs

  const [showCompass, setShowCompass] = useState(false);
  const [compassPos, setCompassPos] = useState<Point>({ x: 600, y: 300 });
  const [compassRot, setCompassRot] = useState<number>(0);
  const [compassRadius, setCompassRadius] = useState<number>(150); // radius in px
  const [isDrawingCompassCircle, setIsDrawingCompassCircle] = useState(false);

  // Drawing settings
  const [currentColor, setCurrentColor] = useState<string>('#0037b0');
  const [currentThickness, setCurrentThickness] = useState<number>(4);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState<number>(50); // pixels
  const [canvasScale, setCanvasScale] = useState<number>(1);
  const [canvasOffset, setCanvasOffset] = useState<Point>({ x: 0, y: 0 });

  // For drawing shape options
  const [shapeMode, setShapeMode] = useState<'free' | 'line' | 'circle' | 'square'>('free');

  // Popup / Helper overlay
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [textToInsert, setTextToInsert] = useState('');
  const [textInsertPoint, setTextInsertPoint] = useState<Point | null>(null);

  // Drawing Canvas references & States
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [undoStack, setUndoStack] = useState<DrawingElement[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStartPoint, setDrawStartPoint] = useState<Point | null>(null);
  const [currentDrawingPoints, setCurrentDrawingPoints] = useState<Point[]>([]);

  // Dragging / Rotating Tool Ref tracking
  const activeDragToolRef = useRef<{
    toolType: 'ruler' | 'protractor' | 'eke' | 'compass';
    action: 'drag' | 'rotate' | 'adjust';
    startPos: Point;
    startToolPos: Point;
    startRot: number;
    startValue?: number;
  } | null>(null);

  // Render elements into canvas whenever elements, grid, scale, or offsets change
  useEffect(() => {
    drawCanvas();
  }, [elements, showGrid, gridSize, canvasScale, canvasOffset]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with light canvas background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // Apply pan and zoom
    ctx.translate(canvasOffset.x, canvasOffset.y);
    ctx.scale(canvasScale, canvasScale);

    // Draw Grid if enabled (Authentic Vietnamese math notebook style look but optimized for contrast)
    if (showGrid) {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      
      // Horizontal lines
      const startY = Math.floor(-canvasOffset.y / canvasScale / gridSize) * gridSize;
      const endY = startY + (canvas.height / canvasScale) + gridSize * 2;
      for (let y = startY; y < endY; y += gridSize) {
        ctx.beginPath();
        // Dynamic bolder line for index lines
        if (y % (gridSize * 5) === 0) {
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1.5;
        } else {
          ctx.strokeStyle = '#f1f5f9';
          ctx.lineWidth = 0.8;
        }
        ctx.moveTo(-canvasOffset.x / canvasScale - gridSize, y);
        ctx.lineTo((-canvasOffset.x + canvas.width) / canvasScale + gridSize, y);
        ctx.stroke();
      }

      // Vertical lines
      const startX = Math.floor(-canvasOffset.x / canvasScale / gridSize) * gridSize;
      const endX = startX + (canvas.width / canvasScale) + gridSize * 2;
      for (let x = startX; x < endX; x += gridSize) {
        ctx.beginPath();
        if (x % (gridSize * 5) === 0) {
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1.5;
        } else {
          ctx.strokeStyle = '#f1f5f9';
          ctx.lineWidth = 0.8;
        }
        ctx.moveTo(x, -canvasOffset.y / canvasScale - gridSize);
        ctx.lineTo(x, (-canvasOffset.y + canvas.height) / canvasScale + gridSize);
        ctx.stroke();
      }
    }

    // Draw saved geometric paths and drawings
    elements.forEach((el) => {
      ctx.strokeStyle = el.color;
      ctx.fillStyle = el.color;
      ctx.lineWidth = el.thickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (el.type === 'path') {
        if (el.points.length < 1) return;
        if (el.shapeType === 'line' && el.points.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(el.points[0].x, el.points[0].y);
          ctx.lineTo(el.points[el.points.length - 1].x, el.points[el.points.length - 1].y);
          ctx.stroke();
        } else if (el.shapeType === 'circle' && el.points.length >= 2) {
          const p1 = el.points[0];
          const p2 = el.points[el.points.length - 1];
          const radius = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, radius, 0, 2 * Math.PI);
          ctx.stroke();
        } else if (el.shapeType === 'square' && el.points.length >= 2) {
          const p1 = el.points[0];
          const p2 = el.points[el.points.length - 1];
          const w = p2.x - p1.x;
          const h = p2.y - p1.y;
          ctx.beginPath();
          ctx.rect(p1.x, p1.y, w, h);
          ctx.stroke();
        } else {
          // Freehand path
          ctx.beginPath();
          ctx.moveTo(el.points[0].x, el.points[0].y);
          for (let i = 1; i < el.points.length; i++) {
            ctx.lineTo(el.points[i].x, el.points[i].y);
          }
          ctx.stroke();
        }
      } else if (el.type === 'text' && el.text) {
        ctx.fillStyle = el.color;
        ctx.font = `bold ${el.thickness * 4 + 16}px Inter`;
        ctx.fillText(el.text, el.points[0].x, el.points[0].y);
      }
    });

    ctx.restore();
  };

  // Resize canvas to cover screen area properly
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = canvas?.parentElement;
      if (canvas && container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawCanvas();
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial call
    setTimeout(handleResize, 100);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper trigger drawing canvas resize when instruments toggle
  useEffect(() => {
    drawCanvas();
  }, [showRuler, showProtractor, showEke, showCompass]);

  // Pointer interaction coordinates matching scale and offset
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvasOffset.x) / canvasScale;
    const y = (e.clientY - rect.top - canvasOffset.y) / canvasScale;
    return { x, y };
  };

  // Pointer Down on Drawing Canvas
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activeTool === 'select' || activeTool === 'pan') {
      if (activeTool === 'pan') {
        setIsDrawing(true);
        setDrawStartPoint({ x: e.clientX, y: e.clientY });
      }
      return;
    }

    const clickPoint = getCanvasCoords(e);
    setIsDrawing(true);
    setDrawStartPoint(clickPoint);

    if (activeTool === 'text') {
      setTextInsertPoint(clickPoint);
      setTextToInsert('');
      setShowTextModal(true);
      setIsDrawing(false);
      return;
    }

    if (activeTool === 'eraser') {
      // Find nearest elements to click point and remove
      eraseAtPoint(clickPoint);
      return;
    }

    // Active tool pen or drawing shapes
    setCurrentDrawingPoints([clickPoint]);
  };

  // Pointer Move on Drawing Canvas
  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    if (activeTool === 'pan' && drawStartPoint) {
      const dx = e.clientX - drawStartPoint.x;
      const dy = e.clientY - drawStartPoint.y;
      setCanvasOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setDrawStartPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    const currentPoint = getCanvasCoords(e);

    if (activeTool === 'eraser') {
      eraseAtPoint(currentPoint);
      return;
    }

    if (activeTool === 'pen') {
      setCurrentDrawingPoints((prev) => [...prev, currentPoint]);

      // Draw active stroke directly for instant feedback (even before state registers)
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas && drawStartPoint) {
        ctx.save();
        ctx.translate(canvasOffset.x, canvasOffset.y);
        ctx.scale(canvasScale, canvasScale);

        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentThickness;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        const pts = [...currentDrawingPoints, currentPoint];
        if (shapeMode === 'free') {
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i].x, pts[i].y);
          }
          ctx.stroke();
        } else if (shapeMode === 'line') {
          ctx.moveTo(pts[0].x, pts[0].y);
          ctx.lineTo(currentPoint.x, currentPoint.y);
          drawCanvas(); // force redraw grid and earlier elements
          ctx.stroke();
        } else if (shapeMode === 'circle' && pts.length >= 2) {
          const r = Math.sqrt(Math.pow(currentPoint.x - pts[0].x, 2) + Math.pow(currentPoint.y - pts[0].y, 2));
          drawCanvas();
          ctx.beginPath();
          ctx.arc(pts[0].x, pts[0].y, r, 0, 2 * Math.PI);
          ctx.stroke();
        } else if (shapeMode === 'square' && pts.length >= 2) {
          drawCanvas();
          ctx.beginPath();
          ctx.rect(pts[0].x, pts[0].y, currentPoint.x - pts[0].x, currentPoint.y - pts[0].y);
          ctx.stroke();
        }
        ctx.restore();
      }
    }
  };

  // Pointer Up on Drawing Canvas
  const handleCanvasPointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (activeTool === 'pen' && currentDrawingPoints.length > 0) {
      const newElement: DrawingElement = {
        id: `el_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type: 'path',
        points: currentDrawingPoints,
        color: currentColor,
        thickness: currentThickness,
        shapeType: shapeMode === 'free' ? undefined : shapeMode,
      };

      // Store in undo history standard stack
      setUndoStack((prev) => [...prev, elements]);
      setElements((prev) => [...prev, newElement]);
    }

    setDrawStartPoint(null);
    setCurrentDrawingPoints([]);
  };

  // Erase nearest drawing element to coordinates
  const eraseAtPoint = (pt: Point) => {
    const threshold = 15; // px sensitivity
    let foundIndex = -1;

    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      if (el.type === 'path') {
        const isFar = el.points.every((p) => {
          const dist = Math.sqrt(Math.pow(p.x - pt.x, 2) + Math.pow(p.y - pt.y, 2));
          return dist > threshold;
        });
        if (!isFar) {
          foundIndex = i;
          break;
        }
      } else if (el.type === 'text') {
        const dist = Math.sqrt(Math.pow(el.points[0].x - pt.x, 2) + Math.pow(el.points[0].y - pt.y, 2));
        if (dist < threshold * 2) {
          foundIndex = i;
          break;
        }
      }
    }

    if (foundIndex !== -1) {
      setUndoStack((prev) => [...prev, elements]);
      setElements((prev) => prev.filter((_, idx) => idx !== foundIndex));
    }
  };

  // Insert Custom Text
  const handleInsertText = () => {
    if (!textToInsert.trim() || !textInsertPoint) return;

    const newElement: DrawingElement = {
      id: `el_${Date.now()}`,
      type: 'text',
      points: [textInsertPoint],
      color: currentColor,
      thickness: currentThickness, // text font size scales on thickness
      text: textToInsert,
    };

    setUndoStack((prev) => [...prev, elements]);
    setElements((prev) => [...prev, newElement]);
    setShowTextModal(false);
    setTextToInsert('');
  };

  // Undo Last Action
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previousState = undoStack[undoStack.length - 1];
    setElements(previousState);
    setUndoStack((prev) => prev.slice(0, prev.length - 1));
  };

  // Reset Canvas Complete
  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sạch toàn bộ hình vẽ trên bảng trình chiếu không?')) {
      setUndoStack((prev) => [...prev, elements]);
      setElements([]);
    }
  };

  // Mathematical Instrument Drag / Rotate Calculations
  const startInstrumentAction = (
    e: React.PointerEvent,
    toolType: 'ruler' | 'protractor' | 'eke' | 'compass',
    action: 'drag' | 'rotate' | 'adjust'
  ) => {
    e.stopPropagation();
    e.preventDefault();

    // Set dragging tool pointer ref
    const targetVar =
      toolType === 'ruler' ? rulerPos :
      toolType === 'protractor' ? protractorPos :
      toolType === 'eke' ? ekePos : compassPos;

    const targetRot =
      toolType === 'ruler' ? rulerRot :
      toolType === 'protractor' ? protractorRot :
      toolType === 'eke' ? ekeRot : compassRot;

    const targetVal = toolType === 'compass' ? compassRadius : 0;

    activeDragToolRef.current = {
      toolType,
      action,
      startPos: { x: e.clientX, y: e.clientY },
      startToolPos: { ...targetVar },
      startRot: targetRot,
      startValue: targetVal
    };

    document.addEventListener('pointermove', globalInstrumentPointerMove);
    document.addEventListener('pointerup', globalInstrumentPointerUp);
  };

  const globalInstrumentPointerMove = (e: PointerEvent) => {
    const tracking = activeDragToolRef.current;
    if (!tracking) return;

    const dx = e.clientX - tracking.startPos.x;
    const dy = e.clientY - tracking.startPos.y;

    if (tracking.action === 'drag') {
      const newPos = {
        x: tracking.startToolPos.x + dx,
        y: tracking.startToolPos.y + dy
      };

      if (tracking.toolType === 'ruler') setRulerPos(newPos);
      else if (tracking.toolType === 'protractor') setProtractorPos(newPos);
      else if (tracking.toolType === 'eke') setEkePos(newPos);
      else if (tracking.toolType === 'compass') setCompassPos(newPos);
    } 
    else if (tracking.action === 'rotate') {
      // Find angle difference between start client angle vs current relative to center center of instrument
      const toolCenter = tracking.startToolPos;
      
      const startAngleRad = Math.atan2(
        tracking.startPos.y - toolCenter.y,
        tracking.startPos.x - toolCenter.x
      );
      const currentAngleRad = Math.atan2(
        e.clientY - toolCenter.y,
        e.clientX - toolCenter.x
      );

      const deltaDeg = ((currentAngleRad - startAngleRad) * 180) / Math.PI;
      let newRot = (tracking.startRot + deltaDeg) % 360;
      if (newRot < 0) newRot += 360;

      // Rounded locks for convenient teaching (lock at multiple of 15 / 45 deg on Shift key optionally)
      if (e.shiftKey) {
        newRot = Math.round(newRot / 15) * 15;
      } else {
        newRot = Math.round(newRot);
      }

      if (tracking.toolType === 'ruler') setRulerRot(newRot);
      else if (tracking.toolType === 'protractor') setProtractorRot(newRot);
      else if (tracking.toolType === 'eke') setEkeRot(newRot);
      else if (tracking.toolType === 'compass') setCompassRot(newRot);
    }
    else if (tracking.action === 'adjust') {
      // Adjustment of size or specialized tool params (like compass radius)
      if (tracking.toolType === 'compass' && tracking.startValue !== undefined) {
        const deltaRadius = dx; // expand / contract compass legs drag horizontally
        const newRadius = Math.max(50, Math.min(400, tracking.startValue + deltaRadius));
        setCompassRadius(Math.round(newRadius));
      }
    }
  };

  const globalInstrumentPointerUp = () => {
    activeDragToolRef.current = null;
    document.removeEventListener('pointermove', globalInstrumentPointerMove);
    document.removeEventListener('pointerup', globalInstrumentPointerUp);
  };

  // Automated Animated Drawing and Rotate Circle with Compass (Extremely satisfying!)
  const drawCompassCircle = () => {
    if (isDrawingCompassCircle) return;
    setIsDrawingCompassCircle(true);

    let startAngle = 0;
    const finalAngle = 360;
    const duration = 1500; // ms
    const startTime = performance.now();

    const circlePoints: Point[] = [];
    const center = { x: compassPos.x, y: compassPos.y };
    const radius = compassRadius;

    const animateRotationAndStroke = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const currentAngle = progress * finalAngle;

      // Add points to shape curve as animation steps
      const rad = (currentAngle * Math.PI) / 180;
      const pt: Point = {
        x: center.x + radius * Math.cos(rad),
        y: center.y + radius * Math.sin(rad)
      };
      circlePoints.push(pt);

      // Rotate compass visual graphic model during work
      setCompassRot(Math.round(currentAngle));

      // Draw local feedback circle temporary
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        drawCanvas();
        ctx.save();
        ctx.translate(canvasOffset.x, canvasOffset.y);
        ctx.scale(canvasScale, canvasScale);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentThickness;
        ctx.beginPath();
        ctx.moveTo(circlePoints[0].x, circlePoints[0].y);
        for (let i = 1; i < circlePoints.length; i++) {
          ctx.lineTo(circlePoints[i].x, circlePoints[i].y);
        }
        ctx.stroke();
        ctx.restore();
      }

      if (progress < 1) {
        requestAnimationFrame(animateRotationAndStroke);
      } else {
        // Complete circle drawing process
        const finalPoints: Point[] = [];
        // Generate uniform complete circle points
        for (let angle = 0; angle <= 360; angle += 4) {
          const r = (angle * Math.PI) / 180;
          finalPoints.push({
            x: center.x + radius * Math.cos(r),
            y: center.y + radius * Math.sin(r)
          });
        }

        const newCircle: DrawingElement = {
          id: `el_compass_${Date.now()}`,
          type: 'path',
          points: finalPoints,
          color: currentColor,
          thickness: currentThickness,
        };

        setUndoStack((prev) => [...prev, elements]);
        setElements((prev) => [...prev, newCircle]);
        setIsDrawingCompassCircle(false);
      }
    };

    requestAnimationFrame(animateRotationAndStroke);
  };

  const handleZoom = (factor: number) => {
    setCanvasScale((prev) => Math.max(0.5, Math.min(4, prev * factor)));
  };

  const handleResetZoom = () => {
    setCanvasScale(1);
    setCanvasOffset({ x: 0, y: 0 });
  };

  return (
    <div className="h-screen bg-[#f8f9fb] text-[#191c1e] flex flex-col items-stretch overflow-hidden select-none select-none">
      
      {/* 1. Classroom Style Branding Header */}
      <header className="bg-gradient-to-r from-[#0037b0] via-[#1E3A8A] to-[#001551] text-white px-6 py-3.5 flex justify-between items-center shadow-md border-b border-[#001551]">
        <a href="https://thnghia.cc/pgp" target="_blank" rel="noreferrer" className="flex items-center gap-4 group cursor-pointer">
          {/* Logo badge */}
          <div className="w-12 h-12 rounded-full bg-[#FDE047] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
            <span className="font-display font-extrabold text-lg text-black tracking-tighter">PGP</span>
          </div>
          <div>
            <h1 className="font-display text-xl md:text-2xl font-black uppercase tracking-wide group-hover:text-[#FDE047] transition-colors">
              Plane Geometry Practice
            </h1>
            <p className="text-xs md:text-sm text-blue-200 font-sans tracking-wide">
              Công Cụ Thực Hành Hình Học Phẳng • Sản Phẩm Hỗ Trợ Từ AI
            </p>
          </div>
        </a>

        {/* Dynamic School and Educator Box */}
        <div className="hidden md:flex flex-col items-end text-right border-l border-white/20 pl-6 select-text">
          <p className="text-sm font-bold text-[#FDE047] font-sans">
            Trần Hữu Nghĩa
          </p>
          <p className="text-[11px] text-white/90">
            Trường THCS Cầu Kè - Tỉnh Vĩnh Long
          </p>
          <p className="text-[10px] text-white/70 font-mono tracking-tight col-span-2">
            Email: trannghiahuu@gmail.com - ĐT: 0799998122
          </p>
        </div>

        {/* Back to Home Button */}
        <button
          onClick={onBackToHome}
          className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs md:text-sm hover:text-[#FDE047] py-2 px-4 rounded-lg border border-white/10 transition-colors cursor-pointer"
        >
          Trang chủ
        </button>
      </header>

      {/* 2. Intelligent High-Contrast Mathematical Toolbar */}
      <div className="bg-white border-b-2 border-[#d5e4f8] py-2 p-4 flex flex-wrap gap-3 items-center justify-between shadow-xs z-30">
        
        {/* TOOL GROUP 1: Navigation & Basic Controls */}
        <div className="flex items-center bg-[#f1f5f9] rounded-xl p-1.5 border border-slate-200">
          <button
            onClick={() => setActiveTool('select')}
            title="Công cụ chọn / trỏ chuột"
            className={`p-2.5 rounded-lg transition-all ${
              activeTool === 'select' ? 'bg-[#0037b0] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MousePointer className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            title="Khôi phục bước trước (Undo)"
            className={`p-2.5 rounded-lg transition-all ${
              undoStack.length === 0 ? 'text-slate-300 pointer-events-none' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTool('pan')}
            title="Kéo dời thế giới / Pan bảng"
            className={`p-2.5 rounded-lg transition-all ${
              activeTool === 'pan' ? 'bg-[#0037b0] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Hand className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-slate-300 mx-1"></div>

          <button
            onClick={() => handleZoom(0.8)}
            title="Thu nhỏ bảng vẽ"
            className="p-2.5 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <span className="text-xs font-mono font-bold text-slate-500 px-1 select-none">
            {Math.round(canvasScale * 100)}%
          </span>

          <button
            onClick={() => handleZoom(1.2)}
            title="Phóng to bảng vẽ"
            className="p-2.5 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetZoom}
            title="Về tỉ lệ mặc định 100%"
            className="p-1 px-2 text-[10px] font-bold uppercase rounded-md text-[#0037b0] hover:bg-blue-50 ml-1"
          >
            Mặc định
          </button>
        </div>

        {/* TOOL GROUP 2: Math Instruments Toggle Buttons (Ruler, Protractor, Eke, Compass) */}
        <div className="flex items-center gap-2">
          {/* Ruler Button */}
          <button
            onClick={() => setShowRuler(!showRuler)}
            className={`flex items-center gap-2 py-2 px-4 rounded-xl border-2 font-bold text-sm transition-all shadow-xs ${
              showRuler
                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span>Thước thẳng</span>
          </button>

          {/* Protractor Button */}
          <button
            onClick={() => setShowProtractor(!showProtractor)}
            className={`flex items-center gap-2 py-2 px-4 rounded-xl border-2 font-bold text-sm transition-all shadow-xs ${
              showProtractor
                ? 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Thước đo góc</span>
          </button>

          {/* Eke Button */}
          <button
            onClick={() => setShowEke(!showEke)}
            className={`flex items-center gap-2 py-2 px-4 rounded-xl border-2 font-bold text-sm transition-all shadow-xs ${
              showEke
                ? 'bg-teal-600 text-white border-teal-600 hover:bg-teal-700'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Triangle className="w-4 h-4" />
            <span>Eke</span>
          </button>

          {/* Compass Button */}
          <button
            onClick={() => setShowCompass(!showCompass)}
            className={`flex items-center gap-2 py-2 px-4 rounded-xl border-2 font-bold text-sm transition-all shadow-xs ${
              showCompass
                ? 'bg-[#e122b5] text-white border-[#e122b5] hover:bg-[#c91ba0]'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="relative">
              <Compass className="w-4 h-4" />
            </div>
            <span>Compa</span>
          </button>
        </div>

        {/* TOOL GROUP 3: Writing Engine Settings (Pen color, drawing options) */}
        <div className="flex items-center gap-3 bg-[#f8fafc] rounded-xl p-1.5 border border-slate-200">
          <button
            onClick={() => setActiveTool('pen')}
            className={`flex items-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs transition-all ${
              activeTool === 'pen' ? 'bg-[#0037b0] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Bút vẽ</span>
          </button>

          {/* Inline Color Dots */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-100">
            {[
              { hex: '#0037b0', label: 'Xanh' },
              { hex: '#ba1a1a', label: 'Đỏ' },
              { hex: '#ea580c', label: 'Cam' },
              { hex: '#16a34a', label: 'Lá' },
              { hex: '#1e293b', label: 'Đen' }
            ].map((col) => (
              <button
                key={col.hex}
                onClick={() => {
                  setCurrentColor(col.hex);
                  setActiveTool('pen');
                }}
                title={col.label}
                className="w-6 h-6 rounded-full border border-slate-300 relative transition-transform hover:scale-110 flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: col.hex }}
              >
                {currentColor === col.hex && (
                  <Check className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
                )}
              </button>
            ))}
          </div>

          {/* Stroke Thickness Picker */}
          <div className="flex items-center gap-2 px-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Nét</span>
            <select
              value={currentThickness}
              onChange={(e) => setCurrentThickness(Number(e.target.value))}
              className="bg-white border border-slate-200 text-xs font-bold rounded-md py-1.5 px-2 outline-none cursor-pointer focus:ring-1 focus:ring-blue-400"
            >
              <option value="2">Mảnh (2px)</option>
              <option value="4">Vừa (4px)</option>
              <option value="6">Đậm (6px)</option>
              <option value="10">Siêu đậm (10px)</option>
            </select>
          </div>

          {/* Shape type selector */}
          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-100">
            <button
              onClick={() => {
                setShapeMode('free');
                setActiveTool('pen');
              }}
              className={`text-[10px] font-bold p-1.5 px-2 rounded-md ${
                shapeMode === 'free' && activeTool === 'pen' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Tự do
            </button>
            <button
              onClick={() => {
                setShapeMode('line');
                setActiveTool('pen');
              }}
              className={`text-[10px] font-bold p-1.5 px-2 rounded-md ${
                shapeMode === 'line' && activeTool === 'pen' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Đ.Thẳng
            </button>
            <button
              onClick={() => {
                setShapeMode('circle');
                setActiveTool('pen');
              }}
              className={`text-[10px] font-bold p-1.5 px-2 rounded-md ${
                shapeMode === 'circle' && activeTool === 'pen' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Hình tròn
            </button>
            <button
              onClick={() => {
                setShapeMode('square');
                setActiveTool('pen');
              }}
              className={`text-[10px] font-bold p-1.5 px-2 rounded-md ${
                shapeMode === 'square' && activeTool === 'pen' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              H.Chữ nhật
            </button>
          </div>
        </div>

        {/* TOOL GROUP 4: Extra interactive tools */}
        <div className="flex items-center gap-1.5 bg-slate-50 rounded-xl p-1 border border-slate-200">
          <button
            onClick={() => setActiveTool('text')}
            title="Chèn nội dung bằng văn bản biểu diễn bài toán"
            className={`p-2.5 rounded-lg transition-all ${
              activeTool === 'text' ? 'bg-[#0037b0] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Type className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTool('eraser')}
            title="Cục tẩy nét vẽ"
            className={`p-2.5 rounded-lg transition-all ${
              activeTool === 'eraser' ? 'bg-[#ba1a1a] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Eraser className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Bật / Tắt lưới ô ly học sinh"
            className={`p-2.5 rounded-lg transition-all ${
              showGrid ? 'bg-indigo-50 border border-indigo-200 text-[#0037b0]' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowHelpModal(true)}
            title="Xem hướng dẫn sử dụng chi tiết"
            className="p-2.5 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <HelpCircle className="w-5 h-5 text-indigo-500" />
          </button>

          <button
            onClick={handleClearAll}
            title="Xóa sạch toàn bộ bảng ảo"
            className="p-2.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-[#ba1a1a]"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3. Immersive Drawing Board & Instruments Canvas Workspace Overlay */}
      <div className="flex-grow w-full relative bg-white overflow-hidden" style={{ touchAction: 'none' }}>
        
        {/* Actual HTML Canvas element for drawings */}
        <canvas
          ref={canvasRef}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
          className={`absolute inset-0 block w-full h-full ${
            activeTool === 'pan' ? 'cursor-grab active:cursor-grabbing' : 
            activeTool === 'eraser' ? 'cursor-cell' : 
            activeTool === 'text' ? 'cursor-text' : 'cursor-crosshair'
          }`}
        />

        {/* MATH INSTRUMENTS LAYOUT OVERLAYS */}
        
        {/* A. THƯỚC THẲNG (Ruler) Component - 360 Degree Rotatable and fully Drag-and-drop */}
        {showRuler && (
          <div
            style={{
              position: 'absolute',
              left: rulerPos.x,
              top: rulerPos.y,
              transform: `translate(-50%, -50%) rotate(${rulerRot}deg)`,
              width: `${rulerLength}px`,
              height: '80px',
              touchAction: 'none',
              cursor: activeDragToolRef.current?.toolType === 'ruler' ? 'grabbing' : 'grab',
              zIndex: 40,
            }}
            onPointerDown={(e) => startInstrumentAction(e, 'ruler', 'drag')}
            className="bg-yellow-100/85 backdrop-blur-xs border-2 border-amber-500 rounded-lg shadow-lg flex flex-col justify-between p-1 select-none select-none select-none outline-2 outline-amber-300 outline-offset-2 hover:bg-yellow-100/95 transition-all duration-150"
          >
            {/* Top Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowRuler(false);
              }}
              className="absolute top-1 right-2 w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 hover:bg-amber-300 transition-colors pointer-events-auto cursor-pointer"
              title="Tắt thước thẳng"
            >
              <X className="w-3 h-3" />
            </button>

            {/* Scale Markings Container */}
            <div className="w-full flex justify-between px-3 relative">
              {/* Millimeter / Centimeter Lines */}
              {Array.from({ length: 24 }).map((_, cmIdx) => (
                <div key={cmIdx} className="flex flex-col items-center flex-grow-0 relative">
                  {/* Centimeter Long Bar */}
                  <div className="w-0.5 h-6 bg-amber-800"></div>
                  <span className="text-[11px] font-bold font-mono text-amber-950 mt-1 select-none">
                    {cmIdx}
                  </span>

                  {/* Half-cm and mm ticks nested */}
                  {cmIdx < 23 && (
                    <div className="absolute left-[3px] top-0 flex items-start gap-[6px] md:gap-[9px]" style={{ transform: 'translateX(0)' }}>
                      <div className="w-[1px] h-2.5 bg-amber-700/50"></div>
                      <div className="w-[1px] h-2.5 bg-amber-700/50"></div>
                      <div className="w-[1px] h-2.5 bg-amber-700/50"></div>
                      <div className="w-[1px] h-2.5 bg-amber-700/50"></div>
                      
                      {/* 0.5 cm tick */}
                      <div className="w-[1px] h-4 bg-amber-700/80"></div>
                      
                      <div className="w-[1px] h-2.5 bg-amber-700/50"></div>
                      <div className="w-[1px] h-2.5 bg-amber-700/50"></div>
                      <div className="w-[1px] h-2.5 bg-amber-700/50"></div>
                      <div className="w-[1px] h-2.5 bg-amber-700/50"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom guide lines & tools branding label */}
            <div className="w-full flex items-center justify-center text-xs font-serif italic text-amber-800/80">
              PGP Ruler v1
            </div>

            {/* ROTATE HANDLE WRAPPER */}
            <div
              onPointerDown={(e) => startInstrumentAction(e, 'ruler', 'rotate')}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-amber-500 text-white rounded-full p-1.5 shadow-md border border-amber-300 hover:scale-110 active:scale-95 transition-transform pointer-events-auto cursor-pointer"
              title="Giữ kéo xoay thước thẳng"
            >
              <RotateCw className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* B. THƯỚC ĐO GÓC (Protractor) Component - Semi-circle marking angle details */}
        {showProtractor && (
          <div
            style={{
              position: 'absolute',
              left: protractorPos.x,
              top: protractorPos.y,
              transform: `translate(-50%, -50%) rotate(${protractorRot}deg)`,
              width: `${protractorSize}px`,
              height: `${protractorSize / 2}px`,
              borderTopLeftRadius: `${protractorSize / 2}px`,
              borderTopRightRadius: `${protractorSize / 2}px`,
              touchAction: 'none',
              cursor: activeDragToolRef.current?.toolType === 'protractor' ? 'grabbing' : 'grab',
              zIndex: 38,
            }}
            onPointerDown={(e) => startInstrumentAction(e, 'protractor', 'drag')}
            className="bg-amber-100/80 backdrop-blur-xs border-2 border-amber-600 border-b-4 shadow-lg flex flex-col justify-end items-center relative select-none outline-2 outline-amber-300 outline-offset-2 hover:bg-amber-100/90 transition-all duration-150"
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowProtractor(false);
              }}
              className="absolute top-2 right-4 w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 hover:bg-amber-300 pointer-events-auto cursor-pointer"
              title="Tắt thước đo góc"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Angle Markings Circle Frame ticks relative radial */}
            <div className="absolute inset-0 pointer-events-none rounded-t-full border border-amber-500/20 overflow-hidden">
              {Array.from({ length: 19 }).map((_, idx) => {
                const angle = idx * 10;
                const radians = (angle * Math.PI) / 180;
                
                // Position tick markers on curve
                const outerRadius = protractorSize / 2;
                const innerRadius = outerRadius - (idx % 3 === 0 ? 30 : idx % 3 === 1 ? 12 : 18);
                const ox = outerRadius + outerRadius * Math.cos(-radians);
                const oy = outerRadius + outerRadius * Math.sin(-radians);
                const ix = outerRadius + innerRadius * Math.cos(-radians);
                const iy = outerRadius + innerRadius * Math.sin(-radians);

                // Label offsets
                const textRadius = outerRadius - 45;
                const tx = outerRadius + textRadius * Math.cos(-radians);
                const ty = outerRadius + textRadius * Math.sin(-radians);

                return (
                  <React.Fragment key={idx}>
                    {/* Tick line */}
                    <svg className="absolute inset-0 w-full h-full">
                      <line
                        x1={ox}
                        y1={oy}
                        x2={ix}
                        y2={iy}
                        stroke="#78350f"
                        strokeWidth={idx % 3 === 0 ? 2.5 : 1}
                      />
                    </svg>

                    {/* Numeric degrees labels */}
                    {idx % 3 === 0 && (
                      <span
                        className="absolute text-[10px] md:text-xs font-bold font-mono text-amber-950"
                        style={{
                          left: tx,
                          top: ty,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        {angle}°
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Central Pin Anchor marker */}
            <div className="w-10 h-10 bg-amber-500/20 rounded-full border border-amber-600 flex items-center justify-center relative -bottom-2 z-10">
              <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
            </div>

            {/* ROTATE PROTRACTOR HANDLE */}
            <div
              onPointerDown={(e) => startInstrumentAction(e, 'protractor', 'rotate')}
              className="absolute -top-10 left-1/2 -translate-x-1/2 bg-amber-600 text-white rounded-full p-1.5 shadow-md border border-amber-300 hover:scale-110 active:scale-95 transition-transform pointer-events-auto cursor-pointer"
              title="Giữ kéo xoay thước đo góc"
            >
              <RotateCw className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* C. EKE VUÔNG (Set Square) Component - Drag & Rotate custom right angled triangle */}
        {showEke && (
          <div
            style={{
              position: 'absolute',
              left: ekePos.x,
              top: ekePos.y,
              transform: `translate(-50%, -50%) rotate(${ekeRot}deg)`,
              width: `${ekeSize}px`,
              height: `${ekeSize}px`,
              touchAction: 'none',
              cursor: activeDragToolRef.current?.toolType === 'eke' ? 'grabbing' : 'grab',
              zIndex: 35,
            }}
            onPointerDown={(e) => startInstrumentAction(e, 'eke', 'drag')}
            className="relative select-none hover:opacity-100 transition-opacity duration-150"
          >
            {/* Styled triangle shape using CSS Clip Path */}
            <div className="absolute inset-0 bg-teal-100/80 backdrop-blur-xs border-2 border-teal-600 rounded-xs shadow-md clip-triangle">
              <style>{`
                .clip-triangle {
                  clip-path: polygon(0 100%, 100% 100%, 0 0);
                }
              `}</style>
              
              {/* Scale markings on vertical edge */}
              <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between py-2 pl-1 pb-1">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <div className="h-0.5 w-4 bg-teal-800"></div>
                    <span className="text-[10px] font-bold font-mono text-teal-950">{7 - idx}</span>
                  </div>
                ))}
              </div>

              {/* Scale markings on horizontal base */}
              <div className="absolute bottom-0 left-0 right-0 h-8 flex justify-between px-2 pb-1">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-end">
                    <span className="text-[10px] font-bold font-mono text-teal-950">{idx}</span>
                    <div className="w-0.5 h-4 bg-teal-800"></div>
                  </div>
                ))}
              </div>

              {/* Label inside inner window */}
              <div className="text-xs font-serif italic text-teal-800/80 absolute left-8 bottom-12 uppercase font-bold select-none whitespace-nowrap">
                Eke vuông 45-90
              </div>
            </div>

            {/* Rotate and close action control anchors explicitly on overlay */}
            <div className="absolute left-4 bottom-20 flex flex-col gap-2 z-10 pointer-events-auto">
              <button
                onPointerDown={(e) => startInstrumentAction(e, 'eke', 'rotate')}
                className="bg-teal-600 text-white rounded-full p-2 shadow-md border border-teal-300 hover:scale-110 cursor-pointer"
                title="Giữ xoay Eke"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEke(false);
                }}
                className="bg-teal-100 text-teal-800 rounded-full p-2 shadow-md border border-teal-300 hover:bg-teal-200 cursor-pointer"
                title="Tắt Eke"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* D. COMPA (Compass) Component - Adjust radius, drag pivot, and auto-draw perfect geometric circles */}
        {showCompass && (
          <div
            style={{
              position: 'absolute',
              left: compassPos.x,
              top: compassPos.y,
              transform: `rotate(${compassRot}deg)`,
              width: '80px',
              height: `${compassRadius + 60}px`,
              transformOrigin: 'top center',
              touchAction: 'none',
              zIndex: 42,
            }}
            className="flex flex-col items-center relative transition-all duration-150"
          >
            {/* Compass hinge center grab trigger */}
            <div
              onPointerDown={(e) => startInstrumentAction(e, 'compass', 'drag')}
              title="Kéo dời vị trí compa (Tâm quay)"
              className="w-10 h-10 rounded-full bg-rose-600 text-white border-2 border-white flex items-center justify-center shadow-lg hover:bg-rose-700 cursor-grab active:cursor-grabbing pointer-events-auto"
            >
              <span className="text-[10px] uppercase font-bold">Piv</span>
            </div>

            {/* Pivot Core anchor line guide */}
            <div className="w-1.5 flex-grow bg-slate-400 border-x border-slate-500 relative">
              {/* Compass left metal leg indicator */}
              <div className="absolute right-3 top-2 bottom-2 w-1.5 bg-slate-300/60 border-l border-slate-400 transform -rotate-6 origin-top"></div>
              {/* Compass right pencil leg indicator */}
              <div className="absolute left-3 top-2 bottom-2 w-1.5 bg-slate-300/60 border-r border-slate-400 transform rotate-6 origin-top"></div>
            </div>

            {/* Pencil Tip and Radius Control Slider inside */}
            <div className="w-full flex justify-between items-center px-1 bg-rose-50/90 border border-rose-200 rounded-lg py-1.5 shadow-sm transform translate-y-3 z-10 pointer-events-auto">
              
              {/* Slider for adjusting width/radius directly */}
              <div className="flex flex-col items-start gap-1 w-full p-1 select-none">
                <div className="flex justify-between items-center w-full">
                  <span className="text-[10px] font-bold text-rose-800 uppercase font-mono">Bán kính R:</span>
                  <span className="text-[11px] font-extrabold text-rose-950 font-mono bg-rose-100 px-1.5 rounded-sm">
                    {Math.round(compassRadius)}px
                  </span>
                </div>
                
                <input
                  type="range"
                  min="50"
                  max="400"
                  value={compassRadius}
                  onChange={(e) => setCompassRadius(Number(e.target.value))}
                  className="w-full accent-rose-600 h-1 bg-rose-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Compass control actions panel floating adjacent */}
            <div className="absolute left-16 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-white/95 rounded-xl p-2 border border-rose-200 shadow-md pointer-events-auto">
              <button
                onClick={drawCompassCircle}
                disabled={isDrawingCompassCircle}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs p-2 rounded-lg flex items-center gap-1 cursor-pointer shadow-xs whitespace-nowrap active:scale-95 transition-transform"
                title="Quay compa tạo đường tròn tự động hoàn hảo"
              >
                <RotateCw className={`w-4 h-4 ${isDrawingCompassCircle ? 'animate-spin' : ''}`} />
                <span>Quay Tròn</span>
              </button>

              <button
                onPointerDown={(e) => startInstrumentAction(e, 'compass', 'rotate')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs p-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                title="Xoay hướng compass định vị góc"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Xoay</span>
              </button>

              <button
                onClick={() => setShowCompass(false)}
                className="text-slate-500 hover:text-red-600 text-xs p-1 mt-1 font-bold transition-colors"
                title="Ẩn Compa"
              >
                Tắt Compa
              </button>
            </div>
          </div>
        )}

        {/* Satisfying Empty Overlay Call To Actions Prompt when no custom elements exist */}
        {elements.length === 0 && (
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 bg-slate-500/5 hover:bg-slate-500/10 border-2 border-dashed border-slate-300 rounded-2xl p-8 max-w-md text-center pointer-events-none transition-colors">
            <h3 className="font-display font-bold text-[#191c1e] text-lg mb-1">
              Bảng trình chiếu rỗng
            </h3>
            <p className="text-sm text-slate-500 font-sans leading-relaxed">
              Hãy dùng <span className="font-bold text-[#0037b0]">Bút vẽ</span> bên trên hoặc bật các công cụ hình học đo lường (Thước, Compa, Eke) để giảng dạy.
            </p>
          </div>
        )}
      </div>

      {/* 4. INSERT TEXT MODAL pop up window */}
      <AnimatePresence>
        {showTextModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl border-2 border-indigo-600 shadow-xl max-w-md w-full p-6 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-display font-bold text-lg text-[#0037b0]">
                  Chèn nhãn văn bản (Điểm, Góc, Công thức)
                </h3>
                <button
                  onClick={() => setShowTextModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <input
                type="text"
                value={textToInsert}
                onChange={(e) => setTextToInsert(e.target.value)}
                placeholder="Ví dụ: Điểm A, Góc ABC, S = πR²..."
                className="w-full border-2 border-slate-200 outline-none p-3 text-lg font-bold font-sans rounded-xl focus:border-indigo-600 transition-colors"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleInsertText();
                }}
              />

              <p className="text-xs text-slate-400 font-sans">
                Gợi ý: Cỡ chữ sẽ được quyết định bởi cấu hình độ rộng cọ sọc đang chọn trong thanh công cụ.
              </p>

              <div className="flex gap-2 justify-end mt-2">
                <button
                  onClick={() => setShowTextModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 font-semibold py-2 px-4 rounded-xl text-slate-700 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleInsertText}
                  className="bg-[#0037b0] hover:bg-brand-primary-light font-bold py-2 px-5 rounded-xl text-white shadow-md transition-colors"
                >
                  Chèn văn bản
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. GUEST INSTRUCTION MANUAL HELP MODAL */}
      <AnimatePresence>
        {showHelpModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white rounded-2xl border-2 border-blue-600 shadow-xl max-w-lg w-full p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center sticky top-0 bg-white py-2 border-b border-slate-100">
                <h3 className="font-display font-bold text-xl text-[#0037b0] flex items-center gap-2">
                  <HelpCircle className="w-6 h-6" />
                  Hướng dẫn sử dụng Plane Geometry Practice
                </h3>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4 font-sans text-sm md:text-base leading-relaxed text-slate-700 select-text">
                
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    Màn hình lớn / Tivi sẵn sàng:
                  </h4>
                  <p className="pl-4 text-xs font-medium text-slate-500">
                    Sản phẩm được thiết kế tối ưu hóa giao diện hiển thị cho cả TV lớp học thường ngày. Mọi chi tiết đồ sọc, độ dày nét chữ to rõ đặc sắc nhất khi đứng từ khoảng cách 5m.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    Kéo thả và xoay thước thẳng (Ruler):
                  </h4>
                  <p className="pl-4">
                    Nhấp giữ thân thước thẳng để dời góc vẽ toán, nhấn giữ phím nút xoay <RotateCw className="inline w-3.5 h-3.5" /> ở dưới thước để đổi độ dốc 360 độ tùy ý.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#e122b5] mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#e122b5]"></span>
                    Quay Compa tạo hình tròn:
                  </h4>
                  <p className="pl-4">
                    Kéo giữ núm đỏ trên đầu compa để di chuyển tâm của đường tròn, sử dụng thanh trượt để thay đổi bán kính R chính xác, sau đó ấn <strong>"Quay Tròn"</strong> để compa tự quay vẽ một đường tròn hoàn hảo trên bảng!
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-amber-600 mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Độ chia thước đo góc và eke vuông:
                  </h4>
                  <p className="pl-4">
                    Kéo chỉnh dời và xoay eke, thước đo góc bám khớp sát sao đề bài toán thực hành trên lớp linh hoạt vô cực.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    Các chế độ Bút vẽ toán học:
                  </h4>
                  <p className="pl-4">
                    Thử nghiệm công nghệ kéo vẽ nét bút thẳng, hình chữ nhật và hình tròn vẽ một nét mượt mà bằng thanh chế độ nằm cạnh dòng cỡ ngòi bút.
                  </p>
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-100 pt-3">
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="bg-[#0037b0] hover:bg-brand-primary-light font-bold text-white py-2 px-6 rounded-xl shadow-md transition-colors"
                >
                  Tôi đã hiểu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
