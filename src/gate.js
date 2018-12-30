import GraphNode from './node'

import andGate from './gates/AND'
import orGate from './gates/OR'

class Gate extends GraphNode {
  drawNode (details) {
    const { gateType } = details

    let gate
    switch (gateType) {
      case 'AND':
        gate = andGate
        break
      case 'OR':
        gate = orGate
        break
      default:
        throw Error(`No such gate: ${gateType}`)
    }
    this.add(gate)

    const handles = this.createHandles(gate)
    this.add(...handles)

    return this
  }
}

module.exports = Gate
