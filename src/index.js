import Editor from './editor'

const editor = new Editor({
  container: 'editor',
  theme: 'light',
  width: window.innerWidth,
  height: window.innerHeight
})

// editor.on('click', event => {})

const x = window.innerWidth / 2 - 400
const y = window.innerHeight / 2

const e1 = editor.addNode({ x, y }, {
  id: 'weather_1',
  label: 'Get Weather Info',
  plug: 'currentWeather v1.0.8',
  states: ['clear', 'rainy'],
  icon: 'https://twemoji.maxcdn.com/36x36/2614.png',
  annotations: [
    'https://twemoji.maxcdn.com/16x16/1f557.png'
  ]
})

const e2 = editor.addNode({ x: x + 300, y: y - 50 }, {
  id: 'twitter_1',
  label: 'Send Twitter DM',
  plug: 'sendTwitterDM v1.0.2',
  icon: 'https://twemoji.maxcdn.com/36x36/1f4ec.png'
})

const e3 = editor.addNode({ x: x + 300, y: y + 50 }, {
  id: 'sendmail_1',
  label: 'Send Email',
  icon: 'https://twemoji.maxcdn.com/36x36/1f4e8.png'
})

const e4 = editor.addNode({ x: x + 500, y: y }, {
  id: 'formula_1',
  label: 'Calculate',
  icon: 'https://twemoji.maxcdn.com/36x36/1f4b1.png'
})

editor.connectNodes(e1, e2)
editor.connectNodes(e1, e3)
