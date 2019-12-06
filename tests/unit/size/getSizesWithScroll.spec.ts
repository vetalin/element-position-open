import { getSizesWithScroll } from '../../../src/size'

const getElementSizes = (width: number, height: number, top = 0, right = 0, bottom = 0, left = 0) => ({width, height, top, right, bottom, left})
const getDefaultElements = () => ({
  parent: getElementSizes(1000, 1000),
  relative: getElementSizes(200, 200, 100, 0, 0, 100),
  element: getElementSizes(100, 100)
})
const getDefaultPadding = (x = 0, y = 0) => ({x, y})
describe('function getSizesWithScroll returns correctly data', () => {
  it('function getSizesWithScroll exist', () => {
    expect(getSizesWithScroll).toBeTruthy()
  })
  it('getSizesWithScroll returns function', () => {
    expect(getSizesWithScroll(getDefaultElements(), 'after', getDefaultPadding())).toBeInstanceOf(Function)
  })
  it('getSizesWithScroll returns sizes to real contains in space after', () => {
    const parent = getElementSizes(1000, 1000)
    const relative = getElementSizes(400, 200, 200, 0, 0, 400)
    const element = getElementSizes(300,200)
    const getSizesToAxis = getSizesWithScroll({parent, relative, element}, 'after', getDefaultPadding())
    expect(getSizesToAxis('x')).toStrictEqual({
      width: 200,
      height: 200,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    })
    expect(getSizesToAxis('y')).toStrictEqual({
      width: 300,
      height: 600,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    })
  })
  it('getSizesWithScroll returns sizes to real contains in space before', () => {
    const parent = getElementSizes(1000, 1000)
    const relative = getElementSizes(400, 200, 200, 0, 0, 400)
    const element = getElementSizes(300,200)
    const getSizesToAxis = getSizesWithScroll({parent, relative, element}, 'before', getDefaultPadding())
    expect(getSizesToAxis('x')).toStrictEqual({
      width: 400,
      height: 200,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    })
    expect(getSizesToAxis('y')).toStrictEqual({
      width: 300,
      height: 200,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    })
  })
})
