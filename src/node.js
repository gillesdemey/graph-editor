import { Group, Circle } from 'konva'
import { tint } from 'polished'
import { HANDLE_COLOR } from './themes/dark'
import { getBezierPoints, stopPropagation, setCursor } from './utils'

import createHead from './node/head'
import createStates from './node/states'

class GraphNode extends Group {
  constructor (options = {}, details = {}) {
    const defaults = {
      id: options.id,
      draggable: true
    }
    super(Object.assign(defaults, options))

    this._data = details

    this.connections = new Set()
    this.contentGroup = new Group()

    this.drawNode(details)

    // dragmove -> update linked nodes and bezier lines
    this.on('dragmove', () => {
      for (const [node, line, handleStart, handleEnd] of this.connections) {
        const bezierPoints = getBezierPoints(
          handleStart.getAbsolutePosition(),
          handleEnd.getAbsolutePosition()
        )
        line.setPoints(bezierPoints)
      }
    })

    return this
  }

  getRightHandlePosition () {
    return this.findOne('.rightHandle').getAbsolutePosition()
  }

  getLeftHandlePosition () {
    return this.findOne('.leftHandle').getAbsolutePosition()
  }

  // tracks connections to other nodes
  addConnection (...args) {
    this.connections.add([...args])
  }

  drawStates (states) {

  }

  drawNode (details) {
    const head = createHead(details)
    this.add(head)

    const handles = this.createHandles(head)
    this.add(...handles)

    return this
  }

  createHandles (bounds) {
    const HANDLE_SIZE = 12

    const { width } = bounds.getClientRect()

    const leftHandle = new Circle({
      name: 'leftHandle',
      radius: HANDLE_SIZE / 2,
      x: -(width / 2),
      fill: HANDLE_COLOR
    })

    const rightHandle = new Circle({
      name: 'rightHandle',
      x: width / 2,
      radius: HANDLE_SIZE / 2,
      fill: HANDLE_COLOR
    })

    const onMouseEnter = (event) => {
      event.target.setFill(tint(0.5, HANDLE_COLOR)).draw()
      setCursor(this, 'crosshair')
    }

    const onMouseLeave = (event) => {
      event.target.setFill(HANDLE_COLOR).draw()
      setCursor(this, 'default')
    }

    leftHandle.on('mouseenter', onMouseEnter)
    rightHandle.on('mouseenter', onMouseEnter)

    leftHandle.on('mouseleave', onMouseLeave)
    rightHandle.on('mouseleave', onMouseLeave)

    // disable drag when initiated from a handle — so we can join nodes
    leftHandle.on('mousedown', stopPropagation)
    rightHandle.on('mousedown', stopPropagation)

    return [leftHandle, rightHandle]
  }
}

export default GraphNode
