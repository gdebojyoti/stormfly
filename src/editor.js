/** @jsx h */
import { h, render } from 'preact'
import React from 'react'

import EditorUi from 'components/Editor/EditorUi'

import 'stylesheets/main.css'
import 'stylesheets/editor.css'

const App = () => {
  return (
    <React.Fragment>
      <canvas id='editor' class='canvas' />
      <EditorUi />
    </React.Fragment>
  )
}

render(<App />, document.body)
