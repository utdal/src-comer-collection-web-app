import React from "react";
import { Button } from "@mui/material";
import { DeleteForeverIcon } from "../../../Imports/Icons";

const PermanentDeleteButton = ({ disabled = false }: {
    readonly disabled?: boolean;
}): React.JSX.Element => {
    return (
        <Button
            color="error"
            disabled={disabled}
            // onClick={onClick}
            startIcon={<DeleteForeverIcon />}
            variant="outlined"
        >
            Delete
        </Button>
    );
};

export default PermanentDeleteButton;
