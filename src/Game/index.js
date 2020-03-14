import { Engine } from '@babylonjs/core/Engines/engine'

import Messenger from 'components/Messenger'
import OverworldScene from './OverworldScene'
import FightScene from './FightScene'

import 'stylesheets/main.css'

const scenes = {
  OVERWORLD_SCENE: OverworldScene,
  FIGHT_SCENE: FightScene
}

class Game {
  static initialize () {
    this.canvas = document.getElementById('canvas')
    this.engine = new Engine(this.canvas)

    this.changeScene('OVERWORLD_SCENE')

    this.subscribeToMessages()

    this.addEventListeners(this.engine)

    this.update(this.engine)
  }

  static changeScene (scene) {
    // destroy current scene
    this.currentScene && this.currentScene.dispose()
    this.currentScene = null

    const newScene = scenes[scene]
    newScene.initialize({ engine: this.engine, canvas: this.canvas })
    this.currentScene = newScene
  }

  static subscribeToMessages () {
    const messages = ['CHANGE_SCENE']
    messages.forEach(message => { Messenger.subscribe(message, data => this.listenToMessages(message, data)) })
  }

  static listenToMessages (message, data) {
    switch (message) {
      case 'CHANGE_SCENE': {
        console.log('changing scene...', data)
        this.changeScene(data)
        break
      }
    }
  }

  static addEventListeners (engine) {
    window.addEventListener('resize', function () {
      engine.resize()
    })
  }

  static update (engine) {
    engine.runRenderLoop(() => {
      this.currentScene && this.currentScene.update()
    })
  }
}

export default Game
