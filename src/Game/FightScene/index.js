import { Scene } from '@babylonjs/core/scene'
import { Vector3 } from '@babylonjs/core/Maths/math'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight'

import '@babylonjs/core/Meshes/meshBuilder' // allow Mesh to create default shapes (sphere, ground)
import '@babylonjs/inspector'

import Messenger from 'components/Messenger'

class FightScene {
  static initialize ({ engine, canvas }) {
    this.scene = new Scene(engine)

    this.initializeCamera(canvas)
    this.initializeLights()
    this.subscribeToMessages()
  }

  static initializeCamera (canvas) {
    this.camera = new FreeCamera('camera1', new Vector3(0, 6, -5), this.scene)
    this.camera.setTarget(Vector3.Zero()) // target camera towards scene origin
    this.camera.attachControl(canvas, true) // attach camera to canvas
  }

  static initializeLights () {
    const light = new DirectionalLight('light1', new Vector3(0.5, -0.9, 1), this.scene)
    light.intensity = 1.5
    window.light = light // NOTE: make light a global object; temporary
  }

  static subscribeToMessages () {
    const messages = ['TEST_FIGHT_EVENT']
    messages.forEach(message => { Messenger.subscribe(message, data => this.listenToMessages(message, data)) })
  }

  static listenToMessages (message, data) {
    switch (message) {
      case 'TEST_FIGHT_EVENT': {
        console.log('TEST_FIGHT_EVENT...', data)
        break
      }
    }
  }

  static update () {
    console.log('Inside update method of Fight scene...')
    this.scene.render()
  }
}

export default FightScene
