import React from 'react'

interface Props {
  width: number
  height: number
  className?: string
  willReadFrequently?: boolean
  contextRef: (a: CanvasRenderingContext2D | null) => void
  onMouseDown?: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseMove?: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseOut?: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onWheel?: (e: React.WheelEvent<HTMLCanvasElement>) => void
  onClick?: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onContextMenu?: (e: React.MouseEvent<HTMLCanvasElement>) => void
}

/**
 * 
 * This Canvas is NOT re-rendered when the parent component is rerendered.
 * 
 */
export class PersistentPixelatedCanvas extends React.Component<Props> {
  static defaultProps = {
    className: 'PersistentPixelatedCanvas',
    willReadFrequently: false
  };

  shouldComponentUpdate() {
    return false
  }

  handleRefPropagation = (canvas: HTMLCanvasElement) => {
    if (!canvas) return
    const context = canvas.getContext('2d', { willReadFrequently: this.props.willReadFrequently })
    context!.imageSmoothingEnabled = false
    this.props.contextRef(context || null)
  }

  handleOnMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (this.props.onMouseDown) this.props.onMouseDown(e)
  }

  handleOnMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (this.props.onMouseMove) this.props.onMouseMove(e)
  }

  handleOnMouseOut = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (this.props.onMouseOut) this.props.onMouseOut(e)
  }

  handleOnClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (this.props.onClick) this.props.onClick(e)
  }

  handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (this.props.onContextMenu) this.props.onContextMenu(e)
  }

  handleOnWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (this.props.onWheel) this.props.onWheel(e)
  }

  render() {
    return (
      <canvas
        className={this.props.className}
        width={this.props.width}
        height={this.props.height}
        ref={this.handleRefPropagation}
        onMouseDown={this.handleOnMouseDown}
        onMouseMove={this.handleOnMouseMove}
        onMouseOut={this.handleOnMouseOut}
        onWheel={this.handleOnWheel}
        onClick={this.handleOnClick}
        onContextMenu={this.handleContextMenu}
      />
    )
  }
}
