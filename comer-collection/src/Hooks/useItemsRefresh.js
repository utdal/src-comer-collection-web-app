import { useCallback, useState } from "react";

/**
 * Custom hook that manages fetching/refreshing items on a management page
 * @typedef {import("../ContextProviders/ManagementPageProvider.js").Item} Item
 * @param {class} Entity the type of items to fetch
 * @param {React.Dispatch<React.SetStateAction<Item[]>>} setItems the setter method for the items state
 * @returns {[() => Promise<void>, boolean, boolean]} [handleRefresh, isLoaded, isError]
 */

export const useItemsRefresh = (Entity, setItems) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleRefresh = useCallback(async () => {
        try {
            setIsError(false);
            setItems(await Entity.handleFetchAll());
            setIsLoaded(true);
        } catch (e) {
            setIsError(true);
            setIsLoaded(false);
        }
    }, [Entity, setItems]);

    return [handleRefresh, isLoaded, isError];
};
