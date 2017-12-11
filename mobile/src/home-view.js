import React, { Component } from 'react'
import ReactNative, {
  AsyncStorage, Modal, Platform, ScrollView, Share, Text, TouchableOpacity, View
} from 'react-native'

import client, { Avatar, TitleBar } from '@doubledutch/rn-client'

import { LabeledTextInput, FlatButton } from './dd-ui'
import { CardView, CardListItem, EditCardView } from './card-view'
import { ScanView, CodeView } from './scan-view'

import FirebaseConnector from '@doubledutch/firebase-connector'
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
      myCard: Object.assign({mobile: null, linkedin: null, twitter: null}, currentUser),
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
      <View style={s.main}>
        <TitleBar title="Personal Leads" client={client} />
        <TouchableOpacity onPress={this.editCard.bind(this)}>
          <CardView user={client.currentUser} {...this.state.myCard} />
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
              onDelete={() => this.deleteCard(index)}
              showExpanded={index == this.state.selectedCard}
              showCard={() => this.showCard(index)}
              user={card}
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
          <CodeView {...this.state} hideModal={this.hideModal} />
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

  deleteCard(index) {
    const cards = this.state.cards.filter((_, i) => i !== index)
    cardsRef.set(cards)
    this.setState({cards})
    this.saveLocalCards({myCard: this.state.myCard, cards})
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
    padding: 10
  }
})

export default HomeView
