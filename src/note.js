import GraphNode from './node'
import createHead from './node/head'

const defaults = {
  color: '#feca57',
  type: 'INFO'
}

class Note extends GraphNode {
  constructor (options, details) {
    super(options, Object.assign(details, defaults))
  }

  drawNode (details) {
    const head = createHead(details)
    this.add(head)

    return this
  }
}

export default Note
