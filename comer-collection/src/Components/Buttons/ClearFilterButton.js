import React, { memo } from "react";
import { Button, Typography } from "@mui/material";
import { useItemCounts, useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider.js";
import { FilterAltOffOutlinedIcon } from "../../Imports/Icons.js";

export const ClearFilterButton = memo(function ClearFilterButton () {
    const itemCounts = useItemCounts();
    const { handleClearFilters } = useManagementCallbacks();
    return (
        <Button
            color="primary"
            disabled={
                itemCounts.visible === itemCounts.all
            }
            onClick={handleClearFilters}
            startIcon={<FilterAltOffOutlinedIcon />}
            variant={
                itemCounts.visible > 0 ? "outlined" : "contained"
            }
        >
            <Typography variant="body1">
                Clear Filters
            </Typography>
        </Button>
    );
});
