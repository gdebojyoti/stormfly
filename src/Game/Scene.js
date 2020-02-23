import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { VertexBuffer } from '@babylonjs/core/Meshes/buffer'
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData'
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader'
import { Vector3, Matrix, Axis } from '@babylonjs/core/Maths/math'

const total = 0
let counter = 0 // to keep track of number of trees loaded

class Scene {
  // set basic info
  static initialize (scene, camera) {
    this.scene = scene
    this.camera = camera

    this.gameObjects = {
      trees: [],
      lego: null
    }
  }

  // world coordinates to screen coordinates
  static mapPointToScreen (point = new Vector3(0, 0, 0)) {
    if (!this.camera) {
      return null
    }
    const { x, y } = Vector3.Project(
      point,
      Matrix.Identity(),
      this.scene.getTransformMatrix(),
      this.camera.viewport
    )

    return {
      x: Math.floor(window.innerWidth * x),
      y: Math.floor(window.innerHeight * y)
    }
  }

  static addLegoModel (scene) {
    SceneLoader.ImportMesh(
      null,
      'assets/models/lego/',
      'lego.obj',
      scene,
      (meshes) => {
        this.gameObjects.lego = new Mesh('lego', scene)

        meshes.forEach((mesh, subindex) => {
          const positions = mesh.getVerticesData(VertexBuffer.PositionKind)
          const normals = new Float32Array(positions.length)
          VertexData.ComputeNormals(positions, mesh.getIndices(), normals)

          mesh.setVerticesData(VertexBuffer.NormalKind, normals)

          mesh.setParent(this.gameObjects.lego)
          mesh.showBoundingBox = true
          mesh.receiveShadows = true
        })

        this.gameObjects.lego.position.x = 3
        this.gameObjects.lego.position.z = 3
        this.gameObjects.lego.rotation.y = Math.PI
        this.gameObjects.lego.scaling = new Vector3(0.1, 0.1, 0.1)

        console.info('Lego model has been loaded', meshes)
      },
      // on progress handler
      progress => {}
    )
  }

  // add 120 instances each of 3 different tree models
  static addDemoTrees (scene) {
    const assets = {
      trees: new Array(total / 3).fill(['TreePine1.glb', 'TreePine2.glb', 'TreePine3.glb']).flat()
    }

    console.info(`Loading ${total} trees...`)

    assets.trees.forEach((tree, index) => {
      const treeGO = new Mesh(`tree${index}`, scene) // empty game object
      this.gameObjects.trees.push(treeGO)
    })

    const rowCount = 17
    assets.trees.forEach((tree, index) => {
      SceneLoader.ImportMesh(
        null,
        'assets/models/',
        tree,
        scene,
        (meshes) => {
          // TODO: found more efficient way to compute bounding box of imported mesh; or create a helper function
          const boundingBox = {
            max: {},
            min: {},
            scale: {},
            center: {}
          }

          // TODO: find a better way of assigning parent to an imported model
          meshes.forEach((mesh, subindex) => {
            mesh.setParent(this.gameObjects.trees[index])
            mesh.showBoundingBox = true

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

          // create a box collider for the final bounding box; add collisions; make it translucent (for debugging)
          const colliderMesh = Mesh.CreateBox(`tree-collider-${index}`)
          colliderMesh.scaling = new Vector3(boundingBox.scale.x, boundingBox.scale.y, boundingBox.scale.z)
          colliderMesh.position = new Vector3(boundingBox.center.x, boundingBox.center.y, boundingBox.center.z)
          colliderMesh.setParent(this.gameObjects.trees[index])
          colliderMesh.checkCollisions = true
          colliderMesh.visibility = 0.4

          this.gameObjects.trees[index].position.x = -Math.floor(index % (rowCount)) * 7
          this.gameObjects.trees[index].position.z = -Math.floor(index / (rowCount)) * 7

          this.gameObjects.trees[index].scaling = new Vector3(0.3, 0.3, 0.3)

          this.gameObjects.trees[index].data = {
            rotationFactor: Math.random() * (index % 2 === 0 ? 1 : -1) // alternate clockwise & anti-clockwise rotations; randomize rotation speed
          }

          counter++
          if (counter === total) {
            console.info(`All ${total} trees have been loaded. Starting animation...`)
          }
        },
        // on progress handler
        progress => {}
      )
    })
  }

  // rotate demo trees
  static update () {
    // exit unless all trees have been loaded
    if (counter !== total) {
      return
    }

    this.gameObjects.trees.forEach((tree, index) => {
      tree.data && tree.rotate(Axis.Y, tree.data.rotationFactor * Math.PI / 150)
    })

    this.gameObjects.lego && this.gameObjects.lego.rotate(Axis.Y, Math.PI / 150)
  }
}

export default Scene
