// This is not a TypeScript project (at least not yet).
// I am defining types here only to add them to JSDocs
// throughout the project, and also to help with autocomplete
// in Visual Studio Code.

type Item = {
    id: number,
    [x: string]: any
};

type ItemCounts = {
    all: number,
    selected: number,
    visible: number,
    selectedAndVisible: number
};

type ItemDictionary = Object<number, Item>;

type SelectionStatusDictionary = Object<number, boolean>;

type VisibilityStatusDictionary = Object<number, boolean>;

type SortableValueDictionary = Object<number, number|string>;

type SortableValueFunction = (item: Item) => number | string;

type FilterFunction = (item: Item) => boolean;

type PaginationStatus = {
    enabled: boolean,
    itemsPerPage: number,
    startIndex: number,
    endIndex: number
};

type ItemsCombinedState = {
    items: Item[],
    itemDictionary: ItemDictionary
    selectionStatuses: SelectionStatusDictionary,
    visibilityStatuses: VisibilityStatusDictionary,
    filterFunction: FilterFunction,
    sortableValueDictionary: SortableValueDictionary,
    sortableValueFunction: SortableValueFunction
    itemCounts: ItemCounts,
    paginationStatus: PaginationStatus;
};

type ItemsDispatchAction = (
    {
        type: "setItems"
        items: Item[]
    }|{
        type: "setSelectedItems",
        selectedItems: Item[]
    }|{
        type: "filterItems",
        filterFunction: (item: Item) => boolean | null
    }|{
        type: "setItemSelectionStatus",
        itemId: number,
        newStatus: boolean
    }|{
        type: "calculateSortableItemValues",
        sortableValueFunction: SortableValueFunction
    }|{
        type: "setPaginationEnabled",
        enabled: boolean
    }|{
        type: "setPaginationItemsPerPage",
        itemsPerPage: number
    }|{
        type: "setPaginationStartIndex",
        startIndex: number
    }
);

type ItemsCallbacks = {
    setItems: (items: object[]) => void,
    setSelectedItems: (selectedItems: object[]) => void,
    filterItems: (filterFunction: FilterFunction) => void,
    setItemSelectionStatus: (itemId: number, newStatus: bool) => void,
    calculateSortableItemValues: (sortableValueFunction: SortableValueFunction) => void,
    setPaginationEnabled: (enabled: boolean) => void,
    setPaginationItemsPerPage: (itemsPerPage: number) => void,
    setPaginationStartIndex: (startIndex: number) => void
};

type ManagementCallbacks = {
    openDialogByIntentWithNoUnderlyingItems: import("../Hooks/useDialogStates.js").OpenDialogByIntentFunctionNoUnderlyingItems,
    openDialogByIntentWithSingleUnderlyingItem: import("../Hooks/useDialogStates.js").OpenDialogByIntentFunctionSingleUnderlyingItem,
    openDialogByIntentWithMultipleUnderlyingItems: import("../Hooks/useDialogStates.js").OpenDialogByIntentFunctionMultipleUnderlyingItems,
    closeDialogByIntent: import("../Hooks/useDialogStates.js").CloseDialogByIntentFunction
};

type Intent = "single-delete" | "multi-delete" | "single-edit" | "multi-create" | "user-reset-password" | "user-change-activation-status" | "user-change-privileges";

type RouterActionRequest = (
    {
        intent: "single-delete",
        itemId: number
    }|{
        intent: "single-permanent-delete",
        itemId: number
    }|{
        intent: "single-restore",
        itemId: number
    }|{
        intent: "multi-delete",
        itemIds: number[]
    }|{
        intent: "single-edit",
        itemId: number,
        body: Item
    }|{
        intent: "multi-create",
        body: {
            itemsToCreate: Item[]
        }
    }|{
        intent: "user-reset-password",
        userId: number,
        body: {
            newPassword: string
        }
    }|{
        intent: "user-change-activation-status",
        userId: number,
        body: {
            newStatus: boolean
        }
    }|{
        intent: "user-change-privileges",
        userId: number,
        body: {
            newRole: "CURATOR" | "COLLECTION_MANAGER" | "ADMINISTRATOR"
        }
    }
);

type RouterActionResponse = (
    {
        status: "success",
        message: string,
        snackbarText: string
    }|{
        status: "error",
        error: string,
        snackbarText: string
    }|{
        status: "partial",
        indicesWithErrors: number[],
        errors: (string | null)[],
        snackbarText: string
    }|{
        status: "partial",
        itemIdsWithErrors: number[],
        snackbarText: string
    }
);

type DialogItemsMultiplicity = "none" | "single" | "multi";

type DialogState = (
    {
        dialogIsOpen: boolean,
        dialogItemsMultiplicity: "none"
    }|{
        dialogIsOpen: boolean,
        dialogItemsMultiplicity: "single",
        underlyingItem: Item
    }|{
        dialogIsOpen: boolean,
        dialogItemsMultiplicity: "multi"
        underlyingItems: Item[]
    }
);

type DialogStateDictionary = {
    [S in Intent]: DialogState
};

type DialogStateAction = (
    {
        type: "open",
        dialogIntent: Intent,
        dialogItemsMultiplicity: "single",
        underlyingItem: Item
    }|{
        type: "open",
        dialogIntent: Intent,
        dialogItemsMultiplicity: "multi",
        underlyingItems: Item[]
    }|{
        type: "open",
        dialogIntent: Intent,
        dialogItemsMultiplicity: "none"
    }|{
        type: "close",
        dialogIntent: Intent
    }
);

type MultiCreateDialogDispatchAction = (
    {
        type: "add"
    }|{
        type: "change",
        index: number,
        field: string,
        newValue: any
    }|{
        type: "remove",
        index: number
    }|{
        type: "filterByIndex",
        indicesToKeep: number[]
    }|{
        type: "set",
        newArray: Item[]
    }
);

type OpenDialogByIntentFunctionNoUnderlyingItems = (intent: Intent) => void;

type OpenDialogByIntentFunctionSingleUnderlyingItem = (intent: Intent, item: Item) => void;

type OpenDialogByIntentFunctionMultipleUnderlyingItems = (intent: Intent, items: Item[]) => void;

type CloseDialogByIntentFunction = (intent: Intent) => void;
