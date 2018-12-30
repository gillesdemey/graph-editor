import { Circle, Group, Path, Text } from 'konva'

const FONT_SIZE = 15
const FONT_COLOR = '#222f3e'
const BG_COLOR = '#1dd1a1'

function createGate (details) {
  const { data = '', label = 'GATE' } = details

  const group = new Group() // adding elements to this group
  const path = new Path({
    data,
    fill: FONT_COLOR
  })

  const { width, height: pathHeight } = path.getClientRect()
  path.setAttrs({
    offsetX: width / 2
  })

  const text = new Text({
    text: label,
    fontSize: FONT_SIZE,
    fontFamily: 'monospace',
    fontStyle: 'bold',
    fill: FONT_COLOR
  })

  const { width: textWidth, height: textHeight } = text.getClientRect()
  text.setAttrs({
    offsetX: textWidth / 2,
    offsetY: textHeight / 2,
    y: pathHeight + FONT_SIZE * 0.8
  })
  group.add(path, text)

  const { height: groupHeight } = group.getClientRect()
  group.setAttrs({
    offsetY: groupHeight / 2
  })

  const background = new Circle({
    radius: groupHeight,
    sides: 6,
    fill: BG_COLOR,
    offsetY: -(groupHeight / 2)
  })

  group.add(background)
  background.moveToBottom()

  return group
}

module.exports = createGate
