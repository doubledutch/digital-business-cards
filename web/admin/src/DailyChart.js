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
import client from '@doubledutch/admin-client'
import { CSVDownload } from '@doubledutch/react-csv'
import { Chart } from 'react-google-charts'

class DailyChart extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      isExporting: false,
      exportList: [],
    }
  }

  render() {
    const variables = [[{ type: 'date', label: 'Day' }, 'Total Networking Opportunities']]
    const exportIsDisabled = !this.props.perUserInfo
    const origData = this.formatDataForDailyChart()
    const max = origData.length
      ? origData.reduce((a, b) => {
          return Math.max(a[1], b[1])
        })
      : 0
    const formattedData = variables.concat(this.addBlankDates(origData))
    const options = {
      chart: {
        title: 'Daily Usage',
      },
      width: 800,
      height: 400,

      vAxis: {
        format: '0',
      },
      series: {
        // Gives each series an axis name that matches the Y-axis below.
        0: { axis: 'Connections' },
        1: { axis: 'Day' },
      },
      axes: {
        // Adds labels to each axis; they don't have to match the axis names.
        y: {
          Connections: { label: 'Connections' },
          Day: { label: 'Day' },
          all: { range: { max: max + 1, min: 0 } },
        },
      },
    }
    return (
      <div>
        <div className="container">
          {this.props.perUserInfo && (
            <Chart
              chartType="Line"
              data={formattedData}
              options={options}
              loader={<div>Loading Chart</div>}
            />
          )}
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
    const result = []
    if (this.props.perUserInfo) {
      const userIds = Object.keys(this.props.perUserInfo)
      const connections = userIds.map(id => Object.keys(this.props.perUserInfo[id].connections))
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
      return result
    }
    return result
  }

  addBlankDates = result => {
    const blankResults = result
      .sort(function(a, b) {
        return Date.parse(a[0]) - Date.parse(b[0])
      })
      .reduce(
        (function(hash) {
          return function(p, c) {
            const missingDaysNo = (Date.parse(c[0]) - hash.prev) / (1000 * 3600 * 24)
            if (hash.prev && missingDaysNo > 1) {
              for (let i = 1; i < missingDaysNo; i++)
                p.push(new Date(hash.prev + i * (1000 * 3600 * 24)))
            }
            hash.prev = Date.parse(c[0])
            return p
          }
        })(Object.create(null)),
        [],
      )
      .map(date => [date, 0])

    return result.concat(blankResults).sort((a, b) => a[0] - b[0])
  }

  formatDataForExport = () => {
    const userIds = Object.keys(this.props.perUserInfo)
    const attendeeQuestionPromises = userIds.map(id =>
      client
        .getAttendee(id)
        .then(attendee => ({ ...this.props.perUserInfo[id], ...attendee }))
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

export default DailyChart
