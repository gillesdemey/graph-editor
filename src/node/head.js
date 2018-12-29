import { Group, Image, Rect, Text } from 'konva'
import { readableColor } from 'polished'
import { NODE_COLOR } from '../themes/dark'

module.exports = ({ label, plug, icon, color = NODE_COLOR }) => {
  const FONT_SIZE = 15
  const PADDING = 12
  const ICON_SIZE = 20
  const FONT_COLOR = readableColor(color) // returns black or white

  // we'll be adding all children to this group
  const headGroup = new Group()

  const title = new Text({
    text: label,
    fontSize: FONT_SIZE,
    fontFamily: 'monospace',
    fontStyle: 'bold',
    fill: FONT_COLOR,
    opacity: 0.9
  })

  const textGroup = new Group()
  textGroup.add(title)

  if (plug) {
    const description = new Text({
      text: plug,
      fontSize: FONT_SIZE * 0.8,
      fontFamily: 'monospace',
      fill: FONT_COLOR,
      offsetY: -FONT_SIZE * 1.1,
      opacity: 0.5
    })

    textGroup.add(description)
  }

  const { width, height } = textGroup.getClientRect()

  textGroup.setPosition({
    x: -width / 2,
    y: -height / 2
  })
  textGroup.setOffset({ x: -ICON_SIZE })

  const background = new Rect({
    fill: color,
    width: width + (PADDING * 2) + ICON_SIZE * 2,
    height: height + (PADDING * 2),
    cornerRadius: 6
  })
  background.setPosition({
    x: -background.getClientRect().width / 2,
    y: -background.height() / 2
  })

  headGroup.add(background, textGroup)

  headGroup.on('mouseenter', () => {
    headGroup.getStage().container().style.cursor = 'move'
  })

  headGroup.on('mouseleave', () => {
    headGroup.getStage().container().style.cursor = 'default'
  })

  addIcon(headGroup, icon, ICON_SIZE)

  return headGroup
}

function addIcon (container, icon, size) {
  Image.fromURL(icon, image => {
    const { width } = container.getClientRect()

    image.setAttrs({
      x: -(width / 2) + size,
      y: 0,
      offsetX: 0,
      offsetY: size / 2,
      width: size,
      height: size
    })

    container.add(image).draw()
    // re-draw entire stage to get around a weird z-index bug
    container.getStage().draw()
  })
}
