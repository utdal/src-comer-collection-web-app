import * as THREE from "three";
import { createBoundingBoxes } from "./BoundingBox.js";

export const setupMainWalls = (scene, textureLoader, wallWidth, wallLength, galleryHeight, galleryDepth, mainColor) => {
    return new Promise((resolve, reject) => {
        try {
            // clean up any existing main walls
            scene.children = scene.children.filter((c) => c.name !== "groupMainWalls");
            // create a group for walls for bounding box and adding to scene
            const wallGroup = new THREE.Group();
            wallGroup.name = "groupMainWalls";
            scene.add(wallGroup);

            // determine wall height
            const wallHeight = galleryHeight + galleryDepth;

            // walls need an amount >0 thickness to be visible
            const wallThick = 0.001;

            // gallery is set up to be a rectangle in any form
            // we create parallel sides at a time so they can use the same loaded texture with correct wrapping specification

            // front and back wall texture set up
            textureLoader.load("/images/textures/wall.jpg", (wallTextureFrontback) => {
                wallTextureFrontback.wrapS = THREE.RepeatWrapping; // horizontal wrap
                wallTextureFrontback.wrapT = THREE.RepeatWrapping; // vertical wrap
                wallTextureFrontback.repeat.set(wallWidth, wallHeight); // repeat texture (width, height)

                // front and back wall construction
                const frontWall = new THREE.Mesh(
                    new THREE.BoxGeometry(wallWidth, wallHeight, wallThick),
                    new THREE.MeshLambertMaterial({
                        map: wallTextureFrontback,
                        color: mainColor
                    })
                );

                const backWall = new THREE.Mesh(
                    new THREE.BoxGeometry(wallWidth, wallHeight, wallThick),
                    new THREE.MeshLambertMaterial({
                        map: wallTextureFrontback,
                        color: mainColor
                    })
                );

                // adjust walls to be in proper places according to adjacent sides
                const wallPositionAdjustmentFrontback = wallLength / 2;

                // adjust positions
                frontWall.position.z = -wallPositionAdjustmentFrontback;
                backWall.position.z = wallPositionAdjustmentFrontback;

                // adjust walls to be flush with floor and ceiling
                wallGroup.position.set(0, (galleryHeight - galleryDepth) / 2, 0);

                // add walls to the group
                wallGroup.add(frontWall, backWall);
                createBoundingBoxes(wallGroup);

                // return walls so that BoundingBox.js can use them
                resolve(wallGroup);
            });
        } catch (e) {
            reject(e);
        }
    });
};

export const setupSideWalls = (scene, textureLoader, wallWidth, wallLength, galleryHeight, galleryDepth, sideColor) => {
    return new Promise((resolve, reject) => {
        try {
            // clean up any existing side walls
            scene.children = scene.children.filter((c) => c.name !== "groupSideWalls");
            // create a group for walls for bounding box and adding to scene
            const wallGroup = new THREE.Group();
            wallGroup.name = "groupSideWalls";
            scene.add(wallGroup);

            // determine wall height
            const wallHeight = galleryHeight + galleryDepth;

            // walls need an amount >0 thickness to be visible
            const wallThick = 0.001;

            // gallery is set up to be a rectangle in any form
            // we create parallel sides at a time so they can use the same loaded texture with correct wrapping specification

            // left and right wall texture set up
            textureLoader.load("/images/textures/wall.jpg", (wallTextureLeftright) => {
                wallTextureLeftright.wrapS = THREE.RepeatWrapping; // horizontal wrap
                wallTextureLeftright.wrapT = THREE.RepeatWrapping; // vertical wrap
                wallTextureLeftright.repeat.set(wallLength, wallHeight); // repeat texture (width, height)

                // left and right wall construction
                const leftWall = new THREE.Mesh(
                    new THREE.BoxGeometry(wallLength, wallHeight, wallThick),
                    new THREE.MeshLambertMaterial({
                        map: wallTextureLeftright,
                        color: sideColor
                    })
                );

                const rightWall = new THREE.Mesh(
                    new THREE.BoxGeometry(wallLength, wallHeight, wallThick),
                    new THREE.MeshLambertMaterial({
                        map: wallTextureLeftright,
                        color: sideColor
                    })
                );

                // adjust walls to be in proper places according to adjacent sides
                const wallPositionAdjustmentLeftright = wallWidth / 2;

                // adjust positions
                leftWall.position.x = -wallPositionAdjustmentLeftright;
                rightWall.position.x = wallPositionAdjustmentLeftright;

                // rotate left right walls in radians
                const wallRotationAdjustment = Math.PI / 2;

                leftWall.rotation.y = wallRotationAdjustment;
                rightWall.rotation.y = wallRotationAdjustment;

                // adjust walls to be flush with floor and ceiling
                wallGroup.position.set(0, (galleryHeight - galleryDepth) / 2, 0);

                // add walls to the group
                wallGroup.add(leftWall, rightWall);

                createBoundingBoxes(wallGroup);
                // return walls so that BoundingBox.js can use them
                resolve(wallGroup);
            });
        } catch (e) {
            reject(e);
        }
    });
};
