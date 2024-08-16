import React from 'react'

interface Props {
  contextRef: (a: CanvasRenderingContext2D | null) => void
  width: number
  height: number
}

export class PersistentCanvas extends React.Component<Props> {
  shouldComponentUpdate() {
    return false
  }

  callCallback = (canvas: HTMLCanvasElement) => {
    if (!canvas) return
    const context = canvas.getContext('2d')
    this.props.contextRef(context || null)
  }

  render() {
    return (
      <canvas
        width={this.props.width}
        height={this.props.height}
        ref={this.callCallback}
      />
    )
  }
}
