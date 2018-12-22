import Editor from './editor'

const editor = new Editor({
  container: 'editor',
  width: window.innerWidth,
  height: window.innerHeight
})

editor.on('click', event => {
  const { x, y } = editor.getPointerPosition()

  const e1 = editor.addNode({ x, y }, {
    id: 'weather_1',
    label: 'getWeatherInfo',
    states: ['clear', 'rainy'],
    icon: '⛅'
  })

  const e2 = editor.addNode({ x: x + 300, y: y - 100 }, {
    id: 'weather_1',
    label: 'sendTwitterDM',
    icon: '🐦',
    color: '#3498db',
    textColor: 'white'
  })

  const e3 = editor.addNode({ x: x + 300, y: y + 100 }, {
    id: 'weather_1',
    label: 'sendEmail',
    icon: '✉️'
  })

  editor.connectNodes(e1, e2)
  editor.connectNodes(e1, e3)
  editor.connectNodes(e2, e3)
})
