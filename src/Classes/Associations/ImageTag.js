import { Image } from "../Entities/Image.js";
import { Tag } from "../Entities/Tag.js";
import { Association } from "../Association.js";
import { TagIDCell } from "../../Components/TableCells/Tag/TagIDCell.js";
import { TagDataCell } from "../../Components/TableCells/Tag/TagDataCell.js";
import { TagNotesCell } from "../../Components/TableCells/Tag/TagNotesCell.js";

class ImageTag extends Association {
    static url = "/api/imagetags";
    static primary = Image;
    static secondary = Tag;

    static singular = "tag";
    static plural = "tags";

    static assignPresent = "tag";
    static assignPast = "tagged";
    static unassignPresent = "untag";
    static unassignPast = "untagged";

    static secondaryFieldInPrimary = "Tags";

    /**
     * @type {TableFieldDefinition[]}
     */
    static tableFields = [
        {
            columnDescription: "ID",
            TableCellComponent: TagIDCell,
            generateSortableValue: (tag) => tag.id
        },
        {
            columnDescription: "Tag",
            TableCellComponent: TagDataCell
        },
        {
            columnDescription: "Notes",
            TableCellComponent: TagNotesCell
        }
    ];
}

export { ImageTag };
