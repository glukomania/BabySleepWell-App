import React, { useEffect, useState } from 'react'
import { Home } from './src/Home.js'
import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('db.testDb') // returns Database object

export default function App() {
  const [data, setData] = useState(null)
  // db.transaction((tx) => {
  //   tx.executeSql('DROP TABLE recordlist')
  // })

  // Check if the items table exists if not create it
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS recordlist (id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT, label TEXT, path TEXT)',
    )
  })

  // event handler for new item creation
  const newRecord = (name, path) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO recordlist (value, label, path) values (?, ?, ?)',
        [name, name, path],
        (txObj, resultSet) =>
          setData(
            data.concat({
              id: resultSet.insertId,
              value: name,
              label: name,
              path: path,
            }),
          ),
        (txObj, error) => console.log('Error', error),
      )
    })
  }

  const fetchData = () => {
    db.transaction((tx) => {
      // sending 4 arguments in executeSql
      tx.executeSql(
        'SELECT * FROM recordlist',
        null, // passing sql query and parameters:null
        // success callback which sends two things Transaction object and ResultSet Object
        (txObj, { rows: { _array } }) => setData(_array),
        // failure callback which sends two things Transaction object and Error
        (txObj, error) => console.log('Error ', error),
      )
    })
  }

  const updateRecord = (newName, id) => {
    console.log('update', newName, id)
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE recordlist SET label = ? WHERE id = ?',
        [newName, id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let newList = data.map((data) => {
              data.id === id && console.log('==', { ...data, label: newName, value: newName })
              if (data.id === id) return { ...data, label: newName, value: newName }
              else return data
            })
            setData(newList)
          }
        },
      )
    })
  }

  const deleteRecord = (id) => {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM recordlist WHERE id = ? ', [id], (txObj, resultSet) => {
        if (resultSet.rowsAffected > 0) {
          let newList = data.filter((data) => {
            if (data.id === id) return false
            else return true
          })
          setData(newList)
        }
      })
    })
  }

  useEffect(() => {
    console.log('--- App is started ---')
    fetchData()
  }, [])

  return (
    <Home
      data={data}
      newRecord={newRecord}
      deleteRecord={deleteRecord}
      updateRecord={updateRecord}
    />
  )
}
