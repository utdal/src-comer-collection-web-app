import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useRouteError } from "react-router";
import { WarningIcon } from "../Imports/Icons.js";
import { FullPageMessage } from "./FullPageMessage.js";

const RouterErrorMessage = ({ viewportHeight, includeLogo, suggestReload }) => {
    const handleTabReload = useCallback(() => {
        window.location.reload();
    }, []);
    const error = useRouteError();
    return (
        <FullPageMessage
            Icon={WarningIcon}
            buttonAction={suggestReload ? handleTabReload : null}
            buttonDestination={suggestReload ? null : "/SignIn"}
            buttonText={suggestReload ? "Refresh" : "Home"}
            includeLogo={includeLogo}
            message={error.message}
            viewportHeight={viewportHeight}
        />
    );
};

RouterErrorMessage.propTypes = {
    includeLogo: PropTypes.bool,
    suggestReload: PropTypes.bool,
    viewportHeight: PropTypes.bool
};

export default RouterErrorMessage;
