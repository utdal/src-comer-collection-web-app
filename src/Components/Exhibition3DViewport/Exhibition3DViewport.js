/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { setupMainWalls, setupSideWalls } from "./js/Walls.js";
import { setupFloor } from "./js/Floor.js";
import { setupCeiling } from "./js/Ceiling.js";
import { createArt } from "./js/Art.js";
import { Box, Fab, Stack, Typography } from "@mui/material";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { EditIcon, SecurityIcon, VisibilityIcon } from "../../Imports/Icons.js";
import useAppUser from "../../Hooks/useAppUser.ts";
import PropTypes from "prop-types";
import { ExhibitionIntro } from "./ExhibitionIntro.js";
import { ArtInfoPopup } from "./ArtInfoPopup.js";
import { entityPropTypeShape } from "../../Classes/Entity.ts";
import { exhibitionStatePropTypesShape } from "../../Classes/Entities/Exhibition.ts";

const getAmbientLightIntensity = (moodiness) => {
    switch (moodiness) {
    case "dark":
        return 0.5;
    case "moody dark":
        return 1.5;
    case "moody bright":
        return 2.5;
    case "bright":
        return 3.5;
    default:
        return 1.5;
    }
};

const getCanvasDimensions = (boundingBoxElement) => {
    if (boundingBoxElement) {
        const { height: canvasHeight, width: canvasWidth } = boundingBoxElement.getBoundingClientRect();
        return [canvasHeight, canvasWidth];
    }
    return [0, 0];
};

const Exhibition3DViewport = ({ exhibitionState, exhibitionMetadata, exhibitionIsEditable, globalImageCatalog, editModeActive, setEditModeActive }) => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    const [keysPressed, setKeysPressed] = useState({
        arrowup: false,
        arrowdown: false,
        arrowleft: false,
        arrowright: false,
        w: false,
        a: false,
        s: false,
        d: false
    });

    const [myRenderer, setMyRenderer] = useState(null);
    const [myScene, setMyScene] = useState(null);
    const [myCamera, setMyCamera] = useState(null);
    const [myControls, setMyControls] = useState(null);
    const [myTextureLoader, setMyTextureLoader] = useState(null);
    const [myClock, setMyClock] = useState(null);
    const [myArtPositionsByImageId, setMyArtPositionsByImageId] = useState(null);
    const [infoMenuImageId, setInfoMenuImageId] = useState(null);

    const [canvasDimensions, setCanvasDimensions] = useState({
        width: null,
        height: null
    });

    const appUser = useAppUser();

    const [dialogIsOpen, setDialogIsOpen] = useState(true);

    const restoreMenu = () => {
        setDialogIsOpen(true);
    };

    const handleWindowResize = () => {
        if (containerRef.current) {
            const [canvasHeight, canvasWidth] = getCanvasDimensions(containerRef.current);
            setCanvasDimensions({
                width: canvasWidth,
                height: canvasHeight
            });
        }
    };

    const handleKeydown = (e) => {
        const keyPressed = e.key.toLowerCase();
        if (keyPressed in keysPressed) {
            setKeysPressed({ ...keysPressed, [keyPressed]: true });
        }
    };

    const handleKeyup = (e) => {
        const keyPressed = e.key.toLowerCase();
        if (keyPressed in keysPressed) {
            setKeysPressed({ ...keysPressed, [keyPressed]: false });
        }
    };

    useEffect(() => {
        const scene = new THREE.Scene();

        if (!containerRef || !containerRef.current) {
            return;
        }

        const [canvasHeight, canvasWidth] = getCanvasDimensions(containerRef.current);

        // camera set up
        const camera = new THREE.PerspectiveCamera(
            60, // field of view: 60-90 is normal for viewing on a monitor
            canvasWidth / canvasHeight, // aspect ratio: assumption that ar should be the current window size
            0.1, // near setting for camera frustum
            1000 // far setting for camera frustum
        );

        scene.add(camera);

        // set camera slighly back from middle of gallery
        camera.position.set(0, 0, exhibitionState.size.length_ft / 4);
        camera.updateProjectionMatrix();

        // enable antialiasing
        const renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        // set initial canvas size
        renderer.setSize(canvasWidth, canvasHeight);

        // render options

        renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

        // add mouse controls
        const controls = new PointerLockControls(camera, renderer.domElement);
        scene.add(controls.getObject());

        // resize window when window is resized
        window.addEventListener("resize", handleWindowResize);

        const clock = new THREE.Clock();
        clock.getDelta();

        setMyRenderer(renderer);
        setMyCamera(camera);
        setMyScene(scene);
        setMyControls(controls);
        setMyClock(clock);

        controls.addEventListener("unlock", restoreMenu);

        window.addEventListener("keydown", handleKeydown);
        window.addEventListener("keyup", handleKeyup);

        const textureLoader = new THREE.TextureLoader();
        setMyTextureLoader(textureLoader);

        return () => {
            controls.removeEventListener("unlock", restoreMenu);
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("keyup", handleKeyup);
            setMyRenderer(null);
            setMyCamera(null);
            setMyScene(null);
            setMyControls(null);
        };
    }, []);

    // Manage movement based on key presses
    // and constrain camera position to exhibition boundaries
    useEffect(() => {
        const distanceThreshold = 5;

        // manage camera movement
        if (myControls?.isLocked) {
            const factor = 5;
            let delta = myClock.getDelta();
            let speed;
            if (delta > 0.05) {
                delta = myClock.getDelta();
                speed = 0.05;
            } else {
                speed = delta;
            }
            switch (true) {
            case keysPressed.d:
            case keysPressed.arrowright:
                myControls.moveRight(factor * speed);
                break;
            case keysPressed.a:
            case keysPressed.arrowleft:
                myControls.moveRight(-factor * speed);
                break;
            case keysPressed.w:
            case keysPressed.arrowup:
                myControls.moveForward(factor * speed);
                break;
            case keysPressed.s:
            case keysPressed.arrowdown:
                myControls.moveForward(-factor * speed);
                break;
            default:
                break;
            }
        }

        // manage camera constraints
        const minDistanceFromWalls = 1;
        const minZ = -exhibitionState.size.length_ft / 2 + minDistanceFromWalls;
        const maxZ = exhibitionState.size.length_ft / 2 - minDistanceFromWalls;
        const minX = -exhibitionState.size.width_ft / 2 + minDistanceFromWalls;
        const maxX = exhibitionState.size.width_ft / 2 - minDistanceFromWalls;
        if (myCamera && myRenderer) {
            switch (true) {
            case myCamera.position.z < minZ:
                myCamera.position.z = minZ;
                break;
            case myCamera.position.z > maxZ:
                myCamera.position.z = maxZ;
                break;
            default:
                break;
            }
            switch (true) {
            case myCamera.position.x < minX:
                myCamera.position.x = minX;
                break;
            case myCamera.position.x > maxX:
                myCamera.position.x = maxX;
                break;
            default:
                break;
            }
            myCamera.updateProjectionMatrix();
            myRenderer.render(myScene, myCamera);
        }

        // manage art info display
        let closeImage = null;
        for (const [imageId, imagePosition] of Object.entries(myArtPositionsByImageId ?? {})) {
            const distanceToArt = myCamera.position.distanceTo(imagePosition);
            if (distanceToArt < distanceThreshold) {
                closeImage = imageId;
            }
        }
        setInfoMenuImageId(closeImage);
    }, [keysPressed, myCamera?.position.x, myCamera?.position.z, exhibitionState.size, exhibitionState.images]);

    useEffect(() => {
        handleWindowResize();
    }, [editModeActive]);

    useEffect(() => {
        if (myCamera && myRenderer) {
            myCamera.aspect = canvasDimensions.width / canvasDimensions.height;
            myCamera.updateProjectionMatrix();
            myRenderer.setSize(canvasDimensions.width, canvasDimensions.height);
            myRenderer.render(myScene, myCamera);
        }
    }, [canvasDimensions]);

    // function to re-render scene when camera is rotated
    const handleControlsChange = () => {
        myRenderer.render(myScene, myCamera);
    };

    // set up event handlers for camera rotation
    useEffect(() => {
        if (canvasRef.current && myScene) {
            canvasRef.current.appendChild(myRenderer.domElement);
            canvasRef.current.addEventListener("click", () => {
                myControls.lock();
            });
            myControls.addEventListener("change", handleControlsChange);

            return () => {
                myControls.removeEventListener("change", handleControlsChange);
                if (canvasRef.current) { canvasRef.current.removeChild(myRenderer.domElement); }
            };
        }
    }, [myControls, myScene, myRenderer]);

    useEffect(() => {
        if (myScene) {
            let photosOn1 = 0;
            let photosOn2 = 0;
            let photosOn3 = 0;
            let photosOn4 = 0;

            // count photos on walls
            exhibitionState.images.forEach((image) => {
                if (image.metadata.direction === 1) { photosOn1++; } else if (image.metadata.direction === 2) { photosOn2++; } else if (image.metadata.direction === 3) { photosOn3++; } else if (image.metadata.direction === 4) { photosOn4++; }
            });

            // kind of a last minute add, but scene needs to be here for lighting, even though
            // art is not added to the scene here
            // ambient_light_intensity is added for safety in light creation
            const { all_arts_group: allArtsGroup, artPositionsByImageId } = createArt(myTextureLoader,
                photosOn1, photosOn2, photosOn3, photosOn4,
                exhibitionState.size.width_ft, exhibitionState.size.length_ft, exhibitionState.size.height_ft, 1 / 12,
                getAmbientLightIntensity(exhibitionState.appearance.moodiness), myScene, myRenderer, myCamera, exhibitionState, globalImageCatalog);

            setMyArtPositionsByImageId(artPositionsByImageId);

            // setupRendering(myScene, myCamera, myRenderer, all_arts_group.children, myControls, exhibitionState.size.width_ft, exhibitionState.size.length_ft);

            return () => {
                myScene.remove(allArtsGroup);
            };
        }
    }, [myCamera, myControls, myScene, myTextureLoader, myRenderer,
        exhibitionState.images,
        exhibitionState.size
    ]);

    // Update all walls on resize
    useEffect(() => {
        if (myScene) {
            Promise.all([
                setupMainWalls(myScene, myTextureLoader, exhibitionState.size.width_ft, exhibitionState.size.length_ft, exhibitionState.size.height_ft, 5, exhibitionState.appearance.main_wall_color),
                setupSideWalls(myScene, myTextureLoader, exhibitionState.size.width_ft, exhibitionState.size.length_ft, exhibitionState.size.height_ft, 5, exhibitionState.appearance.side_wall_color),
                setupFloor(myScene, myTextureLoader, exhibitionState.size.width_ft, exhibitionState.size.length_ft, 5, exhibitionState.appearance.floor_color, exhibitionState.appearance.floor_texture),
                setupCeiling(myScene, myTextureLoader, exhibitionState.size.width_ft, exhibitionState.size.length_ft, exhibitionState.size.height_ft, exhibitionState.appearance.ceiling_color)
            ]).then(() => {
                myRenderer.render(myScene, myCamera);
            }).catch((e) => {
                console.warn(e.message);
            });
        }
    }, [myCamera, myControls, myScene, myTextureLoader, myRenderer, exhibitionState.size]);

    // Update main wall color
    useEffect(() => {
        if (myScene) {
            setupMainWalls(myScene, myTextureLoader,
                exhibitionState.size.width_ft, exhibitionState.size.length_ft, exhibitionState.size.height_ft, 5, exhibitionState.appearance.main_wall_color
            ).then(() => {
                myRenderer.render(myScene, myCamera);
            }).catch((e) => {
                console.warn(e.message);
            });
        }
    }, [myCamera, myControls, myScene, myTextureLoader, myRenderer,
        exhibitionState.appearance.main_wall_color
    ]);

    // Update side wall color
    useEffect(() => {
        if (myScene) {
            setupSideWalls(myScene, myTextureLoader,
                exhibitionState.size.width_ft, exhibitionState.size.length_ft, exhibitionState.size.height_ft, 5, exhibitionState.appearance.side_wall_color).then(() => {
                myRenderer.render(myScene, myCamera);
            }).catch((e) => {
                console.warn(e.message);
            });
        }
    }, [myCamera, myControls, myScene, myTextureLoader, myRenderer,
        exhibitionState.appearance.side_wall_color
    ]);

    // Update floor
    useEffect(() => {
        if (myScene) {
            setupFloor(myScene, myTextureLoader,
                exhibitionState.size.width_ft, exhibitionState.size.length_ft, 5,
                exhibitionState.appearance.floor_color, exhibitionState.appearance.floor_texture
            ).then(() => {
                myRenderer.render(myScene, myCamera);
            }).catch((e) => {
                console.warn(e.message);
            });
        }
    }, [myCamera, myControls, myScene, myTextureLoader, myRenderer,
        exhibitionState.appearance.floor_color,
        exhibitionState.appearance.floor_texture
    ]);

    // Update ceiling
    useEffect(() => {
        if (myScene) {
            setupCeiling(myScene, myTextureLoader,
                exhibitionState.size.width_ft, exhibitionState.size.length_ft, exhibitionState.size.height_ft,
                exhibitionState.appearance.ceiling_color).then(() => {
                myRenderer.render(myScene, myCamera);
            }).catch((e) => {
                console.warn(e.message);
            });
        }
    }, [myCamera, myControls, myScene, myTextureLoader, myRenderer,
        exhibitionState.appearance.ceiling_color
    ]);

    useEffect(() => {
        if (myScene) {
            const ambientLight = new THREE.AmbientLight(exhibitionState.appearance.ambient_light_color, getAmbientLightIntensity(exhibitionState.appearance.moodiness));
            myScene.add(ambientLight);
            myRenderer.render(myScene, myCamera);

            return () => {
                myScene.remove(ambientLight);
            };
        }
    }, [myCamera, myControls, myScene, myTextureLoader, myRenderer,
        exhibitionState.appearance.ambient_light_color, exhibitionState.appearance.moodiness]);

    return (
        <Box
            height="calc(100vh - 64px)"
            ref={containerRef}
            sx={{ position: "relative" }}
            width="100%"
        >
            <div
                id="exhibition-canvas"
                ref={canvasRef}
            />

            {exhibitionIsEditable
                ? (
                    <Fab
                        color={
                            appUser.is_admin && appUser.id !== exhibitionMetadata.exhibition_owner ? "secondary" : "primary"
                        }
                        onClick={() => {
                            if (editModeActive) {
                                setEditModeActive(false);
                            } else {
                                setEditModeActive(true);
                            }
                        }}
                        sx={{ position: "absolute", right: 20, bottom: 20 }}
                        variant="extended"
                    >
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={1}
                        >
                            {(editModeActive &&
                            <VisibilityIcon fontSize="large" />
                            ) || (!editModeActive &&
                            appUser.is_admin && appUser.id !== exhibitionMetadata.exhibition_owner
                                ? <SecurityIcon fontSize="large" />
                                : <EditIcon fontSize="large" />
                            )}

                            <Typography variant="h6">
                                {editModeActive ? "Preview" : "Edit"}
                            </Typography>
                        </Stack>
                    </Fab>
                )
                : null}

            {!editModeActive && (
                <ExhibitionIntro
                    controls={myControls}
                    dialogIsOpen={dialogIsOpen}
                    exhibitionMetadata={exhibitionMetadata}
                    setDialogIsOpen={setDialogIsOpen}
                />
            )}

            <ArtInfoPopup
                exhibitionState={exhibitionState}
                globalImageCatalog={globalImageCatalog}
                imageId={infoMenuImageId}
            />

        </Box>
    );
};

Exhibition3DViewport.propTypes = {
    editModeActive: PropTypes.bool.isRequired,
    exhibitionIsEditable: PropTypes.bool.isRequired,
    exhibitionMetadata: PropTypes.shape({
        exhibition_owner: PropTypes.number
    }).isRequired,
    exhibitionState: exhibitionStatePropTypesShape,
    globalImageCatalog: PropTypes.arrayOf(entityPropTypeShape).isRequired,
    setEditModeActive: PropTypes.func.isRequired
};

export default Exhibition3DViewport;
