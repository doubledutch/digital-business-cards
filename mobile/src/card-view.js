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
import { TouchableOpacity, Text, View, ScrollView, Image, Linking, TextInput } from 'react-native'
import client, { Avatar, translate as t } from '@doubledutch/rn-client'
import { LabeledTextInput } from './dd-ui'
import { envelopeIcon, linkedinIcon, telephoneIcon, twitterIcon } from './icon'

export class EditCardView extends Component {
  constructor(props) {
    super(props)

    // Use state to hold form data.
    // Initialize all values from props
    this.state = {
      id: props.id,
      firstName: props.firstName,
      lastName: props.lastName,
      title: props.title,
      company: props.company,
      mobile: props.mobile,
      email: props.email,
      linkedin: props.linkedin,
      twitter: props.twitter,
    }
  }

  // Use the supplied key to assign the value
  onChange = (value, key) => {
    this.setState({ [key]: value })
  }

  // Hand form state over to function passed in through props
  onSave = () => {
    this.props.updateCard(this.state)
  }

  render() {
    const { primaryColor } = this.props
    return (
      <View
        style={{
          backgroundColor: 'white',
          paddingTop: 32,
          paddingLeft: 8,
          paddingRight: 8,
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <ScrollView style={{ marginTop: 40 }}>
          <View style={{ flexDirection: 'row' }}>
            <LabeledTextInput
              style={{
                flex: 1,
                borderBottomColor: '#E8E8EE',
                borderBottomWidth: 1,
                height: 43,
                marginRight: 10,
                marginLeft: 5,
                marginTop: 10,
              }}
              id="firstName"
              label="First"
              value={this.props.firstName}
              onChangeText={this.onChange}
            />
            <LabeledTextInput
              style={{
                flex: 1,
                borderBottomColor: '#E8E8EE',
                borderBottomWidth: 1,
                height: 43,
                marginLeft: 10,
                marginRight: 5,
                marginTop: 10,
              }}
              id="lastName"
              label="Last"
              value={this.props.lastName}
              onChangeText={this.onChange}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <LabeledTextInput
              style={{
                flex: 1,
                borderBottomColor: '#E8E8EE',
                borderBottomWidth: 1,
                height: 43,
                marginRight: 10,
                marginLeft: 5,
                marginTop: 10,
              }}
              id="title"
              label="Title"
              value={this.props.title}
              onChangeText={this.onChange}
            />
            <LabeledTextInput
              style={{
                flex: 1,
                borderBottomColor: '#E8E8EE',
                borderBottomWidth: 1,
                height: 43,
                marginLeft: 10,
                marginRight: 5,
                marginTop: 10,
              }}
              id="company"
              label="Company"
              value={this.props.company}
              onChangeText={this.onChange}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <LabeledTextInput
              style={{
                flex: 1,
                borderBottomColor: '#E8E8EE',
                borderBottomWidth: 1,
                height: 43,
                marginRight: 10,
                marginLeft: 5,
                marginTop: 10,
              }}
              id="email"
              label="Email"
              value={this.props.email}
              onChangeText={this.onChange}
            />
            <LabeledTextInput
              style={{
                flex: 1,
                borderBottomColor: '#E8E8EE',
                borderBottomWidth: 1,
                height: 43,
                marginLeft: 10,
                marginRight: 5,
                marginTop: 10,
              }}
              id="mobile"
              label="Phone number"
              value={this.props.mobile}
              onChangeText={this.onChange}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <LabeledTextInput
              style={{
                flex: 1,
                borderBottomColor: '#E8E8EE',
                borderBottomWidth: 1,
                height: 43,
                marginRight: 10,
                marginLeft: 5,
                marginTop: 10,
              }}
              id="linkedin"
              label="LinkedIn"
              value={this.props.linkedin}
              onChangeText={this.onChange}
            />
            <LabeledTextInput
              style={{
                flex: 1,
                borderBottomColor: '#E8E8EE',
                borderBottomWidth: 1,
                height: 43,
                marginLeft: 10,
                marginRight: 5,
                marginTop: 10,
              }}
              id="twitter"
              label="Twitter"
              value={this.props.twitter}
              onChangeText={this.onChange}
            />
          </View>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <TouchableOpacity
              onPress={this.props.hideModal}
              style={{
                flex: 1,
                marginLeft: 10,
                marginRight: 5,
                borderColor: primaryColor,
                backgroundColor: 'white',
                borderWidth: 1,
                height: 45,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  color: primaryColor,
                  textAlign: 'center',
                  flex: 1,
                  flexDirection: 'column',
                  fontSize: 18,
                  marginTop: 12,
                  marginLeft: 10,
                  marginBottom: 12,
                  marginRight: 10,
                  fontSize: 18,
                  height: 21,
                }}
              >
                {t('cancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.onSave}
              style={{
                flex: 1,
                marginLeft: 5,
                marginRight: 10,
                borderColor: primaryColor,
                backgroundColor: primaryColor,
                borderWidth: 1,
                height: 45,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  flex: 1,
                  flexDirection: 'column',
                  fontSize: 18,
                  marginTop: 12,
                  marginLeft: 10,
                  marginBottom: 12,
                  marginRight: 10,
                  fontSize: 18,
                  height: 21,
                }}
              >
                {t('save')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    )
  }
}

export class CardView extends Component {
  render() {
    return (
      <View style={{ marginTop: 10 }}>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 4,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 8,
          }}
        >
          <Avatar user={this.props.user} client={client} size={64} style={{ marginRight: 8 }} />
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: '500' }}>
              {this.props.firstName} {this.props.lastName}
            </Text>
            <Text style={{ fontSize: 18 }}>
              {this.props.title}
              {this.props.company ? `, ${this.props.company}` : ''}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

export class CardListView extends Component {
  state = { notes: this.props.notes, isFocused: false, inputHeight: 0 }

  updateLead = () => {
    this.props.onUpdateNotes(this.state.notes)
    this.onBlur()
  }

  onFocus = () => {
    this.handleInputFocus()
    this.refs.NotesInput.focus()
  }

  onBlur = () => {
    this.handleInputBlur()
    this.refs.NotesInput.blur()
  }

  onCancel = () => {
    this.onBlur()
    this.setState({ notes: this.props.notes })
  }

  handleInputFocus = () => this.setState({ isFocused: true })

  handleInputBlur = () => this.setState({ isFocused: false })

  _handleSizeChange = event => {
    this.setState({
      inputHeight: event.nativeEvent.contentSize.height + 5,
    })
  }

  renderButtons = () => {
    const { primaryColor } = this.props
    if (this.state.isFocused) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={{ height: 16, paddingRight: 15, paddingLeft: 15 }}
            onPress={this.onCancel}
          >
            <Text style={{ fontSize: 14, textAlign: 'right', color: primaryColor }}>
              {t('cancel')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.updateLead} style={{ height: 16, paddingLeft: 15 }}>
            <Text style={{ fontSize: 14, textAlign: 'right', color: primaryColor }}>
              {t('save')}
            </Text>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <TouchableOpacity style={{ height: 16, flex: 1 }} onPress={this.onFocus}>
        <Text style={{ fontSize: 14, textAlign: 'right', color: primaryColor }}>{t('edit')}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const { primaryColor } = this.props
    return (
      <View
        style={{ backgroundColor: '#FFFFFF', borderBottomColor: '#E8E8EE', borderBottomWidth: 1 }}
      >
        <TouchableOpacity
          style={{ borderRadius: 4, flexDirection: 'row', padding: 8 }}
          onPress={this.props.showCard}
        >
          <Avatar user={this.props.user} client={client} size={38} style={{ marginRight: 8 }} />
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <Text style={{ fontWeight: '500', flexWrap: 'wrap', fontSize: 18, marginLeft: 2 }}>
              {this.props.firstName} {this.props.lastName}
            </Text>
            <Text style={{ flexWrap: 'wrap', fontSize: 14, color: '#A8A8A8', marginLeft: 2 }}>
              {this.props.title}, {this.props.company}
            </Text>
            <View style={{ marginTop: 5, margin: 2 }}>
              {this.props.email ? (
                <TouchableOpacity
                  style={{ flexDirection: 'row', marginTop: 5 }}
                  onPress={() => Linking.openURL(`mailto:${this.props.email}`)}
                >
                  <Image
                    style={{ width: 15, height: 10, marginTop: 5, marginRight: 5 }}
                    source={envelopeIcon}
                  />
                  <Text style={{ fontSize: 14, flex: 1, marginTop: 1, color: 'blue' }}>
                    {this.props.email}
                  </Text>
                </TouchableOpacity>
              ) : null}
              {this.props.mobile ? (
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                  <Image
                    style={{ width: 12, height: 12, marginTop: 5, marginRight: 5 }}
                    source={telephoneIcon}
                  />
                  <Text style={{ fontSize: 14, flex: 1, marginTop: 2 }}>{this.props.mobile}</Text>
                </View>
              ) : null}
              {this.props.twitter ? (
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                  <Image
                    style={{ width: 14, height: 12, marginTop: 5, marginRight: 5 }}
                    source={twitterIcon}
                  />
                  <Text style={{ fontSize: 14, flex: 1, marginTop: 2 }}>{this.props.twitter}</Text>
                </View>
              ) : null}
              {this.props.linkedin ? (
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                  <Image
                    style={{ width: 13, height: 12, marginTop: 5, marginRight: 5 }}
                    source={linkedinIcon}
                  />
                  <Text style={{ fontSize: 14, flex: 1, marginTop: 3 }}>{this.props.linkedin}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            minHeight: 60,
            borderBottomColor: '#E8E8EE',
            borderBottomWidth: 2,
            borderTopColor: '#E8E8EE',
            borderTopWidth: 1,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 14, marginTop: 11, marginLeft: 11, marginBottom: 0 }}>
              {t('notes')}
            </Text>
            <View style={{ marginTop: 11, marginRight: 11, flex: 1 }}>{this.renderButtons()}</View>
          </View>
          <TextInput
            ref="NotesInput"
            placeholderTextColor="#E1E1E1"
            placeholder="Tap to add text"
            onContentSizeChange={event => this._handleSizeChange(event)}
            multiline
            onFocus={this.handleInputFocus}
            style={{
              height: Math.max(25, this.state.inputHeight),
              textAlignVertical: 'top',
              flex: 1,
              marginRight: 10,
              marginLeft: 10,
              marginBottom: 5,
              fontSize: 14,
            }}
            id="notes"
            key="notes"
            value={this.state.notes}
            onChangeText={notes => this.setState({ notes })}
          />
        </View>
        <View style={{ borderBottomColor: '#E8E8EE', borderBottomWidth: 1 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              margin: 10,
              backgroundColor: this.props.primaryColor,
              padding: 10,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
            }}
            onPress={() => client.openURL(`dd://profile/${this.props.user.id}`)}
          >
            <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: 'white' }}>
              {t('startConvo')}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            height: 16,
            flex: 1,
            marginLeft: 18,
            marginRight: 18,
            marginTop: 13,
            marginBottom: 10,
          }}
          onPress={this.props.showAlert}
        >
          <Text
            style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: primaryColor }}
          >
            {t('remove_lead')}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export class CardListItem extends Component {
  render() {
    if (this.props.showExpanded) {
      return (
        <View style={{ flex: 1, marginBottom: 8 }}>
          <View style={{ flex: 1 }}>
            <CardListView
              {...this.props}
              onUpdateNotes={this.props.onUpdateNotes}
              primaryColor={this.props.primaryColor}
            />
          </View>
        </View>
      )
    }
    return (
      <TouchableOpacity onPress={this.props.showCard} style={{ flex: 1 }}>
        <View
          style={{
            padding: 8,
            backgroundColor: '#FFFFFF',
            borderBottomWidth: 1,
            borderColor: '#dedede',
            flexDirection: 'row',
          }}
        >
          <Avatar user={this.props.user} client={client} size={38} style={{ marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '500', flexWrap: 'wrap', fontSize: 18 }}>
              {this.props.firstName} {this.props.lastName}
            </Text>
            <Text style={{ flexWrap: 'wrap', fontSize: 14, color: '#A8A8A8' }}>
              {this.props.title}, {this.props.company}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
