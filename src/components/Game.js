// import CANNON from 'cannon'
import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import { DebugLayer } from '@babylonjs/core/Debug/debugLayer'
import { Vector3, Color3, Axis } from '@babylonjs/core/Maths/math'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
// import { PhysicsImpostor } from '@babylonjs/core/Physics/physicsImpostor'

import '@babylonjs/core/Meshes/meshBuilder' // allow Mesh to create default shapes (sphere, ground)
import '@babylonjs/inspector'

import Messenger from './Messenger'
import Player from './Player'
import SceneAssets from './Scene'
import { getSearchParam } from 'utilities'

import 'stylesheets/main.css'

// window.CANNON = CANNON

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
    self.initializeScene()
    self.initializeLights()
    const basicAssets = self.initializeBasicAssets()
    self.addPlayers(canvas, basicAssets)
    // self.addMoreAssets()
    self.subscribeToMessages()
    self.update(engine)
  }

  initializeScene () {
    // const gravityVector = new Vector3(0, -9.81, 0)
    // this.scene.enablePhysics(gravityVector)
    SceneAssets.initialize(this.scene, this.camera)
  }

  initializeCamera (canvas) {
    this.camera = new FreeCamera('camera1', new Vector3(0, 6, -5), this.scene)
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
    material.specularColor = new Color3(0, 0, 0)

    // center of map
    Mesh.CreateSphere('center', 3, 0.1)

    // cube1 will trigger collided flag
    const cube1 = Mesh.CreateBox('cube1')
    cube1.name = 'Entry point'
    cube1.position = new Vector3(0, 0.5, -2)
    cube1.material = material
    cube1.enableEdgesRendering(10)

    // player cannot walk through cube2
    const cube2 = Mesh.CreateBox('cube2') // Params: name, subdivs, size (diameter), scene
    cube2.material = material
    cube2.position = new Vector3(0, 0.5, 3)
    cube2.renderOutline = true
    cube2.checkCollisions = true
    cube2.rotation.y = Math.PI / 4
    cube2.showBoundingBox = true

    // ground with slight tilt; indicative of real world terrain
    const ground = Mesh.CreateGround('ground1', 16, 16, 50) // Params: name, width, depth, subdivs, scene
    ground.material = material
    ground.enableEdgesRendering(10)
    ground.rotate(Axis.X, Math.PI / 180)
    ground.checkCollisions = true // don't allow player to walk through
    // ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.scene) // 0 mass makes object immovable

    return [cube1, cube2, ground]
  }

  addPlayers (canvas, colliders) {
    this.player = new Player(this.scene, { canvas, colliders })
  }

  addMoreAssets () {
    SceneAssets.addDemoTrees(this.scene)
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

  mapCenterToScreen () {
    const { x, y } = SceneAssets.mapPointToScreen() || {}
    console.log('Screen coordinates of map center', x, y)
  }

  update (engine) {
    engine.runRenderLoop(() => {
      this.player.update()
      this.scene.render()

      // this.mapCenterToScreen()

      SceneAssets.update()
    })
  }
}

export default Game
