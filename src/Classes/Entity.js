import PropTypes from "prop-types";
import { AddIcon } from "../Imports/Icons.js";

export const capitalized = (string): string => {
    return string.substr(0, 1).toUpperCase() + string.substr(1).toLowerCase();
};

export class Entity {
    static baseUrl = null;

    static singular = "item";

    static plural = "items";

    /**
     * @type {EntityFieldDefinition[]}
     */
    static fieldDefinitions = [
        {
            fieldName: "id",
            displayName: "ID"
        }
    ];

    static hasTrash = false;

    static isTrash = false;

    static TrashEntity = null;

    static deleteDialogAdditionalInstructions = null;

    static permanentDeleteDialogAdditionalInstructions = null;

    static entityManageRelativeUrl = null;

    /**
     * @type {React.ElementType}
     */
    static DefaultIcon = null;

    static searchBoxFields = ["id"];

    static searchBoxPlaceholder = "Search items by ID";

    static MultiCreateButtonIcon = AddIcon;

    static multiCreateDialogSubtitle = null;

    static formatDate = (date) => {
        return new Date(date).toLocaleDateString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
            weekday: "short"
        });
    };

    static formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit"
        });
    };

    static tableFields = [];

    static fetcherUrl = null;
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
