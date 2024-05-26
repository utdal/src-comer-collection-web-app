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
 * @typedef {{
 *      item: Item,
 *      itemString: string
 * }} ItemDictionaryEntry
 *
 * @typedef {Object<number, ItemDictionaryEntry>} ItemDictionary
 *
 * @typedef {{
 *      Entity: class,
 *      items: Item[],
 *      itemDictionary: ItemDictionary
 *      selectionStatuses: Object<number, boolean>,
 *      visibilityStatuses: Object<number, boolean>,
 *      filterFunction: (item: Item) => boolean | null,
 *      itemCounts: ItemCounts
 * }} ItemsCombinedState
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
 *  }
 * )} ItemsDispatchAction
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

/**
 * Reducer function for useItemsReducer
 * @param {ItemsCombinedState} state
 * @param {ItemsDispatchAction} action
 * @returns {ItemsCombinedState} newState
 */
const itemsReducer = (state, action) => {
    if (action.type === "setItems") {
        const newVisibilityStatuses = {};

        for (const newItem of action.items) {
            const newItemString = JSON.stringify(newItem);
            if (!state.itemDictionary[newItem.id] || state.itemDictionary[newItem.id].itemString !== newItemString) {
                state.itemDictionary[newItem.id] = {
                    item: newItem,
                    itemString: JSON.stringify(newItem)
                };
            } else {
                state.itemDictionary[newItem.id].item = newItem;
                state.itemDictionary[newItem.id].itemString = newItemString;
            }
            newVisibilityStatuses[newItem.id] = state.filterFunction ? state.filterFunction(newItem) : true;
        }

        return {
            ...state,
            items: action.items,
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
    } else {
        console.warn("itemsReducer received invalid action object", action);
        return state;
    }
};

/**
 * @param {class} Entity
 * @returns {ItemsCombinedState}
 */
const defaultItemsCombinedState = (Entity) => ({
    Entity,
    items: [],
    itemDictionary: {},
    selectionStatuses: {},
    visibilityStatuses: {},
    filterFunction: null,
    itemCounts: {
        all: 0,
        selected: 0,
        visible: 0,
        selectedAndVisible: 0
    }
});

const ManagementPageContext = createContext();

export const ManagementPageProvider = ({ isLoaded, isError, managementCallbacks, itemsCombinedState, setItems, setSelectedItems, setItemSelectionStatus, children }) => {
    const contextValue = useMemo(() => {
        return {
            managementCallbacks,
            itemsCombinedState,
            setItems,
            setSelectedItems,
            setItemSelectionStatus,
            isLoaded,
            isError
        };
    }, [managementCallbacks, itemsCombinedState, setItems, setSelectedItems, setItemSelectionStatus, isLoaded, isError]);
    return (
        <ManagementPageContext.Provider value={contextValue}>
            {children}
        </ManagementPageContext.Provider>
    );
};

ManagementPageProvider.propTypes = {
    children: PropTypes.node.isRequired,
    isError: PropTypes.bool,
    isLoaded: PropTypes.bool,
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
 * REMOVE THIS
 * @returns {[Item[], function]} [selectedItems, setSelectedItems]
 */
export const useSelectedItems = () => {
    const { setSelectedItems } = useContext(ManagementPageContext);
    return [useMemo(() => [], []), setSelectedItems];
};

/**
 * @returns {[Object<number, boolean>, (itemId: number, newStatus: bool) => void]} [selectionStatuses, setItemSelectionStatus]
 */
export const useSelectionStatuses = () => {
    const { itemsCombinedState, setItemSelectionStatus } = useContext(ManagementPageContext);
    return [itemsCombinedState.selectionStatuses, setItemSelectionStatus];
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
 * @returns {ItemCounts}
 */
export const useItemCounts = () => {
    return useContext(ManagementPageContext).itemsCombinedState.itemCounts;
};

/**
 * @returns {Class} type of entity
 */
export const useEntity = () => {
    return useContext(ManagementPageContext).itemsCombinedState.Entity;
};

/**
 * @returns {[isLoaded: boolean, isError: boolean]} [isLoaded, isError]
 */
export const useItemsLoadStatus = () => {
    const { isLoaded, isError } = useContext(ManagementPageContext);
    return [isLoaded, isError];
};

/**
 * @param {Class} Entity
 * @returns {[
 *  itemsCombinedState: ItemsCombinedState,
 *  setItems: (items: object[]) => void,
 *  setSelectedItems: (selectedItems: object[]) => void,
 *  filterItems: (filterFunction: (item: object) => boolean) => void,
 *  setItemSelectionStatus: (itemId: number, newStatus: bool) => void]}
 * [itemsCombinedState, setItems, setSelectedItems, filterItems, setItemSelectionStatus]
 */
export const useItemsReducer = (Entity) => {
    const [itemsCombinedState, itemsDispatch] = useReducer(itemsReducer, Entity, defaultItemsCombinedState);
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
    const setItemSelectionStatus = useCallback((itemId, newStatus) => {
        itemsDispatch({
            type: "setItemSelectionStatus",
            itemId,
            newStatus
        });
    }, []);
    return [itemsCombinedState, setItems, setSelectedItems, filterItems, setItemSelectionStatus];
};
