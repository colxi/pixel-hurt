import { Coordinates } from '../../types'


export class CanvasMouse {
  #isMouseDown: boolean = false
  #isFirstActionTick: boolean = true
  #lastMouseCoords: Coordinates = {
    x: 0,
    y: 0,
  }

  public get isMouseDown() {
    return this.#isMouseDown
  }

  public get isFirstActionTick() {
    return this.#isFirstActionTick
  }

  public get lastMouseCoords(): Readonly<Coordinates> {
    return this.#lastMouseCoords
  }

  public setMouseCoords = (coords: Coordinates) => {
    this.#lastMouseCoords.x = coords.x
    this.#lastMouseCoords.y = coords.y
  }

  public setMouseDown = () => {
    this.#isMouseDown = true
    this.#isFirstActionTick = true
  }

  public setIsFirstActionTick = (val: boolean) => {
    this.#isFirstActionTick = val
  }

  public setMouseUp = () => {
    this.#isMouseDown = false
    this.#isFirstActionTick = false
  }
}
