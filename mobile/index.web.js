var React = require('react-native');
var { AppRegistry } = React;
import HomeView from './src/home-view'
import { install } from '@doubledutch/rn-client/webShim'

function runApp(DD) {
  AppRegistry.registerComponent('personalleads', () => HomeView)
  AppRegistry.runApplication('personalleads', {
    rootTag: document.getElementById('react-root'),
    initialProps: { ddOverride: DD }
  })
}

if (window.DD && window.DD.Events) {
  install(runApp)
} else {
  runApp(null)
}
