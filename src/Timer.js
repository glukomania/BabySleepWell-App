import React, { useState, useEffect } from 'react'
import { Text } from 'react-native'
import moment from 'moment'

export const Timer = (props) => {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (props.isPlay) {
      const interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [props.isPlay])

  useEffect(() => {
    setSeconds(0)
  }, [props.currentSound])

  return (
    <Text
      style={{
        marginTop: '10%',
        color: props.colorScheme.note,
      }}
    >
      {moment.utc(seconds * 1000).format('HH:mm:ss')}
    </Text>
  )
}

export default Timer
