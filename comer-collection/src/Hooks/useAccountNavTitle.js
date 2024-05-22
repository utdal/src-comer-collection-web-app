import { useContext, useEffect } from "react";
import { AccountNavContext } from "../ContextProviders/AccountNavProvider.js";

export const useAccountNavTitle = (newNavItemTitle) => {
    const { setSelectedNavItem } = useContext(AccountNavContext);
    useEffect(() => {
        setSelectedNavItem(newNavItemTitle);
    }, [newNavItemTitle, setSelectedNavItem]);
};
