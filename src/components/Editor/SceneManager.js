import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import { Vector3 } from '@babylonjs/core/Maths/math'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader'

import '@babylonjs/core/Meshes/meshBuilder' // allow Mesh to create default shapes (sphere, ground)
import '@babylonjs/inspector'

class SceneManager {
  static initialize (models) {
    console.log('initializing scene manager...', models)
    const canvas = document.getElementById('editor')
    canvas.focus()
    const engine = new Engine(canvas)

    this.scene = new Scene(engine)

    this.initializeCamera(canvas)
    this.initializeLights()
    this.initializeBasicAssets()

    this.addEvents()
    this.update(engine)

    this.currentModel = null // model that is currently visible on hovering over base
    this.isPlacingModel = false // set to true if user is currently placing an asset on base
  }

  static initializeCamera (canvas) {
    this.camera = new FreeCamera('camera1', new Vector3(-5, 4, -5), this.scene)
    this.camera.setTarget(Vector3.Zero()) // target camera towards scene origin
    this.camera.attachControl(canvas, true) // attach camera to canvas
  }

  static initializeLights () {
    const light = new DirectionalLight('light1', new Vector3(-0.1, -0.9, 1), this.scene)
    light.intensity = 1.5
    window.light = light // NOTE: make light a global object; temporary
  }

  static initializeBasicAssets () {
    // center of map
    Mesh.CreateSphere('center', 3, 0.1)

    const levelGO = new Mesh('level-go')
    levelGO.isPickable = false

    // reference cube
    const cube = Mesh.CreateBox('cube') // Params: name, subdivs, size (diameter), scene
    cube.position = new Vector3(0, 0.5, 3)
    cube.renderOutline = true
    cube.rotation.y = Math.PI / 4
    cube.showBoundingBox = true
    cube.setParent(levelGO)

    // base upon which all assets will be imported and organized
    const base = Mesh.CreateGround('base', 16, 16, 50) // Params: name, width, depth, subdivs, scene
    base.visibility = 0.4
    base.enableEdgesRendering(10)
  }

  static addEvents () {
    window.addEventListener('click', e => {
      const pickResult = this.scene.pick(e.clientX, e.clientY, mesh => this.isPlacing ? mesh.id === 'base' : mesh.id !== 'base')

      if (!pickResult.hit) {
        console.log('Nothing found')
        return
      }

      console.log('Ray intercepted by:', pickResult.pickedMesh)
      if (this.isPlacing) {
        this.isPlacing = false
      }
    })
  }

  static update (engine) {
    engine.runRenderLoop(() => {
      this.scene.render()
      this.renderModelAtPointer()
    })
  }

  static renderModelAtPointer () {
    if (!this.currentModel || !this.isPlacing) {
      console.log('no model to be rendered')
      return
    }

    const position = this.locatePointOnBase()
    if (position) {
      this.currentModel.position = position
    }
  }

  static locatePointOnBase () {
    const info = this.scene.pick(this.scene.pointerX, this.scene.pointerY, mesh => mesh.id === 'base')
    if (!info.hit) {
      return
    }

    return info.pickedPoint
  }

  /* public methods */

  static loadModel (model) {
    SceneLoader.ImportMesh(
      null,
      'assets/models/',
      model,
      this.scene,
      (meshes) => {
        const parentGo = new Mesh('lego', this.scene)
        parentGo.id = 'dg-' + model + new Date().getTime()

        meshes.forEach((mesh, subindex) => {
          mesh.setParent(parentGo)
          mesh.showBoundingBox = true
          mesh.receiveShadows = true
        })

        parentGo.scaling = new Vector3(0.1, 0.1, 0.1)

        this.currentModel = parentGo
        this.isPlacing = true
      }
    )
  }
}

export default SceneManager
