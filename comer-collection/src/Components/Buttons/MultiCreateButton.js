import { Button, Typography } from "@mui/material";
import React from "react";
import { useEntity, useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider.js";

/**
 * Button to open MultiCreateDialog on a management page.
 *
 * Must be inside a ManagementPageProvider with a function
 * handleOpenMultiCreateDialog inside managementCallbacks.
 */
export const MultiCreateButton = () => {
    const Entity = useEntity();
    const { handleOpenMultiCreateDialog } = useManagementCallbacks();
    return (
        <Button
            color="primary"
            onClick={handleOpenMultiCreateDialog}
            startIcon={<Entity.MultiCreateButtonIcon />}
            variant="contained"
        >
            <Typography variant="body1">
                {"Create "}

                {Entity.plural}
            </Typography>
        </Button>
    );
};
