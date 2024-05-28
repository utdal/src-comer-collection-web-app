import React from "react";
import PropTypes from "prop-types";
import { useRouteError } from "react-router";
import { WarningIcon } from "../Imports/Icons.js";
import { FullPageMessage } from "./FullPageMessage.js";

const RouterErrorMessage = ({ viewportHeight, includeLogo }) => {
    const error = useRouteError();
    return (
        <FullPageMessage
            Icon={WarningIcon}
            buttonDestination="/SignIn"
            buttonText="Home"
            includeLogo={includeLogo}
            message={error.message}
            viewportHeight={viewportHeight}
        />
    );
};

RouterErrorMessage.propTypes = {
    includeLogo: PropTypes.bool,
    viewportHeight: PropTypes.bool
};

export default RouterErrorMessage;
