import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { RestoreIcon } from "../../../Imports/Icons.js";

export const RestoreButton = ({ onClick, disabled = false }) => {
    return (
        <Button
            color="primary"
            disabled={disabled}
            onClick={onClick}
            startIcon={<RestoreIcon />}
            variant="outlined"
        >
            Restore
        </Button>
    );
};

RestoreButton.propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired
};
