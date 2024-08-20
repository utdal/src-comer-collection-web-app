import { Image } from "../Entities/Image";
import { Tag } from "../Entities/Tag";
import { Association } from "../Association";
import TagIDCell from "../../Components/TableCells/Tag/TagIDCell";
import TagDataCell from "../../Components/TableCells/Tag/TagDataCell";
import TagNotesCell from "../../Components/TableCells/Tag/TagNotesCell";
import type { Item, SortableValue } from "../..";

class ImageTag extends Association {
    public static url = "/api/imagetags";

    public static primary = Image;

    public static secondary = Tag;

    public static singular = "tag";

    public static plural = "tags";

    public static assignPresent = "tag";

    public static assignPast = "tagged";

    public static unassignPresent = "untag";

    public static unassignPast = "untagged";

    public static secondaryFieldInPrimary = "Tags";

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
