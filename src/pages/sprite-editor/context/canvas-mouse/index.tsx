import { useState } from 'react'
import { Coordinates } from '../../types'

export type CanvasMouse = ReturnType<typeof useCanvasMouse>

export const useCanvasMouse = () => {
    const [isMouseDown, setIsMouseDown] = useState(false)
    const [isFirstActionTick, setIsFirstActionTick] = useState(true)
    const [lastMouseCoords, setLastMouseCoords] = useState<Coordinates>({
        x: 0,
        y: 0,
    })

    const setMouseDown = () => {
        setIsMouseDown(true)
        setIsFirstActionTick(true)
    }

    const setMouseUp = () => {
        setIsMouseDown(false)
        setIsFirstActionTick(false)
    }

    return {
        setMouseUp,
        setMouseDown,
        setIsFirstActionTick,
        setLastMouseCoords,
        isMouseDown,
        lastMouseCoords,
        isFirstActionTick,
    }
}

