export type PositionX = 'left' | 'right' | UndefinedPosition
export type PositionY = 'top' | 'bottom' | UndefinedPosition
export type UndefinedPosition = 'before' | 'after'
export type Axis = 'x' | 'y'
export type ElementSizes = ClientRect | DOMRect

/**
 * @description Направление открытие относительно relativeEl:
 * start при axis=x - с верхнего правого угла вниз
 * start при axis=y - с нижнего левого угла вниз
 * end при axis=x - с нижнего правого угла вверх
 * end при axis=y - с верхнего правого угла вниз
 */
export type ElementOpenFlow = 'start' | 'end' | 'middle'

/**
 * @description Стандартное направление открытия.
 * По умолчанию - after.
 * При axis=y и DefaultOpenWay=after элемент будет открывать под relativeEl
 * При axis=y и DefaultOpenWay=before элемент будет открывать над relativeEl
 */
export type DefaultOpenWay = UndefinedPosition

/**
 * @description Дистанция между relative и element
 */
export interface IPositionElementDistance {
  x: number
  y: number
}

/**
 * @description Дистанция между element и parent
 */
export interface IPositionElementPadding {
  x: number
  y: number
}

/**
 * .getBoundedRect()
 * @param element Открываемый элемент
 * @param parent Контейнер элемента
 * @relative Относительный элемент, относительно которого будет позиционироваться element
 */
export interface IPositionElementVariables {
  element: ElementSizes
  parent: ElementSizes
  relative: ElementSizes
}

export interface IPositionElementVariablesWithDistance extends IPositionElementVariables {
}

export interface IPositionSizesWithoutAxis {
  offset: number // left | top
  size: number // 'width' | 'height'
}

export interface IPositionElementVariablesWithoutAxis {
  element: IPositionSizesWithoutAxis
  parent: IPositionSizesWithoutAxis
  relative: IPositionSizesWithoutAxis
}

export interface IGetRectAndPositionElement {
  elements: IPositionElementVariables
  distance: IPositionElementDistance
  padding: IPositionElementPadding
  axis: Axis | 'xy'
  defaultOpenWay?: DefaultOpenWay
  elementOpenFlow?: ElementOpenFlow
}
