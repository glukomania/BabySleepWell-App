import { StyleSheet, Text, View, Modal, TextInput, Pressable } from 'react-native'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import { Audio } from 'expo-av'

export const Record = (props) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordPath, setRecordPath] = useState(null)
  const [time, setTime] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [name, setName] = useState()
  const [warning, setWarning] = useState(false)

  const AudioRecorder = useRef(new Audio.Recording())

  const handleRecordPress = useCallback(() => {
    !recordPath && setIsRecording(!isRecording)
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, recordPath, setIsRecording])

  const handleDelete = useCallback(() => {
    props.setisModalOpen(false)
  }, [props.setisModalOpen])

  const handleSave = useCallback(async () => {
    if (name) {
      props.newRecord(name, recordPath, '')

      props.setisModalOpen(false)
    } else {
      setWarning(true)
    }
  }, [recordPath, name, props.newRecord, props.setisModalOpen])

  async function startRecording() {
    console.log('tap start')
    try {
      // Check if user has given the permission to record
      console.log('get permissions')

      const getAudioPerm = await Audio.requestPermissionsAsync()
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      if (getAudioPerm.granted === true) {
        console.log('permissions are ok')
        try {
          // Prepare the Audio Recorder
          console.log('Starting recording.')

          await AudioRecorder.current.prepareToRecordAsync(
            Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
          )

          // Start recording
          await AudioRecorder.current.startAsync()
          setIsRecording(true)
          console.log('Recording has started.')
        } catch (error) {
          console.log(error)
        }
      } else {
        // If user has not given the permission to record, then ask for permission
        getPermission()
      }
    } catch (error) {
      console.log('error start: ', error)
    }
  }

  async function stopRecording() {
    try {
      await AudioRecorder.current.stopAndUnloadAsync()

      // Get the recorded URI here
      const result = AudioRecorder.current.getURI()
      if (result) setRecordPath(result)

      // Reset the Audio Recorder
      AudioRecorder.current = new Audio.Recording()
      setIsRecording(false)
    } catch (error) {
      console.log('stop error: ', error)
    }
  }

  const closeModal = useCallback(() => {
    isRecording && stopRecording()
    props.setisModalOpen(false)
  }, [props.setisModalOpen, isRecording])

  const ModalHeader = () => {
    return (
      <View style={styles.modalHeader}>
        <Pressable
          onPress={() => {
            isRecording && stopRecording()
            props.setisModalOpen(false)
          }}
        >
          <Entypo name="cross" size={30} color="black" />
        </Pressable>
      </View>
    )
  }

  const Tip = () => {
    return (
      !recordPath && (
        <View style={styles.tip}>
          <Text>
            You can record here your child's favorite sounds or a lullaby performed by you, which
            your child likes to listen to many times in a row.
          </Text>
        </View>
      )
    )
  }

  const RecordIcon = () => {
    return (
      !recordPath && (
        <Pressable onPress={handleRecordPress}>
          {isRecording ? (
            <FontAwesomeIcon name="circle" size={60} color="#D0312D" style={styles.playPauseIcon} />
          ) : (
            <FontAwesomeIcon
              name="microphone"
              size={60}
              color="black"
              style={styles.playPauseIcon}
            />
          )}
        </Pressable>
      )
    )
  }

  const Options = () => {
    return (
      recordPath && (
        <View style={styles.options}>
          <Pressable onPress={recordPath && handleDelete} style={styles.option}>
            <Text style={recordPath ? styles.deleteOption : styles.disabledDeleteButton}>
              Delete
            </Text>
          </Pressable>
          <Pressable onPress={handleSave} style={styles.option}>
            <Text style={recordPath ? styles.saveOption : styles.disabledSaveButton}>Save</Text>
          </Pressable>
        </View>
      )
    )
  }

  useEffect(() => {
    if (seconds >= 600) {
      stopRecording()
    }
  }, [seconds])

  useEffect(() => {
    const interval = isRecording && setInterval(() => setTime(time + 1), 1000)
    if (!isRecording) {
      clearInterval(interval)
      setTime(0)
    }
    return () => clearInterval(interval)
  }, [isRecording, time])

  useEffect(() => {
    setMinutes(Math.trunc(time / 60))
    const sec = time - Math.trunc(time / 60) * 60
    setSeconds(sec < 10 ? '0' + sec : sec)
  }, [time])

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.isModalOpen}
      onRequestClose={closeModal}
    >
      <Pressable style={styles.modalContainer} onPress={closeModal}>
        <View style={styles.modalWindow}>
          <ModalHeader />
          <Tip />

          <View style={styles.bodyContainer}>
            <RecordIcon />

            {isRecording && <Text style={styles.timer}>{minutes + ':' + seconds}</Text>}
            {recordPath && <Text style={styles.timer}>The title of your recording:</Text>}
            {recordPath && (
              <TextInput
                placeholder="Name"
                onChangeText={(recordName) => setName(recordName)}
                value={name}
                style={styles.input}
              />
            )}
          </View>
          <Options />
          {warning && (
            <View>
              <Text style={styles.warning}>enter the name</Text>
            </View>
          )}
        </View>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalWindow: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: '20%',
    paddingLeft: '7%',
    paddingRight: '7%',
    marginTop: '45%',
    marginBottom: '60%',
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
    paddingBottom: '10%',
    height: '20%',
  },
  timer: {
    color: '#D0312D',
    paddingTop: '3%',
    fontSize: 18,
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
  option: {
    width: '50%',
  },
  modalContainer: { backgroundColor: '#00000050', height: '100%', width: '100%' },
  tip: {
    height: '33%',
    width: '100%',
    backgroundColor: '#eeeeee',
    padding: '5%',
    borderRadius: '15%',
  },
  bodyContainer: {
    alignItems: 'center',
    height: '53%',
  },
  playPauseIcon: { paddingTop: '10%' },
  warning: { textAlign: 'center', paddingBottom: '5%', marginTop: '-11%' },
})

export default Record
