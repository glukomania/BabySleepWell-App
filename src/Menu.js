import React, { useState } from 'react'
import { Fontisto } from '@expo/vector-icons'
import Entypo from 'react-native-vector-icons/Entypo'

import {
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  View,
  TouchableOpacity,
  Text,
  Pressable,
  Modal,
  TextInput,
} from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'

const window = Dimensions.get('window')

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: 'gray',
    padding: 20,
  },
  avatarContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flex: 1,
  },
  name: {
    position: 'absolute',
    left: 70,
    top: 20,
  },
  item: {
    fontSize: 14,
    fontWeight: '300',
    paddingTop: 5,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    paddingLeft: '20%',
    alignItems: 'left',
    backgroundColor: 'white',
    justifyContent: 'center',
    height: 50,
    fontSize: 18,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'spa  ce-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: '#BFE0DF',
    color: '#329DAA',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: '#FA8072',
    right: 0,
  },
  modalWindow: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: '20%',
    paddingLeft: '7%',
    paddingRight: '7%',
    marginTop: '70%',
    marginBottom: '90%',
    marginLeft: '7%',
    marginRight: '7%',
    fontSize: 16,
  },
  modalHeader: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    height: '5%',
    paddingTop: '5%',
  },
  input: {
    width: '80%',
    marginTop: '15%',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    fontSize: 18,
  },

  options: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingBottom: '5%',
    height: '25%',
  },
  option: {
    width: '50%',
  },
  deleteOption: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
  },
  saveOption: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
  },
  disabledDeleteButton: {
    color: 'grey',
    textAlign: 'center',
    fontSize: 18,
  },
  disabledSaveButton: {
    color: 'grey',
    textAlign: 'center',
    fontSize: 18,
  },
})

export default function Menu(props) {
  const [isRenameModal, setIsRenameModal] = useState(false)
  const [newName, setNewName] = useState(null)
  const [changingRecordingName, setChangingRecordingName] = useState(null)
  const [changingRecordingId, setChangingRecordingId] = useState(null)

  const onRowDidOpen = (rowKey) => {
    console.log('This row opened', rowKey)
  }

  const onDeletePressed = (id) => {
    props.deleteRecord(id)
  }

  const onRenamePressed = (name, id) => {
    console.log('name', name)
    setChangingRecordingName(name)
    setChangingRecordingId(id)
    props.setisModalOpen(false)
    props.setIsMenuOpen(false)
    setIsRenameModal(true)
  }

  const onSavePress = () => {
    console.log('rename', newName, changingRecordingId)
    props.updateRecord(newName, changingRecordingId)
    setIsRenameModal(false)
  }

  const onRecordPress = (item) => {
    props.setCurrentSound(item)
    props.stopPlaying(true)
  }

  const renderItem = (data) => {
    return (
      <TouchableHighlight
        onPress={() => onRecordPress(data.item)}
        style={styles.rowFront}
        underlayColor={'#AAA'}
        useNativeDriver={true}
      >
        <View>
          <Text
            style={
              props.currentSound && props.currentSound.label === data.item.label
                ? { fontSize: 16, color: '#ffa900' }
                : { fontSize: 16 }
            }
          >
            {data.item.label}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }

  const onClosePress = () => {
    setIsRenameModal(false)
  }

  const renderHiddenItem = (data, rowMap) => {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnLeft]}
          onPress={() => onRenamePressed(data.item.label, data.item.id)}
        >
          <Text style={{ color: '#329DAA' }}>Rename</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => onDeletePressed(data.item.id)}
        >
          <Text style={{ color: '#FFF' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const Separator = () => (
    <View
      style={{
        borderBottomColor: '#dddddd',
        borderBottomWidth: '1',
        marginBottom: '8%',
        marginTop: '8%',
      }}
    />
  )

  const Title = (props) => (
    <Text style={{ textAlign: 'center', fontSize: '18', fontWeight: '700', marginBottom: '5%' }}>
      {props.text}
    </Text>
  )

  const RenameModal = (changingRecordingName) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isRenameModal}
        onRequestClose={onClosePress}
      >
        <View style={styles.modalWindow}>
          <View style={styles.modalHeader}>
            <Pressable onPress={onClosePress}>
              <Entypo name="cross" size={30} color="black" />
            </Pressable>
          </View>
          <View style={{ height: '55%', alignItems: 'center' }}>
            <TextInput
              placeholder={changingRecordingName}
              onChangeText={(recordName) => setNewName(recordName)}
              value={newName}
              style={styles.input}
            ></TextInput>
          </View>
          <View style={styles.options}>
            <Pressable onPress={onClosePress} style={styles.option}>
              <Text style={newName ? styles.deleteOption : styles.disabledDeleteButton}>
                Cancel
              </Text>
            </Pressable>
            <Pressable onPress={() => newName && onSavePress()} style={styles.option}>
              <Text style={newName ? styles.saveOption : styles.disabledSaveButton}>Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <View style={{ flexDirection: 'colomn' }}>
      {RenameModal(changingRecordingName)}
      <Pressable
        onPress={props.openRecordingModal}
        style={{
          color: 'white',
          marginTop: '20%',
          marginLeft: '10%',
          marginRight: '10%',
          backgroundColor: '#ffa900',
          padding: '5%',
          borderRadius: '15%',
          flexDirection: 'row',
        }}
      >
        <Fontisto name={'mic'} size={30} style={{ color: 'white', width: '20%' }} on />
        <Text style={{ fontSize: 18, paddingTop: '2%', color: 'white' }}>Record new</Text>
      </Pressable>

      <Separator />

      <Title text="All recordings" />
      <View style={{ height: '52%', alignContent: 'flex-end' }}>
        {props && props.data && props.data.length > 0 ? (
          <SwipeListView
            useNativeDriver={true}
            closeOnRowPress={true}
            data={props.data}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            disableRightSwipe={true}
            rightOpenValue={-150}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            keyExtractor={(item) => item.id}
            onRowDidOpen={onRowDidOpen}
          />
        ) : (
          <Text style={{ textAlign: 'center' }}>no records yet</Text>
        )}
      </View>

      <View
        style={{
          marginBottom: 0,
          marginTop: 'auto',
        }}
      >
        <Separator />
        <Title text="Color scheme:" />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Pressable
            style={{
              borderRadius:
                Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
              width: 40,
              height: 40,
              backgroundColor: 'white',
              borderColor: '#FEBD3C',
              borderWidth: '2',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '10%',
            }}
            underlayColor="#ccc"
            onPress={() => props.setColorSet('light')}
          />
          <Pressable
            style={{
              borderRadius:
                Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
              width: 40,
              height: 40,
              backgroundColor: 'black',
              borderColor: 'white',
              borderWidth: '2',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            underlayColor="#ccc"
            onPress={() => props.setColorSet('dark')}
          />
        </View>
      </View>
    </View>
  )
}
