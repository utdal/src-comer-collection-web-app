import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { OpenInNewIcon } from "../../../Imports/Icons";
import ExhibitionSettingsButton from "./ExhibitionSettingsButton";
import ExhibitionDeleteButton from "./ExhibitionDeleteButton";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ExhibitionItem } from "../../../index.js";

const ExhibitionOptionsCell = (): React.JSX.Element => {
    const exhibition = useTableCellItem() as ExhibitionItem;
    // const {
    //     handleOpenExhibitionSettings,
    //     handleOpenExhibitionDeleteDialog
    // } = useManagementCallbacks();

    // const handleOpenSettings = useCallback(() => {
    //     handleOpenExhibitionSettings(exhibition);
    // }, [exhibition, handleOpenExhibitionSettings]);

    // const handleOpenDeleteDialog = useCallback(() => {
    //     handleOpenExhibitionDeleteDialog(exhibition);
    // }, [exhibition, handleOpenExhibitionDeleteDialog]);

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

            <ExhibitionSettingsButton />

            <ExhibitionDeleteButton />
        </Stack>
    );
};

export default ExhibitionOptionsCell;
