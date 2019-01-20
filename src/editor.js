import { FastLayer, Layer, Stage } from 'konva'

import GraphNode from './node'
import GateNode from './gate'
import NoteNode from './note'

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
    const node = new NoteNode(options, details)
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

  connectNodes (node1, node2, options = {}) {
    let curves = []
    const withStates = options.states && options.states.length > 0

    if (!withStates) {
      if (node1.hasConnection(node2)) return

      const startHandle = node1.getRightHandle()
      const endHandle = node2.getLeftHandle()

      const curve = createCurve(startHandle, endHandle)

      // copy line and node to each node
      node1.addConnection(node2, curve, startHandle, endHandle)
      node2.addConnection(node1, curve, startHandle, endHandle)

      curves.push(curve)
    } else {
      options.states.forEach(state => {
        const startHandle = node1.getStateHandle(state)
        const endHandle = node2.getLeftHandle()

        const color = startHandle.getStroke()
        const curve = createCurve(startHandle, endHandle, { color })

        // copy line and node to each node
        node1.addConnection(node2, curve, startHandle, endHandle)
        node2.addConnection(node1, curve, startHandle, endHandle)

        node1.activateState(state) // make state active (visually)
        curves.push(curve)
      })
    }

    curves.forEach(curve => {
      this._baseLayer.add(curve)
      // lines should always be draw below everything else
      curve.moveToBottom()
    })

    this._baseLayer.draw()

    return curves
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
