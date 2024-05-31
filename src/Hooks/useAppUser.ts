import { useRouteLoaderData } from "react-router";
import type { AppUser } from "../index.js";

/**
 * Hook to retrieve current app user within React Router Context
 */
export const useAppUser = (): AppUser | false | null => {
    const appUser = useRouteLoaderData("root") as AppUser;
    return appUser;
};
