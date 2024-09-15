import React from 'react'

interface Props {
  width: number
  height: number
  className?: string
  contextRef: (a: CanvasRenderingContext2D | null) => void
  onMouseDown?: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseMove?: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onClick?: (e: React.MouseEvent<HTMLCanvasElement>) => void
}

/**
 * 
 * This Canvas is not rerendered when the parent component is rerendered.
 * 
 */
export class PersistentPixelatedCanvas extends React.Component<Props> {
  static defaultProps = {
    className: 'PersistentPixelatedCanvas'
  };

  shouldComponentUpdate() {
    return false
  }

  handleRefPropagation = (canvas: HTMLCanvasElement) => {
    if (!canvas) return
    const context = canvas.getContext('2d')
    context!.imageSmoothingEnabled = false
    this.props.contextRef(context || null)
  }

  handleOnMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (this.props.onMouseDown) this.props.onMouseDown(e)
  }

  handleOnMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (this.props.onMouseMove) this.props.onMouseMove(e)
  }


  handleOnClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (this.props.onClick) this.props.onClick(e)
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
        onClick={this.handleOnClick}
      />
    )
  }
}
