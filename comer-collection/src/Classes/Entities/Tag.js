import { TagDataCell } from "../../Components/TableCells/Tag/TagDataCell.js";
import { TagIDCell } from "../../Components/TableCells/Tag/TagIDCell.js";
import { TagImageCountCell } from "../../Components/TableCells/Tag/TagImageCountCell.js";
import TagManageOptionsArray from "../../Components/TableCells/Tag/TagManageOptionsArray.js";
import { TagNotesCell } from "../../Components/TableCells/Tag/TagNotesCell.js";
import { SellIcon } from "../../Imports/Icons.js";
import { Entity } from "../Entity.js";

class Tag extends Entity {
    static baseUrl = "/api/admin/tags";
    static singular = "tag";
    static plural = "tags";

    static fieldDefinitions = [
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

    static DefaultIcon = SellIcon;

    static searchBoxFields = ["data", "notes"];

    static tableFields = [
        {
            columnDescription: "ID",
            TableCellComponent: TagIDCell,
            generateSortableValue: (tag) => tag.id
        },
        {
            columnDescription: "Data",
            maxWidth: "300px",
            TableCellComponent: TagDataCell,
            generateSortableValue: (tag) => tag.data.toLowerCase()
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
    static baseUrl = "/api/public/tags";
};

export { Tag, PublicTag };
