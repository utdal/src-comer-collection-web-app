import React, { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import PropTypes from "prop-types";
import { itemsCombinedStatePropTypeShape } from "../Classes/Entity.ts";

/**
 * Return an itemCounts object based on an array of items,
 * and its associated selection and visibility status dictionaries
 * @param {Item[]} items
 * @param {SelectionStatusDictionary} selectionStatuses
 * @param {VisibilityStatusDictionary} visibilityStatuses
 * @returns {ItemCounts}
*/
const getItemCounts = (items, selectionStatuses, visibilityStatuses) => {
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

const compareItems = (item1, item2) => {
    return JSON.stringify(item1) === JSON.stringify(item2);
};

/**
 * Given an array of items and a sortable value function,
 * compute and return the entire sortable value dictionary
 * @param {Item[]} items
 * @param {SortableValueFunction} sortableValueFunction
 * @returns {SortableValueDictionary}
 */
const getSortableItemDictionary = (items, sortableValueFunction) => {
    return Object.fromEntries(items.map((i) => [
        i.id,
        sortableValueFunction ? sortableValueFunction(i) : i.id
    ]));
};

/**
 * Helper function that enforces a specific range for a value
 * @param {number} originalValue value to test
 * @param {number} minimum enforce a minimum value
 * @param {number} maximum enforce a maximum value
 * @returns {number} The original value if within range, the minimum
 * if too low, or the maximum if too high
 */
const clampValue = (originalValue, minimum, maximum) => {
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
 * @param {number} startIndex
 * @param {number} itemsPerPage
 * @param {number} visibleItems retrieve this from ItemCounts object
 */
const calculatePaginationEndIndex = (startIndex, itemsPerPage, visibleItems) => {
    const endIndex = startIndex + itemsPerPage < visibleItems
        ? startIndex + itemsPerPage - 1
        : visibleItems - 1;
    return endIndex;
};

/**
 * Reducer function for useItemsReducer
 * @param {ItemsCombinedState} state
 * @param {ItemsDispatchAction} action
 * @returns {ItemsCombinedState} newState
 */
const itemsReducer = (state, action) => {
    if (action.type === "setItems") {
        const newVisibilityStatuses = {};
        const newItemDictionary = {};

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
        const newSelectionStatuses = {};
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
        const newVisibilityStatuses = {};

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
            filterFunction: action.filterFunction,
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
    } else if (action.type === "setPaginationStartIndex") {
        const newStartIndex = clampValue(action.startIndex, 0, state.itemCounts.visible - 1);
        return {
            ...state,
            paginationStatus: {
                ...state.paginationStatus,
                startIndex: newStartIndex,
                endIndex: calculatePaginationEndIndex(newStartIndex, state.paginationStatus.itemsPerPage, state.itemCounts.visible)
            }
        };
    } else {
        console.warn("itemsReducer received invalid action object", action);
        return state;
    }
};

/**
 * @param {Item[]} items
 * @returns {ItemsCombinedState}
 */
const defaultItemsCombinedState = (items) => {
    const itemDictionary = {};
    const selectionStatuses = {};
    const visibilityStatuses = {};
    for (const item of items) {
        itemDictionary[item.id] = item;
        selectionStatuses[item.id] = false;
        visibilityStatuses[item.id] = true;
    }
    /**
     * @type {SortableValueDictionary}
     */
    const sortableValueDictionary = Object.fromEntries(items.map((i) => [i.id, i.id]));
    return {
        items,
        itemDictionary,
        selectionStatuses,
        visibilityStatuses,
        sortableValueDictionary,
        filterFunction: null,
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

const ManagementPageContext = createContext();

/**
 * @param {{
 *      Entity: class,
 *      managementCallbacks: ManagementCallbacks,
 *      itemsCombinedState: ItemsCombinedState,
 *      itemsCallbacks: ItemsCallbacks,
 *      children
 * }} props
 * @returns {React.Provider}
 */
export const ManagementPageProvider = ({ Entity, managementCallbacks, itemsCombinedState, itemsCallbacks, children }) => {
    const contextValue = useMemo(() => {
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

/**
 * @returns {ManagementCallbacks}
 */
export const useManagementCallbacks = () => {
    return useContext(ManagementPageContext).managementCallbacks;
};

/**
 * @returns {[items: Item[], setItems: (items: Item[]) => void]} [items, setItems]
 */
export const useItems = () => {
    /**
     * @type {{ itemsCombinedState: ItemsCombinedState, itemsCallbacks: {setItems: (items: Item[]) => void}}}
     */
    const { itemsCombinedState, itemsCallbacks: { setItems } } = useContext(ManagementPageContext);
    return [itemsCombinedState.items, setItems];
};

/**
 * @returns [selectionStatuses, setItemSelectionStatus, setSelectedItems]
 */
export const useSelectionStatuses = () => {
    /**
     * @type {{ itemsCombinedState: ItemsCombinedState, itemsCallbacks: {
     *  setSelectedItems: (items: Item[]) => void,
     *  setItemSelectionStatus: (itemId: number, newStatus: boolean) => void
     * }}}
     */
    const { itemsCombinedState, itemsCallbacks: { setItemSelectionStatus, setSelectedItems } } = useContext(ManagementPageContext);
    return [itemsCombinedState.selectionStatuses, setItemSelectionStatus, setSelectedItems];
};

/**
 * @returns {[VisibilityStatusDictionary, (filterFunction: FilterFunction) => void]} [visibilityStatuses, filterItems]
 */
export const useVisibilityStatuses = () => {
    /**
     * @type {{ itemsCombinedState: ItemsCombinedState, itemsCallbacks: {
       *  filterItems: (FilterFunction) => void,
       * }}}
       */
    const { itemsCombinedState, itemsCallbacks: { filterItems } } = useContext(ManagementPageContext);
    return [itemsCombinedState.visibilityStatuses, filterItems];
};

/**
 * @returns {ItemDictionary}
 */
export const useItemDictionary = () => {
    return useContext(ManagementPageContext).itemsCombinedState.itemDictionary;
};

/**
 * @returns {{
 *  sortableValueDictionary: SortableValueDictionary,
 *  calculateSortableItemValues: (sortableValueFunction: SortableValueFunction) => void
 * }}
 */
export const useSortableValues = () => {
    /**
     * @type {{
     *  itemsCombinedState: {
     *      sortableValueDictionary: SortableValueDictionary
     *  },
     *  itemsCallbacks: {
     *      calculateSortableItemValues: (sortableValueFunction: SortableValueFunction) => void
     *  }
     * }}
     */
    const { itemsCombinedState: { sortableValueDictionary }, itemsCallbacks: { calculateSortableItemValues } } = useContext(ManagementPageContext);
    return { sortableValueDictionary, calculateSortableItemValues };
};

/**
 * @returns {ItemCounts}
 */
export const useItemCounts = () => {
    return useContext(ManagementPageContext).itemsCombinedState.itemCounts;
};

/**
 * @returns {Class} type of entity
 */
export const useEntity = () => {
    return useContext(ManagementPageContext).Entity;
};

/**
 * Allows components inside the ManagementPageContext
 * to access and modify pagination settings
 */
export const useItemsPagination = () => {
    /**
     * @type {{itemsCallbacks: ItemsCallbacks, itemsCombinedState: ItemsCombinedState}}
     */
    const { itemsCallbacks, itemsCombinedState } = useContext(ManagementPageContext);
    const { setPaginationEnabled, setPaginationItemsPerPage, setPaginationStartIndex } = itemsCallbacks;
    const { paginationStatus } = itemsCombinedState;
    return { paginationStatus, setPaginationEnabled, setPaginationItemsPerPage, setPaginationStartIndex };
};

/**
 * @param {Item[]} items
 * @returns {[
 *  itemsCombinedState: ItemsCombinedState,
 *  itemsCallbacks: ItemsCallbacks
 * ]}
 * [itemsCombinedState, { setItems, setSelectedItems, filterItems, setItemSelectionStatus }]
 */
export const useItemsReducer = ([...items]) => {
    const [itemsCombinedState, itemsDispatch] = useReducer(itemsReducer, items, defaultItemsCombinedState);
    const setItems = useCallback((items) => {
        itemsDispatch({
            type: "setItems",
            items
        });
    }, []);
    const setSelectedItems = useCallback((selectedItems) => {
        itemsDispatch({
            type: "setSelectedItems",
            selectedItems
        });
    }, []);
    const filterItems = useCallback((filterFunction) => {
        itemsDispatch({
            type: "filterItems",
            filterFunction
        });
    }, []);
    const calculateSortableItemValues = useCallback((sortableValueFunction) => {
        itemsDispatch({
            type: "calculateSortableItemValues",
            sortableValueFunction
        });
    }, []);
    const setItemSelectionStatus = useCallback((itemId, newStatus) => {
        itemsDispatch({
            type: "setItemSelectionStatus",
            itemId,
            newStatus
        });
    }, []);
    const setPaginationEnabled = useCallback((enabled) => {
        itemsDispatch({
            type: "setPaginationEnabled",
            enabled
        });
    }, []);
    const setPaginationItemsPerPage = useCallback((itemsPerPage) => {
        itemsDispatch({
            type: "setPaginationItemsPerPage",
            itemsPerPage
        });
    }, []);
    const setPaginationStartIndex = useCallback((startIndex) => {
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
