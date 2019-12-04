import { IGetRectAndPositionElement } from './interfaces'
import { getOpenElementPosition } from './elementPositionLogic'

export const getElementRectAndPosition = (data: IGetRectAndPositionElement): ClientRect => {
  return getOpenElementPosition(
    data.elements,
    data.distance,
    data.padding,
    data.axis,
    data.defaultOpenWay,
    data.elementOpenFlow
  )
}