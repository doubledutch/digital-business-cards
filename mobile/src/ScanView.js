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

import React, { Component } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { translate as t } from '@doubledutch/rn-client'

export default class ScanView extends Component {
  onRead = code => {
    const { addCard } = this.props
    try {
      addCard(JSON.parse(code.data))
    } catch (e) {
      Alert.alert(t('error'), t('newScan'))
    }
  }

  render() {
    const { color, hideModal } = this.props
    try {
      return (
        <View
          style={{
            backgroundColor: '#dedede',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            paddingTop: 32,
          }}
        >
          <QRCodeScanner onRead={this.onRead} />
          <View style={{ height: 40, marginBottom: 10 }}>
            <TouchableOpacity
              style={{ flex: 1, marginLeft: 64, marginRight: 64, marginBottom: 8 }}
              onPress={hideModal}
            >
              <Text style={{ fontSize: 24, textAlign: 'center', color }}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    } catch (e) {
      console.log(e)
      return null
    }
  }
}
