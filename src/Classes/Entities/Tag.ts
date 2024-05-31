import type React from "react";
import { TagDataCell } from "../../Components/TableCells/Tag/TagDataCell.js";
import { TagIDCell } from "../../Components/TableCells/Tag/TagIDCell.js";
import { TagImageCountCell } from "../../Components/TableCells/Tag/TagImageCountCell.js";
import TagManageOptionsArray from "../../Components/TableCells/Tag/TagManageOptionsArray.js";
import { TagNotesCell } from "../../Components/TableCells/Tag/TagNotesCell.js";
import { SellIcon } from "../../Imports/Icons.js";
import type { EntityFieldDefinition, Item, SortableValue } from "../../index.js";
import { Entity } from "../Entity";

class Tag extends Entity {
    public static baseUrl = "/api/tags";

    public static singular = "tag";

    public static plural = "tags";

    public static fetcherUrl = "/Account/Admin/Tags";

    public static entityManageRelativeUrl = "Tags";

    public static fieldDefinitions: EntityFieldDefinition[] = [
        {
            fieldName: "data",
            displayName: "Tag",
            isRequired: true
        },
        {
            fieldName: "notes",
            displayName: "Notes",
            isRequired: false,
            inputType: "textarea",
            multiline: true
        }
    ];

    public static DefaultIcon = SellIcon as React.FunctionComponent;

    public static searchBoxFields = ["data", "notes"];

    public static searchBoxPlaceholder = "Search tags by name or notes";

    /**
     * @type {TableFieldDefinition[]}
     */
    public static tableFields = [
        {
            columnDescription: "ID",
            TableCellComponent: TagIDCell,
            generateSortableValue: (tag: Item): SortableValue => tag.id
        },
        {
            columnDescription: "Data",
            maxWidth: "300px",
            TableCellComponent: TagDataCell,
            generateSortableValue: (tag: Item): SortableValue => (tag.data as string).toLowerCase()
        },
        {
            columnDescription: "Images",
            TableCellComponent: TagImageCountCell
        },
        {
            columnDescription: "Notes",
            TableCellComponent: TagNotesCell
        },
        {
            columnDescription: "Options",
            TableCellComponent: TagManageOptionsArray
        }
    ];
}

class PublicTag extends Tag {
    public static baseUrl = "/api/tags";
}

export { Tag, PublicTag };
