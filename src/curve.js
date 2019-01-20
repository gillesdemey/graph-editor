import { Line } from 'konva'
import { absolutePosition, getBezierPoints } from './utils'
import { LINE_COLOR } from './themes/dark'

module.exports = (handle1, handle2, options = {}) => {
  const pos1 = absolutePosition(handle1)
  const pos2 = absolutePosition(handle2)

  const bezierPoints = getBezierPoints(pos1, pos2)

  const line = new Line({
    strokeWidth: 2,
    stroke: options.color || LINE_COLOR,
    lineCap: 'round',
    bezier: true,
    points: bezierPoints,
    opacity: 0.6
  })

  return line
}
