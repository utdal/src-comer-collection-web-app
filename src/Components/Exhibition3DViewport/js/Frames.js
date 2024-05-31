import * as THREE from "three";

export function createFrame (frameWidth, frameHeight, frameColor, frameSecondary) {
    // create frame as a group so that we can add all the planes as one 'object' that
    // is appended to the art in Art.js
    const frameGroup = new THREE.Group();

    // possibly remove, makes frames slighly larger to accommodate
    frameWidth = frameWidth + 2;
    frameHeight = frameHeight + 2;

    /** note: there are a lot of position adjustments in this file.
     *  The important thing to know about these, are that they are based on the fact
     *  that a frame is created at (0, 0, 0). The frames are moved to their proper
     *  position and rotation in the Art.js file, so it is preferred that you keep
     *  all the math here the same, and alter any minute adjustments in that file.
     *
     *  Everything is divided by 12 as we are using a conversion of 1 unit in Three.js
     *  as 12 inches or 1 foot, and we are dealing with inch sizes for photos and their frames.
     *  Some things are adjusted by half of an inch (0.5 / 12) because Three.js is using
     *  the midpoints for positioning, and the frames are 1 inch thick in terms of
     *  both depth and thickness of the frame.
     */

    // all front facing panels of frame
    const frontBottom = new THREE.Mesh(
        new THREE.PlaneGeometry(frameWidth / 12, 1 / 12),
        new THREE.MeshLambertMaterial({
            color: frameColor,
            side: THREE.DoubleSide
        })
    );

    const frontTop = new THREE.Mesh(
        new THREE.PlaneGeometry(frameWidth / 12, 1 / 12),
        new THREE.MeshLambertMaterial({
            color: frameColor,
            side: THREE.DoubleSide
        })
    );

    frontTop.position.set(0, (frameHeight - 1) / 12, 0);

    const frontLeft = new THREE.Mesh(
        new THREE.PlaneGeometry(1 / 12, (frameHeight - 2) / 12),
        new THREE.MeshLambertMaterial({
            color: frameColor,
            side: THREE.DoubleSide
        })
    );

    frontLeft.position.set((-(frameWidth - 1) / 2) / 12,
        ((frameHeight - 1) / 2) / 12);

    const frontRight = new THREE.Mesh(
        new THREE.PlaneGeometry(1 / 12, (frameHeight - 2) / 12),
        new THREE.MeshLambertMaterial({
            color: frameColor,
            side: THREE.DoubleSide
        })
    );

    frontRight.position.set(((frameWidth - 1) / 2) / 12,
        ((frameHeight - 1) / 2) / 12);

    // all outer facing panels of frame
    const outerRight = new THREE.Mesh(
        new THREE.PlaneGeometry(1 / 12, frameHeight / 12),
        new THREE.MeshLambertMaterial({
            color: frameSecondary,
            side: THREE.DoubleSide
        })
    );

    outerRight.position.set((frameWidth / 2) / 12,
        ((frameHeight - 1) / 2) / 12,
        -0.5 / 12);
    outerRight.rotation.y = -Math.PI / 2;

    const outerLeft = new THREE.Mesh(
        new THREE.PlaneGeometry(1 / 12, frameHeight / 12),
        new THREE.MeshLambertMaterial({
            color: frameSecondary,
            side: THREE.DoubleSide
        })
    );

    outerLeft.position.set(-(frameWidth / 2) / 12,
        ((frameHeight - 1) / 2) / 12,
        -0.5 / 12);
    outerLeft.rotation.y = -Math.PI / 2;

    const outerBottom = new THREE.Mesh(
        new THREE.PlaneGeometry(frameWidth / 12, 1 / 12),
        new THREE.MeshLambertMaterial({
            color: frameSecondary,
            side: THREE.DoubleSide
        })
    );

    outerBottom.position.set(0, -0.5 / 12, -0.5 / 12);
    outerBottom.rotation.x = Math.PI / 2;

    const outerTop = new THREE.Mesh(
        new THREE.PlaneGeometry(frameWidth / 12, 1 / 12),
        new THREE.MeshLambertMaterial({
            color: frameSecondary,
            side: THREE.DoubleSide
        })
    );

    outerTop.position.set(0, (frameHeight - 0.5) / 12, -0.5 / 12);
    outerTop.rotation.x = Math.PI / 2;

    // inner facing panels (the small areas on the inside of frames)
    // they are 1/4 of an inch which covers any problem of being able to see through the frames
    const innerBottom = new THREE.Mesh(
        new THREE.PlaneGeometry((frameWidth - 2) / 12, 1 / 48),
        new THREE.MeshLambertMaterial({
            color: frameSecondary,
            side: THREE.DoubleSide
        })
    );

    innerBottom.position.set(0, 0.5 / 12, -1 / 96);
    innerBottom.rotation.x = Math.PI / 2;

    const innerTop = new THREE.Mesh(
        new THREE.PlaneGeometry((frameWidth - 2) / 12, 1 / 48),
        new THREE.MeshLambertMaterial({
            color: frameSecondary,
            side: THREE.DoubleSide
        })
    );

    innerTop.position.set(0, (frameHeight - 1.5) / 12, -1 / 96);
    innerTop.rotation.x = Math.PI / 2;

    const innerRight = new THREE.Mesh(
        new THREE.PlaneGeometry((frameHeight - 2) / 12, 1 / 48),
        new THREE.MeshLambertMaterial({
            color: frameSecondary,
            side: THREE.DoubleSide
        })
    );

    innerRight.position.set(((frameWidth - 2) / 2) / 12, ((frameHeight - 1) / 2) / 12, -1 / 96);
    innerRight.rotation.x = Math.PI / 2;
    innerRight.rotation.y = Math.PI / 2;

    const innerLeft = new THREE.Mesh(
        new THREE.PlaneGeometry((frameHeight - 2) / 12, 1 / 48),
        new THREE.MeshLambertMaterial({
            color: frameSecondary,
            side: THREE.DoubleSide
        })
    );

    innerLeft.position.set(-((frameWidth - 2) / 2) / 12, ((frameHeight - 1) / 2) / 12, -1 / 96);
    innerLeft.rotation.x = Math.PI / 2;
    innerLeft.rotation.y = Math.PI / 2;

    // add all parts to the group
    frameGroup.add(frontBottom, outerBottom, innerBottom,
        frontTop, outerTop, innerTop,
        frontLeft, outerLeft, innerLeft,
        frontRight, outerRight, innerRight);

    // this might work for when there is a custom position, but will have to check in the future
    // frame_group.position.set(0, -((frame_height - 1) / 2) / 12, 0);

    // return group as a finished frame
    return frameGroup;
}
