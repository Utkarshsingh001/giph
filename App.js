import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import HomeContainer from './src/pages/home/home-container'

const App = () => {
  return (
    <SafeAreaView style={{flex:1}}>
    <HomeContainer/>
    </SafeAreaView>
  )
}

export default App