import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { DeleteForeverIcon } from "../../../Imports/Icons.js";

export const PermanentDeleteButton = ({ onClick, disabled = false }) => {
    return (
        <Button
            color="error"
            disabled={disabled}
            onClick={onClick}
            startIcon={<DeleteForeverIcon />}
            variant="outlined"
        >
            Delete
        </Button>
    );
};

PermanentDeleteButton.propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired
};
