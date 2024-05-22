import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

export const AppUserContext = createContext();

export const AppUserProvider = ({ children }) => {
    const [appUser, setAppUser] = useState(null);
    const [appUserIsLoaded, setAppUserIsLoaded] = useState(false);

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

    useEffect(() => {
        initializeAppUser().then(() => {
            setAppUserIsLoaded(true);
        });
    }, [initializeAppUser]);

    const appUserContextValue = useMemo(() => {
        return {
            appUser,
            setAppUser,
            initializeAppUser,
            appUserIsLoaded
        };
    }, [appUser, setAppUser, initializeAppUser, appUserIsLoaded]);

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
    const { appUser, setAppUser, initializeAppUser, appUserIsLoaded } = useContext(AppUserContext);
    return [appUser, setAppUser, initializeAppUser, appUserIsLoaded];
};
