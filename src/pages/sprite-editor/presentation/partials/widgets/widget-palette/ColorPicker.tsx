import { useEvent } from '@/tools/hooks'
import { PersistentPixelatedCanvas } from '@/tools/ui-components/persistent-pixelated-canvas/PersistentPixelatedCanvas'
import { useState } from 'react'


export const ColorPicker = () => {
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)

  const onContextUpdate = (ctx: CanvasRenderingContext2D | null) => {
    if (!ctx) return
    console.log('123', ctx)
    setContext(ctx)
    createPalette(ctx)
  }

  const createPalette = (context: CanvasRenderingContext2D) => {
    console.log('111')
    const { width, height } = context.canvas
    var gradient = context.createLinearGradient(0, 0, width, 0)
    // Create color gradient
    gradient.addColorStop(0, "rgb(255,   0,   0)")
    gradient.addColorStop(0.15, "rgb(255,   0, 255)")
    gradient.addColorStop(0.33, "rgb(0,     0, 255)")
    gradient.addColorStop(0.49, "rgb(0,   255, 255)")
    gradient.addColorStop(0.67, "rgb(0,   255,   0)")
    gradient.addColorStop(0.84, "rgb(255, 255,   0)")
    gradient.addColorStop(1, "rgb(255,   0,   0)")

    // Apply gradient to canvas
    context.fillStyle = gradient
    context.fillRect(0, 0, width, height)

    // Create semi transparent gradient (white -> trans. -> black)
    gradient = context.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)")
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)")
    gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)")
    gradient.addColorStop(1, "rgba(0,     0,   0, 1)")

    // Apply gradient to canvas
    context.fillStyle = gradient
    context.fillRect(0, 0, width, height)
  }

  return <>
    <PersistentPixelatedCanvas
      width={198}
      height={100}
      contextRef={onContextUpdate}
    />
  </>
}

// var app = {}
// // app.$colors = $('canvas.color-palette')
// // app.colorctx = app.$colors[0].getContext('2d')
// // Build Color palette
// app.buildColorPalette = function () {
//     var gradient = app.colorctx.createLinearGradient(0, 0, app.$colors.width(), 0)
//     // Create color gradient
//     gradient.addColorStop(0, "rgb(255,   0,   0)")
//     gradient.addColorStop(0.15, "rgb(255,   0, 255)")
//     gradient.addColorStop(0.33, "rgb(0,     0, 255)")
//     gradient.addColorStop(0.49, "rgb(0,   255, 255)")
//     gradient.addColorStop(0.67, "rgb(0,   255,   0)")
//     gradient.addColorStop(0.84, "rgb(255, 255,   0)")
//     gradient.addColorStop(1, "rgb(255,   0,   0)")
//     // Apply gradient to canvas
//     app.colorctx.fillStyle = gradient
//     app.colorctx.fillRect(0, 0, app.colorctx.canvas.width, app.colorctx.canvas.height)

//     // Create semi transparent gradient (white -> trans. -> black)
//     gradient = app.colorctx.createLinearGradient(0, 0, 0, app.$colors.height())
//     gradient.addColorStop(0, "rgba(255, 255, 255, 1)")
//     gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)")
//     gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)")
//     gradient.addColorStop(1, "rgba(0,     0,   0, 1)")
//     // Apply gradient to canvas
//     app.colorctx.fillStyle = gradient
//     app.colorctx.fillRect(0, 0, app.colorctx.canvas.width, app.colorctx.canvas.height)
//     app.$colors.mousedown(function (e) {
//         // Track mouse movement on the canvas if the mouse button is down
//         $(document).mousemove(function (e) {
//             app.colorEventX = e.pageX - ms.$colors.offset().left
//             app.colorEventY = e.pageY - ms.$colors.offset().top
//         })

//         // Get the color at the current mouse coordinates
//         app.colorTimer = setInterval(app.getColor, 50)
//     })
//         // On mouseup, clear the interval and unbind the mousemove event,
//         // it should only happen if the button is down
//         .mouseup(function (e) {
//             clearInterval(ms.colorTimer)
//             $(document).unbind('mousemove')
//         })
// }
