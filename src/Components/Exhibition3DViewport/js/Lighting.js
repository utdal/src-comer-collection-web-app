import * as THREE from "three";

export function createAmbientLight (color, intensity) {
    const ambientLight = new THREE.AmbientLight(color, intensity);
    return ambientLight;
}

export function createSpotlight (intensity, color, artPosition, galleryHeight, scene, direction) {
    const spotlight = new THREE.SpotLight(color, intensity);

    // set the light 5 feet away from the art
    const lightOffset = 5; // modify this if you want to change how far lights are away from the photos
    if (direction === 1) {
        spotlight.position.set(artPosition.x, galleryHeight, artPosition.z + lightOffset);
    } else if (direction === 2) {
        spotlight.position.set(artPosition.x - lightOffset, galleryHeight, artPosition.z);
    } else if (direction === 3) {
        spotlight.position.set(artPosition.x, galleryHeight, artPosition.z - lightOffset);
    } else if (direction === 4) {
        spotlight.position.set(artPosition.x + lightOffset, galleryHeight, artPosition.z);
    }

    // set target position to art
    spotlight.target.position.set(artPosition.x, artPosition.y, artPosition.z);

    spotlight.angle = Math.PI / 8; // value effects 'wideness' of light
    spotlight.penumbra = 0.8; // hardness of light edges, looks better on higher end [0,1]
    spotlight.decay = 0.22; // this is a good value for lightOffset = 5, would need to change if that changes

    // pythag theorem, but we can approximate since it just needs to reach the wall, going over doesn't effect too much
    spotlight.distance = lightOffset * galleryHeight;

    // add light and target
    scene.add(spotlight);
    scene.add(spotlight.target);

    return spotlight;
}
