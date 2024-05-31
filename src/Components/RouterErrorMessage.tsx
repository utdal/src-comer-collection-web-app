import React, { useCallback } from "react";
import { useRouteError } from "react-router";
import { WarningIcon } from "../Imports/Icons.js";
import { FullPageMessage } from "./FullPageMessage";

const RouterErrorMessage = ({ viewportHeight, includeLogo, suggestReload }: {
    readonly viewportHeight?: boolean;
    readonly includeLogo?: boolean;
    readonly suggestReload?: boolean;
}): React.JSX.Element => {
    const handleTabReload = useCallback(() => {
        window.location.reload();
    }, []) as () => void;

    const error = useRouteError() as Error;
    return (
        <FullPageMessage
            Icon={WarningIcon as React.FunctionComponent}
            buttonAction={(suggestReload === true) ? handleTabReload : undefined}
            buttonDestination={(suggestReload === true) ? undefined : "/SignIn"}
            buttonText={(suggestReload === true) ? "Refresh" : "Home"}
            includeLogo={includeLogo}
            message={error.message}
            viewportHeight={viewportHeight}
        />
    );
};

export default RouterErrorMessage;
