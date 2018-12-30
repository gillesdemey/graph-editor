import { Circle, Group, Path, Text } from 'konva'
import { shade } from 'polished'

const FONT_SIZE = 15
const FILL_COLOR = shade(0.1, 'white')
const BG_COLOR = '#474787'

function createGate (details) {
  const { data = '', label = 'GATE' } = details

  const group = new Group() // adding elements to this group
  const path = new Path({
    data,
    fill: FILL_COLOR
  })

  const { width, height: pathHeight } = path.getClientRect()
  path.setAttrs({
    offsetX: width / 2
  })

  const text = new Text({
    text: label,
    fontSize: FONT_SIZE,
    fontFamily: 'monospace',
    fill: FILL_COLOR
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
