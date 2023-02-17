import React, { useState, useEffect, useCallback, useRef } from 'react'
import { StyleSheet, Text, View, TouchableHighlight, Modal, TextInput } from 'react-native'

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

  return (
    <View>
      <Text>{'test'}</Text>
    </View>
  )
}

export default Home
