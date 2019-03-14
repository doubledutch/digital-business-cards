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
import ExportButton from './ExportButton'

import './App.css'

function getQRCodeURLs() {
  return client.getAttendees().then(attendees =>
    attendees.map(a => {
      const obj = {
        firstName: a.firstName,
        lastName: a.lastName,
        title: a.title,
        company: a.company,
        email: a.email,
        twitter: a.twitter,
        linkedin: a.linkedin,
      }
      return {
        'First Name': a.firstName,
        'Last Name': a.lastName,
        Email: a.email,
        URL: `https://us-central1-bazaar-179323.cloudfunctions.net/qr?data=${encodeURIComponent(
          JSON.stringify(obj),
        )}`,
      }
    }),
  )
}

class App extends PureComponent {
  constructor(props) {
    super(props)

    this.state = { perUserInfo: null }
  }

  componentDidMount() {
    const { fbc } = this.props
    fbc.signinAdmin().then(() => {
      const totalCardsRef = fbc.database.private.adminableUsersRef()

      totalCardsRef.on('value', data => {
        this.setState({ perUserInfo: data.val() || null })
      })
      mapPerUserPrivateAdminablePushedDataToStateObjects(
        fbc,
        'connections',
        this,
        'connections',
        (_, key) => key,
        userId => userId,
      )
    })
  }

  render() {
    const { perUserInfo } = this.state
    return (
      <div className="App">
        <h2 className="boxTitle">Digital Business Cards</h2>
        <DailyChart perUserInfo={perUserInfo} />
        <ExportButton getData={getQRCodeURLs}>Export attendee QR code URLs</ExportButton>
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
