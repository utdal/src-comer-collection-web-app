import { Button } from "@mui/material";
import React, { memo } from "react";
import { useEntity, useItemsLoadStatus, useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider.js";

/**
 * Button to open MultiCreateDialog on a management page.
 *
 * Must be inside a ManagementPageProvider with a function
 * handleOpenMultiCreateDialog inside managementCallbacks.
 */
export const MultiCreateButton = memo(function MultiCreateButton () {
    const Entity = useEntity();
    const { handleOpenMultiCreateDialog } = useManagementCallbacks();
    const [isLoaded, isError] = useItemsLoadStatus();

    return (
        <Button
            color="primary"
            disabled={!isLoaded || isError}
            onClick={handleOpenMultiCreateDialog}
            startIcon={<Entity.MultiCreateButtonIcon />}
            variant="contained"
        >
            {"Create "}

            {Entity.plural}
        </Button>
    );
});
