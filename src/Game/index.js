import { Engine } from '@babylonjs/core/Engines/engine'

import OverworldScene from './OverworldScene'

import 'stylesheets/main.css'

class Game {
  static initialize () {
    const canvas = document.getElementById('canvas')
    canvas.focus()
    const engine = new Engine(canvas)

    OverworldScene.initialize({ engine, canvas })
    this.update(engine)
  }

  static update (engine) {
    engine.runRenderLoop(() => {
      OverworldScene.update()
    })
  }
}

export default Game
