import { Exhibition } from "../Entities/Exhibition.js";
import { User } from "../Entities/User.js";
import { Association } from "../Association.js";

class UserExhibition extends Association {
    static url = null;
    static primary = User;
    static secondary = Exhibition;

    static singular = "exhibition";
    static plural = "exhibitions";

    static secondaryFieldInPrimary = "Exhibitions";

    static tableFields = [
        {
            columnDescription: "ID",
            TableCellComponent: Exhibition.TableCells.ID
        },
        {
            columnDescription: "Title",
            TableCellComponent: Exhibition.TableCells.Title
        },
        {
            columnDescription: "Open",
            TableCellComponent: Exhibition.TableCells.OpenInNewTab
        },
        {
            columnDescription: "Created",
            TableCellComponent: Exhibition.TableCells.DateCreatedStacked
        },
        {
            columnDescription: "Modified",
            TableCellComponent: Exhibition.TableCells.DateModifiedStacked
        },
        {
            columnDescription: "Access",
            TableCellComponent: Exhibition.TableCells.Access
        }
    ];
}

export { UserExhibition };
