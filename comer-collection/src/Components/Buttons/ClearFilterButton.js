import React, { memo } from "react";
import { Button, Typography } from "@mui/material";
import { useItems, useManagementCallbacks, useVisibleItems } from "../../ContextProviders/ManagementPageProvider.js";
import { FilterAltOffOutlinedIcon } from "../../Imports/Icons.js";

export const ClearFilterButton = memo(function ClearFilterButton () {
    const [items] = useItems();
    const [visibleItems] = useVisibleItems();
    const { handleClearFilters } = useManagementCallbacks();
    return (
        <Button
            color="primary"
            disabled={
                visibleItems.length === items.length
            }
            onClick={handleClearFilters}
            startIcon={<FilterAltOffOutlinedIcon />}
            variant={
                visibleItems.length > 0 ? "outlined" : "contained"
            }
        >
            <Typography variant="body1">
                Clear Filters
            </Typography>
        </Button>
    );
});
