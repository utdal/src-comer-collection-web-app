import React, { createContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useRouteLoaderData } from "react-router";

export const AppUserContext = createContext();

export const AppUserProvider = ({ children }) => {
    const [appUser, setAppUser] = useState(null);

    const appUserContextValue = useMemo(() => {
        return {
            appUser,
            setAppUser
        };
    }, [appUser, setAppUser]);

    return (
        <AppUserContext.Provider value={appUserContextValue}>
            {children}
        </AppUserContext.Provider>
    );
};

AppUserProvider.propTypes = {
    children: PropTypes.node.isRequired
};

/**
 * Hook to retrieve current app user within AppUserContext
 * @returns {[object, function, function, boolean]} [appUser, setAppUser, initializeAppUser, appUserIsLoaded]
 */
export const useAppUser = () => {
    const appUser = useRouteLoaderData("root");
    return [appUser];
};
