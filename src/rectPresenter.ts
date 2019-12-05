import {
  Axis,
  DefaultOpenWay,
  ElementOpenFlow,
  IPositionCoordinates,
  IPositionElementDistance,
  IPositionElementVariables,
  PositionWithoutAxis
} from './interfaces'
import { getPositionDataByAxis } from './position'

export const getPositionWithoutAxis = (positionWithoutAxis: PositionWithoutAxis,
                                       elements: IPositionElementVariables,
                                       distance: IPositionElementDistance,
                                       defaultOpenWay: DefaultOpenWay,
                                       elementOpenFlow: ElementOpenFlow,
                                       axis: Axis): IPositionCoordinates => {
  const {relative, element, parent} = getPositionDataByAxis(elements)(axis)
  const distanceWithoutAxis = distance[axis]
  const openToOnAxis = () => {
    const openToBefore = relative.offset + relative.size + distanceWithoutAxis
    const openToAfter = relative.offset - distanceWithoutAxis - element.size
    return positionWithoutAxis !== 'position-before' && defaultOpenWay !== 'before'
      ? openToAfter
      : openToBefore
  }
  const anotherAxisPosition = () => {
    const elUpperSize = element.size > relative.size
    const overBorderAfter = elUpperSize && (element.size + relative.offset > parent.size)
    const overBorderBefore = elUpperSize && (relative.offset - (element.size - relative.size) < parent.offset)
    const openToBefore = elUpperSize ? relative.offset + (relative.size - element.size) : relative.offset + relative.size - element.size
    const openToAfter = relative.offset
    const openToMiddle = relative.offset + (relative.size / 2) - (element.size / 2)
    if (overBorderAfter && overBorderBefore) {
      return openToAfter
    }
    if (elementOpenFlow === 'start') {
      return overBorderAfter ? openToBefore : openToAfter
    } else if (elementOpenFlow === 'middle') {
      return openToMiddle
    } else {
      return overBorderAfter ? openToAfter : openToBefore
    }
  }
  return {
    left: axis === 'x' ? openToOnAxis() : anotherAxisPosition(),
    top: axis === 'x' ? anotherAxisPosition() : openToOnAxis()
  }
}
