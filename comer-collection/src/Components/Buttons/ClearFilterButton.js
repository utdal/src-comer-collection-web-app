import React, { memo } from "react";
import { Button } from "@mui/material";
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
            Clear Filters
        </Button>
    );
});
