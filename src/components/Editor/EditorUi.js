/** @jsx h */
import { h, render } from 'preact'
import { useEffect, useState } from 'react'

import SceneManager from './SceneManager'

const models = ['TreePine1.glb', 'TreePine2.glb', 'TreePine3.glb']

const EditorUi = () => {
  useEffect(() => {
    // Trigger your effect
    SceneManager.initialize(models)
    return () => {
      // Optional: Any cleanup code
    }
  }, [])

  const [selectedModel, setSelectedModel] = useState('') // asset currently selected in panel

  const onAssetSelect = model => {
    console.log('asset selected:', model)
    setSelectedModel(model)
    SceneManager.loadModel(model)
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
    </div>
  )
}

render(<EditorUi />, document.body)

export default EditorUi
