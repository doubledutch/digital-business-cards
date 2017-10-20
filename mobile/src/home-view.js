import React, { Component } from 'react'
import ReactNative, {
  AsyncStorage, Modal, Platform, ScrollView, Share, Text, TouchableOpacity, View
} from 'react-native'

import client, { Avatar, TitleBar } from '@doubledutch/rn-client'
const eventId = client.currentEvent.id
const userId = client.currentUser.id

import { LabeledTextInput, FlatButton } from './dd-ui'
import { CardView, CardListItem, EditCardView } from './card-view'
import { ScanView, CodeView } from './scan-view'

class HomeView extends Component {
  constructor() {
    super()

    // Initially, create a blank state filled out only with the current users id
    this.state = {
      myCard: {
        name: null,
        title: null,
        company: null,
        email: null,
        mobile: null,
        id: userId,
        twitter: null,
        linkedin: null
      },
      cards: [],
      selectedCard: null,
      showCode: false,
      showScanner: false,
      showEditor: false
    }

    this.loadState().then(() => {
      // Then pick data from the user profile
      var data = client.currentUser
      var card = this.state.myCard
      if (card.name == null) card = {...card, name: data.firstName + ' ' + data.lastName }
      if (card.title == null) card = {...card, title: data.title }
      if (card.company == null) card = {...card, company: data.company }
      this.setState({ myCard: card }, () => {
        // Finally, load data from api
        client.api.getUser(userId).then(data => {
          var card = this.state.myCard
          if (card.name == null) card = {...card, name: data.firstName + " " + data.lastName }
          if (card.title == null) card = {...card, title: data.title }
          if (card.company == null) card = {...card, company: data.company }
          if (card.email == null) card = {...card, email: data.email }
          if (card.twitter == null) card = {...card, twitter: data.twitter }
          if (card.linkedin == null) card = {...card, linkedin: data.linkedins }
          this.setState({ myCard: card })// ,cards:[card]}))
        })
      })
    })
  }

  componentWillMount() {
  }

  render() {

    return (
      <View style={s.main}>
        <TitleBar title="Personal Leads" client={client} />
        <TouchableOpacity onPress={this.editCard.bind(this)}>
          <CardView ddapi={client.api} user={client.currentUser} {...this.state.myCard} />
          <View style={{ position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.05)', paddingTop: 2, paddingBottom: 2, paddingLeft: 8, paddingRight: 8, borderRadius: 8 }}>
            <Text style={{ color: '#888888', backgroundColor: 'rgba(0,0,0,0)' }}>tap to edit</Text>
          </View>
        </TouchableOpacity> 
        <View style={{ flexDirection: 'row', margin: 8 }}>
          <FlatButton onPress={this.showCode} title='Share Card' style={{ marginRight: 4, backgroundColor: client.primaryColor, color: '#FFFFFF' }} />
          <FlatButton onPress={this.scanCode} title='Scan Card' style={{ marginLeft: 4, backgroundColor: client.secondaryColor, color: '#FFFFFF' }} />
        </View>
        <ScrollView style={s.scroll}>
          {this.state.cards.map((card, index) => 
            <CardListItem
              ddapi={client.api}
              onDelete={() => this.deleteCard(index)}
              showExpanded={index == this.state.selectedCard}
              showCard={() => this.showCard(index)}
              user={{id: card.id}}
              {...card} />
          )}
        </ScrollView>
        {this.state.cards.length > 0 &&
          <FlatButton onPress={this.exportCards} title='Export Cards' style={{ marginLeft: 64, marginRight: 64, marginBottom: 8, flex: 0 }} />
        }
        <Modal
            animationType={"slide"}
            transparent={true}
            visible={this.state.showCode}
            onRequestClose={() => { }}>
          <CodeView ddapi={client.api} {...this.state} hideModal={this.hideModal} />
        </Modal>
        <Modal
            animationType={"slide"}
            transparent={true}
            visible={this.state.showScanner}
            onRequestClose={() => { }}>
          <ScanView {...this.state} addCard={this.addCard} hideModal={this.hideModal} />
        </Modal>
        <Modal
            animationType={"slide"}
            transparent={true}
            visible={this.state.showEditor}
            onRequestClose={() => { }}>
          <EditCardView {...this.state.myCard} updateCard={this.updateCard} hideModal={this.hideModal} />
        </Modal>
      </View>
    )
  }

  loadState() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(leadStorageKey()).then((value) => {
        if (value !== null) {
          this.setState(Object.assign({}, this.state, JSON.parse(value), { showCode: false, showScanner: false, showEditor: false }), () => {
            resolve()
          })
        } else {
          resolve()
        }
      })
    })
  }

  saveState() {
    AsyncStorage.setItem(leadStorageKey(), JSON.stringify(this.state))
  }

  showCode = () => {
    this.setState({ showCode: true })
  }

  scanCode = () => {
    this.setState({ showScanner: true })
  }

  exportCards = () => {
    var data = this.state.cards.map(card => {
      let data = card.name + "\n"
      if (card.title != null && card.title != "") data += card.title + "\n"
      if (card.company != null && card.company != "") data += card.company + "\n"
      if (card.mobile != null && card.mobile != "") data += "mobile: " + card.mobile + "\n"
      if (card.email != null && card.email != "") data += "email : " + card.email + "\n"
      if (card.linkedin != null && card.linkedin != "") data += "linkedin : " + card.linkedin + "\n"
      if (card.twitter != null && card.twitter != "") data += "twitter : " + card.twitter + "\n"
      return data
    }).join('\n\n')
    Share.share({ message: data, title: 'Exported Cards' }, {})
  }

  addCard = (newCard) => {
    var cards = [...this.state.cards, newCard]
    this.setState({ cards, showScanner: false }, () => { this.saveState() })
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

  updateCard = (card) => {
    this.setState({ showEditor: false, myCard: card }, () => { this.saveState() })
  }

  deleteCard(index) {
    const cards = this.state.cards.filter((_, i) => i !== index)
    this.setState({ cards }, () => { this.saveState() })
  }
}

function leadStorageKey() { return `@DD:personal_leads_${eventId}_${userId}` }

const s = ReactNative.StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#dedede'
  },
  scroll: {
    flex: 1,
    backgroundColor: '#dedede',
    padding: 10
  }
})

export default HomeView
