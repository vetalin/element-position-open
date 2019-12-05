import {
  Axis,
  DefaultOpenWay,
  ElementOpenFlow,
  IPositionElementDistance,
  IPositionElementPadding,
  IPositionElementVariables,
  IPositionElementVariablesWithDistance,
  IPositionElementVariablesWithoutAxis,
  IPositionSizesWithoutAxis,
  PositionX,
  PositionY,
  UndefinedPosition
} from './interfaces'
import { getPositionVariablesWithDistance, getSizesWithScroll } from 'src/size'
import { getPositionX, getPositionY } from 'src/position'

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
  axis: Axis | 'xy',
  defaultOpenWay: DefaultOpenWay = 'after',
  elementOpenFlow: ElementOpenFlow = 'start'
): ClientRect => {
  const elementsWithDistance = getPositionVariablesWithDistance({ element, relative, parent }, distance)
  const positionIsUndefined = (position: PositionX | PositionY) => ['after', 'before'].includes(position)
  const getRectByAxis = {
    x: (): ClientRect => {
      const positionX = getPositionX(elementsWithDistance)
      if (positionIsUndefined(positionX)) {
        const undefinedPositionX = positionX as UndefinedPosition
        return getSizesWithScroll(elementsWithDistance, undefinedPositionX, padding)('x')
      } else {
        return {
          left: positionX !== 'left' && defaultOpenWay !== 'before'
            ? relative.left + relative.width + distance.x
            : relative.left - distance.x - element.width,
          top: (() => {
            const overBorderTop = (element.height + relative.top > parent.height)
            const overBorderBottom = (relative.top - (element.height - relative.height) < parent.top)
            const openToTop = relative.top + relative.height - element.height
            const openToBottom = relative.top
            const openToMiddle = relative.top + (relative.height / 2) - (element.height / 2)
            if (overBorderTop && overBorderBottom) {
              console.warn(`overBorderTop && overBorderBottom === true`)
              return openToTop
            }
            if (elementOpenFlow === 'start') {
              return !overBorderTop ? openToTop : openToBottom
            } else if (elementOpenFlow === 'middle') {
              return openToMiddle
            } else {
              return overBorderBottom ? openToTop : openToBottom
            }
          })(),
          bottom: relative.bottom,
          right: relative.right,
          width: element.width,
          height: element.height
        }
      }
    },
    y: (): ClientRect => {
      const positionY = getPositionY(elementsWithDistance)
      if (positionIsUndefined(positionY)) {
        const undefinedPositionY = positionY as UndefinedPosition
        return getSizesWithScroll(elementsWithDistance, undefinedPositionY, padding)('y')
      } else {
        return {
          top: positionY !== 'top' && defaultOpenWay !== 'before'
            ? relative.top + relative.height + distance.y
            : relative.top - distance.y - element.height,
          height: element.height,
          width: element.width,
          right: relative.right,
          bottom: relative.bottom,
          left: (() => {
            const elUpperWidth = element.width > relative.width
            const overBorderRight = elUpperWidth && (element.width + relative.left > parent.width)
            const overBorderLeft = elUpperWidth && (relative.left - (element.width - relative.width) < parent.left)
            const openToLeft = elUpperWidth ? relative.left + (relative.width - element.width) : relative.left + relative.width - element.width
            const openToRight = relative.left
            const openToMiddle = relative.left + (relative.width / 2) - (element.width / 2)
            if (overBorderRight && overBorderLeft) {
              console.warn(`overBorderRight && overBorderLeft === true`)
              return openToRight
            }
            if (elementOpenFlow === 'start') {
              return !overBorderRight ? openToRight : openToLeft
            } else if (elementOpenFlow === 'middle') {
              return openToMiddle
            } else {
              return overBorderLeft ? openToRight : openToLeft
            }
          })()
        }
      }
    }
  }
  if (axis === 'x') {
    return getRectByAxis.x()
  }
  if (axis === 'y') {
    return getRectByAxis.y()
  }
  const rectByX = getRectByAxis.x()
  const rectByY = getRectByAxis.y()
  return {
    width: rectByX.width,
    height: rectByY.height,
    left: rectByX.left,
    right: rectByX.right,
    top: rectByX.top,
    bottom: rectByY.bottom
  }
}
