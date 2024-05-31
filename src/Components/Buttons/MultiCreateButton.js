import { Button } from "@mui/material";
import React, { memo, useCallback } from "react";
import { useEntity, useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider.js";

/**
 * Button to open MultiCreateDialog on a management page.
 *
 * Must be inside a ManagementPageProvider with a function
 * handleOpenMultiCreateDialog inside managementCallbacks.
 */
export const MultiCreateButton = memo(function MultiCreateButton () {
    const Entity = useEntity();
    const { openDialogByIntentWithNoUnderlyingItems } = useManagementCallbacks();
    const handleOpenMultiCreateDialog = useCallback(() => {
        openDialogByIntentWithNoUnderlyingItems("multi-create");
    }, [openDialogByIntentWithNoUnderlyingItems]);
    return (
        <Button
            color="primary"
            onClick={handleOpenMultiCreateDialog}
            startIcon={<Entity.MultiCreateButtonIcon />}
            variant="contained"
        >
            {"Create "}

            {Entity.plural}
        </Button>
    );
});
