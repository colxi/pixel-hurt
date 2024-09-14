import styled from 'styled-components'

export const SpriteCanvasContainer = styled.div`
  position: relative;
  width: 500px;
  height: 500px;
  cursor: none;
  border: 2px solid #bf4f74;
  overflow: hidden;
`

export const SpriteCanvas = styled.canvas`
  position: absolute;
  background: transparent;
  margin: 0;
  display: block;
  width: 100%;
  height: 100%;
`

export const SpriteCanvasUI = styled.canvas`
  position: absolute;
  background: transparent;
  margin: 0;
  display: block;
  cursor: none;
  width: 100%;
  height: 100%;
`
