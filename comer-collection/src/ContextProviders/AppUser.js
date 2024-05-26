import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useRouteLoaderData } from "react-router";

export const AppUserContext = createContext();

export const AppUserProvider = ({ children }) => {
    const [appUser, setAppUser] = useState(null);

    const initializeAppUser = useCallback(async () => {
        try {
            if (!localStorage.getItem("token")) {
                throw new Error("No user is logged in");
            }
            const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/user/profile`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.status === 200) {
                const responseJson = await response.json();
                setAppUser(responseJson.data);
            } else {
                throw new Error("Response status was not 200");
            }
        } catch (error) {
            setAppUser(null);
        }
    }, []);

    const appUserContextValue = useMemo(() => {
        return {
            appUser,
            setAppUser,
            initializeAppUser
        };
    }, [appUser, setAppUser, initializeAppUser]);

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
    const { setAppUser, initializeAppUser } = useContext(AppUserContext);
    const appUser = useRouteLoaderData("root");
    return [appUser, setAppUser, initializeAppUser, true];
};
