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
import {
  Alert, Button, Image, Modal, ScrollView, StyleSheet, Text, TextInput,
  TouchableHighlight, TouchableOpacity, View
} from 'react-native'
import { CardView, CardListView } from './card-view'
import QRCode from 'react-native-qrcode'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { LabeledTextInput, FlatButton, assetRoot } from './dd-ui'
import client, { Avatar } from '@doubledutch/rn-client'

export class CodeView extends Component{
  constructor() {
    super()
    this.state = {
      message: '',
      showCode: true
    }
  }

  setText(message) {
    this.setState({message})
  }

  generateCode() {
    this.setState({showCode:true})
  }

  render() {
    const {id, firstName, lastName, title, company, email, twitter, mobile, linkedin} = this.props.myCard
    const user= client.currentUser
    return(
      <View style={{backgroundColor:'#dedede',paddingTop:32,position:'absolute',top:0,bottom:0,left:0,right:0}}>
        <View style={{ backgroundColor:"#FFFFFF", borderBottomColor: "#E8E8EE", borderBottomWidth: 1}}>
				<View style={{borderRadius:4,flexDirection:'row', padding: 8}}>
          <Avatar user={user} client={client} size={64} style={{marginRight: 8}} />
					<View style={{flexDirection:'column',flex:1}}>
						<Text style={{fontWeight:'500',flexWrap:'wrap', fontSize: 24, marginLeft: 2}}>{firstName} {lastName}</Text>
						<Text style={{flexWrap:'wrap', fontSize: 18, marginLeft: 2}}>{title}, {company}</Text>
						<View style={{marginTop: 5, margin: 2}}>
              { email ? <View style={{flexDirection: "row", marginTop: 5}}>
                <Image style={{width: 15, height: 10, marginTop: 5, marginRight: 5}} source={{uri: `${assetRoot}/envelope.png`}}/>
                <Text style={{fontSize: 14, flex: 1, marginTop: 1}}>{email}</Text>
              </View> : null }
              { mobile ?  <View style={{flexDirection: "row", marginTop: 5}}>
                <Image style={{width: 12, height: 12, marginTop: 5, marginRight: 5}} source={{uri: `${assetRoot}/telephone.png`}}/>
                <Text style={{fontSize: 14, flex: 1, marginTop: 2}}>{mobile}</Text>
              </View> : null }
              { twitter ? <View style={{flexDirection: "row", marginTop: 5}}>
                <Image style={{width: 14, height: 12, marginTop: 5, marginRight: 5}} source={{uri: `${assetRoot}/Twitter.png`}}/>
                <Text style={{fontSize: 14, flex: 1, marginTop: 2}}>{twitter}</Text>
              </View> : null }
              { linkedin ? <View style={{flexDirection: "row", marginTop: 5}}>
                <Image style={{width: 13, height: 12, marginTop: 5, marginRight: 5}} source={{uri: `${assetRoot}/Linkedin.png`}}/>
                <Text style={{fontSize: 14, flex: 1, marginTop: 3}}>{linkedin}</Text>
              </View> : null }
						</View>
					</View>
				</View>
        </View>
        <View style={{paddingLeft:8,paddingRight:8,flex:1}}>
          <View style={{flex:1}}>
            <View style={{justifyContent:'center',flex:1,flexDirection:'row',paddingTop:16,paddingBottom:10}}>
              <QRCode
                value={JSON.stringify({...this.props.myCard, message:this.state.message})}
                size={256}
                bgColor='black'
                fgColor='white' />
            </View>
            <View style={{height: 40, marginBottom: 10}}>
              <TouchableOpacity style={{flex: 1, marginLeft: 64, marginRight: 64, marginBottom: 8}}  onPress={this.props.hideModal}><Text style={{fontSize: 24, textAlign: "center", color: client.primaryColor}}>Exit</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export class ScanView extends Component{
  onRead(code){
    this.props.addCard(JSON.parse(code.data))
  }
  render(){
    try{
      return(
        <View style={{backgroundColor:'#dedede',position:'absolute',top:0,bottom:0,left:0,right:0,paddingTop:32}}>
          <QRCodeScanner onRead={this.onRead.bind(this)} />
          <View style={{height: 40, marginBottom: 10}}>
            <TouchableOpacity style={{flex: 1, marginLeft: 64, marginRight: 64, marginBottom: 8}}  onPress={this.props.hideModal}><Text style={{fontSize: 24, textAlign: "center", color: client.primaryColor}}>Close</Text></TouchableOpacity>
          </View>
        </View>
      )
    } catch(e){
      console.log(e)
    }
  }
}
