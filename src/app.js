import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import { Vector3, Axis, Color3 } from '@babylonjs/core/Maths/math'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
// import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
// import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'

// import '@babylonjs/core/Materials/standardMaterial' // allow standard material to be used as default
import '@babylonjs/core/Meshes/meshBuilder' // allow Mesh to create default shapes (sphere, ground)
import '@babylonjs/loaders/OBJ' // OBJ loader
import '@babylonjs/loaders/gLTF' // OBJ loader
import '@babylonjs/core/Loading/loadingScreen' // LoadingScreen needed by SceneLoader.Append & ImportMesh

import 'stylesheets/main.css'

const canvas = document.getElementById('canvas')
const engine = new Engine(canvas)
const scene = new Scene(engine)

// scene.debugLayer.show({ showExplorer: true, overlay: true }) // for debugger

const camera = new FreeCamera('camera1', new Vector3(0, 5, -15), scene)
// const camera = new ArcRotateCamera('camera1', 0, 0.8, 10, new Vector3(0, 5, -15), scene)
camera.setTarget(Vector3.Zero()) // target camera towards scene origin
camera.attachControl(canvas, true) // attach camera to canvas

const light = new DirectionalLight('light1', new Vector3(-1, -1, 0), scene)
light.intensity = 1.5
// light.diffuse = new Color3(1, 0.9, 0.7)
window.light = light // NOTE: make light a global object; temporary

const material = new StandardMaterial()
material.diffuseColor = new Color3(1, 0.9, 0.7)

const sphere = Mesh.CreateSphere('sphere1', 16, 1) // Params: name, subdivs, size, scene
sphere.position.y = 2

const ground = Mesh.CreateGround('ground1', 6, 6, 2) // Params: name, width, depth, subdivs, scene
ground.material = material

// // dummy lego model
// const legoModel = new Mesh('lego', scene) // empty game object

SceneLoader.ImportMesh(
  null,
  'assets/models/',
  'vincent.glb',
  scene,
  (meshes, particleSystems, skeletons, animationGroups) => {
    const player = meshes[0]
    player.position = new Vector3(0, 2, 0)

    const idleAnimation = animationGroups.filter(group => group.name === 'walk')[0]
    idleAnimation.start(true) // loop = true
  }
)

const assets = {
  trees: []
  // trees: new Array(120).fill(['TreePine1.glb', 'TreePine2.glb', 'TreePine3.glb']).flat()
}
const gameObjects = {
  trees: []
}

assets.trees.forEach((tree, index) => {
  const treeGO = new Mesh(`tree${index}`, scene) // empty game object
  gameObjects.trees.push(treeGO)
})

const bla = 18
assets.trees.forEach((tree, index) => {
  SceneLoader.ImportMesh(
    null,
    'assets/models/',
    tree,
    scene,
    (meshes) => {
      // TODO: find a better way of assigning parent to an imported model
      meshes.forEach(mesh => { mesh.setParent(gameObjects.trees[index]) })
      gameObjects.trees[index].position.x = -Math.floor(index % (bla - 1)) * 7
      gameObjects.trees[index].position.z = -Math.floor(index / (bla - 1)) * 7

      gameObjects.trees[index].data = {
        rotationFactor: Math.random() * (index % 2 === 0 ? 1 : -1) // alternate clockwise & anti-clockwise rotations; randomize rotation speed
      }
    }
  )
})

engine.runRenderLoop(() => {
  scene.render()

  gameObjects.trees.forEach((tree, index) => {
    tree.data && tree.rotate(Axis.Y, tree.data.rotationFactor * Math.PI / 150)
  })
})
