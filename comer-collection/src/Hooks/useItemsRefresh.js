import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook that fetches items of the specified Entity type
 * on first render, and returns a helper method for managing
 * fetching/refreshing items on a management page, as well as
 * status variables isLoaded and isError
 * @typedef {import("../ContextProviders/ManagementPageProvider.js").Item} Item
 * @param {class} Entity the type of items to fetch
 * @param {React.Dispatch<React.SetStateAction<Item[]>>} setItems the setter method for the items state
 * @returns {[() => Promise<void>, boolean, boolean]} [handleRefresh, isLoaded, isError]
 */

export default function useItemsRefresh (Entity, setItems, refreshCondition = true) {
    if (!Entity) {
        throw new Error("useItemsRefresh must have an entity type");
    } else if (!setItems) {
        throw new Error("useItemsRefresh needs a state setter function");
    }

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

    useEffect(() => {
        if (refreshCondition) {
            handleRefresh();
        }
    }, [handleRefresh, refreshCondition]);

    return [handleRefresh, isLoaded, isError];
};
