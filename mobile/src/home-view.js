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
import ReactNative, { AsyncStorage, Modal, Platform, ScrollView, Share, Text, TouchableOpacity, View, Alert, KeyboardAvoidingView, TextInput } from 'react-native'
import client, { Avatar, TitleBar } from '@doubledutch/rn-client'
import { LabeledTextInput, FlatButton } from './dd-ui'
import { CardView, CardListItem, EditCardView } from './card-view'
import { ScanView, CodeView } from './scan-view'
import FirebaseConnector from '@doubledutch/firebase-connector'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
const fbc = FirebaseConnector(client, 'personalleads')
fbc.initializeAppWithSimpleBackend()

const { currentEvent, currentUser } = client

const cardsRef = fbc.database.private.userRef('cards')
const myCardRef = fbc.database.private.userRef('myCard')

class HomeView extends Component {
  constructor() {
    super()

    // Initially, create a blank state filled out only with the current user's id
    this.state = {
      myCard: Object.assign({mobile: null, linkedin: null, twitter: null, leadNotes: null}, currentUser),
      cards: [],
      selectedCard: null,
      showCode: false,
      showScanner: false,
      showEditor: false
    }
  }

  componentDidMount() {
    fbc.signin().catch(err => console.log(err))
    
    this.loadLocalCards()
    .then(localCards => {
      // Load current user data from api, but don't overwrite any local values.
      client.getUser(currentUser.id).then(data => {
        var card = this.state.myCard;
        ['firstName', 'lastName', 'title', 'company', 'email', 'twitter', 'linkedin'].forEach(field => {
          if (card[field] == null && data[field]) card = {...card, [field]: data[field]}
        })
        this.setState({ myCard: card })
      })
      .catch(err => console.log('error fetching user from api', err))

      // Load from DB only if local copy not found
      if (!localCards) {
        myCardRef.on('value', data => {
          const myCard = data.val()
          myCard && this.setState({ myCard: data.val() })
        })
        cardsRef.on('value', data => {
          const cards = data.val()
          cards && this.setState({ cards: data.val() })
        })
      }
    })
  }

 

  render() {
    return (
      <View style={s.main} >
        <TitleBar title="Personal Leads" client={client} />
        <TouchableOpacity onPress={this.editCard.bind(this)}>
          <CardView user={client.currentUser} {...this.state.myCard} />
          <View style={{ position: 'absolute', marginTop: 22, right: 10, backgroundColor: 'white'}}>
            <Text style={{ color: '#888888', backgroundColor: 'white', fontSize: 14, marginTop: 8}}>Edit Info</Text>
          </View>
        </TouchableOpacity>
       
        <KeyboardAwareScrollView style={s.scroll} viewIsInsideTabBar={true} enableAutomaticScroll={true} extraScrollHeight={200} keyboardShouldPersistTaps={'always'}>
        <View style={{backgroundColor: 'white', height: 41, borderBottomColor: '#E8E8EE', borderBottomWidth: 1, flex: 1, flexDirection: 'row'}}>
          <Text style={{fontSize: 18, marginLeft: 10, marginTop: 10, height: 21}}>My Connections</Text>
          {this.state.cards.length > 0 &&
            <TouchableOpacity style={{height: 16, flex: 1, marginRight: 18, marginLeft: 50, marginTop: 13}}  onPress={this.exportCards}><Text style={{fontSize: 14, textAlign: "right", color: client.primaryColor}}>Export All</Text></TouchableOpacity>
          }
        </View>
          { this.state.cards.length === 0 && <Text style={s.noConnections}>No connections scanned yet.</Text> }
          {this.state.cards.map((card, index) =>
            <CardListItem
              showExpanded={index == this.state.selectedCard}
              showCard={() => this.showCard(index)}
              showAlert = {() => this.showAlert()}
              onUpdateNotes={(notes) => this.updateScannedCard(index, {...card, notes})}
              user={card}
              {...card} />
          )}
        </KeyboardAwareScrollView>
        <View style={{ flexDirection: 'row', padding: 2, marginBottom: 20, marginTop: 20}}>
          <TouchableOpacity onPress={this.showCode} style={{flex: 1, marginLeft: 10, marginRight: 5, borderColor: client.primaryColor, backgroundColor: "white", borderWidth: 1, borderRadius: 20, height: 45}}><Text style={{color: client.primaryColor, textAlign: 'center', flex: 1, flexDirection: 'column', fontSize: 18, marginTop: 10, marginLeft: 10, marginBottom: 10, marginRight: 10, fontSize: 18, height: 21}}>Share My Info</Text></TouchableOpacity>
          <TouchableOpacity onPress={this.scanCode} style={{ flex: 1, marginLeft: 5, marginRight: 10, borderColor: client.primaryColor, backgroundColor: client.primaryColor, borderWidth: 1, height: 45, borderRadius: 20}}><Text style={{color: "white", textAlign: 'center', flex: 1, flexDirection: 'column', fontSize: 18, marginTop: 10, marginLeft: 10, marginBottom: 10, marginRight: 10, fontSize: 18, height: 21}}>Scan Info</Text></TouchableOpacity>
        </View>
        <Modal
            animationType={"slide"}
            transparent={true}
            visible={this.state.showCode}
            onRequestClose={() => { }}>
          <CodeView {...this.state} hideModal={this.hideModal} />
        </Modal>
        <Modal
            animationType={"slide"}
            transparent={true}
            visible={this.state.showScanner}
            onRequestClose={() => { }}>
          <ScanView {...this.state} addCard={this.addCard} hideModal={this.hideModal} color={client.primaryColor}/>
        </Modal>
        <Modal
            animationType={"slide"}
            transparent={true}
            visible={this.state.showEditor}
            onRequestClose={() => { }}>
          <TitleBar title="Personal Leads" client={client} />
          <EditCardView {...this.state.myCard} updateCard={this.updateCard} hideModal={this.hideModal} />
        </Modal>
      </View>
    )
  }
 
 
    showAlert = () => {
      const currentCard = this.state.cards[this.state.selectedCard]
      const alertText = 'Are you sure you want to remove ' + currentCard.firstName + " " + currentCard.lastName + " from your connections?"
       Alert.alert(
        'Confirm',
        alertText,
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'OK', onPress: () => this.deleteCard ('OK Pressed')},
        ],
        { cancelable: false }
       )
    }
  

  loadLocalCards() {
    return AsyncStorage.getItem(leadStorageKey())
    .then(value => {
      if (value) {
        const parsed = JSON.parse(value)
        this.setState(parsed)
        return parsed
      }
      return null
    })
  }

  saveLocalCards({myCard, cards}) {
    return AsyncStorage.setItem(leadStorageKey(), JSON.stringify({myCard, cards}))
  }

  showCode = () => this.setState({ showCode: true })

  scanCode = () => this.setState({showScanner: true})

  exportCards = () => {
    var data = this.state.cards.map(card => {
      let data = card.firstName + ' ' + card.lastName + "\n"
      if (card.title) data += card.title + "\n"
      if (card.company) data += card.company + "\n"
      if (card.mobile) data += "mobile: " + card.mobile + "\n"
      if (card.email) data += "email : " + card.email + "\n"
      if (card.linkedin) data += "linkedin : " + card.linkedin + "\n"
      if (card.twitter) data += "twitter : " + card.twitter + "\n"
      if (card.notes) data += "notes : " + card.notes + "\n"
      return data
    }).join('\n\n')
    Share.share({ message: data, title: 'Exported Cards' }, {})
  }

  showCard(index) {
    if (this.state.selectedCard == index) {
      this.setState({ selectedCard: null })
    } else {
      this.setState({ selectedCard: index })
    }
  }

  hideModal = () => {
    this.setState({ showCode: false, showScanner: false, showEditor: false })
  }

  editCard = () => {
    this.setState({ showEditor: true })
  }

  updateCard = (myCard) => {
    myCardRef.set(myCard)
    this.setState({ myCard, showEditor: false })
    this.saveLocalCards({myCard, cards: this.state.cards})
  }

  addCard = (newCard) => {
    var cards = [...this.state.cards, newCard]
    cardsRef.set(cards)
    this.saveLocalCards({myCard: this.state.myCard, cards})
    this.setState({cards, showScanner: false})
  }

  updateScannedCard = (index, updatedCard) => {
    var cards = [...this.state.cards.slice(0, index), updatedCard, ...this.state.cards.slice(index + 1)]
    cardsRef.set(cards)
    this.saveLocalCards({myCard: this.state.myCard, cards})
    this.setState({cards, showScanner: false})    
  }


  onUpdateLead = (card) => {
    cardsRef.set(cards)
    this.saveLocalCards({myCard: this.state.myCard, cards})
  }

  

  deleteCard = () => {
    const cards = this.state.cards.filter((_, i) => i !== this.state.selectedCard)
    cardsRef.set(cards)
    this.setState({cards})
    this.saveLocalCards({myCard: this.state.myCard, cards})
    this.hideModal()
  }
}

function leadStorageKey() { return `@DD:personal_leads_${currentEvent.id}_${currentUser.id}` }

const s = ReactNative.StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#dedede'
  },
  scroll: {
    flex: 1,
    backgroundColor: '#dedede',
    paddingTop: 20,
    flexDirection: 'column'
  },
  noConnections: {
    color: '#aaa',
    margin: 10
  }
})

export default HomeView
