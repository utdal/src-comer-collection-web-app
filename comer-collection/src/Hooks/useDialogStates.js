import { useCallback, useReducer } from "react";

/**
 * @type {Object<string, import("../Classes/buildRouterAction").DialogItemsMultiplicity>}
 */
const dialogItemsMultiplicityByIntent = {
    "single-permanent-delete": "single",
    "single-restore": "single",
    "single-edit": "single",
    "multi-create": "none",
    "user-reset-password": "single",
    "user-change-activation-status": "single"
};

/**
 * @typedef {{
 *  dialogIsOpen: boolean,
 *  dialogItemsMultiplicity: "none"
 * }|{
 *  dialogIsOpen: boolean,
 *  dialogItemsMultiplicity: "single",
 *  underlyingItem: import("../ContextProviders/ManagementPageProvider").Item
 * }|{
 *  dialogIsOpen: boolean,
 *  dialogItemsMultiplicity: "multi"
 *  underlyingItems: import("../ContextProviders/ManagementPageProvider").Item[]
 * }} DialogState
 *
 * @typedef {Object<string, DialogState>} DialogStateDictionary
 */

/**
 * @param {import("../Classes/buildRouterAction").Intent[]} intentArray
 * @returns {DialogStateDictionary}
 */
const generateDefaultDialogStates = (intentArray) => {
    /**
     * @type {DialogStateDictionary}
     */
    const output = {};
    for (const intent of intentArray) {
        output[intent] = {
            dialogIsOpen: false,
            dialogItemsMultiplicity: dialogItemsMultiplicityByIntent[intent] ?? "none",
            underlyingItem: null,
            underlyingItems: []
        };
    }
    return output;
};

/**
 * @typedef {{
 *  type: "open",
 *  dialogIntent: Intent,
 *  dialogItemsMultiplicity: "single",
 *  underlyingItem: import("../ContextProviders/ManagementPageProvider").Item
 * }|{
 *  type: "open",
 *  dialogIntent: Intent,
 *  dialogItemsMultiplicity: "multi",
 *  underlyingItems: import("../ContextProviders/ManagementPageProvider").Item[]
 * }|{
 *  type: "open",
 *  dialogIntent: Intent,
 *  dialogItemsMultiplicity: "none"
 * }|{
 *  type: "close",
 *  dialogIntent: Intent
 * }} DialogStateAction
 */

/**
 * Reducer function for useDialogStates
 * @param {DialogStateDictionary} state
 * @param {DialogStateAction} action
 * @returns {DialogStateDictionary}
 */
const dialogStateReducer = (state, action) => {
    const correctMultiplicity = state[action.dialogIntent].dialogItemsMultiplicity;
    if (action.type === "open") {
        if (correctMultiplicity !== action.dialogItemsMultiplicity) {
            throw new Error(`The dialog with intent ${action.dialogIntent} 
            has multiplicity ${correctMultiplicity}, 
            but the DialogStateAction dispatched has multiplicity ${action.dialogItemsMultiplicity}`);
        }
        switch (correctMultiplicity) {
        case "multi":
            return {
                ...state,
                [action.dialogIntent]: {
                    ...state[action.dialogIntent],
                    dialogIsOpen: true,
                    underlyingItems: action.underlyingItems
                }
            };
        case "single":
            return {
                ...state,
                [action.dialogIntent]: {
                    ...state[action.dialogIntent],
                    dialogIsOpen: true,
                    underlyingItem: action.underlyingItem
                }
            };
        case "none":
            return {
                ...state,
                [action.dialogIntent]: {
                    ...state[action.dialogIntent],
                    dialogIsOpen: true
                }
            };
        default:
            throw new Error(`Action contains invalid dialogItemsMultiplicity ${action.dialogItemsMultiplicity}`);
        }
    } else if (action.type === "close") {
        switch (correctMultiplicity) {
        case "multi":
            return {
                ...state,
                [action.dialogIntent]: {
                    ...state[action.dialogIntent],
                    dialogIsOpen: false,
                    underlyingItems: []
                }
            };
        case "single":
            return {
                ...state,
                [action.dialogIntent]: {
                    ...state[action.dialogIntent],
                    dialogIsOpen: false,
                    underlyingItem: null
                }
            };
        case "none":
            return {
                ...state,
                [action.dialogIntent]: {
                    ...state[action.dialogIntent],
                    dialogIsOpen: false
                }
            };
        default:
            console.warn("Correct multiplicity was not calculated correctly in dialogStateReducer");
            return state;
        }
    }
    return state;
};

/**
 * @typedef {import("../Classes/buildRouterAction").Intent} Intent
 * @typedef {import("../ContextProviders/ManagementPageProvider").Item} Item
 *
 * Hook to help manage the states of multiple dialogs
 * @typedef {(intent: Intent) => void} OpenDialogByIntentFunctionNoUnderlyingItems
 * @typedef {(intent: Intent, item, Item) => void} OpenDialogByIntentFunctionSingleUnderlyingItem
 * @typedef {(intent: Intent, items: Item[]) => void} OpenDialogByIntentFunctionMultipleUnderlyingItems
 * @typedef {(intent: Intent) => void} CloseDialogByIntentFunction
 *
 * @type {(intentArray: Intent[]) => {
 *      dialogStateDictionary: DialogStateDictionary,
 *      openDialogByIntentWithNoUnderlyingItems: OpenDialogByIntentFunctionNoUnderlyingItems,
 *      openDialogByIntentWithSingleUnderlyingItem: OpenDialogByIntentFunctionSingleUnderlyingItem,
 *      openDialogByIntentWithMultipleUnderlyingItems: OpenDialogByIntentFunctionMultipleUnderlyingItems,
 *      closeDialogByIntent: CloseDialogByIntentFunction
 *  }}
 */
const useDialogStates = ([...intentArray]) => {
    const [dialogStateDictionary, dialogStateDispatch] = useReducer(dialogStateReducer, intentArray, generateDefaultDialogStates);

    /**
     * @type {(intent: Intent) => void}
     */
    const openDialogByIntentWithNoUnderlyingItems = useCallback((intent) => {
        dialogStateDispatch({
            type: "open",
            dialogIntent: intent,
            dialogItemsMultiplicity: "none"
        });
    }, []);

    /**
     * @type {(intent: Intent, item: Item) => void}
     */
    const openDialogByIntentWithSingleUnderlyingItem = useCallback((intent, item) => {
        dialogStateDispatch({
            type: "open",
            dialogIntent: intent,
            dialogItemsMultiplicity: "single",
            underlyingItem: item
        });
    }, []);

    /**
     * @type {(intent: Intent, items: Item[]) => void}
     */
    const openDialogByIntentWithMultipleUnderlyingItems = useCallback((intent, items) => {
        dialogStateDispatch({
            type: "open",
            dialogIntent: intent,
            dialogItemsMultiplicity: "multi",
            underlyingItems: items
        });
    }, []);

    /**
     * @type {(intent: Intent) => void}
     */
    const closeDialogByIntent = useCallback((intent) => {
        dialogStateDispatch({
            type: "close",
            dialogIntent: intent
        });
    }, []);
    return {
        dialogStateDictionary,
        openDialogByIntentWithNoUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem,
        openDialogByIntentWithMultipleUnderlyingItems,
        closeDialogByIntent
    };
};

export default useDialogStates;
