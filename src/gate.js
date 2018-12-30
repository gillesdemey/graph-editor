import GraphNode from './node'

import andGate from './gates/AND'
import orGate from './gates/OR'

const gateTypes = {
  'AND': andGate,
  'OR': orGate
}

class Gate extends GraphNode {
  drawNode (details) {
    const { gateType } = details

    const gate = gateTypes[gateType]
    if (!gate) {
      throw new Error(`No such gate: ${gateType}`)
    }

    this.add(gate)

    const handles = this.createHandles(gate)
    this.add(...handles)

    return this
  }
}

module.exports = Gate
