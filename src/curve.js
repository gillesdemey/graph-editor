import { Line } from 'konva'
import { getBezierPoints } from './utils'
import { LINE_COLOR } from './themes/dark'

module.exports = (pos1, pos2) => {
  const bezierPoints = getBezierPoints(pos1, pos2)

  const line = new Line({
    strokeWidth: 2,
    stroke: LINE_COLOR,
    lineCap: 'round',
    bezier: true,
    points: bezierPoints,
    opacity: 0.3
  })

  return line
}
