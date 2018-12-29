import { Group, Circle } from 'konva'
import { tint } from 'polished'

import createCurve from './curve'
import { HANDLE_COLOR } from './themes/dark'
import { getBezierPoints, stopPropagation, setCursor } from './utils'

import createHead from './node/head'
import createAnnotations from './node/annotations'
// import createStates from './node/states'

class GraphNode extends Group {
  constructor (options = {}, details = {}) {
    const defaults = {
      id: options.id,
      draggable: true
    }
    super(Object.assign(defaults, options))

    this._data = details

    this.connections = new Map()

    this.drawNode(details)

    // dragmove -> update linked nodes and bezier lines
    this.on('dragmove', () => {
      this.connections.forEach(curve => {
        const { line, startPos, endPos } = curve

        const bezierPoints = getBezierPoints(
          startPos.getAbsolutePosition(),
          endPos.getAbsolutePosition()
        )
        line.setPoints(bezierPoints)
      })
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
  addConnection (node, line, startPos, endPos) {
    if (this.hasConnection(node)) return
    this.connections.set(node, { line, startPos, endPos })
  }

  hasConnection (node) {
    return this.connections.has(node)
  }

  drawNode (details) {
    const head = createHead(details)
    this.add(head)

    const handles = this.createHandles(head)
    this.add(...handles)

    const annotations = createAnnotations(details, head)
    this.add(annotations)

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

    const onMouseDown = (event) => {
      const stage = this.getStage()

      // TODO: get rid of implicit parent relation, somehow
      const node1 = event.target.parent

      const startPos = event.target.getAbsolutePosition()
      const endPos = stage.getPointerPosition()

      const curve = createCurve(startPos, endPos)

      const layer = stage.find('Layer')
      layer.add(curve).draw()

      // attach curve to cursor
      stage.on('mousemove', event => {
        const points = getBezierPoints(
          startPos,
          stage.getPointerPosition()
        )

        /**
         * the actual line needs to "lag behind" the cursor or the "mouseup"
         * event will detect the line itself and not the actual target, so we're
         * offsetting the x coordinate on the final point
         */
        points[6] = points[6] - 2

        curve.setPoints(points)
        stage.batchDraw()
      })

      stage.on('mouseup', event => {
        stage.off('mouseup mousemove') // stop listening to move events

        const isHandleTarget = event.target.hasName('leftHandle')
        if (isHandleTarget) {
          const node2 = event.target.parent
          stage.connectNodes(node1, node2)
        }

        curve.destroy()
        // one final draw() after destroying the curve
        stage.draw()
      })
    }

    rightHandle.on('mousedown', onMouseDown)

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
