import { Button } from "@mui/material";
import React, { memo, useCallback, useState } from "react";
import { RefreshIcon } from "../../Imports/Icons.js";
import { useItemsLoadStatus, useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider.js";
import { sleepAsync } from "../../Helpers/sleepAsync.js";

export const RefreshButton = memo(function RefreshButton () {
    const { handleRefresh } = useManagementCallbacks();
    const [refreshInProgress, setRefreshInProgress] = useState(false);
    const [isLoaded, isError] = useItemsLoadStatus();
    const handleClickRefresh = useCallback(() => {
        setRefreshInProgress(true);
        Promise.all([
            handleRefresh(),
            sleepAsync(1000)
        ]).then(() => {
            setRefreshInProgress(false);
        });
    }, [handleRefresh]);
    return (
        <Button
            color="primary"
            disabled={refreshInProgress || !isLoaded || isError}
            onClick={handleClickRefresh}
            startIcon={<RefreshIcon />}
            variant="outlined"
        >
            Refresh
        </Button>
    );
});
