import { getPositionElementWithoutAxis } from '../../../src/position'
import { IPositionSizesWithoutAxis } from '../../../src/interfaces'

const getParamsEl = (size: number, offset: number = 0): IPositionSizesWithoutAxis => ({size, offset})
describe('function getPositionElementWithoutAxis always return to allow results', () => {
  it ('function getPositionElementWithoutAxis exist', () => {
    expect(getPositionElementWithoutAxis).toBeTruthy()
  })
  it ('element size is over high', () => {
    const parent = getParamsEl(1000)
    const relative = getParamsEl(100, 400)
    const element = getParamsEl(1000)
    expect(getPositionElementWithoutAxis({parent, relative, element})).toBe('after')
    expect(getPositionElementWithoutAxis({
      parent,
      relative,
      element: getParamsEl(900)
    })).toBe('after')
    expect(getPositionElementWithoutAxis({
      parent,
      relative: getParamsEl(10, 899),
      element: getParamsEl(900)
    })).toBe('before')
    expect(getPositionElementWithoutAxis({
      parent,
      relative: getParamsEl(10, 899),
      element: getParamsEl(1500)
    })).toBe('before')
  })
  it('element is normal size, open to larger space', () => {
    const parent = getParamsEl(1000)
    const relative = getParamsEl(100, 400)
    const element = getParamsEl(100)
    const elementsCase = {parent, relative, element}
    expect(getPositionElementWithoutAxis(elementsCase)).toBe('position-after')
    expect(getPositionElementWithoutAxis({
      ...elementsCase,
      relative: getParamsEl(300, 400)
    })).toBe('position-after')
    expect(getPositionElementWithoutAxis({
      ...elementsCase,
      relative: getParamsEl(300, 650)
    })).toBe('position-before')
    expect(getPositionElementWithoutAxis({
      ...elementsCase,
      element: getParamsEl(500)
    })).toBe('position-after')
  })
})
