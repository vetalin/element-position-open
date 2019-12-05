import { IGetRectAndPositionElement, IPositionElementDistance, IPositionElementPadding } from './interfaces'
import { getOpenElementPosition } from './elementPositionLogic'


/**
 *
 * @param data
 * @param data.elements - IPositionElementVariables
 * @param data.distance? - IPositionElementDistance
 * @param data.padding? - IPositionElementPadding
 * @param data.axis? - Axis | 'xy'
 * @param data.defaultOpenWay? - DefaultOpenWay
 * @param data.elementOpenFlow? - ElementOpenFlow
 */
export const getElementRectAndPosition = (data: IGetRectAndPositionElement): ClientRect => {
  const initPadding = (): IPositionElementPadding | IPositionElementDistance => ({x: 0, y: 0})
  return getOpenElementPosition(
    data.elements,
    data.distance || initPadding(),
    data.padding || initPadding(),
    data.axis || 'y',
    data.defaultOpenWay,
    data.elementOpenFlow
  )
}
