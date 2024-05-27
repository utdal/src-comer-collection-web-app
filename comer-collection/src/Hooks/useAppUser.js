import { useRouteLoaderData } from "react-router";

/**
 * Hook to retrieve current app user within React Router Context
 * @returns {[object, function, function, boolean]} [appUser, setAppUser, initializeAppUser, appUserIsLoaded]
 */

export const useAppUser = () => {
    const appUser = useRouteLoaderData("root");
    return appUser;
};
