import { Engine } from '@babylonjs/core/Engines/engine'

import Messenger from 'components/Messenger'
import OverworldScene from './OverworldScene'
import FightScene from './FightScene'

import 'stylesheets/main.css'

class Game {
  static initialize () {
    const canvas = document.getElementById('canvas')
    const engine = new Engine(canvas)

    OverworldScene.initialize({ engine, canvas })
    FightScene.initialize({ engine, canvas })

    // set default scene
    this.changeScene('OVERWORLD_SCENE')

    this.subscribeToMessages()

    this.update(engine)
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

  static changeScene (scene) {
    this.currentScene = scene
  }

  static update (engine) {
    engine.runRenderLoop(() => {
      this.currentScene === 'OVERWORLD_SCENE' && OverworldScene.update()
      this.currentScene === 'FIGHT_SCENE' && FightScene.update()
    })
  }
}

export default Game
