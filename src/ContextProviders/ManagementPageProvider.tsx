import React, { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import PropTypes from "prop-types";
import { itemsCombinedStatePropTypeShape } from "../Classes/Entity";
import type { EntityType, FilterFunction, Item, ItemCounts, ItemDictionary, ItemsCallbacks, ItemsCombinedState, ItemsDispatchAction, ManagementCallbacks, PaginationStatus, SelectionStatusDictionary, SortableValueDictionary, SortableValueFunction, VisibilityStatusDictionary } from "../index.js";

/**
 * Return an itemCounts object based on an array of items,
 * and its associated selection and visibility status dictionaries
*/
const getItemCounts = (items: Item[], selectionStatuses: SelectionStatusDictionary, visibilityStatuses: VisibilityStatusDictionary): ItemCounts => {
    const itemCounts = {
        all: items.length,
        selected: 0,
        visible: 0,
        selectedAndVisible: 0
    };
    for (const { id } of items) {
        if (selectionStatuses[id]) {
            itemCounts.selected++;
        }
        if (visibilityStatuses[id]) {
            itemCounts.visible++;
        }
        if (selectionStatuses[id] && visibilityStatuses[id]) {
            itemCounts.selectedAndVisible++;
        }
    }
    return itemCounts;
};

const compareItems = (item1: Item, item2: Item): boolean => {
    return JSON.stringify(item1) === JSON.stringify(item2);
};

/**
 * Given an array of items and a sortable value function,
 * compute and return the entire sortable value dictionary
 */
const getSortableItemDictionary = (items: Item[], sortableValueFunction?: SortableValueFunction): SortableValueDictionary => {
    return Object.fromEntries(items.map((i) => [
        i.id,
        sortableValueFunction ? sortableValueFunction(i) : i.id
    ]));
};

/**
 * Helper function that enforces a specific range for a value
 * @param originalValue value to test
 * @param minimum enforce a minimum value
 * @param maximum enforce a maximum value
 * @returns The original value if within range, the minimum
 * if too low, or the maximum if too high
 */
const clampValue = (originalValue: number, minimum: number, maximum: number): number => {
    switch (true) {
    case originalValue < minimum:
        return minimum;
    case originalValue > maximum:
        return maximum;
    default:
        return originalValue;
    }
};

/**
 * Calculate the appropriate pagination end index based on the
 * start index, number of items per page, and number of visible items
 * @param startIndex
 * @param itemsPerPage
 * @param visibleItems retrieve this from ItemCounts object
 * @returns endIndex
 */
const calculatePaginationEndIndex = (startIndex: number, itemsPerPage: number, visibleItems: number): number => {
    const endIndex = startIndex + itemsPerPage < visibleItems
        ? startIndex + itemsPerPage - 1
        : visibleItems - 1;
    return endIndex;
};

/**
 * Reducer function for useItemsReducer
 * @param state
 * @param action
 * @returns newState
 */
const itemsReducer = (state: ItemsCombinedState, action: ItemsDispatchAction): ItemsCombinedState => {
    if (action.type === "setItems") {
        const newVisibilityStatuses = {} as VisibilityStatusDictionary;
        const newItemDictionary = {} as ItemDictionary;

        for (const newItem of action.items) {
            const existingItem = state.itemDictionary[newItem.id];
            newItemDictionary[newItem.id] = compareItems(newItem, existingItem)
                ? existingItem
                : newItem;

            newVisibilityStatuses[newItem.id] = state.filterFunction ? state.filterFunction(newItem) : true;
        }

        const newSortableValueDictionary = getSortableItemDictionary(action.items, state.sortableValueFunction);
        const newItemCounts = getItemCounts(action.items, state.selectionStatuses, newVisibilityStatuses);

        let newPaginationStartIndex = state.paginationStatus.startIndex;

        while (newPaginationStartIndex >= newItemCounts.visible && newPaginationStartIndex >= 1) {
            newPaginationStartIndex = clampValue(newPaginationStartIndex - state.paginationStatus.itemsPerPage, 0, newItemCounts.visible - 1);
        }

        return {
            ...state,
            items: action.items,
            itemDictionary: newItemDictionary,
            visibilityStatuses: newVisibilityStatuses,
            sortableValueDictionary: newSortableValueDictionary,
            paginationStatus: {
                ...state.paginationStatus,
                startIndex: newPaginationStartIndex,
                endIndex: calculatePaginationEndIndex(newPaginationStartIndex, state.paginationStatus.itemsPerPage, newItemCounts.visible)
            },
            itemCounts: newItemCounts
        };
    } else if (action.type === "setSelectedItems") {
        const newSelectionStatuses = {} as SelectionStatusDictionary;
        for (const { id } of action.selectedItems) {
            newSelectionStatuses[id] = true;
        }

        return {
            ...state,
            selectionStatuses: newSelectionStatuses,
            itemCounts: getItemCounts(state.items, newSelectionStatuses, state.visibilityStatuses)
        };
    } else if (action.type === "filterItems") {
        const filteredItems = state.items.filter(action.filterFunction);
        const newVisibilityStatuses = {} as VisibilityStatusDictionary;

        for (const { id } of filteredItems) {
            newVisibilityStatuses[id] = true;
        }
        const newItemCounts = getItemCounts(state.items, state.selectionStatuses, newVisibilityStatuses);
        return {
            ...state,
            paginationStatus: {
                ...state.paginationStatus,
                startIndex: 0,
                endIndex: calculatePaginationEndIndex(0, state.paginationStatus.itemsPerPage, newItemCounts.visible)
            },
            visibilityStatuses: newVisibilityStatuses,
            filterFunction: action.filterFunction as FilterFunction,
            itemCounts: newItemCounts
        };
    } else if (action.type === "setItemSelectionStatus") {
        const newSelectionStatuses = {
            ...state.selectionStatuses,
            [action.itemId]: action.newStatus
        };
        return {
            ...state,
            selectionStatuses: newSelectionStatuses,
            itemCounts: getItemCounts(state.items, newSelectionStatuses, state.visibilityStatuses)
        };
    } else if (action.type === "calculateSortableItemValues") {
        const newSortableValueDictionary = getSortableItemDictionary(state.items, action.sortableValueFunction);
        return {
            ...state,
            paginationStatus: {
                ...state.paginationStatus,
                startIndex: 0,
                endIndex: calculatePaginationEndIndex(0, state.paginationStatus.itemsPerPage, state.itemCounts.visible)
            },
            sortableValueFunction: action.sortableValueFunction,
            sortableValueDictionary: newSortableValueDictionary
        };
    } else if (action.type === "setPaginationEnabled") {
        return {
            ...state,
            paginationStatus: {
                ...state.paginationStatus,
                enabled: action.enabled,
                startIndex: 0,
                endIndex: calculatePaginationEndIndex(0, state.paginationStatus.itemsPerPage, state.itemCounts.visible)
            }
        };
    } else if (action.type === "setPaginationItemsPerPage") {
        return {
            ...state,
            paginationStatus: {
                ...state.paginationStatus,
                itemsPerPage: action.itemsPerPage,
                endIndex: calculatePaginationEndIndex(state.paginationStatus.startIndex, state.paginationStatus.itemsPerPage, state.itemCounts.visible)
            }
        };
    } else {
        const newStartIndex = clampValue(action.startIndex, 0, state.itemCounts.visible - 1); /* setPaginationStartIndex */
        return {
            ...state,
            paginationStatus: {
                ...state.paginationStatus,
                startIndex: newStartIndex,
                endIndex: calculatePaginationEndIndex(newStartIndex, state.paginationStatus.itemsPerPage, state.itemCounts.visible)
            }
        };
    }
};

const defaultItemsCombinedState = (items: Item[]): ItemsCombinedState => {
    const itemDictionary = {} as ItemDictionary;
    const selectionStatuses = {} as SelectionStatusDictionary;
    const visibilityStatuses = {} as VisibilityStatusDictionary;
    for (const item of items) {
        itemDictionary[item.id] = item;
        selectionStatuses[item.id] = false;
        visibilityStatuses[item.id] = true;
    }
    const sortableValueFunction: SortableValueFunction = (item: Item) => item.id;
    const filterFunction: FilterFunction = (item: Item) => item.id > 0;

    const sortableValueDictionary: SortableValueDictionary = Object.fromEntries(items.map((i) => [i.id, i.id]));
    return {
        items,
        itemDictionary,
        selectionStatuses,
        visibilityStatuses,
        sortableValueDictionary,
        sortableValueFunction,
        filterFunction,
        itemCounts: {
            all: items.length,
            selected: 0,
            visible: items.length,
            selectedAndVisible: 0
        },
        paginationStatus: {
            enabled: true,
            itemsPerPage: 20,
            startIndex: 0,
            endIndex: calculatePaginationEndIndex(0, 20, items.length)
        }
    };
};

interface ManagementPageContextValue {
    Entity: EntityType;
    managementCallbacks: ManagementCallbacks;
    itemsCombinedState: ItemsCombinedState;
    itemsCallbacks: ItemsCallbacks;
}

const ManagementPageContext = createContext((null as unknown) as ManagementPageContextValue);

interface ManagementPageProviderProps extends ManagementPageContextValue {
    children: React.ReactNode;
}

/**
 * @param {} props
 * @returns {React.Provider}
 */
export const ManagementPageProvider = ({ Entity, managementCallbacks, itemsCombinedState, itemsCallbacks, children }: ManagementPageProviderProps): React.JSX.Element => {
    const contextValue: ManagementPageContextValue = useMemo(() => {
        return {
            Entity,
            managementCallbacks,
            itemsCombinedState,
            itemsCallbacks
        };
    }, [Entity, managementCallbacks, itemsCombinedState, itemsCallbacks]);
    return (
        <ManagementPageContext.Provider value={contextValue}>
            {children}
        </ManagementPageContext.Provider>
    );
};

ManagementPageProvider.propTypes = {
    Entity: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    itemsCallbacks: PropTypes.objectOf(PropTypes.func),
    itemsCombinedState: itemsCombinedStatePropTypeShape.isRequired,
    managementCallbacks: PropTypes.objectOf(PropTypes.func)
};

export const useManagementCallbacks = (): ManagementCallbacks => {
    return useContext(ManagementPageContext).managementCallbacks;
};

export const useItems = (): [items: Item[], setItems: (items: Item[]) => void] => {
    const { itemsCombinedState, itemsCallbacks: { setItems } } = useContext(ManagementPageContext);
    return [itemsCombinedState.items, setItems];
};

export const useSelectionStatuses = (): [selectionStatuses: SelectionStatusDictionary, setItemSelectionStatus: (itemId: number, newStatus: boolean) => void, setSelectedItems: (items: Item[]) => void] => {
    const { itemsCombinedState, itemsCallbacks: { setItemSelectionStatus, setSelectedItems } } = useContext(ManagementPageContext);
    return [itemsCombinedState.selectionStatuses, setItemSelectionStatus, setSelectedItems];
};

export const useVisibilityStatuses = (): [visibilityStatuses: VisibilityStatusDictionary, filterItems: (filterFunction: FilterFunction) => void] => {
    const { itemsCombinedState, itemsCallbacks: { filterItems } } = useContext(ManagementPageContext);
    return [itemsCombinedState.visibilityStatuses, filterItems];
};

export const useItemDictionary = (): ItemDictionary => {
    return useContext(ManagementPageContext).itemsCombinedState.itemDictionary;
};

export const useSortableValues = (): {
    sortableValueDictionary: SortableValueDictionary;
    calculateSortableItemValues: (sortableValueFunction: SortableValueFunction) => void;
} => {
    const { itemsCombinedState: { sortableValueDictionary }, itemsCallbacks: { calculateSortableItemValues } } = useContext(ManagementPageContext);
    return { sortableValueDictionary, calculateSortableItemValues };
};

export const useItemCounts = (): ItemCounts => {
    return useContext(ManagementPageContext).itemsCombinedState.itemCounts;
};

export const useEntity = (): EntityType => {
    return useContext(ManagementPageContext).Entity;
};

/**
 * Allows components inside the ManagementPageContext
 * to access and modify pagination settings
 */
export const useItemsPagination = (): {
    paginationStatus: PaginationStatus;
    setPaginationEnabled: (enabled: boolean) => void;
    setPaginationItemsPerPage: (itemsPerPage: number) => void;
    setPaginationStartIndex: (startIndex: number) => void;
} => {
    const { itemsCallbacks, itemsCombinedState } = useContext(ManagementPageContext);
    const { setPaginationEnabled, setPaginationItemsPerPage, setPaginationStartIndex } = itemsCallbacks;
    const { paginationStatus } = itemsCombinedState;
    return { paginationStatus, setPaginationEnabled, setPaginationItemsPerPage, setPaginationStartIndex };
};

export const useItemsReducer = ([...items]: Item[]): [
    itemsCombinedState: ItemsCombinedState,
    itemsCallbacks: ItemsCallbacks
] => {
    const [itemsCombinedState, itemsDispatch] = useReducer(itemsReducer, items, defaultItemsCombinedState);
    const setItems = useCallback((newItems: Item[]) => {
        itemsDispatch({
            type: "setItems",
            items: newItems
        });
    }, []);
    const setSelectedItems = useCallback((newSelectedItems: Item[]) => {
        itemsDispatch({
            type: "setSelectedItems",
            selectedItems: newSelectedItems
        });
    }, []);
    const filterItems = useCallback((newFilterFunction: FilterFunction) => {
        itemsDispatch({
            type: "filterItems",
            filterFunction: newFilterFunction
        });
    }, []);
    const calculateSortableItemValues = useCallback((newSortableValueFunction: SortableValueFunction) => {
        itemsDispatch({
            type: "calculateSortableItemValues",
            sortableValueFunction: newSortableValueFunction
        });
    }, []);
    const setItemSelectionStatus = useCallback((itemId: number, newStatus: boolean) => {
        itemsDispatch({
            type: "setItemSelectionStatus",
            itemId,
            newStatus
        });
    }, []);
    const setPaginationEnabled = useCallback((enabled: boolean) => {
        itemsDispatch({
            type: "setPaginationEnabled",
            enabled
        });
    }, []);
    const setPaginationItemsPerPage = useCallback((itemsPerPage: number) => {
        itemsDispatch({
            type: "setPaginationItemsPerPage",
            itemsPerPage
        });
    }, []);
    const setPaginationStartIndex = useCallback((startIndex: number) => {
        itemsDispatch({
            type: "setPaginationStartIndex",
            startIndex
        });
    }, []);

    return [itemsCombinedState, {
        setItems,
        setSelectedItems,
        filterItems,
        setItemSelectionStatus,
        calculateSortableItemValues,
        setPaginationEnabled,
        setPaginationItemsPerPage,
        setPaginationStartIndex
    }];
};
