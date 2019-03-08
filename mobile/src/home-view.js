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

import React, { PureComponent } from 'react'
import {
  Alert,
  AsyncStorage,
  Modal,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Platform,
} from 'react-native'
import client, { TitleBar, useStrings, translate as t } from '@doubledutch/rn-client'
import { provideFirebaseConnectorToReactComponent } from '@doubledutch/firebase-connector'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import i18n from './i18n'
import { CardView, CardListItem, EditCardView } from './card-view'
import CodeView from './CodeView'
import ScanView from './ScanView'
import LoadingView from './LoadingView'

useStrings(i18n)

class HomeView extends PureComponent {
  // Initially, create a blank state filled out only with the current user's id
  state = {
    cards: [],
    selectedCard: null,
    showCode: false,
    showScanner: false,
    showEditor: false,
    isLoggedIn: false,
    logInFailed: false,
    searchText: '',
    sendOnScan: true,
  }

  cardsRef = () => this.props.fbc.database.private.userRef('cards')

  myCardRef = () => this.props.fbc.database.private.userRef('myCard')

  leadStorageKey = () => {
    const { currentEvent, currentUser } = this.state
    return `@DD:personal_leads_${currentEvent.id}_${currentUser.id}`
  }

  sendOnScanKey = () => `${this.leadStorageKey()}_sendOnScan`

  componentDidMount() {
    const { fbc } = this.props
    const signin = fbc.signin()
    signin.catch(err => console.log(err))

    client.getCurrentEvent().then(currentEvent => this.setState({ currentEvent }))
    client.getPrimaryColor().then(primaryColor => this.setState({ primaryColor }))
    client
      .getCurrentUser()
      .then(currentUser => {
        this.setState({
          currentUser,
          myCard: Object.assign(
            { mobile: null, linkedin: null, twitter: null, leadNotes: null },
            currentUser,
          ),
        })

        this.loadLocalCards().then(localCards => {
          // Load current user data from api, but don't overwrite any local values.
          client
            .getAttendee(currentUser.id)
            .then(data => {
              this.setState(({ myCard }) => {
                let card = myCard
                ;[
                  'firstName',
                  'lastName',
                  'title',
                  'company',
                  'email',
                  'twitter',
                  'linkedin',
                ].forEach(field => {
                  if (card[field] == null && data[field]) card = { ...card, [field]: data[field] }
                })
                return { myCard: card }
              })
            })
            .catch(err => console.log('error fetching user from api', err))

          // Load from DB only if local copy not found
          if (!localCards) {
            signin.then(() => {
              this.myCardRef().on('value', data => {
                const myCard = data.val()
                if (myCard) this.setState({ myCard })
              })
              this.cardsRef().on('value', data => {
                let cards = data.val() || []
                cards = cards.sort((a, b) => a.lastName - b.lastName)
                this.setState({ cards })
              })
            })
          }

          // Accept 2-way reciprocal scans when someone scans me.
          fbc.database.private.userMessagesRef(currentUser.id).on('child_added', data => {
            const senderId = data.key
            const messages = data.val()
            Object.values(messages || {}).forEach(card => {
              this.addCard({ ...card, id: senderId })
            })
            if (messages) data.ref.remove() // Done processing the reciprocal sharing of info. Delete message.
          })

          this.hideLogInScreen = setTimeout(() => {
            this.setState({ isLoggedIn: true })
          }, 200)

          AsyncStorage.getItem(this.sendOnScanKey()).then(val => {
            this.setState({ sendOnScan: val !== 'false' })
          })
        })
      })
      .catch(() => this.setState({ logInFailed: true }))
  }

  render() {
    const { suggestedTitle } = this.props
    const {
      cards,
      currentUser,
      currentEvent,
      isLoggedIn,
      logInFailed,
      myCard,
      primaryColor,
      searchText,
      selectedCard,
      sendOnScan,
      showCode,
      showEditor,
      showScanner,
    } = this.state
    const leads = searchText ? this.returnUpdatedList(searchText) : cards
    if (!currentUser || !currentEvent || !primaryColor) return null

    return (
      <View style={s.main}>
        <TitleBar title={suggestedTitle || t('personal_leads')} client={client} />
        {isLoggedIn ? (
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={this.editCard}>
              <CardView user={currentUser} {...myCard} />
              <View
                style={{ position: 'absolute', marginTop: 22, right: 10, backgroundColor: 'white' }}
              >
                <Text
                  style={{ color: '#888888', backgroundColor: 'white', fontSize: 14, marginTop: 2 }}
                >
                  {t('edit_info')}
                </Text>
              </View>
            </TouchableOpacity>
            <KeyboardAwareScrollView
              style={s.scroll}
              viewIsInsideTabBar
              enableAutomaticScroll
              extraScrollHeight={200}
              keyboardShouldPersistTaps="always"
            >
              <View
                style={{
                  backgroundColor: 'white',
                  height: 41,
                  borderBottomColor: '#E8E8EE',
                  borderBottomWidth: 1,
                  flex: 1,
                  flexDirection: 'row',
                }}
              >
                <Text style={{ fontSize: 18, marginLeft: 10, marginTop: 10, height: 21 }}>
                  {t('my_connections')}
                </Text>
                <View style={{ flex: 1 }} />
                {cards.length > 0 && (
                  <TouchableOpacity
                    style={{ marginRight: 18, marginLeft: 50, marginTop: 13 }}
                    onPress={this.exportCards}
                  >
                    <Text style={{ fontSize: 14, textAlign: 'right', color: primaryColor }}>
                      {t('export')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {this.renderSearch()}
              {leads.length === 0 && <Text style={s.noConnections}>{t('no_connections')}</Text>}
              {leads.map((card, index) => (
                <CardListItem
                  key={index}
                  showExpanded={index === selectedCard}
                  showCard={() => this.showCard(index)}
                  showAlert={() => this.showAlert()}
                  onUpdateNotes={notes => this.updateScannedCard(index, { ...card, notes })}
                  user={card}
                  primaryColor={primaryColor}
                  {...card}
                />
              ))}
            </KeyboardAwareScrollView>
            <View style={{ flexDirection: 'row', padding: 2, marginBottom: 20, marginTop: 20 }}>
              <TouchableOpacity
                onPress={this.showCode}
                style={{
                  flex: 1,
                  marginLeft: 10,
                  marginRight: 5,
                  borderColor: primaryColor,
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderRadius: 20,
                  height: 45,
                }}
              >
                <Text
                  style={{
                    color: primaryColor,
                    textAlign: 'center',
                    flex: 1,
                    flexDirection: 'column',
                    fontSize: 18,
                    marginTop: 10,
                    marginLeft: 10,
                    marginBottom: 10,
                    marginRight: 10,
                    height: 21,
                  }}
                >
                  {t('share')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.scanCode}
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
                    marginTop: 10,
                    marginLeft: 10,
                    marginBottom: 10,
                    marginRight: 10,
                    fontSize: 18,
                    height: 21,
                  }}
                >
                  {t('scan')}
                </Text>
              </TouchableOpacity>
            </View>
            <Modal animationType="slide" transparent visible={showCode} onRequestClose={() => {}}>
              <CodeView
                {...this.state}
                hideModal={this.hideModal}
                currentUser={currentUser}
                primaryColor={primaryColor}
              />
            </Modal>
            <Modal
              animationType="slide"
              transparent
              visible={showScanner}
              onRequestClose={() => {}}
            >
              <ScanView
                {...this.state}
                addCard={this.addCard}
                color={primaryColor}
                hideModal={this.hideModal}
                sendOnScan={sendOnScan}
                setSendOnScan={this.setSendOnScan}
              />
            </Modal>
            <Modal animationType="slide" transparent visible={showEditor} onRequestClose={() => {}}>
              <TitleBar title={t('personal_leads')} client={client} />
              <EditCardView
                {...myCard}
                updateCard={this.updateCard}
                hideModal={this.hideModal}
                primaryColor={primaryColor}
              />
            </Modal>
          </View>
        ) : (
          <LoadingView logInFailed={logInFailed} />
        )}
      </View>
    )
  }

  renderSearch = () => {
    const { inputHeight, searchText } = this.state
    const newStyle = {
      flex: 1,
      fontSize: 18,
      color: '#364247',
      textAlignVertical: 'top',
      maxHeight: 100,
      height: Math.max(35, inputHeight),
      paddingTop: 0,
    }

    const platformStyle = Platform.select({
      ios: {
        marginTop: 3,
      },
      android: {
        paddingLeft: 0,
        marginTop: 5,
        marginBottom: 5,
      },
    })
    return (
      <View style={s.searchBox}>
        {searchText ? (
          <View style={s.fixedMargin} />
        ) : (
          <TouchableOpacity style={s.circleBoxMargin}>
            <Text style={s.whiteText}>?</Text>
          </TouchableOpacity>
        )}
        <TextInput
          style={[newStyle, platformStyle]}
          placeholder={t('search')}
          value={searchText}
          onChangeText={searchText => this.setState({ searchText })}
          maxLength={25}
          placeholderTextColor="#9B9B9B"
        />
        {searchText ? (
          <TouchableOpacity style={s.circleBoxMargin} onPress={this.resetSearch}>
            <Text style={s.whiteText}>X</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    )
  }

  returnUpdatedList = search => {
    const { cards } = this.state
    const queryResult = []
    cards.forEach(lead => {
      const name = `${lead.firstName} ${lead.lastName}`
      if (name) {
        if (name.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
          queryResult.push(lead)
        }
      }
    })
    return queryResult
  }

  resetSearch = () => {
    this.setState({ lead: '' })
  }

  showAlert = () => {
    const { cards, selectedCard } = this.state
    const currentCard = cards[selectedCard]
    const name = `${currentCard.firstName} ${currentCard.lastName}`
    const alertText = t('alert', { name })
    Alert.alert(
      t('confirm'),
      alertText,
      [{ text: t('cancel'), style: 'cancel' }, { text: t('OK'), onPress: this.deleteCard }],
      { cancelable: false },
    )
  }

  loadLocalCards() {
    return AsyncStorage.getItem(this.leadStorageKey()).then(value => {
      if (value) {
        try {
          const { myCard, cards } = JSON.parse(value)
          this.setState({ myCard, cards })
          return { myCard, cards }
        } catch (e) { /* Bad JSON data stored */ }
      }
      return null
    })
  }

  saveLocalCards({ myCard, cards }) {
    return AsyncStorage.setItem(this.leadStorageKey(), JSON.stringify({ myCard, cards }))
  }

  showCode = () => this.setState({ showCode: true })

  scanCode = () => this.setState({ showScanner: true })

  setSendOnScan = sendOnScan => {
    this.setState({ sendOnScan })
    AsyncStorage.setItem(this.sendOnScanKey(), sendOnScan ? 'true' : 'false')
  }

  exportCards = () => {
    const { cards } = this.state
    const message = cards
      .map(card => {
        let data = `${card.firstName} ${card.lastName}\n`
        if (card.title) data += `${card.title}\n`
        if (card.company) data += `${card.company}\n`
        if (card.mobile) data += `mobile: ${card.mobile}\n`
        if (card.email) data += `email : ${card.email}\n`
        if (card.linkedin) data += `linkedin : ${card.linkedin}\n`
        if (card.twitter) data += `twitter : ${card.twitter}\n`
        if (card.notes) data += `notes : ${card.notes}\n`
        return data
      })
      .join('\n\n')
    Share.share({ message, title: 'Exported Cards', subject: 'Exported Cards' }, {})
  }

  showCard(index) {
    const { selectedCard } = this.state
    if (selectedCard === index) {
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

  updateCard = myCard => {
    const { cards } = this.state
    this.myCardRef().set(myCard)
    this.setState({ myCard, showEditor: false })
    this.saveLocalCards({ myCard, cards })
  }

  addCard = newCard => {
    const { fbc } = this.props
    const { cards, currentUser, myCard, sendOnScan } = this.state
    const isNew = !cards.find(card => card.id === newCard.id)
    if (newCard.firstName && newCard.lastName && isNew) {
      const newCards = [...cards, newCard]
      this.cardsRef().set(newCards)
      this.saveLocalCards({ myCard, cards: newCards })
      this.setState({ cards: newCards, showScanner: false })

      if (sendOnScan) {
        fbc.database.private.userMessagesRef(newCard.id, currentUser.id).push(myCard)
      }
    } else {
      Alert.alert(t('error'), t('newScan'), [{ text: 'OK' }], {
        cancelable: false,
      })
    }
  }

  updateScannedCard = (index, updatedCard) => {
    const { cards, myCard } = this.state
    const newCards = [...cards.slice(0, index), updatedCard, ...cards.slice(index + 1)]
    this.cardsRef().set(newCards)
    this.saveLocalCards({ myCard, cards: newCards })
    this.setState({ cards: newCards, showScanner: false })
  }

  deleteCard = () => {
    const { cards, myCard, selectedCard } = this.state
    const newCards = cards.filter((_, i) => i !== selectedCard)
    this.cardsRef().set(newCards)
    this.setState({ cards: newCards })
    this.saveLocalCards({ myCard, cards: newCards })
    this.hideModal()
  }
}

export default provideFirebaseConnectorToReactComponent(
  client,
  'personalleads',
  (props, fbc) => <HomeView {...props} fbc={fbc} />,
  PureComponent,
)

const s = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#dedede',
  },
  fixedMargin: {
    width: 40,
  },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#b7b7b7',
    borderBottomWidth: 1,
    borderRadius: 5,
    height: 40,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#dedede',
    paddingTop: 20,
    flexDirection: 'column',
  },
  noConnections: {
    color: '#aaa',
    margin: 10,
  },
  circleBoxMargin: {
    marginTop: 10,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 20,
    justifyContent: 'center',
    backgroundColor: '#9B9B9B',
    paddingLeft: 8,
    paddingRight: 8,
    height: 22,
    borderRadius: 50,
  },
  whiteText: {
    fontSize: 18,
    color: 'white',
  },
})
