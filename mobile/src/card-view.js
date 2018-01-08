import React, { Component } from 'react'

import { LabeledTextInput, FlatButton } from './dd-ui'

import { Alert, KeyboardAvoidingView, Platform, TouchableOpacity, TouchableHighlight, Text, View, ScrollView, Image, Modal, TextInput, Button, StyleSheet} from 'react-native'
import client, { Avatar } from '@doubledutch/rn-client'

export class EditCardView extends Component{
	constructor(props){
    super(props)
    // Use state to hold form data.
    // Initialize all values from props
    this.state={
      id:props.id,
      firstName:props.firstName,
      lastName:props.lastName,
      title:props.title,
      company:props.company,
      mobile:props.mobile,
      email:props.email,
      linkedin:props.linkedin,
      twitter:props.twitter
    }
  }

  // Use the supplied key to assign the value
	onChange = (value,key) => {
		this.setState({[key]: value})
	}
	// Hand form state over to function passed in through props
	onSave(){
		this.props.updateCard(this.state)
	}

	render(){
		return(
			<KeyboardAvoidingView behavior={Platform.select({ios: "padding", android: null})} style={{backgroundColor:"white" ,paddingTop:32,paddingLeft:8,paddingRight:8,position:'absolute',top:0,bottom:0,left:0,right:0}}>
				<ScrollView style={{marginTop: 40}}>
					<View style={{flexDirection: 'row'}}>
						<LabeledTextInput style={{flex: 1, borderBottomColor: "#E8E8EE", borderBottomWidth: 1, height: 43, marginRight: 10, marginLeft: 5, marginTop: 10}}id="firstName" label="First" value={this.props.firstName} onChangeText={this.onChange}/>
						<LabeledTextInput style={{flex: 1, borderBottomColor: "#E8E8EE", borderBottomWidth: 1, height: 43, marginLeft: 10, marginRight: 5, marginTop: 10}} id="lastName" label="Last" value={this.props.lastName} onChangeText={this.onChange}/>
					</View>
					<View style={{flexDirection: 'row'}}>
						<LabeledTextInput style={{flex: 1, borderBottomColor: "#E8E8EE", borderBottomWidth: 1, height: 43, marginRight: 10, marginLeft: 5, marginTop: 10}} id="title" label="Title" value={this.props.title} onChangeText={this.onChange} />
						<LabeledTextInput style={{flex: 1, borderBottomColor: "#E8E8EE", borderBottomWidth: 1, height: 43, marginLeft: 10, marginRight: 5, marginTop: 10}} id="company" label="Company" value={this.props.company} onChangeText={this.onChange} />
					</View>
					<View style={{flexDirection: 'row'}}>
						<LabeledTextInput style={{flex: 1, borderBottomColor: "#E8E8EE", borderBottomWidth: 1, height: 43, marginRight: 10, marginLeft: 5, marginTop: 10}} id="email" label="Email" value={this.props.email} onChangeText={this.onChange} />
						<LabeledTextInput style={{flex: 1, borderBottomColor: "#E8E8EE", borderBottomWidth: 1, height: 43, marginLeft: 10, marginRight: 5, marginTop: 10}} id="mobile" label="Phone number" value={this.props.mobile} onChangeText={this.onChange} />
					</View>
					<View style={{flexDirection: 'row'}}>
						<LabeledTextInput style={{flex: 1, borderBottomColor: "#E8E8EE", borderBottomWidth: 1, height: 43, marginRight: 10, marginLeft: 5, marginTop: 10}} id="linkedin" label="LinkedIn" value={this.props.linkedin} onChangeText={this.onChange} />
						<LabeledTextInput style={{flex: 1, borderBottomColor: "#E8E8EE", borderBottomWidth: 1, height: 43, marginLeft: 10, marginRight: 5, marginTop: 10}} id="twitter" label="Twitter" value={this.props.twitter} onChangeText={this.onChange} />
					</View>
					<View style={{flexDirection:'row',marginTop:20}}>
						<TouchableOpacity onPress={this.props.hideModal} style={{ flex: 1, marginLeft: 10, marginRight: 5, borderColor: client.primaryColor, backgroundColor: "white", borderWidth: 1, height: 45, borderRadius: 20}}><Text style={{color: client.primaryColor, textAlign: 'center', flex: 1, flexDirection: 'column', fontSize: 18, marginTop: 12, marginLeft: 10, marginBottom: 12, marginRight: 10, fontSize: 18, height: 21}}>Cancel</Text></TouchableOpacity>
          				<TouchableOpacity onPress={this.onSave.bind(this)} style={{flex: 1, marginLeft: 5, marginRight: 10, borderColor: client.primaryColor, backgroundColor: client.primaryColor, borderWidth: 1, height: 45, borderRadius: 20}}><Text style={{color: "white", textAlign: 'center', flex: 1, flexDirection: 'column', fontSize: 18, marginTop: 12, marginLeft: 10, marginBottom: 12, marginRight: 10, fontSize: 18, height: 21}}>Save</Text></TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		)
	}
}

export class ConfirmView extends Component{
	render(){
			return(
				<View style={{backgroundColor:'#dedede',position:'absolute',top:0,bottom:0,left:0,right:0,paddingTop:32}}>
				  <View style={{flexDirection:'column',flex:1,marginTop:"40%"}}>
				  	<Text style={{textAlign: "center", fontSize: 18}}>Are you sure you want to delete this contact?</Text>
					<View style={{flexDirection:"row", flex: 1, marginTop: 20}}>
						<TouchableOpacity onPress={this.props.onDelete} style={{ flex: 1, marginLeft: 10, marginRight: 5, borderColor: client.primaryColor, backgroundColor: "white", borderWidth: 1, height: 45, borderRadius: 20}}><Text style={{color: client.primaryColor, textAlign: 'center', flex: 1, flexDirection: 'column', fontSize: 18, marginTop: 12, marginLeft: 10, marginBottom: 12, marginRight: 10, fontSize: 18, height: 21}}>Delete</Text></TouchableOpacity>
          				<TouchableOpacity onPress={this.props.hideModal} style={{flex: 1, marginLeft: 5, marginRight: 10, borderColor: client.primaryColor, backgroundColor: client.primaryColor, borderWidth: 1, height: 45, borderRadius: 20}}><Text style={{color: "white", textAlign: 'center', flex: 1, flexDirection: 'column', fontSize: 18, marginTop: 12, marginLeft: 10, marginBottom: 12, marginRight: 10, fontSize: 18, height: 21}}>Cancel</Text></TouchableOpacity>
		  			</View>
				  </View>
				</View>
			  )
	}

}

export class CardView extends Component{
	render() {
		return(
			<View style={{marginTop: 10}}>
				<View style={{height: 80, backgroundColor:"#FFFFFF",borderRadius:4,flexDirection:'row'}}>
          			<Avatar user={this.props.user} client={client} size={64} style={{marginRight: 8, marginTop: 8, marginLeft: 8}} />
					<View style={{flexDirection:'column',flex:1}}>
						<Text style={{fontSize:24, fontWeight: "500", marginTop: 12}}>{this.props.firstName} {this.props.lastName}</Text>
						<Text style={{fontSize: 18 ,marginBottom:0}}>{this.props.title}, {this.props.company}</Text>
					</View>
				</View>
			</View>
		)
	}
}

export class CardListView extends Component{
	render() {
		return(
			<View style={{ backgroundColor:"#FFFFFF", borderBottomColor: "#E8E8EE", borderBottomWidth: 1}}>
				<View style={{borderRadius:4,flexDirection:'row', padding: 8}}>
          			<Avatar user={this.props.user} client={client} size={38} style={{marginRight: 8}} />
					<View style={{flexDirection:'column',flex:1}}>
						<Text style={{fontWeight:'500',flexWrap:'wrap', fontSize: 18, marginLeft: 2}}>{this.props.firstName} {this.props.lastName}</Text>
						<Text style={{flexWrap:'wrap', fontSize: 14, color: "#A8A8A8", marginLeft: 2}}>{this.props.title}, {this.props.company}</Text>
						<View style={{marginTop: 5, margin: 2}}>
							<View style={{flexDirection: "row", marginTop: 5}}><Image style={{width: 15, height: 10, marginTop: 5, marginRight: 5}} source={{uri: "https://dml2n2dpleynv.cloudfront.net/extensions/personal-leads/envelope.png"}}/><Text style={{fontSize: 14, flex: 1, marginTop: 1}}>{this.props.email}</Text></View>
							<View style={{flexDirection: "row", marginTop: 5}}><Image style={{width: 12, height: 12, marginTop: 5, marginRight: 5}} source={{uri: "https://dml2n2dpleynv.cloudfront.net/extensions/personal-leads/telephone.png"}}/><Text style={{fontSize: 14, flex: 1, marginTop: 2}}>{this.props.mobile}</Text></View>
							<View style={{flexDirection: "row", marginTop: 5}}><Image style={{width: 14, height: 12, marginTop: 5, marginRight: 5}} source={{uri: "https://dml2n2dpleynv.cloudfront.net/extensions/personal-leads/Twitter.png"}}/><Text style={{fontSize: 14, flex: 1, marginTop: 2}}>{this.props.twitter}</Text></View>
							<View style={{flexDirection: "row", marginTop: 5}}><Image style={{width: 13, height: 12, marginTop: 5, marginRight: 5}} source={{uri: "https://dml2n2dpleynv.cloudfront.net/extensions/personal-leads/Linkedin.png"}}/><Text style={{fontSize: 14, flex: 1, marginTop: 3}}>{this.props.linkedin}</Text></View>
						</View>
					</View>
				</View>
				<TouchableOpacity style={{height: 16, flex: 1, marginLeft: 200, marginRight: 18, marginTop: 13, marginBottom: 10}}  onPress={this.props.showAlert}><Text style={{fontSize: 14, textAlign: "right", color: client.primaryColor}}>Remove</Text></TouchableOpacity>
			</View>
		)
	}
}

export class CardListItem extends Component{
	render() {
		if(this.props.showExpanded){
			return(
				<TouchableOpacity onPress={this.props.showCard} style={{flex:1,marginBottom:8}}>
					<View style={{flex:1}}>
						<CardListView {...this.props} />
					</View>
				</TouchableOpacity>
			)
		}
		return(
			<TouchableOpacity onPress={this.props.showCard} style={{flex:1}}>
				<View style={{padding:8,backgroundColor:"#FFFFFF",borderBottomWidth:1,borderColor:'#dedede',flexDirection:'row'}}>
          			<Avatar user={this.props.user} client={client} size={38} style={{marginRight: 8}} />
					<View style={{flex:1}}>
						<Text style={{fontWeight:'500',flexWrap:'wrap', fontSize: 18}}>{this.props.firstName} {this.props.lastName}</Text>
						<Text style={{flexWrap:'wrap', fontSize: 14, color: "#A8A8A8"}}>{this.props.title}, {this.props.company}</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}
}


