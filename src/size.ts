import {
  Axis,
  IPositionElementDistance,
  IPositionElementPadding,
  IPositionElementVariables,
  IPositionElementVariablesWithDistance,
  UndefinedPosition
} from 'src/interfaces'


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
