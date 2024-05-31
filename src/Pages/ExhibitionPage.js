import { Box } from "@mui/material";
import { useLoaderData, useParams } from "react-router";
import { ExhibitionEditPane } from "../Components/ExhibitionPage/ExhibitionEditPane.js";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { exhibitionEditReducer, blankExhibitionData } from "../Components/ExhibitionPage/exhibitionEditReducer.js";
import Exhibition3DViewport from "../Components/Exhibition3DViewport/Exhibition3DViewport.js";
import { sendAuthenticatedRequest } from "../Helpers/APICalls.ts";
import { useAppUser } from "../Hooks/useAppUser.ts";
import { useSnackbar, useTitle } from "../ContextProviders/AppFeatures.tsx";

const ExhibitionPage = () => {
    const exhibitionId = parseInt(useParams().exhibitionId);

    const { exhibitionData, globalImageCatalog } = useLoaderData();

    const [exhibitionMetadata, setExhibitionMetadata] = useState(exhibitionData);

    const [exhibitionState, exhibitionEditDispatch] = useReducer(exhibitionEditReducer, blankExhibitionData);
    const [exhibitionIsEditable, setExhibitionIsEditable] = useState(false);
    const [editModeActive, setEditModeActive] = useState(false);

    // const loadCatalog = async () => {
    //     const catalogData = await sendAuthenticatedRequest("GET", "/api/images");
    //     setGlobalImageCatalog(catalogData.data);
    // };

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
        setExhibitionMetadata(exhibitionData);

        if (exhibitionData?.data) {
            exhibitionEditDispatch({
                scope: "exhibition",
                type: "set_everything",
                newExhibition: JSON.parse(exhibitionData.data)
            });
        }
        if (exhibitionData?.isEditable) {
            setExhibitionIsEditable(true);
        }
        setTitleText(exhibitionData?.title);
    }, [exhibitionData, setTitleText]);

    useEffect(() => {
        loadExhibition();
    }, [appUser, loadExhibition]);

    // useEffect(() => {
    //     loadCatalog();
    // }, []);

    const onUnload = useCallback(async () => {
        await saveExhibition();
        return false;
    }, [saveExhibition]);

    useEffect(() => {
        window.onbeforeunload = onUnload;
        return () => {
            window.onbeforeunload = null;
        };
    }, [exhibitionState, onUnload]);

    useEffect(() => {
        if (exhibitionIsEditable && !editModeActive) {
            saveExhibition();
        }
    }, [editModeActive, exhibitionIsEditable, saveExhibition]);

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

    return (
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
