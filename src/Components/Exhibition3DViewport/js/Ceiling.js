import * as THREE from "three";
import { createBoundingBoxes } from "./BoundingBox.js";

export const setupCeiling = (scene, textureLoader, ceilingWidth, ceilingLength, ceilingHeight, ceilingColor) => {
    return new Promise((resolve, reject) => {
        try {
            // clean up any existing floor
            scene.children = scene.children.filter((c) => c.name !== "group_ceiling");

            const ceilingGroup = new THREE.Group();
            ceilingGroup.name = "group_ceiling";
            scene.add(ceilingGroup);

            textureLoader.load("/images/textures/wall.jpg", (ceilingTexture) => {
                ceilingTexture.wrapS = THREE.RepeatWrapping; // horizontal wrap
                ceilingTexture.wrapT = THREE.RepeatWrapping; // vertical wrap
                ceilingTexture.repeat.set(ceilingWidth, ceilingLength); // repeat texture (width, height)

                // create geometry for floor (width, height)
                const planeGeometry = new THREE.PlaneGeometry(ceilingWidth, ceilingLength);

                // create material from texture to apply to geometry
                const planeMaterial = new THREE.MeshPhongMaterial({
                    map: ceilingTexture,
                    side: THREE.DoubleSide,
                    color: ceilingColor
                });

                // create mesh
                const ceilingPlane = new THREE.Mesh(planeGeometry, planeMaterial);

                ceilingPlane.rotation.x = Math.PI / 2; // make plane horizontal (radians)
                ceilingPlane.position.y = ceilingHeight; // raise ceiling

                ceilingGroup.add(ceilingPlane);
                createBoundingBoxes(ceilingGroup);

                resolve(ceilingGroup);
            });
        } catch (e) {
            reject(e);
        }
    });
};
