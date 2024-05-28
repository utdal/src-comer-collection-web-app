import React from "react";
import PropTypes from "prop-types";

const FullLogo = ({ maxWidth = 200 }) => {
    return (
        <img
            src="/images/logo_square_orange.png"
            style={{ maxWidth }}
        />
    );
};

FullLogo.propTypes = {
    maxWidth: PropTypes.number
};

export default FullLogo;
