import React from "react";
import PropTypes from "prop-types";
import { DeleteButton } from "../Entity/DeleteButton.js";

export const ExhibitionDeleteButton = ({ onClick }) => {
    return (
        <DeleteButton onClick={onClick} />
    );
};

ExhibitionDeleteButton.propTypes = {
    onClick: PropTypes.func.isRequired
};
