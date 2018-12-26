import { Group, Rect, Text } from 'konva'
import { shade } from 'polished'
import { getBezierPoints, stopPropagation } from './utils'

class GraphNode extends Group {
  constructor (options = {}, details = {}) {
    const defaults = {
      id: options.id,
      draggable: true
    }
    super(Object.assign(defaults, options))

    this._data = details
    const { id, label, color = '#ecf0f1', textColor = '#7f8c8d', states, icon } = details

    this.connections = new Set()
    this.contentGroup = new Group()

    this.drawLabel(label || id, { color, textColor })

    if (states) {
      this.drawStates(states)
    }

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

  drawLabel (label, { color, textColor }) {
    const HEIGHT = 40
    const ICON_SIZE = HEIGHT
    const PADDING = 15

    const { contentGroup } = this

    const text = new Text({
      text: label,
      fontSize: 15,
      fontFamily: 'monospace',
      fill: textColor,
      align: 'center',
      height: HEIGHT,
      padding: PADDING,
      opacity: 0.9
    })

    text.offset({
      x: (text.width() / 2) - (ICON_SIZE / 3),
      y: text.height() / 2
    })

    const rect = new Rect({
      fill: color,
      width: text.width() + ICON_SIZE,
      height: HEIGHT,
      cornerRadius: 6,
      offset: {
        x: (text.width() / 2) + (ICON_SIZE / 2),
        y: text.height() / 2
      }
    })

    const iconRect = new Rect({
      width: HEIGHT,
      height: HEIGHT,
      fill: shade(0.1, color),
      cornerRadius: 6,
      x: -(rect.width() / 2),
      y: -(HEIGHT / 2)
    })

    const labelGroup = new Group()
    labelGroup.add(rect, iconRect, text)

    this.drawHandles(labelGroup)

    text.on('mouseenter', () => {
      contentGroup.getStage().container().style.cursor = 'move'
    })

    text.on('mouseleave', () => {
      contentGroup.getStage().container().style.cursor = 'default'
    })

    contentGroup.add(rect, iconRect, text)
  }

  drawHandles (bounds) {
    const HANDLE_SIZE = 10
    const FILL = '#95a5a6'

    const { contentGroup } = this
    const { width } = bounds.getClientRect()

    const leftHandle = new Rect({
      name: 'leftHandle',
      width: 10,
      height: 10,
      cornerRadius: 3,
      x: -(width / 2),
      offsetX: HANDLE_SIZE / 2,
      offsetY: HANDLE_SIZE / 2,
      fill: FILL
    })

    const rightHandle = new Rect({
      name: 'rightHandle',
      width: 10,
      height: 10,
      cornerRadius: 3,
      x: width / 2,
      offsetX: HANDLE_SIZE / 2,
      offsetY: HANDLE_SIZE / 2,
      fill: FILL
    })

    // disable drag when initiated from a handle — so we can join nodes
    leftHandle.on('mousedown', stopPropagation)
    rightHandle.on('mousedown', stopPropagation)

    this.add(contentGroup, rightHandle, leftHandle)
  }
}

export default GraphNode
