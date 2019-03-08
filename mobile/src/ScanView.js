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

import React from 'react'
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { translate as t } from '@doubledutch/rn-client'

const ScanView = ({ addCard, color, hideModal, sendOnScan, setSendOnScan }) => {
  const closeStyle = { fontSize: 24, textAlign: 'center', color }

  const onRead = code => {
    try {
      addCard(JSON.parse(code.data))
    } catch (e) {
      Alert.alert(t('error'), t('newScan'))
    }
  }

  try {
    return (
      <View style={s.main}>
        <QRCodeScanner onRead={onRead} />
        <View style={s.toggleRow}>
          <Text style={s.toggleText}>{t('share_on_scan')}</Text>
          <Switch value={sendOnScan} onValueChange={setSendOnScan} />
        </View>
        <TouchableOpacity style={s.button} onPress={hideModal}>
          <Text style={closeStyle}>{t('close')}</Text>
        </TouchableOpacity>
      </View>
    )
  } catch (e) {
    return null
  }
}

const s = StyleSheet.create({
  main: {
    backgroundColor: '#dedede',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 32,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  toggleText: {
    fontSize: 14,
  },
  button: { padding: 20, marginBottom: 30 },
})

export default ScanView
