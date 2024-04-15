import * as THREE from "three";

export function createMatte (matteWidth, matteHeight, matteColor) {
    // create matte
    const matte = new THREE.Mesh(
        new THREE.PlaneGeometry(matteWidth / 12, matteHeight / 12),
        new THREE.MeshLambertMaterial({
            color: matteColor,
            side: THREE.DoubleSide
        })
    );

    return matte;
}
