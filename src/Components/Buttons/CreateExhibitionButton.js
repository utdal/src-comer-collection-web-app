import React from "react";
import { Button } from "@mui/material";
import { useAppUser } from "../../Hooks/useAppUser.js";
import { useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider.js";
import { AddIcon } from "../../Imports/Icons.js";

export const CreateExhibitionButton = () => {
    const appUser = useAppUser();
    const { handleOpenExhibitionCreateDialog } = useManagementCallbacks();
    return (
        <Button
            color="primary"
            disabled={!appUser.can_create_exhibition}
            onClick={handleOpenExhibitionCreateDialog}
            size="large"
            startIcon={<AddIcon />}
            variant="contained"
        >
            Create Exhibition
        </Button>
    );
};
