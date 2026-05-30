/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ToolType =
  | 'select'
  | 'pan'
  | 'zoom_in'
  | 'zoom_out'
  | 'ruler'
  | 'protractor'
  | 'eke'
  | 'compass'
  | 'pen'
  | 'eraser'
  | 'text';

export interface Point {
  x: number;
  y: number;
}

export interface DrawingElement {
  id: string;
  type: 'path' | 'text' | 'shape';
  points: Point[];
  color: string;
  thickness: number;
  text?: string;
  shapeType?: 'line' | 'circle' | 'square';
}

export interface InteractiveTool {
  id: string;
  type: 'ruler' | 'protractor' | 'eke' | 'compass';
  x: number;
  y: number;
  rotation: number; // in degrees
  scale: number; // 0.5 to 2
}
