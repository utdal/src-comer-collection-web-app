import { Exhibition } from "../Entities/Exhibition";
import { User } from "../Entities/User";
import { Association } from "../Association";
import ExhibitionIDCell from "../../Components/TableCells/Exhibition/ExhibitionIDCell";
import ExhibitionTitleCell from "../../Components/TableCells/Exhibition/ExhibitionTitleCell";
import ExhibitionOpenInNewTabCell from "../../Components/TableCells/Exhibition/ExhibitionOpenInNewTabCell";
import ExhibitionDateCreatedStackedCell from "../../Components/TableCells/Exhibition/ExhibitionDateCreatedStackedCell";
import ExhibitionDateModifiedStackedCell from "../../Components/TableCells/Exhibition/ExhibitionDateModifiedStackedCell";
import ExhibitionAccessCell from "../../Components/TableCells/Exhibition/ExhibitionAccessCell";
import type { TableFieldDefinition } from "../../index.js";

class UserExhibition extends Association {
    public static primary = User;

    public static secondary = Exhibition;

    public static singular = "exhibition";

    public static plural = "exhibitions";

    public static secondaryFieldInPrimary = "Exhibitions";

    public static secondarySearchBoxFields = ["title"];

    public static secondarySearchBoxPlaceholder = "Search exhibitions by title";

    public static tableFields: TableFieldDefinition[] = [
        {
            columnDescription: "ID",
            TableCellComponent: ExhibitionIDCell
        },
        {
            columnDescription: "Title",
            TableCellComponent: ExhibitionTitleCell
        },
        {
            columnDescription: "Open",
            TableCellComponent: ExhibitionOpenInNewTabCell
        },
        {
            columnDescription: "Created",
            TableCellComponent: ExhibitionDateCreatedStackedCell
        },
        {
            columnDescription: "Modified",
            TableCellComponent: ExhibitionDateModifiedStackedCell
        },
        {
            columnDescription: "Access",
            TableCellComponent: ExhibitionAccessCell
        }
    ];
}

export { UserExhibition };
