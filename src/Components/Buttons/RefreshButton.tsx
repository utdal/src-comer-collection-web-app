import { Button } from "@mui/material";
import React, { useCallback } from "react";
import { RefreshIcon } from "../../Imports/Icons";
import { useRevalidator } from "react-router";

const RefreshButton = (): React.JSX.Element => {
    const revalidator = useRevalidator();
    const handleClickRefresh = useCallback(() => {
        revalidator.revalidate();
    }, [revalidator]);
    return (
        <Button
            color="primary"
            disabled={revalidator.state === "loading"}
            onClick={handleClickRefresh}
            startIcon={<RefreshIcon />}
            variant="outlined"
        >
            Refresh
        </Button>
    );
};

export default RefreshButton;
