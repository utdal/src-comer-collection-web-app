import React from "react";
import { Button } from "@mui/material";
import { RestoreIcon } from "../../../Imports/Icons.js";

const RestoreButton = ({ disabled = false }: {
    readonly disabled?: false;
}): React.JSX.Element => {
    return (
        <Button
            color="primary"
            disabled={disabled}
            // onClick={onClick}
            startIcon={<RestoreIcon />}
            variant="outlined"
        >
            Restore
        </Button>
    );
};

export default RestoreButton;
