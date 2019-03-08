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

import React, { PureComponent } from 'react'
import '@doubledutch/react-components/lib/base.css'
import client from '@doubledutch/admin-client'
import {
  provideFirebaseConnectorToReactComponent,
  mapPerUserPrivateAdminablePushedDataToStateObjects,
} from '@doubledutch/firebase-connector'
import DailyChart from './DailyChart'

import './App.css'

class App extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      perUserInfo: null,
      isExporting: false,
      exportList: [],
    }
  }

  componentDidMount() {
    const { fbc } = this.props
    fbc.signinAdmin().then(() => {
      const totalCardsRef = fbc.database.private.adminableUsersRef()

      totalCardsRef.on('value', data => {
        // console.log(data.val())
        this.setState({ perUserInfo: data.val() || null })
      })
      mapPerUserPrivateAdminablePushedDataToStateObjects(
        fbc,
        'connections',
        this,
        'connections',
        (userId, key, value) => key,
        userId => userId,
      )
    })
  }

  render() {
    return (
      <div className="App">
        <h2 className="boxTitle">Digital Business Cards</h2>
        <DailyChart perUserInfo={this.state.perUserInfo} />
      </div>
    )
  }
}

export default provideFirebaseConnectorToReactComponent(
  client,
  'personalleads',
  (props, fbc) => <App {...props} fbc={fbc} />,
  PureComponent,
)
