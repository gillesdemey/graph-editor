import { Layer, Stage, Line } from 'konva'
import GraphNode from './node'
import { getBezierPoints } from './utils'
import { LINE_COLOR } from './themes/light'

class Editor extends Stage {
  constructor (options) {
    const defaults = {}
    super(Object.assign(defaults, options))

    const layer = new Layer()
    this.add(layer)

    this._theme = options.theme
    this._baseLayer = layer
    return this
  }

  addNode (options, details) {
    const node = new GraphNode(options, details)
    this._baseLayer.add(node).draw()

    return node
  }

  connectNodes (node1, node2) {
    const pos1 = node1.getRightHandlePosition()
    const pos2 = node2.getLeftHandlePosition()

    const bezierPoints = getBezierPoints(pos1, pos2)
    const quadLine = new Line({
      strokeWidth: 2,
      stroke: LINE_COLOR,
      lineCap: 'round',
      bezier: true,
      points: bezierPoints,
      opacity: 0.3
    })

    const startPos = node1.findOne('.rightHandle')
    const endPos = node2.findOne('.leftHandle')

    // copy line and node to each node
    node1.addConnection(node2, quadLine, startPos, endPos)
    node2.addConnection(node1, quadLine, startPos, endPos)

    this._baseLayer.add(quadLine)
    // lines should always be draw below everything else
    quadLine.moveToBottom()
    this._baseLayer.draw()

    return quadLine
  }
}

export default Editor
