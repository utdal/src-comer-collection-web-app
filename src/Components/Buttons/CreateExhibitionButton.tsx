import React, { useCallback } from "react";
import { Button } from "@mui/material";
import useAppUser from "../../Hooks/useAppUser.js";
import { AddIcon } from "../../Imports/Icons.js";
import type { AppUser } from "../../index.js";
import { useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider.js";

const CreateExhibitionButton = (): React.JSX.Element => {
    const appUser = useAppUser() as AppUser;
    const { openDialogByIntentWithNoUnderlyingItems } = useManagementCallbacks();

    const handleClick = useCallback(() => {
        openDialogByIntentWithNoUnderlyingItems("exhibition-single-create");
    }, [openDialogByIntentWithNoUnderlyingItems]);

    return (
        <Button
            color="primary"
            disabled={!appUser.can_create_exhibition}
            onClick={handleClick}
            size="large"
            startIcon={<AddIcon />}
            variant="contained"
        >
            Create Exhibition
        </Button>
    );
};

export default CreateExhibitionButton;
