import React from "react";
import { Button } from "@mui/material";
import useAppUser from "../../Hooks/useAppUser.js";
import { AddIcon } from "../../Imports/Icons.js";
import type { AppUser } from "../../index.js";

const CreateExhibitionButton = (): React.JSX.Element => {
    const appUser = useAppUser() as AppUser;
    // const { handleOpenExhibitionCreateDialog } = useManagementCallbacks();
    return (
        <Button
            color="primary"
            disabled={!appUser.can_create_exhibition}
            // onClick={handleOpenExhibitionCreateDialog}
            size="large"
            startIcon={<AddIcon />}
            variant="contained"
        >
            Create Exhibition
        </Button>
    );
};

export default CreateExhibitionButton;
