import Editor from './editor'

const editor = new Editor({
  container: 'editor',
  theme: 'light',
  width: window.innerWidth,
  height: window.innerHeight
})

// editor.on('click', event => {})

const x = window.innerWidth / 2 - 300
const y = window.innerHeight / 2

const weatherSensor = editor.addNode({ x, y }, {
  id: 'weather_1',
  type: 'SENSOR',
  label: 'Get Weather Info',
  plug: 'currentWeather v1.0.8',
  states: [
    'Clear',
    'Clouds',
    'Drizzle',
    'Fog',
    'Haze',
    'Mist',
    'Rain',
    'Snow',
    'Storm'
  ],
  icon: 'https://twemoji.maxcdn.com/2/72x72/2614.png',
  annotations: [
    'https://twemoji.maxcdn.com/16x16/23f0.png',
    'https://twemoji.maxcdn.com/16x16/231b.png'
  ]
})

const holidaySensor = editor.addNode({ x: x, y: y - 130 }, {
  id: 'isHoliday',
  type: 'SENSOR',
  label: 'isHoliday?',
  plug: 'isBelgianHoliday v1.0.2',
  icon: 'https://twemoji.maxcdn.com/36x36/1f4e8.png',
  states: [
    'TRUE',
    'FALSE'
  ]
})

const andGate = editor.addGate({ x: x + 250, y: y - 80 }, {
  gateType: 'AND'
})

const twitterActuator = editor.addNode({ x: x + 450, y: y - 80 }, {
  id: 'twitter_1',
  type: 'ACTUATOR',
  label: 'Send Twitter DM',
  plug: 'sendTwitterDM v1.0.2',
  icon: 'https://twemoji.maxcdn.com/36x36/1f4ec.png'
})

editor.addNote({ x: x + 300, y: y + 50 }, {
  label: `Hello, world!
This is a simple note! 🎉`
})

editor.connectNodes(weatherSensor, andGate, { states: ['Clear', 'Mist'] })
editor.connectNodes(holidaySensor, andGate, { states: ['TRUE'] })
editor.connectNodes(andGate, twitterActuator)

editor.debug(false)
