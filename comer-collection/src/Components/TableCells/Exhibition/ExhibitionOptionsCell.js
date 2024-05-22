import React, { useCallback } from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Button, Stack, Typography } from "@mui/material";
import { OpenInNewIcon } from "../../../Imports/Icons.js";
import { ExhibitionSettingsButton } from "./ExhibitionSettingsButton";
import { ExhibitionDeleteButton } from "./ExhibitionDeleteButton";
import { useManagementCallbacks } from "../../../ContextProviders/ManagementPageProvider.js";

export const ExhibitionOptionsCell = () => {
    const exhibition = useTableRowItem();
    const {
        handleOpenExhibitionSettings,
        handleOpenExhibitionDeleteDialog
    } = useManagementCallbacks();

    const handleOpenSettings = useCallback(() => {
        handleOpenExhibitionSettings(exhibition);
    }, [exhibition, handleOpenExhibitionSettings]);

    const handleOpenDeleteDialog = useCallback(() => {
        handleOpenExhibitionDeleteDialog(exhibition);
    }, [exhibition, handleOpenExhibitionDeleteDialog]);

    return (
        <Stack
            direction="row"
            spacing={1}
        >
            <Button
                endIcon={<OpenInNewIcon />}
                href={`/Exhibitions/${exhibition.id}`}
                target="_blank"
                variant="outlined"
            >
                <Typography variant="body1">
                    Open
                </Typography>
            </Button>

            <ExhibitionSettingsButton
                onClick={handleOpenSettings}
            />

            <ExhibitionDeleteButton
                onClick={handleOpenDeleteDialog}
            />
        </Stack>
    );
};
