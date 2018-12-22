import { Group, Rect, Text } from 'konva'
import { getBezierPoints } from './utils'

class GraphNode extends Group {
  constructor (options = {}, details = {}) {
    const defaults = {
      id: options.id,
      draggable: true
    }
    super(Object.assign(defaults, options))

    const { id, label, color, textColor } = details
    this.connections = new Set()

    const contentGroup = new Group()

    const text = new Text({
      text: label || id,
      fontSize: 15,
      fontFamily: 'monospace',
      fill: textColor || '#7f8c8d',
      align: 'center',
      height: 40,
      padding: 15,
      opacity: 0.9
    })

    text.offset({
      x: text.width() / 2,
      y: text.height() / 2
    })

    const rect = new Rect({
      fill: color || '#ecf0f1',
      width: text.width(),
      height: text.height(),
      cornerRadius: 6,
      offset: {
        x: text.width() / 2,
        y: text.height() / 2
      }
    })

    text.on('mouseenter', () => {
      contentGroup.getStage().container().style.cursor = 'move'
    })

    text.on('mouseleave', () => {
      contentGroup.getStage().container().style.cursor = 'default'
    })

    const HANDLE_SIZE = 10

    const leftHandle = new Rect({
      name: 'leftHandle',
      width: 10,
      height: 10,
      cornerRadius: 3,
      x: -(rect.width() / 2),
      offsetX: HANDLE_SIZE / 2,
      offsetY: HANDLE_SIZE / 2,
      fill: '#95a5a6'
    })

    const rightHandle = new Rect({
      name: 'rightHandle',
      width: 10,
      height: 10,
      cornerRadius: 3,
      x: rect.width() / 2,
      offsetX: HANDLE_SIZE / 2,
      offsetY: HANDLE_SIZE / 2,
      fill: '#95a5a6'
    })

    // disable drag when initiated from a handle — so we can join nodes
    leftHandle.on('mousedown', _stopPropagation)
    rightHandle.on('mousedown', _stopPropagation)

    this._data = details

    contentGroup.add(rect, text)
    this.add(contentGroup, rightHandle, leftHandle)

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
}

function _stopPropagation (event) {
  event.cancelBubble = true
}

export default GraphNode
