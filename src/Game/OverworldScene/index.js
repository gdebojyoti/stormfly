// main scene

import { Scene } from '@babylonjs/core/scene'
import { DebugLayer } from '@babylonjs/core/Debug/debugLayer'
import { Vector3, Color3, Axis } from '@babylonjs/core/Maths/math'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'

import '@babylonjs/core/Meshes/meshBuilder' // allow Mesh to create default shapes (sphere, ground)
import '@babylonjs/inspector'

import { getSearchParam } from 'utilities'
import SceneAssets from 'Game/Scene'
import Messenger from 'components/Messenger'
import Player from 'Game/Player'

class OverworldScene {
  static initialize ({ engine, canvas }) {
    this.scene = new Scene(engine)

    // debugging enabled when URL contains 'debug=true'
    const debugLayer = new DebugLayer(this.scene)
    getSearchParam('debug') ? debugLayer.show() : debugLayer.hide()

    this.initializeCamera(canvas)
    this.initializeScene()
    this.initializeLights()
    const basicAssets = this.initializeBasicAssets()
    this.addPlayers(canvas, basicAssets)
    this.addMoreAssets()
    this.subscribeToMessages()
  }

  static initializeCamera (canvas) {
    this.camera = new FreeCamera('camera1', new Vector3(0, 6, -5), this.scene)
    this.camera.setTarget(Vector3.Zero()) // target camera towards scene origin
    this.camera.attachControl(canvas, true) // attach camera to canvas
  }

  static initializeScene () {
    SceneAssets.initialize(this.scene, this.camera)
  }

  static initializeLights () {
    const light = new DirectionalLight('light1', new Vector3(0.5, -0.9, 1), this.scene)
    light.intensity = 1.5
    window.light = light // NOTE: make light a global object; temporary
  }

  static initializeBasicAssets () {
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

    return [cube1, cube2, ground]
  }

  static addPlayers (canvas, colliders) {
    this.player = new Player(this.scene, { canvas, colliders })
  }

  static addMoreAssets () {
    SceneAssets.addDemoTrees(this.scene)
    SceneAssets.addLegoModel(this.scene)
  }

  static subscribeToMessages () {
    const messages = ['PLAYER_LOADED']
    messages.forEach(message => { Messenger.subscribe(message, data => this.listenToMessages(message, data)) })
  }

  static listenToMessages (message, data) {
    switch (message) {
      case 'PLAYER_LOADED': {
        console.log('player model has loaded...', data)
        break
      }
    }
  }

  static mapCenterToScreen () {
    const { x, y } = SceneAssets.mapPointToScreen() || {}
    console.log('Screen coordinates of map center', x, y)
  }

  static update () {
    this.player.update()
    SceneAssets.update()

    // this.mapCenterToScreen()

    // call predefined render method of self
    this.scene.render()
  }
}

export default OverworldScene
