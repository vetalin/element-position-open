import {
  Axis,
  DefaultOpenWay,
  ElementOpenFlow,
  IPositionElementDistance,
  IPositionElementPadding,
  IPositionElementVariables,
  PositionWithoutAxis,
  UndefinedPosition
} from './interfaces'
import { getPositionVariablesWithDistance, getSizesWithScroll } from './size'
import { getPositionDataByAxis, getPositionElementWithoutAxis } from './position'
import { getPositionWithoutAxis } from './rectPresenter'

/**
 * @description Открыть элемент
 * @param element
 * @param relative
 * @param parent
 * @param distance
 * @param padding
 * @param axis
 * @param defaultOpenWay
 * @param elementOpenFlow
 */
export const getOpenElementPosition = (
  { element, relative, parent }: IPositionElementVariables,
  distance: IPositionElementDistance,
  padding: IPositionElementPadding,
  axis: Axis,
  defaultOpenWay: DefaultOpenWay = 'after',
  elementOpenFlow: ElementOpenFlow = 'start'
): ClientRect => {
  const elementsWithDistance = getPositionVariablesWithDistance({ element, relative, parent }, distance)
  const elementsPositionWithoutAxis = getPositionDataByAxis({ element, relative, parent })(axis)
  const positionWithoutAxis = getPositionElementWithoutAxis(elementsPositionWithoutAxis)
  const positionIsUndefined = (position: PositionWithoutAxis) => ['after', 'before'].includes(position)
  if (positionIsUndefined(positionWithoutAxis)) {
    return getSizesWithScroll(elementsWithDistance, <UndefinedPosition>positionWithoutAxis, padding)(axis)
  }
  const { top, left } = getPositionWithoutAxis(positionWithoutAxis, { element, relative, parent }, distance, defaultOpenWay, elementOpenFlow, axis)
  return {
    left,
    top,
    bottom: relative.bottom,
    right: relative.right,
    width: element.width,
    height: element.height
  }
}
