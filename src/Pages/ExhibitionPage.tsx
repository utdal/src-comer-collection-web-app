import { Box } from "@mui/material";
import type { Params } from "react-router";
import { useLoaderData, useParams } from "react-router";
import { ExhibitionEditPane } from "../Components/ExhibitionPage/ExhibitionEditPane";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { exhibitionEditReducer, blankExhibitionData } from "../Components/ExhibitionPage/exhibitionEditReducer";
import Exhibition3DViewport from "../Components/Exhibition3DViewport/Exhibition3DViewport.js";
import { sendAuthenticatedRequest } from "../Helpers/APICalls";
import useAppUser from "../Hooks/useAppUser";
import { useSnackbar, useTitle } from "../ContextProviders/AppFeatures";
import type { Item } from "../index.js";
import type { ExhibitionData, ExhibitionDataAsString, ExhibitionMetadata, ExhibitionSetEverythingAction } from "../Components/ExhibitionPage/ExhibitionDispatchActionTypes.js";

interface ExhibitionPageParams extends Readonly<Params> {
    exhibitionIdParam: string;
}

interface ExhibitionPageLoaderData {
    exhibitionDataAsString: ExhibitionDataAsString | null;
    exhibitionMetadata: ExhibitionMetadata;
    globalImageCatalog: Item[];
}

const ExhibitionPage = (): React.JSX.Element => {
    const params = useParams() as ExhibitionPageParams;
    const exhibitionId = parseInt(params.exhibitionIdParam);

    const { exhibitionDataAsString, exhibitionMetadata, globalImageCatalog } = useLoaderData() as ExhibitionPageLoaderData;

    const [exhibitionState, exhibitionEditDispatch] = useReducer(exhibitionEditReducer, blankExhibitionData);
    const [editModeActive, setEditModeActive] = useState(false);

    const appUser = useAppUser();
    const showSnackbar = useSnackbar();
    const setTitleText = useTitle("Exhibition");

    const exhibitionUrl = `/api/exhibitions/${exhibitionId}/data`;

    const saveExhibition = useCallback(async () => {
        try {
            const exhibitionStateAsString: ExhibitionDataAsString = JSON.stringify(exhibitionState);
            await sendAuthenticatedRequest("PUT", exhibitionUrl, {
                data: exhibitionStateAsString
            });
            showSnackbar("Exhibition saved", "success");
        } catch (e) {
            console.log("Error saving exhibition", (e as Error).message);
            showSnackbar("Could not save exhibition", "error");
        }
    }, [exhibitionState, exhibitionUrl, showSnackbar]);

    useEffect(() => {
        if (exhibitionDataAsString != null) {
            const dispatchAction: ExhibitionSetEverythingAction = {
                scope: "exhibition",
                type: "set_everything",
                newExhibition: JSON.parse(exhibitionDataAsString) as ExhibitionData
            };
            exhibitionEditDispatch(dispatchAction);
        }
        setTitleText(exhibitionMetadata.title);
    }, [appUser, exhibitionDataAsString, exhibitionMetadata.title, setTitleText]);

    useEffect(() => {
        if (exhibitionMetadata.isEditable) {
            setEditModeActive(true);
        }
    }, [exhibitionMetadata.isEditable]);

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
                exhibitionIsEditable={exhibitionMetadata.isEditable}
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
