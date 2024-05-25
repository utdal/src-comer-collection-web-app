import React, { memo } from "react";
import { Button } from "@mui/material";
import { useItemCounts, useItemsLoadStatus, useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider.js";
import { FilterAltOffOutlinedIcon } from "../../Imports/Icons.js";

export const ClearFilterButton = memo(function ClearFilterButton () {
    const itemCounts = useItemCounts();
    const { handleClearFilters } = useManagementCallbacks();
    const [isLoaded, isError] = useItemsLoadStatus();

    return (
        <Button
            color="primary"
            disabled={
                itemCounts.visible === itemCounts.all || !isLoaded || isError
            }
            onClick={handleClearFilters}
            startIcon={<FilterAltOffOutlinedIcon />}
            variant={
                itemCounts.all === 0 || itemCounts.visible > 0 ? "outlined" : "contained"
            }
        >
            Clear Filters
        </Button>
    );
});
