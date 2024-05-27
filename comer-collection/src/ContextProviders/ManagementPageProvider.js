import React, { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import PropTypes from "prop-types";
import { itemsCombinedStatePropTypeShape } from "../Classes/Entity.js";

/**
 *
 * @typedef {{id: number}} Item
 *
 * @typedef {{
 *      all: number,
 *      selected: number,
 *      visible: number,
 *      selectedAndVisible: number
 * }} ItemCounts
 *
 * @typedef {Object<number, Item>} ItemDictionary
 *
 * @typedef {Object<number, number|string>} SortableValueDictionary
 *
 * @typedef {{
 *      Entity: class,
 *      items: Item[],
 *      itemDictionary: ItemDictionary
 *      selectionStatuses: Object<number, boolean>,
 *      visibilityStatuses: Object<number, boolean>,
 *      filterFunction: (item: Item) => boolean | null,
 *      sortableValueDictionary: SortableValueDictionary
 *      itemCounts: ItemCounts,
 *      paginationStatus: {
 *          enabled: boolean,
 *          itemsPerPage: number,
 *          startIndex: number
 *      }
 * }} ItemsCombinedState
 *
 * @typedef {(Item) => number | string} SortableValueFunction
 *
 * @typedef {{
 *      startIndex: number,
 *      itemsPerPage: number
 *      enabled: boolean
 * }} PaginationStatus
 *
 * @typedef {(
 *  {
 *      type: "setItems"
 *      items: Item[]
 *  }|{
 *      type: "setSelectedItems",
 *      selectedItems: Item[]
 *  }|{
 *      type: "filterItems",
 *      filterFunction: (item: Item) => boolean | null
 *  }|{
 *      type: "setItemSelectionStatus",
 *      itemId: number,
 *      newStatus: boolean
 *  }|{
 *      type: "calculateSortableItemValues",
 *      sortableValueFunction: SortableValueFunction
 *  }|{
 *      type: "setPaginationEnabled",
 *      enabled: boolean
 *  }|{
 *      type: "setPaginationItemsPerPage",
 *      itemsPerPage: number
 *  }|{
 *      type: "setPaginationStartIndex",
 *      startIndex: number
 *  }
 * )} ItemsDispatchAction
 *
 *
 * @typedef {{
 *      setItems: (items: object[]) => void,
 *      setSelectedItems: (selectedItems: object[]) => void,
 *      filterItems: (filterFunction: (item: object) => boolean) => void,
 *      setItemSelectionStatus: (itemId: number, newStatus: bool) => void,
 *      calculateSortableItemValues: (sortableValueFunction: SortableValueFunction) => void,
 *      setPaginationEnabled: (enabled: boolean) => void,
 *      setPaginationItemsPerPage: (itemsPerPage: number) => void,
 *      setPaginationStartIndex: (startIndex: number) => void
 * }} ItemsCallbacks
 *
 */

/**
 * Return an itemCounts object based on an array of items,
 * and its associated selection and visibility status dictionaries
 * @param {Item[]} items
 * @param {Object<number, boolean>} selectionStatuses
 * @param {Object<number, boolean>} visibilityStatuses
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

        return {
            ...state,
            items: action.items,
            itemDictionary: newItemDictionary,
            visibilityStatuses: newVisibilityStatuses,
            itemCounts: getItemCounts(action.items, state.selectionStatuses, newVisibilityStatuses)
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
        return {
            ...state,
            visibilityStatuses: newVisibilityStatuses,
            filterFunction: action.filterFunction,
            itemCounts: getItemCounts(state.items, state.selectionStatuses, newVisibilityStatuses)
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
        const sortableValueFunction = action.sortableValueFunction;
        const newSortableValueDictionary = Object.fromEntries(state.items.map((i) => [
            i.id,
            action.sortableValueFunction ? sortableValueFunction(i) : i.id
        ]));
        return {
            ...state,
            sortableValueDictionary: newSortableValueDictionary
        };
    } else if (action.type === "setPaginationEnabled") {
        return {
            ...state,
            paginationStatus: {
                ...state.paginationStatus,
                enabled: action.enabled
            }
        };
    } else if (action.type === "setPaginationItemsPerPage") {
        return {
            ...state,
            paginationStatus: {
                ...state.paginationStatus,
                itemsPerPage: action.itemsPerPage
            }
        };
    } else if (action.type === "setPaginationStartIndex") {
        return {
            ...state,
            paginationStatus: {
                ...state.paginationStatus,
                startIndex: action.startIndex
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
     * @type {Object<number, number>}
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
            startIndex: 0
        }
    };
};

const ManagementPageContext = createContext();

/**
 * @param {{
 *      Entity: class,
 *      managementCallbacks: Object<string, () => void>,
 *      itemsCombinedState: ItemsCombinedState,
 *      setItems: (items: object[]) => void,
 *      setSelectedItems: (selectedItems: object[]) => void,
 *      setItemSelectionStatus: (itemId: number, newStatus: bool) => void,
 *      calculateSortableItemValues: (sortableValueFunction: SortableValueFunction) => void,
 *      itemsCallbacks: ItemsCallbacks,
 *      children
 * }} props
 * @returns {React.Provider}
 */
export const ManagementPageProvider = ({ Entity, managementCallbacks, itemsCombinedState, setItems, setSelectedItems, setItemSelectionStatus, calculateSortableItemValues, itemsCallbacks, children }) => {
    const contextValue = useMemo(() => {
        return {
            Entity,
            managementCallbacks,
            itemsCombinedState,
            setItems,
            setSelectedItems,
            setItemSelectionStatus,
            calculateSortableItemValues,
            itemsCallbacks
        };
    }, [Entity, managementCallbacks, itemsCombinedState, setItems, setSelectedItems, setItemSelectionStatus, calculateSortableItemValues, itemsCallbacks]);
    return (
        <ManagementPageContext.Provider value={contextValue}>
            {children}
        </ManagementPageContext.Provider>
    );
};

ManagementPageProvider.propTypes = {
    Entity: PropTypes.func.isRequired,
    calculateSortableItemValues: PropTypes.func,
    children: PropTypes.node.isRequired,
    itemsCallbacks: PropTypes.objectOf(PropTypes.func),
    itemsCombinedState: itemsCombinedStatePropTypeShape.isRequired,
    managementCallbacks: PropTypes.objectOf(PropTypes.func).isRequired,
    setItemSelectionStatus: PropTypes.func,
    setItems: PropTypes.func.isRequired,
    setSelectedItems: PropTypes.func
};

/**
 * @returns {Object.<string, function()>}
 */
export const useManagementCallbacks = () => {
    return useContext(ManagementPageContext).managementCallbacks;
};

/**
 * @returns {[Item[], function]} [items, setItems]
 */
export const useItems = () => {
    const { itemsCombinedState, setItems } = useContext(ManagementPageContext);
    return [itemsCombinedState.items, setItems];
};

/**
 * @returns {[
 *      Object<number, boolean>,
 *      (itemId: number, newStatus: bool) => void,
 *      (items: Item[]) => void
 * ]} [selectionStatuses, setItemSelectionStatus, setSelectedItems]
 */
export const useSelectionStatuses = () => {
    const { itemsCombinedState, setItemSelectionStatus, setSelectedItems } = useContext(ManagementPageContext);
    return [itemsCombinedState.selectionStatuses, setItemSelectionStatus, setSelectedItems];
};

/**
 * @returns {[Object<number, boolean>, (item: object) => boolean]} [visibilityStatuses, filterItems]
 */
export const useVisibilityStatuses = () => {
    const { itemsCombinedState, filterItems } = useContext(ManagementPageContext);
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
     *  calculateSortableItemValues: (sortableValueFunction: SortableValueFunction) => void
     * }}
     */
    const { itemsCombinedState: { sortableValueDictionary }, calculateSortableItemValues } = useContext(ManagementPageContext);
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
 * @returns {[isLoaded: boolean, isError: boolean]} [isLoaded, isError]
 */
export const useItemsLoadStatus = () => {
    return [true, false];
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
