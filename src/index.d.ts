// This is not a TypeScript project (at least not yet).
// I am defining types here only to add them to JSDocs
// throughout the project, and also to help with autocomplete
// in Visual Studio Code.  While editing the project in VS Code,
// this file should be kept open in the background to allow the 
// editor to resolve the types.

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

type ItemDictionary = {
    [id: number]: Item
};

type SelectionStatusDictionary = {
    [id: number]: boolean
};

type VisibilityStatusDictionary = {
    [id: number]: boolean
};

type SortableValue = number | string;

type SortableValueDictionary = {
    [id: number]: SortableValue
};

type SortableValueFunction = (item: Item) => SortableValue;

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
    setItemSelectionStatus: (itemId: number, newStatus: boolean) => void,
    calculateSortableItemValues: (sortableValueFunction: SortableValueFunction) => void,
    setPaginationEnabled: (enabled: boolean) => void,
    setPaginationItemsPerPage: (itemsPerPage: number) => void,
    setPaginationStartIndex: (startIndex: number) => void
};

type ManagementCallbacks = {
    openDialogByIntentWithNoUnderlyingItems: OpenDialogByIntentFunctionNoUnderlyingItems,
    openDialogByIntentWithSingleUnderlyingItem: OpenDialogByIntentFunctionSingleUnderlyingItem,
    openDialogByIntentWithMultipleUnderlyingItems: OpenDialogByIntentFunctionMultipleUnderlyingItems,
    closeDialogByIntent: CloseDialogByIntentFunction
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

type AccountNavPaneLinkDefinition = {
    title: string,
    Icon: Function,
    link: string,
    requirePermanentPassword: boolean,
    displayText: string
};

type EntityFieldDefinition = {
    fieldName: string,
    displayName: string,
    isRequired: boolean,
    inputType?: "email" | "number" | "url" | "textarea" | "datetime-local",
    blank?: string | number,
    multiline?: boolean
};

type TableFieldDefinition = {
    columnDescription: string,
    TableCellComponent: () => any,
    generateSortableValue?: SortableValueFunction
};
