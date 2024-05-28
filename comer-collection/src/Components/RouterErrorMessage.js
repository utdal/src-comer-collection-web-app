import React from "react";
import { useRouteError } from "react-router";
import { WarningIcon } from "../Imports/Icons.js";
import { FullPageMessage } from "./FullPageMessage.js";

const RouterErrorMessage = () => {
    const error = useRouteError();
    return (
        <FullPageMessage
            Icon={WarningIcon}
            buttonDestination="/SignIn"
            buttonText="Home"
            includeLogo
            message={error.message}
        />
    );
};

export default RouterErrorMessage;
