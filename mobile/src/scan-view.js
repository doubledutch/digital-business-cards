import React, { Component } from 'react'
import ReactNative from 'react-native'
import { CardView } from './card-view'
import QRCode from 'react-native-qrcode'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { LabeledTextInput, FlatButton } from './dd-ui'

const { Alert, TouchableOpacity, TouchableHighlight, Text, View, ScrollView, Image, Modal,TextInput,Button,StyleSheet} = ReactNative

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
    const { id, firstName, lastName } = this.props.myCard
    return(
      <View style={{backgroundColor:'#dedede',paddingTop:32,position:'absolute',top:0,bottom:0,left:0,right:0}}>
        <CardView ddapi={this.props.ddapi} user={{id, firstName, lastName}} {...this.props.myCard} />
        <View style={{paddingLeft:8,paddingRight:8,flex:1}}>
          <View style={{flex:1}}>
            <View style={{justifyContent:'center',flex:1,flexDirection:'row',paddingTop:16,paddingBottom:42}}>
              <QRCode
                value={JSON.stringify({...this.props.myCard, message:this.state.message})}
                size={256}
                bgColor='black'
                fgColor='white' />
            </View>
            <View style={{flexDirection:'row',flex:1,marginTop:32}}>
              <FlatButton onPress={this.props.hideModal} title='Close' style={{marginLeft:64,marginRight:64,marginBottom:8}}/>
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

          <View style={{flexDirection:'row',flex:1,marginTop:128}}>
            <FlatButton onPress={this.props.hideModal} title='Close' style={{marginLeft:64,marginRight:64,marginBottom:8}}/>
          </View>
        </View>
      )
    } catch(e){
      console.log(e)
    }
  }
}
