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
import { CSVDownload } from '@doubledutch/react-csv'
import { Chart } from 'react-google-charts'
import {
  provideFirebaseConnectorToReactComponent,
  mapPerUserPrivateAdminablePushedDataToStateObjects,
} from '@doubledutch/firebase-connector'

import './App.css'

class App extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      sharedTasks: [],
      connections: {},
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
    const exportIsDisabled = !this.state.perUserInfo
    const options = {
      chart: {
        title: 'Daily Usage',
      },
      width: 900,
      height: 500,
      series: {
        // Gives each series an axis name that matches the Y-axis below.
        0: { axis: 'Total' },
        1: { axis: 'Day' },
      },
      axes: {
        // Adds labels to each axis; they don't have to match the axis names.
        y: {
          Temps: { label: 'Total' },
          Daylight: { label: 'Date' },
        },
      },
    }
    const data = this.formatDataForDailyChart()
    return (
      <div className="App">
        <h2 className="boxTitle">Digital Business Cards</h2>
        <div className="container">
          <Chart
            chartType="Line"
            data={data}
            options={options}
            width="80%"
            height="300"
            loader={<div>Loading Chart</div>}
          />
        </div>
        <button
          className="csvButton"
          onClick={this.formatDataForExport}
          disabled={exportIsDisabled}
        >
          Export Per-User Totals
        </button>
        {this.state.isExporting && this.state.exportList ? (
          <CSVDownload
            data={this.state.exportList}
            filename="connections_report.csv"
            target="_blank"
          />
        ) : null}
      </div>
    )
  }

  formatDataForDailyChart = () => {
    const variables = [[{ type: 'date', label: 'Day' }, 'Total Networking Opportunities']]
    if (this.state.perUserInfo) {
      const userIds = Object.keys(this.state.perUserInfo)
      const connections = userIds.map(id => Object.keys(this.state.perUserInfo[id].connections))
      let exportReports = []
      connections.forEach(user => {
        exportReports = exportReports.concat(user)
      })
      exportReports = exportReports.map(dateString => {
        const newDate = new Date(new Date(Number(dateString)).toDateString())
        return [newDate, 1]
      })
      const sum = {}
      for (var i = 0, c; (c = exportReports[i]); ++i) {
        if (undefined === sum[c[0]]) {
          sum[c[0]] = c
        } else {
          sum[c[0]][1] += c[1]
        }
      }
      const result = Object.keys(sum).map(function(val) {
        return sum[val]
      })
      return variables.concat(result)
    }
    return variables
  }

  formatDataForExport = () => {
    const userIds = Object.keys(this.state.perUserInfo)
    const attendeeQuestionPromises = userIds.map(id =>
      client
        .getAttendee(id)
        .then(attendee => ({ ...this.state.perUserInfo[id], ...attendee }))
        .catch(err => 'error'),
    )
    Promise.all(attendeeQuestionPromises).then(results => {
      const users = results.filter(x => x !== 'error' && x)
      const resultsForExport = users.map(usersForCSV)
      this.setState({ exportList: resultsForExport, isExporting: true })
      setTimeout(() => this.setState({ isExporting: false }), 3000)
    })
  }
}

function usersForCSV(user) {
  const totalConnections = user.connections ? Object.keys(user.connections).length : 0
  return {
    First_Name: user.firstName,
    Last_Name: user.lastName,
    Email: user.email,
    Connections: totalConnections,
  }
}

export default provideFirebaseConnectorToReactComponent(
  client,
  'personalleads',
  (props, fbc) => <App {...props} fbc={fbc} />,
  PureComponent,
)
