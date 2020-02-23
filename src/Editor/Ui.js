/** @jsx h */
import { h } from 'preact'
import { useEffect, useState, useImperativeHandle, forwardRef } from 'react'

import SceneManager from './SceneManager'
import Utils from './Utils'
import { getFromLocalStorage, downloadLevelJson, viewLevelJson } from 'utilities'

const models = ['TreePine1.glb', 'TreePine2.glb', 'TreePine3.glb']

const Ui = forwardRef((props, ref) => {
  useEffect(() => {
    SceneManager.initialize(getFromLocalStorage('levelData'))
  }, [])

  useImperativeHandle(ref, () => ({
    canvasClick: SceneManager.onClick.bind(SceneManager),
    onKeyDown: SceneManager.onKeyDown.bind(SceneManager)
  }))

  const [selectedModel, setSelectedModel] = useState('') // asset currently selected in panel

  const onAssetSelect = model => {
    setSelectedModel(model)
    SceneManager.loadModel(model, Utils.addModel)
  }

  return (
    <div id='editor-ui' class='ui'>
      {models.map((model, index) => {
        return (
          <button
            class={selectedModel === model ? 'btn btn--selected' : 'btn'}
            key={index}
            onClick={() => onAssetSelect(model)}
          >
            {model}
          </button>
        )
      })}
      <br />
      <button onClick={downloadLevelJson}>Download JSON</button>
      <button onClick={viewLevelJson}>View JSON</button>
    </div>
  )
})

export default Ui
