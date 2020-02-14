import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import { Vector3, Color3 } from '@babylonjs/core/Maths/math'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'

import Player from './Player'
import SceneAssets from './Scene'

import '@babylonjs/core/Meshes/meshBuilder' // allow Mesh to create default shapes (sphere, ground)

import 'stylesheets/main.css'

class Game {
  static initialize () {
    const canvas = document.getElementById('canvas')
    canvas.focus()
    const engine = new Engine(canvas)

    const self = new Game()

    self.scene = new Scene(engine)
    self.gameObjects = {}

    self.initializeCamera(canvas)
    self.initializeLights()
    self.initializeBasicAssets()
    self.addPlayers(canvas)
    self.addMoreAssets()
    self.update(engine)
  }

  initializeCamera (canvas) {
    this.camera = new FreeCamera('camera1', new Vector3(0, 5, -15), this.scene)
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
    material.diffuseColor = new Color3(1, 0.9, 0.7)

    const sphere = Mesh.CreateSphere('sphere1', 16, 1) // Params: name, subdivs, size, scene
    sphere.position.y = 2

    const ground = Mesh.CreateGround('ground1', 6, 6, 2) // Params: name, width, depth, subdivs, scene
    ground.material = material
  }

  addPlayers (canvas) {
    this.player = new Player(this.scene, canvas)
  }

  addMoreAssets () {
    SceneAssets.addDemoTrees(this.scene)
  }

  update (engine) {
    engine.runRenderLoop(() => {
      this.player.update()
      this.scene.render()

      SceneAssets.update()
    })
  }
}

export default Game
