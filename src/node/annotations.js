import { Group, Image } from 'konva'

module.exports = (details, container) => {
  const group = new Group()
  const { annotations = [] } = details

  if (annotations.length > 0) {
    annotations.forEach(imgSrc => createImage(imgSrc, group))
  }

  const { width, height } = container.getClientRect()
  group.setPosition({
    x: -width / 2,
    y: -height / 2
  })

  return group
}

function placeInRow (nodes, options = {}) {
  const { margin = 0 } = options

  nodes.forEach((node, index) => {
    const { x, y } = node.getPosition()
    const width = node.width()

    const xPos = (x + (width * index)) + (margin * index)
    node.setPosition({ x: xPos, y })
  })
}

function createImage (src, container) {
  const size = 16

  Image.fromURL(src, image => {
    image.setAttrs({
      offsetX: size / 2,
      offsetY: size / 2,
      width: size,
      height: size
    })

    container.add(image)
    placeInRow(container.children, { margin: 5 })
    container.draw()
  })
}
