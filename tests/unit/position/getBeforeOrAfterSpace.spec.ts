import { IPositionSizesWithoutAxis } from '../../../src/interfaces'
import { getBeforeOrAfterSpace } from '../../../src/position'

describe('function getBeforeOrAfterSpace returns currently results', () => {
  const elementMock: IPositionSizesWithoutAxis = {
    size: 0,
    offset: 0
  }
  const parentParams: IPositionSizesWithoutAxis = {
    size: 1000,
    offset: 0
  }
  const relativeParams: IPositionSizesWithoutAxis = {
    size: 1,
    offset: 500
  }
  it('getBeforeOrAfterSpace returns after if space after > before space', () => {
    expect(getBeforeOrAfterSpace({
      element: elementMock,
      relative: {
        size: 1,
        offset: 499
      },
      parent: parentParams
    })).toBe('after')
    expect(getBeforeOrAfterSpace({
      element: elementMock,
      relative: {
        size: 499,
        offset: 0
      },
      parent: parentParams
    })).toBe('after')
    expect(getBeforeOrAfterSpace({
      element: elementMock,
      relative: {
        size: 0,
        offset: 0
      },
      parent: parentParams
    })).toBe('after')
    expect(getBeforeOrAfterSpace({
      element: elementMock,
      relative: relativeParams,
      parent: {
        offset: 500,
        size: 1500
      }
    })).toBe('after')
    expect(getBeforeOrAfterSpace({
      element: elementMock,
      relative: {
        offset: 49,
        size: 1
      },
      parent: {
        offset: 500,
        size: 100
      }
    })).toBe('after')
  })
  it ('getBeforeOrAfterSpace returns before if space before > after space', () => {
    expect(getBeforeOrAfterSpace({
      element: elementMock,
      relative: {
        size: 1,
        offset: 500
      },
      parent: parentParams
    })).toBe('before')
    expect(getBeforeOrAfterSpace({
      element: elementMock,
      relative: relativeParams,
      parent: {
        offset: 500,
        size: 700
      }
    })).toBe('before')
    expect(getBeforeOrAfterSpace({
      element: elementMock,
      relative: {
        offset: 50,
        size: 1
      },
      parent: {
        offset: 500,
        size: 100
      }
    })).toBe('before')
  })
})
