import { Box } from "@mui/material";
import { useParams } from "react-router";
import { ExhibitionEditPane } from "../Components/ExhibitionPage/ExhibitionEditPane.js";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { exhibitionEditReducer, blankExhibitionData } from "../Components/ExhibitionPage/exhibitionEditReducer.js";
import Exhibition3DViewport from "../Components/Exhibition3DViewport/Exhibition3DViewport.js";
import { sendAuthenticatedRequest } from "../Helpers/APICalls.js";
import { useAppUser } from "../Hooks/useAppUser.js";
import { FullPageMessage } from "../Components/FullPageMessage.js";
import { useSnackbar, useTitle } from "../ContextProviders/AppFeatures.js";

import { InfoIcon } from "../Imports/Icons.js";

const ExhibitionPage = () => {
    const exhibitionId = parseInt(useParams().exhibitionId);

    const [globalImageCatalog, setGlobalImageCatalog] = useState([]);

    const [exhibitionMetadata, setExhibitionMetadata] = useState(null);

    const [exhibitionState, exhibitionEditDispatch] = useReducer(exhibitionEditReducer, blankExhibitionData);
    const [exhibitionIsLoaded, setExhibitionIsLoaded] = useState(false);
    const [isPermissionGranted, setIsPermissionGranted] = useState(false);
    const [exhibitionIsEditable, setExhibitionIsEditable] = useState(false);
    const [editModeActive, setEditModeActive] = useState(false);

    const loadCatalog = async () => {
        const catalogData = await sendAuthenticatedRequest("GET", "/api/images");
        setGlobalImageCatalog(catalogData.data);
    };

    const appUser = useAppUser();
    const showSnackbar = useSnackbar();
    const setTitleText = useTitle("Exhibition");

    const exhibitionUrl = `/api/exhibitions/${exhibitionId}/data`;

    const saveExhibition = useCallback(async () => {
        try {
            await sendAuthenticatedRequest("PUT", exhibitionUrl, {
                data: JSON.stringify(exhibitionState)
            });
            window.onbeforeunload = null;
            showSnackbar("Exhibition saved", "success");
        } catch (e) {
            console.log("Error saving exhibition", e.message);
            showSnackbar("Could not save exhibition", "error");
        }
    }, [exhibitionState, exhibitionUrl, showSnackbar]);

    const loadExhibition = useCallback(async () => {
        try {
            const exhibitionData = await sendAuthenticatedRequest("GET", exhibitionUrl);

            setIsPermissionGranted(true);

            if (exhibitionData.data) {
                setExhibitionMetadata(exhibitionData.data);

                if (exhibitionData.data?.data) {
                    exhibitionEditDispatch({
                        scope: "exhibition",
                        type: "set_everything",
                        newExhibition: JSON.parse(exhibitionData.data.data)
                    });
                }
                if (exhibitionData.data?.isEditable) {
                    setExhibitionIsEditable(true);
                }
                setTitleText(exhibitionData.data?.title);
                setExhibitionIsLoaded(true);
            }
        } catch (e) {
            console.log("Error getting permission to open exhibition", e.message);
            setIsPermissionGranted(false);
            setTitleText("Exhibition Unavailable");
        }
    }, [exhibitionUrl, setTitleText]);

    useEffect(() => {
        loadExhibition();
    }, [appUser, loadExhibition]);

    useEffect(() => {
        if (isPermissionGranted) {
            loadCatalog();
        }
    }, [isPermissionGranted]);

    const onUnload = useCallback(async () => {
        await saveExhibition();
        return false;
    }, [saveExhibition]);

    useEffect(() => {
        if (exhibitionIsLoaded) {
            window.onbeforeunload = onUnload;
            return () => {
                window.onbeforeunload = null;
            };
        }
    }, [exhibitionState, exhibitionIsLoaded, onUnload]);

    useEffect(() => {
        if (exhibitionIsLoaded && !editModeActive) {
            saveExhibition();
        }
    }, [editModeActive, exhibitionIsLoaded, saveExhibition]);

    const handleControlS = useCallback((e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
            e.preventDefault();
            saveExhibition();
        }
    }, [saveExhibition]);

    useEffect(() => {
        if (editModeActive) {
            document.addEventListener("keydown", handleControlS);
            return () => {
                document.removeEventListener("keydown", handleControlS);
            };
        }
    }, [editModeActive, handleControlS]);

    return (!isPermissionGranted &&
        <FullPageMessage
            Icon={InfoIcon}
            buttonDestination="/Exhibitions"
            buttonText="View Public Exhibitions"
            message="This exhibition is not available"
        />
    ) || (isPermissionGranted &&
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "grid",
                gridTemplateRows: "1fr",
                gridTemplateColumns: editModeActive ? "calc(100vw - 300px) 300px" : "100vw 0px",
                gridTemplateAreas: `
                    "viewer editpane"
                `
            }}
        >

            <Exhibition3DViewport
                editModeActive={editModeActive}
                exhibitionIsEditable={exhibitionIsEditable}
                exhibitionIsLoaded={exhibitionIsLoaded}
                exhibitionMetadata={exhibitionMetadata}
                exhibitionState={exhibitionState}
                globalImageCatalog={globalImageCatalog}
                setEditModeActive={setEditModeActive}
                sx={{
                    gridArea: "viewer",
                    width: "100%",
                    height: "calc(100vh - 64px)"
                }}
            />

            {editModeActive
                ? (
                    <ExhibitionEditPane
                        editModeActive={editModeActive}
                        exhibitionEditDispatch={exhibitionEditDispatch}
                        exhibitionId={exhibitionId}
                        exhibitionIsLoaded={exhibitionIsLoaded}
                        exhibitionMetadata={exhibitionMetadata}
                        exhibitionState={exhibitionState}
                        globalImageCatalog={globalImageCatalog}
                        saveExhibition={saveExhibition}
                        setEditModeActive={setEditModeActive}
                        sx={{
                            gridArea: "editpane",
                            display: editModeActive ? "" : "none"
                        }}
                    />
                )
                : null}

        </Box>
    );
};

export default ExhibitionPage;
