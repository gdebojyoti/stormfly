import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import { DebugLayer } from '@babylonjs/core/Debug/debugLayer'
import { Vector3, Color3 } from '@babylonjs/core/Maths/math'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'

import '@babylonjs/core/Meshes/meshBuilder' // allow Mesh to create default shapes (sphere, ground)
import '@babylonjs/inspector'

import Messenger from './Messenger'
import Player from './Player'
// import SceneAssets from './Scene'
import { getSearchParam } from 'utilities'

import 'stylesheets/main.css'

class Game {
  static initialize () {
    const canvas = document.getElementById('canvas')
    canvas.focus()
    const engine = new Engine(canvas)

    const self = new Game()

    self.scene = new Scene(engine)

    // debugging enabled when URL contains 'debug=true'
    const debugLayer = new DebugLayer(self.scene)
    getSearchParam('debug') ? debugLayer.show() : debugLayer.hide()

    self.gameObjects = {}

    self.initializeCamera(canvas)
    self.initializeLights()
    self.initializeBasicAssets()
    self.addPlayers(canvas)
    self.addMoreAssets()
    self.subscribeToMessages()
    self.update(engine)
  }

  initializeCamera (canvas) {
    this.camera = new FreeCamera('camera1', new Vector3(0, 2, -5), this.scene)
    this.camera.setTarget(Vector3.Zero()) // target camera towards scene origin
    this.camera.attachControl(canvas, true) // attach camera to canvas
  }

  initializeLights () {
    const light = new DirectionalLight('light1', new Vector3(-1, -1, 0), this.scene)
    light.intensity = 1.5
    window.light = light // NOTE: make light a global object; temporary
  }

  initializeBasicAssets () {
    const material = new StandardMaterial()
    material.name = 'My custom material'
    material.diffuseColor = new Color3(1, 0.9, 0.7)

    this.sphere = Mesh.CreateSphere('sphere1', 16, 1) // Params: name, subdivs, size (diameter), scene
    this.sphere.position.y = 0.5
    this.sphere.renderOutline = true

    const ground = Mesh.CreateGround('ground1', 16, 16, 2) // Params: name, width, depth, subdivs, scene
    ground.material = material
  }

  addPlayers (canvas) {
    this.player = new Player(this.scene, { canvas, colliders: [this.sphere] })
  }

  addMoreAssets () {
    // SceneAssets.addDemoTrees(this.scene)
  }

  subscribeToMessages () {
    const messages = ['PLAYER_LOADED']
    messages.forEach(message => { Messenger.subscribe(message, data => this.listenToMessages(message, data)) })
  }

  listenToMessages (message, data) {
    switch (message) {
      case 'PLAYER_LOADED': {
        console.log('player model has loaded...', data)
        break
      }
    }
  }

  update (engine) {
    engine.runRenderLoop(() => {
      this.player.update()
      this.scene.render()

      // SceneAssets.update()
    })
  }
}

export default Game
