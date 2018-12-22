import { Layer, Stage, Line } from 'konva'
import GraphNode from './node'

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
    const { x: x1, y: y1 } = node1.getRightHandlePosition()
    const { x: x2, y: y2 } = node2.getLeftHandlePosition()

    /**
     * add additional bezier control points for a nice curve
     *
     * cp1: x-coordinate is half-way node1 and node2;
     *  same y-coordinate as the first node
     * cp2: x-coordinate is half-way node1 and node2;
     *  same y-coorindate as the second node
     */
    const controlPoint1 = x1 < x2 ? [
      x1 + (x2 - x1) / 2,
      y1
    ] : [
      x1 + ((x1 - x2) / 2),
      y1
    ]
    const controlPoint2 = x1 < x2 ? [
      x1 + (x2 - x1) / 2,
      y2
    ] : [
      x2 - ((x1 - x2) / 2),
      y2
    ]

    // const cp1 = new Circle({ radius: 5, stroke: 'red', x: controlPoint1[0], y: controlPoint1[1], opacity: 0.2 })
    // const cp2 = new Circle({ radius: 5, stroke: 'red', x: controlPoint2[0], y: controlPoint2[1], opacity: 0.2 })
    // this.getStage()._baseLayer.add(cp1)
    // this.getStage()._baseLayer.add(cp2)
    // this.getStage()._baseLayer.draw()

    const quadLine = new Line({
      strokeWidth: 2,
      stroke: 'black',
      lineCap: 'round',
      bezier: true,
      points: [
        x1, y1,
        ...controlPoint1,
        ...controlPoint2,
        x2, y2
      ],
      opacity: 0.3
    })

    this._baseLayer.add(quadLine).draw()

    return quadLine
  }
}

export default Editor
