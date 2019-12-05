import { getPositionX } from '../src/elementPositionLogic'
import { getElementRectAndPosition } from '../src/index'

describe('Element position logic', () => {
  describe('check position X', () => {
    const element = {
      width: 300,
      height: 300
    }
    const parent = {
      width: 1000,
      height: 1000,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
    const relative = {
      width: 100,
      height: 100,
      top: 300,
      bottom: 600,
      left: 300,
      right: 600
    }
    it('element to be right', () => {
      const positionRight = getPositionX({
        element,
        parent,
        relative
      })
      expect(positionRight).toBe('right')
    })
    it('element.width + relative.left + relative.width > parent.width', () => {
      const positionLeft = getPositionX({
        element: {
          width: 601,
          height: 300
        },
        relative: {
          width: 100,
          left: 602
        },
        parent
      })
      expect(positionLeft).toBe('left')
    })
    it('element.width > relative.width + parent.width', () => {
      const positionAfter = getPositionX({
        element: {
          width: 800,
          height: 300
        },
        relative,
        parent
      })
      expect(positionAfter).toBe('after')
    })
    it('element.width is too bigger for right position', () => {
      const positionBefore = getPositionX({
        element: {
          width: 800
        },
        relative: {
          left: 500,
          width: 100
        },
        parent
      })
      expect(positionBefore).toBe('before')
    })
    it('element.width to middle position, but element.width > open space', () => {
      const positionAfter = getPositionX({
        element: {
          width: 501
        },
        relative: {
          left: 500,
          width: 2
        },
        parent
      })
      expect(positionAfter).toBe('before')
    })
    it('element.width to middle position', () => {
      const positionRight = getPositionX({
        element: {
          width: 501
        },
        relative: {
          left: 500,
          width: 1
        },
        parent
      })
      expect(positionRight).toBe('before')
    })
    it('element.width > parent.width', () => {
      const positionAfter = getPositionX({
        element: {
          width: 1001
        },
        relative: {
          left: 0,
          width: 1
        },
        parent
      })
      expect(positionAfter).toBe('after')
    })
    it('element.width > parent.width but relative.left > parent.width / 2', () => {
      const positionBefore = getPositionX({
        element: {
          width: 1001
        },
        relative: {
          left: 501,
          width: 1
        },
        parent
      })
      expect(positionBefore).toBe('before')
    })
    it('element.width = parent.width - relative.width + relative.left', () => {
      const positionAfter = getPositionX({
        element: {
          width: 1000
        },
        relative: {
          left: 499,
          width: 1
        },
        parent
      })
      expect(positionAfter).toBe('after')
    })
    it('element.width = relative.left', () => {
      const positionBefore = getPositionX({
        element: {
          width: 1000
        },
        relative: {
          width: 100,
          left: 900
        },
        parent
      })
      expect(positionBefore).toBe('before')
    })
  })
  describe('get element rect and position', () => {
    const element = {
      width: 200,
      height: 200
    }
    const parent = {
      width: 1000,
      height: 1000,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    }
    const relative = {
      width: 100,
      height: 100,
      left: 500,
      top: 200
    }
    const distance = {
      x: 0,
      y: 0
    }
    const padding = {
      x: 0,
      y: 0
    }
    const axis = 'xy'
    it('normal element open to right top, without change sizes', () => {
      const elementSizes = getElementRectAndPosition({
        elements: {
          element,
          relative,
          parent
        },
        distance,
        padding,
        axis
      })
      expect(elementSizes.left).toBe(600)
      expect(elementSizes.top).toBe(100)
      expect(elementSizes.width).toBe(200)
      expect(elementSizes.height).toBe(200)
    })
    it('element open to left top, without change sizes', () => {
      const elementSizes = getElementRectAndPosition({
        elements: {
          element,
          relative: {
            left: 800,
            width: 100,
            top: 200,
            height: 100
          },
          parent
        },
        distance,
        padding,
        axis
      })
      expect(elementSizes.left).toBe(600)
      expect(elementSizes.top).toBe(100)
      expect(elementSizes.width).toBe(200)
      expect(elementSizes.height).toBe(200)
    })
    // it('element open to right bottom, without change sizes')
    // it('element open to left bottom, without change sizes')
  })
  describe('more options in arguments to function', () => {
    const element = {
      width: 200,
      height: 200
    }
    const parent = {
      width: 1000,
      height: 1000,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    }
    const relative = {
      width: 100,
      height: 100,
      left: 500,
      top: 200
    }
    const distance = {
      x: 0,
      y: 0
    }
    const padding = {
      x: 0,
      y: 0
    }
    it('element position null', () => {
      const elementSizes = getElementRectAndPosition({
        elements: {
          relative,
          parent,
          element: {
            ...element
          }
        },
        axis: 'y',
        padding,
        distance
      })
      expect(elementSizes.left).toBe(500)
      expect(elementSizes.top).toBe(300)
    })
    it('element default open flow end', () => {
      const elementSizes = getElementRectAndPosition({
        elements: {
          relative,
          parent,
          element
        },
        axis: 'y',
        padding,
        distance,
        elementOpenFlow: 'end'
      })
      expect(elementSizes.left).toBe(400)
    })
    it('element default open flow end, relative.width > element.width', () => {
      const elementSizes = getElementRectAndPosition({
        elements: {
          relative: {
            ...relative,
            width: 500
          },
          parent,
          element
        },
        axis: 'y',
        padding,
        distance,
        elementOpenFlow: 'end'
      })
      expect(elementSizes.left).toBe(800)
    })
  })
})
