import React from "react";
import { Button } from "@mui/material";
import { useItemCounts } from "../../ContextProviders/ManagementPageProvider";
import { FilterAltOffOutlinedIcon } from "../../Imports/Icons";

const ClearFilterButton = (): React.JSX.Element => {
    const itemCounts = useItemCounts();
    // const { handleClearFilters } = useManagementCallbacks();
    return (
        <Button
            color="primary"
            disabled={
                itemCounts.visible === itemCounts.all
            }
            // onClick={handleClearFilters}
            startIcon={<FilterAltOffOutlinedIcon />}
            variant={
                itemCounts.visible > 0 ? "outlined" : "contained"
            }
        >
            Clear Filters
        </Button>
    );
};

export default ClearFilterButton;
