import React from "react";
import { IconButton } from "@mui/material";
import { SettingsIcon } from "../../../Imports/Icons";

const ExhibitionSettingsButton = ({ disabled = false }: {
    readonly disabled?: boolean;
}): React.JSX.Element => {
    return (
        <IconButton
            disabled={disabled}
            // onClick={onClick}
        >
            <SettingsIcon />
        </IconButton>
    );
};

export default ExhibitionSettingsButton;
