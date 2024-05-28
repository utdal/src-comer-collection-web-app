import { Button } from "@mui/material";
import React, { memo, useCallback, useState } from "react";
import { RefreshIcon } from "../../Imports/Icons.js";
import { sleepAsync } from "../../Helpers/sleepAsync.js";
import { useRevalidator } from "react-router";

export const RefreshButton = memo(function RefreshButton () {
    const revalidator = useRevalidator();
    const [refreshInProgress, setRefreshInProgress] = useState(false);
    const handleClickRefresh = useCallback(() => {
        revalidator.revalidate();
        sleepAsync(1000).then(() => {
            setRefreshInProgress(false);
        });
    }, [revalidator]);
    return (
        <Button
            color="primary"
            disabled={refreshInProgress}
            onClick={handleClickRefresh}
            startIcon={<RefreshIcon />}
            variant="outlined"
        >
            Refresh
        </Button>
    );
});
