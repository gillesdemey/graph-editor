function getBezierPoints (startPost, endPos) {
  const { x: x1, y: y1 } = startPost
  const { x: x2, y: y2 } = endPos

  /**
   * add additional bezier control points for a nice curve
   *
   * cp1: x-coordinate is half-way node1 and node2;
   *  same y-coordinate as the first node
   * cp2: x-coordinate is half-way node1 and node2;
   *  same y-coorindate as the second node
   */
  const xDiff = Math.max(x1, x2) - Math.min(x1, x2)
  const yDiff = Math.max(y1, y2) - Math.min(y1, y2)

  const toTheRight = x2 > x1
  const below = y2 > y1

  const toTheRightAndBelow = toTheRight && below
  const toTheLeftAndBelow = !toTheRight && below
  const toTheRightAndAbove = toTheRight && !below
  const toTheLeftAndAbove = !toTheRight && !below

  let controlPoint1, controlPoint2
  if (toTheRightAndBelow || toTheRightAndAbove) {
    controlPoint1 = [ x1 + (xDiff / 2), y1 ]
    controlPoint2 = [ x1 + (xDiff / 2), y2 ]
  }

  if (toTheLeftAndBelow) {
    controlPoint1 = [ x1 + (xDiff / 2), y1 + (yDiff / 2) ]
    controlPoint2 = [ x2 - (xDiff / 2), y2 - (yDiff / 2) ]
  }

  if (toTheLeftAndAbove) {
    controlPoint1 = [ x1 + Math.max((xDiff / 2), 10), y1 ]
    controlPoint2 = [ x2 - Math.max((xDiff / 2), 10), y2 ]
  }

  return [
    x1, y1,
    ...controlPoint1,
    ...controlPoint2,
    x2, y2
  ]
}

export {
  getBezierPoints
}
