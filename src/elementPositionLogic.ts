/**
 * @description Возвращаем неточную позицию и предупреждение
 * @param warn
 * @param position
 */
import {
  Axis,
  DefaultOpenWay,
  ElementOpenFlow,
  IGetRectAndPositionElement,
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

const returnUndefinedPosition = (warn: string, position: UndefinedPosition): UndefinedPosition => {
  // console.warn(warn)
  return position
}

/**
 * @description Определяем, в какую сторону элемент влезет больше (неопределенная позиция)
 * @param positionVariables
 */
export const getBeforeOrAfterSpace = ({ element, parent, relative }: IPositionElementVariablesWithoutAxis) => {
  const afterSpace = parent.size - (relative.offset + relative.size)
  const beforeSpace = relative.offset
  return beforeSpace > afterSpace ? 'before' : 'after'
}

const getPositionDataByAxis = ({ element, parent, relative }: IPositionElementVariables) => {
  return (axis: Axis): IPositionElementVariablesWithoutAxis => {
    const sizeKey = axis === 'x' ? 'width' : 'height'
    const offsetKey = axis === 'x' ? 'left' : 'top'
    const translater = (elm: ClientRect): IPositionSizesWithoutAxis => {
      return {
        size: elm[sizeKey],
        offset: elm[offsetKey]
      }
    }
    return {
      element: translater(element),
      relative: translater(relative),
      parent: translater(parent)
    }
  }
}

/**
 * @description Определяем в какую сторону по оси Х открыть элемент. Если ни в ту, не в другую сторону элемент не влазит
 * то определяем позицию как неопределенную и указываем направление, чтобы в последствии
 * открыть его там, с изменением размеров
 * @param element
 * @param parent
 * @param relative
 */
export const getPositionX = ({ element, parent, relative }: IPositionElementVariablesWithDistance): PositionX => {
  return <PositionX>getPositionElement({ element, parent, relative })('x')
}

/**
 * @description Определяем в какую сторону по оси Y открыть элемент. Если ни в ту, не в другую сторону элемент не влазит
 * то определяем позицию как неопределенную и указываем направление, чтобы в последствии
 * открыть его там, с изменением размеров
 * @param element
 * @param parent
 * @param relative
 */
export const getPositionY = ({ element, parent, relative }: IPositionElementVariablesWithDistance): PositionY => {
  return <PositionY>getPositionElement({ element, parent, relative })('y')
}

const getPositionElement = (positionVariables: IPositionElementVariablesWithDistance) => {
  return (axis: Axis): PositionY | PositionX => {
    const { element, parent, relative } = getPositionDataByAxis(positionVariables)(axis)
    const beforeOrAfter = getBeforeOrAfterSpace({ element, parent, relative })
    if (element.size >= parent.size) {
      return returnUndefinedPosition('getPosition: elementSize >= parentSize', beforeOrAfter)
    }
    const sumSize = element.size + relative.size
    if (sumSize >= parent.size) {
      return returnUndefinedPosition('getPosition: elementSize + relativeSize >= parent.size', beforeOrAfter)
    }
    if ((element.size > (parent.size - (relative.offset + relative.size))) && (element.size > relative.offset)) {
      return returnUndefinedPosition('getPosition: elementSize has no out space', beforeOrAfter)
    }
    if (relative.offset + sumSize <= parent.size) {
      return axis === 'x' ? 'right' : 'bottom'
    }
    if (relative.offset >= element.size) {
      return axis === 'x' ? 'left' : 'top'
    }
    return 'after'
  }
}

/**
 * @description Для использования с элементами с неопределенной позицией. Расчитываем уменьшенные размеры элемента
 * чтобы он влез
 * @param element
 * @param relative
 * @param parent
 * @param beforeOrAfter
 * @param x
 * @param y
 */
export const getSizesWithScroll = ({ element, relative, parent }: IPositionElementVariablesWithDistance, beforeOrAfter: UndefinedPosition, { x = 0, y = 0 }: IPositionElementPadding) => {
  return (axis: Axis): ClientRect => {
    const isBefore = beforeOrAfter === 'before'
    const computeSize = () => {
      return {
        height: isBefore ? relative.top - y : parent.height - (relative.top + relative.height) - y,
        width: isBefore ? relative.left - x : parent.width - (relative.left + relative.width) - x
      }
    }
    const { height, width } = computeSize()
    return {
      height: axis === 'x' ? element.height : height,
      width: axis === 'y' ? element.width : width,
      right: element.right,
      bottom: element.bottom,
      left: element.left,
      top: element.top
    }
  }
}

/**
 * @description Добавляем дистанцию между открываемым и относительным элементами
 * @param element
 * @param relative
 * @param parent
 * @param x
 * @param y
 */
export const getPositionVariablesWithDistance = ({ element, relative, parent }: IPositionElementVariables, { x = 0, y = 0 }: IPositionElementDistance): IPositionElementVariablesWithDistance => {
  return {
    element,
    relative: {
      top: relative.top + y / 2,
      height: relative.height + y / 2,
      left: relative.left + x / 2,
      width: relative.width + x / 2,
      bottom: relative.bottom,
      right: relative.right
    },
    parent
  }
}

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

/**
 * @description Точка входа
 * @param data
 */
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
