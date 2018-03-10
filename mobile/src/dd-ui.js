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
import { Alert, Button, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View} from 'react-native'

export const assetRoot = 'https://dml2n2dpleynv.cloudfront.net/extensions/personal-leads'
export class LabeledTextInput extends Component{
	constructor(props) {
		super(props)
		this.state = {
			data: props.value == null ? '' : props.value
		}
	}

	onChangeText(text) {
		this.setState({data: text})
		if(this.props.onChangeText) {
			this.props.onChangeText(text, this.props.id)
		}
	}

	onFocusChange() {
		this.setState({isFocused: this.textInput && this.textInput.isFocused()})
	}

	render() {
		const labelColor=this.props.style!=null && this.props.style.labelColor!=null?this.props.style.labelColor:'#AAAAAA'
		const labelMarkColor=this.props.style!=null && this.props.style.labelMarkColor!=null?this.props.style.labelMarkColor:'#FF0055'
		return(
			<View style={[{backgroundColor:'#FFFFFF',marginBottom:2,height:48,paddingTop:4},this.props.style]}>
				<TextInput underlineColorAndroid='transparent' value={this.state.data} onEndEditing={()=>this.onFocusChange()} onFocus={()=>this.onFocusChange()} ref={input => this.textInput = input} 
					style={{paddingLeft:8,flex:1}} onChangeText={this.onChangeText.bind(this)}/>
				<Text onPress={() => this.textInput.focus()} style={{position:'absolute', marginTop: -5,
					top: (this.state.data.length==0 && !this.state.isFocused) ? 12 : 2,
					left:8,
					fontSize: (this.state.data.length==0 && !this.state.isFocused) ? 18 : 12,
					color: this.state.isFocused ? labelMarkColor : labelColor,
					backgroundColor:'rgba(0,0,0,0)'}}>{this.props.label}</Text>
			</View>
		)
	}
}

export class FlatButton extends Component{
	render(){
		var backgroundColor='#FFFFFF'
		if(this.props.style!=null && this.props.style.backgroundColor!=null){
			backgroundColor=this.props.style.backgroundColor
		}
		var color="#000000"
		if(this.props.style!=null && this.props.style.color!=null){
			color=this.props.style.color
		}
		var passInStyles=null
		if(this.props.style!=null){
			passInStyles={
				padding:this.props.style.padding,
				paddingLeft:this.props.style.paddingLeft,
				paddingTop:this.props.style.paddingTop,
				paddingRight:this.props.style.paddingRight,
				paddingBottom:this.props.style.paddingBottom,
				margin:this.props.style.margin,
				marginLeft:this.props.style.marginLeft,
				marginTop:this.props.style.marginTop,
				marginRight:this.props.style.marginRight,
				marginBottom:this.props.style.marginBottom
			}
			if('flex' in this.props.style){
				passInStyles.flex=this.props.style.flex
			}
		}
		return(
			<TouchableOpacity onPress={this.props.onPress} style={[{flex:1},passInStyles]}>
				<View style={{backgroundColor:backgroundColor,padding:0,marginTop:0,marginLeft:0,marginRight:0}}>
					<View style={{height:1,backgroundColor:'rgba(255,255,255,0.25)'}} />
					<View style={{height:2,backgroundColor:'rgba(255,255,255,0.125)'}} />
					<Text style={{color:color,textAlign:'center',marginBottom:3,padding:8}}>{this.props.title}</Text>
				</View>
				<View style={{height:2,backgroundColor:'rgba(0,0,0,0.1)',marginLeft:4,marginRight:4}}></View>
			</TouchableOpacity>
	  )
	}
	
}
