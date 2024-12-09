export enum SpriteEditorTool {
  MOVE = 'MOVE',
  BRUSH = 'BRUSH',
  ERASER = 'ERASER',
  HAND = 'HAND',
  ZOOM = 'ZOOM',
}

export type Color = {
  r: number
  g: number
  b: number
  a: number
}

export interface Coordinates {
  x: number
  y: number
}

export interface Size {
  w: number
  h: number
}

export interface Box {
  position: Coordinates
  size: Size
}
