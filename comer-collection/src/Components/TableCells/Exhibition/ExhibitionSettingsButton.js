import React from "react";
import { IconButton } from "@mui/material";
import { SettingsIcon } from "../../../Imports/Icons.js";
import PropTypes from "prop-types";

export const ExhibitionSettingsButton = ({ onClick, disabled }) => {
    return (
        <IconButton
            disabled={disabled}
            onClick={onClick}
        >
            <SettingsIcon />
        </IconButton>
    );
};

ExhibitionSettingsButton.propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired
};

ExhibitionSettingsButton.defaultProps = {
    disabled: false
};
