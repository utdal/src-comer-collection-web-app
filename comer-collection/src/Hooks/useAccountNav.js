import { useContext } from "react";
import { AccountNavContext } from "../ContextProviders/AccountNavProvider.js";

export const useAccountNav = () => {
    const { selectedNavItem, setSelectedNavItem } = useContext(AccountNavContext);
    return [selectedNavItem, setSelectedNavItem];
};
