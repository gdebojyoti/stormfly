/** @jsx h */
import { h, render } from 'preact'
import React, { useRef } from 'react'

import EditorUi from 'components/Editor/EditorUi'

import 'stylesheets/main.css'
import 'stylesheets/editor.css'

const App = () => {
  const canvasRef = useRef()

  const onClickCanvas = e => {
    if (canvasRef.current) {
      canvasRef.current.canvasClick(e)
    }
  }

  const onKeyDown = e => {
    if (canvasRef.current) {
      canvasRef.current.onKeyDown(e)
    }
  }

  return (
    <React.Fragment>
      <canvas id='editor' class='canvas' onClick={onClickCanvas} onKeyDown={onKeyDown} />
      <EditorUi ref={canvasRef} />
    </React.Fragment>
  )
}

render(<App />, document.body)
