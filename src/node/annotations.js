import { Group, Image } from 'konva'

const ICON_SIZE = 16

module.exports = (details, container) => {
  const group = new Group()
  const { annotations = [] } = details

  if (annotations.length > 0) {
    annotations.forEach(imgSrc => createImage(imgSrc, group))
  }

  const { width, height } = container.getClientRect()
  group.setPosition({
    x: width / 2,
    y: -height / 2
  })

  return group
}

function placeInRow (nodes, options = {}) {
  const { margin = 0, direction = 'ltr' } = options

  nodes.forEach((node, index) => {
    const { x, y } = node.getPosition()
    const width = node.width()

    const xPos = direction === 'ltr'
      ? (x + (width * index)) + (margin * index)
      : (x - (width * index)) - (margin * index)
    node.setPosition({ x: xPos, y })
  })
}

function createImage (src, container) {
  Image.fromURL(src, image => {
    image.setAttrs({
      offsetX: ICON_SIZE / 2,
      offsetY: ICON_SIZE / 2,
      width: ICON_SIZE,
      height: ICON_SIZE
    })

    container.add(image)
    placeInRow(container.children, { margin: 5, direction: 'rtl' })
    container.draw()
  })
}
