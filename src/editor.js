import { Layer, Stage, Line } from 'konva'
import GraphNode from './node'
import { getBezierPoints } from './utils'

class Editor extends Stage {
  constructor (options) {
    const defaults = {}
    super(Object.assign(defaults, options))

    const layer = new Layer()
    this.add(layer)

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
      stroke: 'black',
      lineCap: 'round',
      bezier: true,
      points: bezierPoints,
      opacity: 0.3
    })

    // copy line and node to each node
    node1.addConnection(node2, quadLine, node1.findOne('.rightHandle'), node2.findOne('.leftHandle'))
    node2.addConnection(node1, quadLine, node2.findOne('.leftHandle'), node1.findOne('.rightHandle'))

    this._baseLayer.add(quadLine).draw()

    return quadLine
  }
}

export default Editor
