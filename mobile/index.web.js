/*
 * Copyright 2018 DoubleDutch, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AppRegistry } from 'react-native'
import { install } from '@doubledutch/rn-client/webShim'
import HomeView from './src/home-view'

function runApp(DD) {
  AppRegistry.registerComponent('personalleads', () => HomeView)
  AppRegistry.runApplication('personalleads', {
    rootTag: document.getElementById('react-root'),
    initialProps: { ddOverride: DD },
  })
}

if (window.DD && window.DD.Events) {
  install(runApp)
} else {
  runApp(null)
}