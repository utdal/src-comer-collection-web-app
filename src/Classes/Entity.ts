import PropTypes from "prop-types";
import { AddIcon } from "../Imports/Icons.js";
import type React from "react";
import type { EntityFieldDefinition } from "../index.js";

export const capitalized = (string: string): string => {
    return string.substr(0, 1).toUpperCase() + string.substr(1).toLowerCase();
};

export class Entity {
    public static baseUrl = null;

    public static singular = "item";

    public static plural = "items";

    public static fieldDefinitions: EntityFieldDefinition[] = [
        {
            fieldName: "id",
            displayName: "ID",
            isRequired: false
        }
    ];

    public static hasTrash = false;

    public static isTrash = false;

    public static TrashEntity = null;

    public static deleteDialogAdditionalInstructions = null;

    public static permanentDeleteDialogAdditionalInstructions = null;

    public static entityManageRelativeUrl = null;

    public static DefaultIcon: React.ElementType | null = null;

    public static searchBoxFields = ["id"];

    public static searchBoxPlaceholder = "Search items by ID";

    public static MultiCreateButtonIcon: React.ElementType | null = AddIcon;

    public static multiCreateDialogSubtitle = null;

    public static tableFields = [];

    public static fetcherUrl = null;

    public static formatDate = (date) => {
        return new Date(date).toLocaleDateString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
            weekday: "short"
        });
    };

    public static formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit"
        });
    };
}

export const entityPropTypeShape = PropTypes.shape({
    id: PropTypes.number
});

export const itemsCombinedStatePropTypeShape = PropTypes.shape({
    items: PropTypes.arrayOf(entityPropTypeShape),
    selectedItems: PropTypes.arrayOf(entityPropTypeShape),
    visibleItems: PropTypes.arrayOf(entityPropTypeShape),
    selectedVisibleItems: PropTypes.arrayOf(entityPropTypeShape),
    filterFunction: PropTypes.func
});

export const tableFieldPropTypeShape = PropTypes.shape({
    columnDescription: PropTypes.string,
    TableCellComponent: PropTypes.elementType
});
