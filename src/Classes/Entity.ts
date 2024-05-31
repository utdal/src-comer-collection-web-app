import PropTypes from "prop-types";
import { AddIcon } from "../Imports/Icons.js";
import type React from "react";
import type { EntityFieldDefinition, TableFieldDefinition } from "../index.js";

export const capitalized = (string: string): string => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return string.substring(0, 1).toUpperCase() + string.substr(1).toLowerCase();
};

export class Entity extends null {
    public static baseUrl = "/";

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

    public static MultiCreateButtonIcon: React.ElementType = AddIcon as React.FunctionComponent;

    public static multiCreateDialogSubtitle = "";

    public static tableFields = [] as TableFieldDefinition[];

    public static fetcherUrl = null;

    public static formatDate = (date: string): string => {
        return new Date(date).toLocaleDateString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
            weekday: "short"
        });
    };

    public static formatTime = (date: string): string => {
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
