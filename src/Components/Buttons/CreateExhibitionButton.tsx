import React, { useCallback } from "react";
import { Button } from "@mui/material";
import useAppUser from "../../Hooks/useAppUser";
import { AddIcon } from "../../Imports/Icons";
import type { AppUser } from "../../index";
import { useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider";

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
