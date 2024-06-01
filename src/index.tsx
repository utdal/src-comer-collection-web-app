import React from "react";
import "./index.css";
import App from "./App";
import { createRoot } from "react-dom/client";
import type { Container } from "react-dom/client";
import type { Artist } from "./Classes/Entities/Artist";
import type { Course } from "./Classes/Entities/Course";
import type { Exhibition, PublicExhibition } from "./Classes/Entities/Exhibition";
import type { Tag } from "./Classes/Entities/Tag";
import type { User } from "./Classes/Entities/User";
import type { DeletedImage, Image } from "./Classes/Entities/Image";
import type { ImageArtist } from "./Classes/Associations/ImageArtist";
import type { ImageTag } from "./Classes/Associations/ImageTag";
import type { ImageExhibition } from "./Classes/Associations/ImageExhibition";
import type { EnrollmentCoursePrimary, EnrollmentUserPrimary } from "./Classes/Associations/Enrollment";
import type { UserExhibition } from "./Classes/Associations/UserExhibition";

export type CourseStatus = "Active" | "Expired" | "Upcoming";

export type ItemGenericFieldValue = boolean[] | number[] | object[] | string[] | boolean | number | object | string | null | undefined;

export interface Item {
    [x: string]: ItemGenericFieldValue;
    id: number;
    safe_display_name: string;
}

export interface SecondaryItem extends Item {
    readonly quantity_assigned: number;
}

export interface ArtistItem extends Item {
    website: string | null;
    notes: string | null;
    familyName: string;
    givenName: string;
    fullName: string;
    fullNameReverse: string;
    Images?: Item[];
}

export interface TagItem extends Item {
    notes: string | null;
    data: string;
    Images?: Item[];
}

export interface ImageItem extends Item {
    Artists?: Item[];
    Tags?: Item[];
    accessionNumber: string | null;
    Exhibitions?: Item[];
    location: string | null;
    title: string;
    year: number | null;
}

export interface CourseItem extends Item {
    date_start: string;
    date_end: string;
    notes?: string;
    Users?: Item[];
    status: CourseStatus;
    name: string;
}

export interface UserItem extends Item {
    given_name?: string;
    family_name?: string;
    full_name_reverse: string;
    email: string;
    is_active: boolean;
    has_password: boolean;
    is_admin: boolean;
    is_admin_or_collection_manager: boolean;
    is_collection_manager: boolean;
    Courses?: Item[];
    Exhibitions?: Item[];
    exhibition_quota: number;
    has_name: boolean;
    pw_updated: string;
    pw_change_required: boolean;
    can_create_exhibition: boolean;
}

export type ExhibitionPrivacy = "PRIVATE" | "PUBLIC_ANONYMOUS" | "PUBLIC";

export interface ExhibitionItem extends Item {
    privacy: ExhibitionPrivacy;
    curator: string;
    date_created: string;
    date_modified: string;
    title: string | null;
    User: Item;
}

export type EntityType = typeof Artist | typeof Course | typeof DeletedImage | typeof Exhibition | typeof Image | typeof PublicExhibition | typeof Tag | typeof User;

export type AssociationType = typeof EnrollmentCoursePrimary | typeof EnrollmentUserPrimary | typeof ImageArtist | typeof ImageExhibition | typeof ImageTag | typeof UserExhibition;

export type AppUser = UserItem;

export interface ItemCounts {
    all: number;
    selected: number;
    visible: number;
    selectedAndVisible: number;
}

export type ItemDictionary = Record<number, Item>;

export type SelectionStatusDictionary = Record<number, boolean>;

export type VisibilityStatusDictionary = Record<number, boolean>;

export type SortableValue = Date | number | string;

export type SortableValueDictionary = Record<number, SortableValue>;

export type SortableValueFunction = (item: Item) => SortableValue;

export type FilterFunction = (item: Item) => boolean;

export interface PaginationStatus {
    enabled: boolean;
    itemsPerPage: number;
    startIndex: number;
    endIndex: number;
}

export interface ItemsCombinedState {
    items: Item[];
    itemDictionary: ItemDictionary;
    selectionStatuses: SelectionStatusDictionary;
    visibilityStatuses: VisibilityStatusDictionary;
    filterFunction?: FilterFunction | null;
    sortableValueDictionary: SortableValueDictionary;
    sortableValueFunction: SortableValueFunction;
    itemCounts: ItemCounts;
    paginationStatus: PaginationStatus;
}

export type ItemsDispatchAction = (
    {
        type: "calculateSortableItemValues";
        sortableValueFunction: SortableValueFunction;
    } | {
        type: "filterItems";
        filterFunction: (item: Item) => boolean | null;
    } | {
        type: "setItems";
        items: Item[];
    } | {
        type: "setItemSelectionStatus";
        itemId: number;
        newStatus: boolean;
    } | {
        type: "setPaginationEnabled";
        enabled: boolean;
    } | {
        type: "setPaginationItemsPerPage";
        itemsPerPage: number;
    } | {
        type: "setPaginationStartIndex";
        startIndex: number;
    } | {
        type: "setSelectedItems";
        selectedItems: Item[];
    }
);

export interface ItemsCallbacks {
    setItems: (items: Item[]) => void;
    setSelectedItems: (selectedItems: Item[]) => void;
    filterItems: (filterFunction: FilterFunction) => void;
    setItemSelectionStatus: (itemId: number, newStatus: boolean) => void;
    calculateSortableItemValues: (sortableValueFunction: SortableValueFunction) => void;
    setPaginationEnabled: (enabled: boolean) => void;
    setPaginationItemsPerPage: (itemsPerPage: number) => void;
    setPaginationStartIndex: (startIndex: number) => void;
}

export type Intent = "multi-create" | "multi-delete" | "single-delete" | "single-edit" | "single-permanent-delete" | "single-restore" | "user-change-activation-status" | "user-change-privileges" | "user-reset-password";

export type OpenDialogByIntentFunctionNoUnderlyingItems = (intent: Intent) => void;

export type OpenDialogByIntentFunctionSingleUnderlyingItem = (intent: Intent, item: Item) => void;

export type OpenDialogByIntentFunctionMultipleUnderlyingItems = (intent: Intent, items: Item[]) => void;

export type CloseDialogByIntentFunction = (intent: Intent) => void;

export interface ManagementCallbacks {
    openDialogByIntentWithNoUnderlyingItems: OpenDialogByIntentFunctionNoUnderlyingItems;
    openDialogByIntentWithSingleUnderlyingItem: OpenDialogByIntentFunctionSingleUnderlyingItem;
    openDialogByIntentWithMultipleUnderlyingItems: OpenDialogByIntentFunctionMultipleUnderlyingItems;
    closeDialogByIntent: CloseDialogByIntentFunction;
}

export type RouterActionRequest = (
    {
        intent: "multi-create";
        body: {
            itemsToCreate: object[];
        };
    } | {
        intent: "multi-delete";
        itemIds: number[];
    } | {
        intent: "single-delete";
        itemId: number;
    } | {
        intent: "single-edit";
        itemId: number;
        body: object;
    } | {
        intent: "single-permanent-delete";
        itemId: number;
    } | {
        intent: "single-restore";
        itemId: number;
    } | {
        intent: "user-change-activation-status";
        userId: number;
        body: {
            newStatus: boolean;
        };
    } | {
        intent: "user-change-privileges";
        userId: number;
        body: {
            newRole: "ADMINISTRATOR" | "COLLECTION_MANAGER" | "CURATOR";
        };
    } | {
        intent: "user-reset-password";
        userId: number;
        body: {
            newPassword: string;
        };
    }
);

export interface RouterActionResponseBase {
    status: "error" | "partial-by-id" | "partial-by-index" | "success";
    snackbarText: "string";
}

export interface RouterActionSuccessResponse extends RouterActionResponseBase {
    status: "success";
}

export interface RouterActionErrorResponse extends RouterActionResponseBase {
    status: "error";
}

export interface RouterActionPartialByIndexResponse extends RouterActionResponseBase {
    status: "partial-by-index";
    indicesWithErrors: number[];
    errors: (string | null)[];
}

export interface RouterActionPartialByItemIdResponse extends RouterActionResponseBase {
    status: "partial-by-id";
    itemIdsWithErrors: number[];
    errorsByItemId: Record<number, string>;
}

export type RouterActionResponse = RouterActionErrorResponse | RouterActionPartialByIndexResponse | RouterActionPartialByItemIdResponse | RouterActionSuccessResponse;

export type DialogItemsMultiplicity = "multi" | "none" | "single";

export interface DialogStateBase {
    dialogIsOpen: boolean;
    dialogItemsMultiplicity: DialogItemsMultiplicity;
}

export interface DialogStateNoUnderlyingItems extends DialogStateBase {
    dialogItemsMultiplicity: "none";
}

export interface DialogStateSingleUnderlyingItem extends DialogStateBase {
    dialogItemsMultiplicity: "single";
    underlyingItem: Item | null;
}

export interface DialogStateMultipleUnderlyingItems extends DialogStateBase {
    dialogItemsMultiplicity: "multi";
    underlyingItems: Item[];
}

export type DialogState = DialogStateMultipleUnderlyingItems | DialogStateNoUnderlyingItems | DialogStateSingleUnderlyingItem;

export type DialogStateDictionary = Record<Intent, DialogState>;

interface DialogStateActionBase {
    dialogIntent: Intent;
    dialogItemsMultiplicity: DialogItemsMultiplicity;
    type: "close" | "open";
}

interface DialogStateOpenSingleItemAction extends DialogStateActionBase {
    type: "open";
    underlyingItem: Item;
    dialogItemsMultiplicity: "single";
}

interface DialogStateOpenMultipleItemsAction extends DialogStateActionBase {
    type: "open";
    underlyingItems: Item[];
    dialogItemsMultiplicity: "multi";
}

interface DialogStateOpenNoItemsAction extends DialogStateActionBase {
    type: "open";
    dialogItemsMultiplicity: "none";
}

interface DialogStateCloseAction extends DialogStateActionBase {
    type: "close";
}

export type DialogStateAction = DialogStateCloseAction | DialogStateOpenMultipleItemsAction | DialogStateOpenNoItemsAction | DialogStateOpenSingleItemAction;

export type MultiCreateDialogDispatchAction = (
    {
        type: "add";
    } | {
        type: "change";
        index: number;
        field: string;
        newValue: number | string;
    } | {
        type: "filterByIndex";
        indicesToKeep: number[];
    } | {
        type: "remove";
        index: number;
    } | {
        type: "set";
        newArray: Item[];
    }
);

export interface NavPaneLinkDefinition {
    requirePermanentPassword: boolean;
    title: string;
    link: string;
    displayText: string;
    Icon: React.ElementType;
}

export interface EntityFieldDefinition {
    maxlength: number;
    fieldName: string;
    displayName: string;
    isRequired: boolean;
    inputType?: "datetime-local" | "email" | "number" | "textarea" | "url";
    blank?: number | string;
    multiline?: boolean;
    maxValue?: number;
    minValue?: number;
}

export interface TableFieldDefinition {
    columnDescription: string;
    maxWidth?: string;
    TableCellComponent: React.ElementType;
    generateSortableValue?: SortableValueFunction;
}

const container = document.getElementById("root") as Container;
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
