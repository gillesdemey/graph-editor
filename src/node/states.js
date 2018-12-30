import { Circle, Group, Text } from 'konva'
import { schemeSpectral as scheme } from 'd3-scale-chromatic'

const HANDLE_RADIUS = 5

module.exports = (details) => {
  const { states = [] } = details
  // we're adding all children to this group
  const group = new Group()
  const generateColor = colorGenerator(states.length)

  const stateItems = placeInColumn(
    states.map((state, index) => {
      return createStateItem(state, index, generateColor)
    }), { margin: 5 })

  group.add(...stateItems)

  return group
}

function createStateItem (state, index, generator) {
  const color = generator(index)
  const group = new Group()

  const text = new Text({
    text: state,
    fill: color
  })

  const handle = new Circle({
    stroke: color,
    radius: HANDLE_RADIUS,
    x: text.width() + (HANDLE_RADIUS * 2.5),
    y: text.height() / 2
  })

  group.add(text, handle)

  return group
}

function placeInColumn (nodes, options = {}) {
  const { margin = 0 } = options

  const widestNode = Math.max(
    ...nodes.map(n => n.getClientRect().width)
  )

  nodes.forEach((node, index) => {
    const { width, height } = node.getClientRect()

    const newY = (height * index) + (index * margin)
    const newX = widestNode - width

    node.setPosition({ y: newY, x: newX })
  })

  return nodes
}

// select color palette based on number of states
function colorGenerator (length) {
  // ordinal scale has to be between 3 and 11 in size
  const numColors = Math.max(3, Math.min(11, length))
  const colors = scheme[numColors]

  return (index) => colors[index % length]
}
