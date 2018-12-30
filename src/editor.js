import { FastLayer, Layer, Stage } from 'konva'
import GraphNode from './node'
import GateNode from './gate'
import { debug } from './utils'

import createCurve from './curve'
import andGate from './gates/and'

class Editor extends Stage {
  constructor (options) {
    const defaults = {}
    super(Object.assign(defaults, options))

    const layer = new Layer()
    this.add(layer)

    // this is the base layer of the editor, most everything goes here
    this._baseLayer = layer

    // we'll use this for visual debugging of the editor
    this._debugLayer = new FastLayer()

    return this
  }

  addNode (options, details) {
    const node = new GraphNode(options, details)
    this._baseLayer.add(node).draw()

    return node
  }

  addNote (options, details) {
    const node = new GraphNode(options, { ...details,
      color: '#feca57',
      type: 'INFO'
    })
    this._baseLayer.add(node).draw()

    return node
  }

  addGate (options, details) {
    const node = new GateNode(options, { ...details,
      color: '#2bcbba',
      content: andGate,
      type: 'GATE'
    })
    this._baseLayer.add(node).draw()

    return node
  }

  connectNodes (node1, node2) {
    if (node1.hasConnection(node2)) return

    const pos1 = node1.getRightHandlePosition()
    const pos2 = node2.getLeftHandlePosition()

    const curve = createCurve(pos1, pos2)

    const startPos = node1.findOne('.rightHandle')
    const endPos = node2.findOne('.leftHandle')

    // copy line and node to each node
    node1.addConnection(node2, curve, startPos, endPos)
    node2.addConnection(node1, curve, startPos, endPos)

    this._baseLayer.add(curve)
    // lines should always be draw below everything else
    curve.moveToBottom()
    this._baseLayer.draw()

    return curve
  }

  /**
   * Create a new debug layer and layer it on top of the existing
   * _baseLayer layer
   */
  debug (truthy) {
    this._debugLayer && this._debugLayer.destroy()
    if (!truthy) return

    this._debugLayer = new FastLayer()
    this.add(this._debugLayer)

    const nodes = this.find('Group')
    debug(nodes, this._debugLayer)
  }
}

export default Editor
