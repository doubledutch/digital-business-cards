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

import React, { useState } from 'react'
import { CSVDownload } from '@doubledutch/react-csv'

const ExportButton = ({ children, getData, disabled }) => {
  const [exportList, setExportList] = useState(null)

  function download() {
    getData().then(data => {
      setExportList(data)
      setTimeout(() => setExportList(null), 3000)
    })
  }

  return (
    <div>
      <button className="csvButton" onClick={download} disabled={disabled} type="button">
        {children}
      </button>
      {exportList ? (
        <CSVDownload data={exportList} filename="connections_report.csv" target="_blank" />
      ) : null}
    </div>
  )
}

export default ExportButton
