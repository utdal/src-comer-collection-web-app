import { Image } from "../Entities/Image.js";
import { Tag } from "../Entities/Tag.js";
import { Association } from "../Association.js";

class ImageTag extends Association {
    static url = "/api/admin/imagetags";
    static primary = Image;
    static secondary = Tag;

    static singular = "tag";
    static plural = "tags";

    static assignPresent = "tag";
    static assignPast = "tagged";
    static unassignPresent = "untag";
    static unassignPast = "untagged";

    static secondaryFieldInPrimary = "Tags";

    static tableFields = [
        {
            columnDescription: "ID",
            TableCellComponent: Tag.TableCells.ID,
            generateSortableValue: (tag) => tag.id
        },
        {
            columnDescription: "Tag",
            TableCellComponent: Tag.TableCells.Data
        },
        {
            columnDescription: "Notes",
            TableCellComponent: Tag.TableCells.Notes
        }
    ];
}

export { ImageTag };
