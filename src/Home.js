import React, { useState, useEffect, useCallback, useRef } from 'react'
import { StyleSheet, Text, View, TouchableHighlight, Modal, TextInput } from 'react-native'
import { Audio } from 'expo-av'
import { StatusBar } from 'expo-status-bar'
import { Fontisto, Octicons } from '@expo/vector-icons'
import Record from './Record'
import Timer from './Timer'
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable'
import SideMenu from 'react-native-side-menu'
import Menu from './Menu'

const colors = {
  light: {
    basicBackground: '#F5E8D5',
    playButtonFrame: '#FEBD3D',
    textColor: '#09284D',
    frame: 'grey',
    iconColor: '#09284D',
    recordButtonBackground: '#f7e1c1',
    note: 'grey',
    seected: '#FEBD3D',
    topBar: '#333333', //dark-grey
    playIconColor: '#A44200', //'#3B1518',
  },
  dark: {
    basicBackground: '#111111',
    playButtonFrame: '#FEBD3D',
    textColor: 'white',
    frame: 'grey',
    iconColor: 'white',
    recordButtonBackground: '#333333',
    note: 'grey',
    seected: '#FEBD3D',
    topBar: '#333333',
    playIconColor: 'white',
  },
}

export const Home = (props) => {
  const [colorScheme, setColorScheme] = useState(colors.dark)
  const [colorSet, setColorSet] = useState('dark')

  useEffect(() => {
    colorSet === 'light' ? setColorScheme(colors.light) : setColorScheme(colors.dark)
  }, [colorSet])

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme.basicBackground,
      alignItems: 'center',
      width: '100%',
      flexDirection: 'column',
      fontSize: 18,
    },
    icon: {
      color: colorScheme.playIconColor,
    },
    button: {
      width: 200,
      height: 200,
      borderColor: colorScheme.playButtonFrame,
      borderWidth: 4,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      borderRadius: 50,
    },
    innerContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    menu: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingBottom: '30%',
      marginTop: '10%',
    },
    menuIconContainer: {
      color: colorScheme.textColor,
      width: '10%',
    },
    menuIcon: { color: colorScheme.note },
  })

  const [isPlaying, setIsPlaying] = useState(false)
  const [isModalOpen, setisModalOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentSound, setCurrentSound] = useState(placeholder)

  const placeholder = {
    label: 'Default white noise',
    value: 'Default white noise',
  }

  const AudioPlayer = useRef(new Audio.Sound())

  const handlePlayPause = async () => {
    if (isPlaying) {
      stopPlaying()
    } else {
      startPlaying()
    }

    setIsPlaying(!isPlaying)
  }

  const startPlaying = useCallback(async () => {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      staysActiveInBackground: true,
      playThroughEarpieceAndroid: true,
      valume: 1,
    })
    try {
      if (
        currentSound &&
        currentSound.path &&
        currentSound.path !== '' &&
        currentSound.path !== undefined
      ) {
        await AudioPlayer.current.loadAsync({ uri: currentSound.path }, {}, true)
      } else {
        await AudioPlayer.current.loadAsync(require('../assets/noise.mp3'))
      }
      const playerStatus = await AudioPlayer.current.getStatusAsync()

      if (playerStatus.isLoaded) {
        AudioPlayer.current.setVolumeAsync(1)
        AudioPlayer.current.playAsync()
        AudioPlayer.current.setIsLoopingAsync(1000)
        setIsPlaying(true)
      } else {
        console.log('recording is not loaded')
      }
    } catch (error) {
      console.log('Error while playing: ', error)
    }
  }, [currentSound])

  const stopPlaying = async () => {
    try {
      //Get Player Status
      const playerStatus = await AudioPlayer.current.getStatusAsync()
      // If song is playing then stop it
      if (playerStatus.isLoaded === true) {
        AudioPlayer.current.pauseAsync()
        await AudioPlayer.current.unloadAsync()
      }

      setIsPlaying(false)
    } catch (error) {}
  }

  const init = useCallback(async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: true,
        allowsRecordingIOS: false,
        valume: 1,
      })
    } catch (error) {
      console.log('init error', error)
    }
  }, [props.data])

  const openRecordingModal = () => {
    if (isPlaying) {
      stopPlaying()
    }
    setisModalOpen(!isModalOpen)
    setIsMenuOpen(false)
  }

  const TopBar = () => {
    return (
      <View
        style={{
          backgroundColor: colorScheme.topBar,
          marginTop: '0%',
          width: '100%',
          height: '6%',
        }}
      ></View>
    )
  }

  const Header = () => {
    return (
      <View
        style={{
          width: '90%',
          paddingLeft: '10%',
        }}
      >
        <Text style={{ color: colorScheme.note }}>What is playing:</Text>
        <Text style={{ fontSize: 20, color: colorScheme.textColor, marginTop: '3%' }}>
          {currentSound ? currentSound.label : 'Default white noise '}
        </Text>
      </View>
    )
  }

  useEffect(() => {
    console.log('==== Home is started ==== ')
    init()
    return () => {
      AudioPlayer.current.getStatusAsync()
    }
  }, [])

  useEffect(() => {
    init()
  }, [props.data])

  return (
    <SideMenu
      menu={
        <Menu
          data={props.data}
          openRecordingModal={openRecordingModal}
          deleteRecord={props.deleteRecord}
          updateRecord={props.updateRecord}
          setisModalOpen={setisModalOpen}
          setIsMenuOpen={setIsMenuOpen}
          setCurrentSound={setCurrentSound}
          stopPlaying={stopPlaying}
          currentSound={currentSound}
          setColorSet={setColorSet}
          colorScheme={colorScheme}
        />
      }
      isOpen={isMenuOpen}
      menuPosition={'right'}
      onChange={(isOpen) => setIsMenuOpen(isOpen)}
    >
      <View style={styles.container}>
        <TopBar />
        {isModalOpen && (
          <Record
            newRecord={props.newRecord}
            visible={isModalOpen}
            setisModalOpen={setisModalOpen}
          />
        )}

        <View style={styles.menu}>
          <Header />

          <Pressable
            onPress={() => {
              setIsMenuOpen(!isMenuOpen)
            }}
            style={styles.menuIconContainer}
          >
            <Octicons name={'triangle-right'} size={40} style={styles.menuIcon} on />
          </Pressable>
        </View>
        <StatusBar style="light" />

        <TouchableHighlight
          onPress={handlePlayPause}
          underlayColor={colorScheme.recordButtonBackground}
          style={styles.button}
        >
          <View style={styles.innerContainer}>
            <Fontisto name={!isPlaying ? 'play' : 'pause'} size={60} style={styles.icon} on />
          </View>
        </TouchableHighlight>

        <Timer isPlay={isPlaying} currentSound={currentSound} colorScheme={colorScheme} />
      </View>
    </SideMenu>
  )
}

export default Home
