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
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import client, { Avatar, translate as t } from '@doubledutch/rn-client'
import QRCode from '@doubledutch/react-native-qrcode'
import QRCodeOriginal from 'react-native-qrcode'
import LoadingView from './LoadingView'
import { envelopeIcon, linkedinIcon, telephoneIcon, twitterIcon } from './icon'

const isWebKitVersion = client.clientVersion.major > 8 && client.clientVersion.minor > 2

export default class CodeView extends Component {
  state = {
    message: '',
    pageLoading: isWebKitVersion,
  }

  render() {
    const { currentUser, hideModal, myCard, primaryColor } = this.props
    const { message, pageLoading } = this.state
    const { firstName, lastName, title, company, email, twitter, mobile, linkedin } = myCard
    const paddingTop = pageLoading ? 0 : 32

    return (
      <View
        style={{
          backgroundColor: '#dedede',
          paddingTop,
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        {pageLoading && <LoadingView />}
        <View style={pageLoading ? s.webHidden : s.web}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderBottomColor: '#E8E8EE',
              borderBottomWidth: 1,
            }}
          >
            <View style={{ borderRadius: 4, flexDirection: 'row', padding: 8 }}>
              <Avatar user={currentUser} client={client} size={64} style={{ marginRight: 8 }} />
              <View style={{ flexDirection: 'column', flex: 1 }}>
                <Text style={{ fontWeight: '500', flexWrap: 'wrap', fontSize: 24, marginLeft: 2 }}>
                  {firstName} {lastName}
                </Text>
                <Text style={{ flexWrap: 'wrap', fontSize: 18, marginLeft: 2 }}>
                  {titleAndCompany(title, company)}
                </Text>
                <View style={{ marginTop: 5, margin: 2 }}>
                  {email ? (
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                      <Image
                        style={{ width: 15, height: 10, marginTop: 5, marginRight: 5 }}
                        source={envelopeIcon}
                      />
                      <Text style={{ fontSize: 14, flex: 1, marginTop: 1 }}>{email}</Text>
                    </View>
                  ) : null}
                  {mobile ? (
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                      <Image
                        style={{ width: 12, height: 12, marginTop: 5, marginRight: 5 }}
                        source={telephoneIcon}
                      />
                      <Text style={{ fontSize: 14, flex: 1, marginTop: 2 }}>{mobile}</Text>
                    </View>
                  ) : null}
                  {twitter ? (
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                      <Image
                        style={{ width: 14, height: 12, marginTop: 5, marginRight: 5 }}
                        source={twitterIcon}
                      />
                      <Text style={{ fontSize: 14, flex: 1, marginTop: 2 }}>{twitter}</Text>
                    </View>
                  ) : null}
                  {linkedin ? (
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                      <Image
                        style={{ width: 13, height: 12, marginTop: 5, marginRight: 5 }}
                        source={linkedinIcon}
                      />
                      <Text style={{ fontSize: 14, flex: 1, marginTop: 3 }}>{linkedin}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          </View>
          <View style={{ paddingLeft: 8, paddingRight: 8, flex: 1 }}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  justifyContent: 'center',
                  flex: 1,
                  flexDirection: 'row',
                  paddingTop: 16,
                  paddingBottom: 10,
                }}
              >
                {isWebKitVersion ? (
                  <QRCode
                    value={JSON.stringify(applyToValues(removeEmojis, { ...myCard, message }))}
                    size={256}
                    bgColor="black"
                    fgColor="white"
                    onLoad={() => this.setState({ pageLoading: false })}
                  />
                ) : (
                  <QRCodeOriginal
                    value={JSON.stringify(applyToValues(removeEmojis, { ...myCard, message }))}
                    size={256}
                    bgColor="black"
                    fgColor="white"
                  />
                )}
              </View>
              <View style={{ height: 40, marginBottom: 10 }}>
                <TouchableOpacity
                  style={{ flex: 1, marginLeft: 64, marginRight: 64, marginBottom: 8 }}
                  onPress={hideModal}
                >
                  <Text style={{ fontSize: 24, textAlign: 'center', color: primaryColor }}>
                    {t('exit')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

function removeEmojis(s) {
  if (!s || !s.substr) return s
  return s.replace(
    /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    '',
  )
}

function applyToValues(fn, obj) {
  return Object.entries(obj).reduce((o, [key, val]) => {
    o[key] = fn(val)
    return o
  }, {})
}

const titleAndCompany = (title, company) => [title, company].filter(x => x).join(', ')

const s = StyleSheet.create({
  web: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  webHidden: {
    height: 1,
    width: 1,
  },
})
