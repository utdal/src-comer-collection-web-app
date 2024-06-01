import PropTypes from "prop-types";
import ExhibitionAccessCell from "../../Components/TableCells/Exhibition/ExhibitionAccessCell";
import ExhibitionDateCreatedStackedCell from "../../Components/TableCells/Exhibition/ExhibitionDateCreatedStackedCell";
import ExhibitionDateModifiedStackedCell from "../../Components/TableCells/Exhibition/ExhibitionDateModifiedStackedCell";
import ExhibitionIDCell from "../../Components/TableCells/Exhibition/ExhibitionIDCell";
import ExhibitionOptionsCell from "../../Components/TableCells/Exhibition/ExhibitionOptionsCell";
import ExhibitionOwnerStackedNameEmailCell from "../../Components/TableCells/Exhibition/ExhibitionOwnerStackedNameEmailCell";
import ExhibitionTitleCell from "../../Components/TableCells/Exhibition/ExhibitionTitleCell";
import type { ExhibitionItem, Item, SortableValue, TableFieldDefinition } from "../../index";
import { Entity, entityPropTypeShape } from "../Entity";
import ExhibitionOpenInCurrentTabCell from "../../Components/TableCells/Exhibition/ExhibitionOpenInCurrentTabCell";
import ExhibitionDateCreatedCell from "../../Components/TableCells/Exhibition/ExhibitionDateCreatedCell";
import ExhibitionDateModifiedCell from "../../Components/TableCells/Exhibition/ExhibitionDateModifiedCell";

class Exhibition extends Entity {
    public static baseUrl = "/api/exhibitions";

    public static singular = "exhibition";

    public static plural = "exhibitions";

    public static searchBoxFields = ["title"];

    public static searchBoxPlaceholder = "Search by title";

    public static deleteDialogRequireTypedConfirmation = true;

    public static tableFields: TableFieldDefinition[] = [
        {
            columnDescription: "ID",
            TableCellComponent: ExhibitionIDCell,
            generateSortableValue: (exhibition: Item): SortableValue => exhibition.id
        },
        {
            columnDescription: "Title",
            maxWidth: "150px",
            TableCellComponent: ExhibitionTitleCell,
            generateSortableValue: (exhibition: Item): SortableValue => (exhibition.title as string).toLowerCase()
        },
        {
            columnDescription: "Owner",
            TableCellComponent: ExhibitionOwnerStackedNameEmailCell,
            generateSortableValue: (exhibition: Item): SortableValue => ((exhibition.User as Item).full_name_reverse as string).toLowerCase()
        },
        {
            columnDescription: "Created",
            TableCellComponent: ExhibitionDateCreatedStackedCell,
            generateSortableValue: (exhibition: Item): SortableValue => new Date(exhibition.date_created as string)
        },
        {
            columnDescription: "Modified",
            TableCellComponent: ExhibitionDateModifiedStackedCell,
            generateSortableValue: (exhibition: Item): SortableValue => new Date(exhibition.date_modified as string)
        },
        {
            columnDescription: "Access",
            TableCellComponent: ExhibitionAccessCell
        },
        {
            columnDescription: "Options",
            TableCellComponent: ExhibitionOptionsCell
        }
    ];
}

class MyExhibition extends Exhibition {
    public static tableFields: TableFieldDefinition[] = [
        {
            columnDescription: "Title",
            maxWidth: "200px",
            TableCellComponent: ExhibitionTitleCell,
            generateSortableValue: (item: Item): SortableValue => ((item as ExhibitionItem).title ?? "").toLowerCase()
        },
        {
            columnDescription: "Open",
            TableCellComponent: ExhibitionOpenInCurrentTabCell
        },
        {
            columnDescription: "Date Created",
            TableCellComponent: ExhibitionDateCreatedCell,
            generateSortableValue: (item: Item): SortableValue => new Date((item as ExhibitionItem).date_created)
        },
        {
            columnDescription: "Date Modified",
            TableCellComponent: ExhibitionDateModifiedCell,
            generateSortableValue: (item: Item): SortableValue => new Date((item as ExhibitionItem).date_modified)
        },
        {
            columnDescription: "Access",
            TableCellComponent: ExhibitionAccessCell
        },
        {
            columnDescription: "Options",
            TableCellComponent: ExhibitionOptionsCell
        }
    ];
}

class PublicExhibition extends Exhibition {
    public static baseUrl = "/api/exhibitions?public_only=1";
}

export const exhibitionStatePropTypesShape = PropTypes.shape({
    size: PropTypes.shape({
        length_ft: PropTypes.number,
        width_ft: PropTypes.number,
        height_ft: PropTypes.number
    }),
    appearance: PropTypes.shape({
        moodiness: PropTypes.string,
        main_wall_color: PropTypes.string,
        side_wall_color: PropTypes.string,
        floor_color: PropTypes.string,
        floor_texture: PropTypes.string,
        ceiling_color: PropTypes.string,
        ambient_light_color: PropTypes.string
    }),
    images: PropTypes.arrayOf(entityPropTypeShape)
});

export { Exhibition, MyExhibition, PublicExhibition };
