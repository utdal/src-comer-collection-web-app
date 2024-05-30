import { sendAuthenticatedRequest } from "../Helpers/APICalls.js";
import PropTypes from "prop-types";
import { AddIcon } from "../Imports/Icons.js";

export const capitalized = (string) => {
    return string.substr(0, 1).toUpperCase() + string.substr(1).toLowerCase();
};

export class Entity {
    static baseUrl = null;

    static singular = "item";
    static plural = "items";

    static fieldDefinitions = [
        {
            fieldName: "id",
            displayName: "ID"
        }
    ];

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

    /**
     * @returns {Promise<Object[]>} The requested data
     */
    static handleFetchAll () {
        return new Promise((resolve, reject) => {
            sendAuthenticatedRequest("GET", `${this.baseUrl}`).then((response) => {
                resolve(response.data);
            }).catch((e) => {
                reject(e);
            });
        });
    }

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
