import React from "react";
import { Button, Typography } from "@mui/material";
import { useAppUser } from "../../ContextProviders/AppUser.js";
import { useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider.js";
import { AddIcon } from "../../Imports/Icons.js";

export const CreateExhibitionButton = () => {
    const [appUser] = useAppUser();
    const { handleOpenExhibitionCreateDialog } = useManagementCallbacks();
    return (
        <Button
            color="primary"
            disabled={!appUser.can_create_exhibition}
            onClick={handleOpenExhibitionCreateDialog}
            startIcon={<AddIcon />}
            variant="contained"
        >
            <Typography>
                Create Exhibition
            </Typography>
        </Button>
    );
};
