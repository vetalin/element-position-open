import {getPositionWithoutAxis} from '../../src/rectPresenter'

const getElementSizes = (width: number, height: number, top = 0, right = 0, bottom = 0, left = 0) => ({width, height, top, right, left, bottom})
describe('function getPositionWithoutAxis returns correct data', () => {
  it('getPositionWithoutAxis exist', () => {
    expect(getPositionWithoutAxis).toBeTruthy()
  })
  it('open element in standart flow', () => {
    const positionWithoutAxis = 'position-after'
    const distance = {x: 0, y: 0}
    const defaultOpenWay = 'after'
    const elementOpenFlow = 'start'
    const axis = 'y'
    const elements = {
      parent: getElementSizes(1000, 1000),
      relative: getElementSizes(200, 200, 200, 0, 0, 200),
      element: getElementSizes(100, 100)
    }
    expect(getPositionWithoutAxis(
      positionWithoutAxis,
      elements,
      distance,
      defaultOpenWay,
      elementOpenFlow,
      axis
    )).toStrictEqual({
      left: 200,
      top: 400
    })
  })
})
