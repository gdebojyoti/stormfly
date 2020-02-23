import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import { Vector3 } from '@babylonjs/core/Maths/math'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader'
import { GizmoManager } from '@babylonjs/core/Gizmos/gizmoManager'

import '@babylonjs/core/Meshes/meshBuilder' // allow Mesh to create default shapes (sphere, ground)
import '@babylonjs/inspector'

import Utils from './Utils'

class SceneManager {
  static initialize (levelData) {
    const canvas = document.getElementById('editor')
    canvas.focus()
    const engine = new Engine(canvas)

    this.scene = new Scene(engine)

    this.initializeCamera(canvas)
    this.initializeLights()
    this.initializeBasicAssets()
    this.initializGizmos()
    this.loadAssetsFromLevel(levelData)

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
    window.cube = cube

    // base upon which all assets will be imported and organized
    const base = Mesh.CreateGround('base', 16, 16, 50) // Params: name, width, depth, subdivs, scene
    base.visibility = 0.4
    base.enableEdgesRendering(10)
  }

  static initializGizmos () {
    this.gizmoManager = new GizmoManager(this.scene)

    // set all to true in order to implement onDragEndObservable methods
    this.gizmoManager.positionGizmoEnabled = true
    this.gizmoManager.rotationGizmoEnabled = true
    this.gizmoManager.scaleGizmoEnabled = true

    this.gizmoManager.attachableMeshes = []

    const gizmos = this.gizmoManager.gizmos
    // gizmos.positionGizmo.snapDistance = 0.1
    gizmos.positionGizmo.onDragEndObservable.add(() => {
      console.log('Dragged', gizmos.positionGizmo.attachedMesh)
      Utils.updateModel(gizmos.positionGizmo.attachedMesh)
    })
    gizmos.rotationGizmo.onDragEndObservable.add(() => {
      console.log('rotated', gizmos.rotationGizmo.attachedMesh)
      Utils.updateModel(gizmos.rotationGizmo.attachedMesh)
    })
    gizmos.scaleGizmo.onDragEndObservable.add(() => {
      console.log('scaled', gizmos.scaleGizmo.attachedMesh)
      Utils.updateModel(gizmos.scaleGizmo.attachedMesh)
    })

    // only position gizmo should be enabled by default
    this.gizmoManager.rotationGizmoEnabled = false
    this.gizmoManager.scaleGizmoEnabled = false
  }

  static loadAssetsFromLevel (levelData) {
    // exit if there is no saved level data
    if (!levelData) {
      return
    }

    const assets = levelData.zone1

    // load every instance of every model
    assets.forEach(asset => {
      if (!asset.instances) return

      asset.instances.forEach(instance => {
        this.loadModel(asset.modelId, null, instance)
      })
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

  // set gizmo controls to affect position, rotation or scale
  static modifyGizmoControls ({ position, rotation, scale }) {
    // exit if in placing mode
    if (this.isPlacing) return

    this.gizmoManager.positionGizmoEnabled = !!position
    this.gizmoManager.rotationGizmoEnabled = !!rotation
    this.gizmoManager.scaleGizmoEnabled = !!scale
  }

  // set parent and apply colliders to imported model
  static processModel (meshes, modelName, existingModel) {
    const modelId = modelName.split('.')[0]
    const identifier = existingModel ? existingModel.id : `dg-${modelId}-${new Date().getTime()}`
    const parentGo = new Mesh(identifier)

    const boundingBox = {
      max: {},
      min: {},
      scale: {},
      center: {}
    }

    meshes.forEach((mesh, subindex) => {
      mesh.setParent(parentGo)
      mesh.showBoundingBox = true
      mesh.receiveShadows = true

      const meshBoundingBox = mesh.getBoundingInfo().boundingBox
      const a = ['x', 'y', 'z']
      const b = ['max', 'min']
      a.forEach(xyz => {
        b.forEach(minmax => {
          const c = minmax === 'min' ? 'minimumWorld' : 'maximumWorld'
          boundingBox[minmax][xyz] = boundingBox[minmax][xyz] === undefined ? meshBoundingBox[c][xyz] : Math[minmax](meshBoundingBox[c][xyz], boundingBox[minmax][xyz])
          xyz === 'y' && console.log('meshBoundingBox[c][xyz]', meshBoundingBox.maximumWorld.y)
        })
        boundingBox.scale[xyz] = boundingBox.max[xyz] - boundingBox.min[xyz]
        boundingBox.center[xyz] = (boundingBox.max[xyz] + boundingBox.min[xyz]) / 2
      })
    })

    const colliderMesh = Mesh.CreateBox(`${identifier}-collider`)
    colliderMesh.scaling = new Vector3(boundingBox.scale.x, boundingBox.scale.y, boundingBox.scale.z)
    colliderMesh.position = new Vector3(boundingBox.center.x, boundingBox.center.y, boundingBox.center.z)
    colliderMesh.setParent(parentGo)
    colliderMesh.checkCollisions = true
    colliderMesh.visibility = 0.4

    parentGo.data = {
      modelId: modelName
    }

    if (existingModel) {
      parentGo.position = new Vector3(existingModel.position.x, existingModel.position.y, existingModel.position.z)
      parentGo.rotation = new Vector3(existingModel.rotation.x, existingModel.rotation.y, existingModel.rotation.z)
      parentGo.scaling = new Vector3(existingModel.scale.x, existingModel.scale.y, existingModel.scale.z)

      return parentGo
    }

    parentGo.scaling = new Vector3(0.1, 0.1, 0.1)

    return parentGo
  }

  /* public methods */

  static onClick (e) {
    const pickResult = this.scene.pick(e.clientX, e.clientY, mesh => this.isPlacing ? mesh.id === 'base' : mesh.id !== 'base')

    if (!pickResult.hit) {
      // TODO: deselect gizmo controls
      // this.gizmoManager.attachToMesh(null)
      return
    }

    this.currentModel = pickResult.pickedMesh

    console.log('Ray intercepted by:', pickResult.pickedMesh)
    if (this.isPlacing) {
      // TODO: update model's position in level data

      // reset isPlacing flag
      this.isPlacing = false
    }
  }

  static onKeyDown (e) {
    // exit if invalid event
    if (!e) return

    switch (e.keyCode) {
      case 87: {
        this.modifyGizmoControls({ position: true })
        break
      }
      case 69: {
        this.modifyGizmoControls({ scale: true })
        break
      }
      case 82: {
        this.modifyGizmoControls({ rotation: true })
        break
      }
      case 27: {
        // pressing 'Esc' removes active gizmo controls
        this.gizmoManager.attachToMesh(null)
        this.currentModel = null
        break
      }
    }
  }

  // load model; existingModel = details of model that needs to be preloaded for existing map data
  static loadModel (model, onModelLoad, existingModel) {
    SceneLoader.ImportMesh(
      null,
      'assets/models/',
      model,
      this.scene,
      (meshes) => {
        this.currentModel = this.processModel(meshes, model, existingModel)
        this.isPlacing = !existingModel

        // add model to list of gizmo enabled meshes
        this.gizmoManager.attachableMeshes.push(this.currentModel)

        onModelLoad && onModelLoad(model, this.currentModel)
      }
    )
  }
}

export default SceneManager
