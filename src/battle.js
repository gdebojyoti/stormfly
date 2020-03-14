/** @jsx h */
import { h, render } from 'preact'
import React from 'react'

import Player from 'components/Battle'

import 'stylesheets/battle.css'

const App = () => {
  return (
    <React.Fragment>
      <h2>Battle ground</h2>
      <Player />
    </React.Fragment>
  )
}

render(<App />, document.body)
