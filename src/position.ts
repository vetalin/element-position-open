import {
  Axis,
  IPositionElementVariables, IPositionElementVariablesWithDistance,
  IPositionElementVariablesWithoutAxis, IPositionSizesWithoutAxis, PositionX, PositionY,
  UndefinedPosition
} from 'src/interfaces'

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
