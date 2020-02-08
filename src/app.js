import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import { Vector3, Axis } from '@babylonjs/core/Maths/math'
// import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
// import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader'

import '@babylonjs/core/Materials/standardMaterial' // allow standard material to be used as default
import '@babylonjs/core/Meshes/meshBuilder' // allow Mesh to create default shapes (sphere, ground)
import '@babylonjs/loaders/OBJ' // OBJ loader
import '@babylonjs/loaders/gLTF' // OBJ loader
import '@babylonjs/core/Loading/loadingScreen' // LoadingScreen needed by SceneLoader.Append & ImportMesh

import 'stylesheets/main.css'

const canvas = document.getElementById('canvas')
const engine = new Engine(canvas)
const scene = new Scene(engine)

// const camera = new FreeCamera('camera1', new Vector3(0, 5, -15), scene)
const camera = new ArcRotateCamera('camera1', 0, 0.8, 10, new Vector3(0, 5, -15), scene)
camera.setTarget(Vector3.Zero()) // target camera towards scene origin
camera.attachControl(canvas, true) // attach camera to canvas

const light = new DirectionalLight('light1', new Vector3(-1, -1, 0), scene)
// light.intensity = 0.6
window.light = light

const sphere = Mesh.CreateSphere('sphere1', 16, 1, scene) // Params: name, subdivs, size, scene
sphere.position.y = 2

Mesh.CreateGround('ground1', 6, 6, 2, scene) // Params: name, width, depth, subdivs, scene

const legoModel = new Mesh('lego', scene) // empty game object
const treeModel = new Mesh('tree', scene) // empty game object

SceneLoader.ImportMesh(
  null,
  'assets/dump/',
  'lego.obj',
  scene,
  (meshes) => {
    console.log('lego model loaded', meshes)

    // TODO: find a better way of assigning parent to an imported model
    meshes.forEach(mesh => { mesh.setParent(legoModel) })
    legoModel.scaling = new Vector3(0.05, 0.05, 0.05)
  }
)

SceneLoader.ImportMesh(
  null,
  'assets/models/',
  'TreePine1.glb',
  scene,
  (meshes) => {
    // TODO: find a better way of assigning parent to an imported model
    meshes.forEach(mesh => { mesh.setParent(treeModel) })
    treeModel.position.x = -5
  }
)

engine.runRenderLoop(() => {
  scene.render()
  legoModel.rotate(Axis.Y, Math.PI / 150)
  treeModel.rotate(Axis.Y, -Math.PI / 150)
})
