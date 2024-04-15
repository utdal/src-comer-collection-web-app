import * as THREE from "three";
import { createBoundingBoxes } from "./BoundingBox.js";

export const setupFloor = (scene, textureLoader, floorWidth, floorLength, floorDepth, floorColor, floorTextureName) => {
    return new Promise((resolve, reject) => {
        try {
            // clean up any existing floor
            scene.children = scene.children.filter((c) => c.name !== "group_floor");

            const floorGroup = new THREE.Group();
            floorGroup.name = "group_floor";
            scene.add(floorGroup);

            textureLoader.load(`/images/textures/${floorTextureName}`, (floorTexture) => {
                floorTexture.wrapS = THREE.RepeatWrapping; // horizontal wrap
                floorTexture.wrapT = THREE.RepeatWrapping; // vertical wrap
                floorTexture.repeat.set(floorWidth / 4, floorLength / 4); // repeat texture (width, height)

                // create geometry for floor (width, height)
                const planeGeometry = new THREE.PlaneGeometry(floorWidth, floorLength);

                // create material from texture to apply to geometry
                const planeMaterial = new THREE.MeshPhongMaterial({
                    map: floorTexture,
                    side: THREE.DoubleSide,
                    color: floorColor
                });

                // create mesh
                const floorPlane = new THREE.Mesh(planeGeometry, planeMaterial);

                floorPlane.rotation.x = Math.PI / 2; // make plane horizontal (radians)
                floorPlane.position.y = -floorDepth; // lower floor so eye level can stay at 0

                floorGroup.add(floorPlane);
                createBoundingBoxes(floorGroup);

                resolve(floorGroup);
            });
        } catch (e) {
            reject(e);
        }
    });
};
