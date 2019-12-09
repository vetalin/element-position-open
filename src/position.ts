import {
  Axis,
  IPositionElementVariables,
  IPositionElementVariablesWithoutAxis,
  IPositionSizesWithoutAxis,
  PositionWithoutAxis,
  UndefinedPosition
} from './interfaces'

/**
 * @description Возвращаем неточную позицию и предупреждение
 * @param warn
 * @param position
 */
const returnUndefinedPosition = (warn: string, position: UndefinedPosition): UndefinedPosition => {
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

export const getPositionDataByAxis = ({ element, parent, relative }: IPositionElementVariables) => {
  return (axis: Axis): IPositionElementVariablesWithoutAxis => {
    const sizeKey = axis === 'x' ? 'width' : 'height'
    const offsetKey = axis === 'x' ? 'left' : 'top'
    const getSizeOffset = (elm: ClientRect): IPositionSizesWithoutAxis => {
      return {
        size: elm[sizeKey],
        offset: elm[offsetKey]
      }
    }
    return {
      element: getSizeOffset(element),
      relative: getSizeOffset(relative),
      parent: getSizeOffset(parent)
    }
  }
}

export const getPositionElementWithoutAxis = ({element, parent, relative}: IPositionElementVariablesWithoutAxis): PositionWithoutAxis => {
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
  if (relative.offset + sumSize <= parent.size) return 'position-after'
  if (relative.offset >= element.size) return 'position-before'
  return 'after'
}
