/* eslint-disable react/prop-types */
import { Entity } from "../Entity";
import ImageIDCell from "../../Components/TableCells/Image/ImageIDCell";
import ImageTitleCell from "../../Components/TableCells/Image/ImageTitleCell";
import ImagePreviewThumbnailCell from "../../Components/TableCells/Image/ImagePreviewThumbnailCell";
import ImageAccessionNumberCell from "../../Components/TableCells/Image/ImageAccessionNumberCell";
import ImageYearCell from "../../Components/TableCells/Image/ImageYearCell";
import ImageLocationCell from "../../Components/TableCells/Image/ImageLocationCell";
import ImageArtistAssignmentCell from "../../Components/TableCells/Image/ImageArtistAssignmentCell";
import ImageTagAssignmentCell from "../../Components/TableCells/Image/ImageTagAssignmentCell";
import ImageExhibitionCountCell from "../../Components/TableCells/Image/ImageExhibitionCountCell";
import ImageOptionsCell from "../../Components/TableCells/Image/ImageOptionsCell";
import ImageDeletedOptionsCell from "../../Components/TableCells/Image/ImageDeletedOptionsCell";
import { AddPhotoAlternateIcon, DeleteIcon } from "../../Imports/Icons";
import type React from "react";
import type { EntityFieldDefinition, Item, SortableValue, TableFieldDefinition } from "../..";

class Image extends Entity {
    public static baseUrl = "/api/images";

    public static singular = "image";

    public static plural = "images";

    public static MultiCreateButtonIcon = AddPhotoAlternateIcon as React.FunctionComponent;

    public static multiCreateDialogSubtitle = "You can add artists and tags after creating the images.";

    public static searchBoxFields = ["title", "valuationNotes", "otherNotes"];

    public static searchBoxPlaceholder = "Search images by title or notes";

    public static hasTrash = true;

    public static deleteDialogAdditionalInstructions = "Any exhibitions currently featuring this image will show a placeholder image instead.";

    public static fieldDefinitions: EntityFieldDefinition[] = [
        {
            fieldName: "title",
            displayName: "Image Title",
            isRequired: true
        },
        {
            fieldName: "accessionNumber",
            displayName: "Accession Number",
            isRequired: false
        },
        {
            fieldName: "year",
            displayName: "Year",
            isRequired: false,
            inputType: "number"
        },
        {
            fieldName: "additionalPrintYear",
            displayName: "Additional Print Year",
            isRequired: false,
            inputType: "number"
        },
        {
            fieldName: "url",
            displayName: "URL",
            inputType: "url",
            multiline: true,
            blank: "https://atecquilt01.utdallas.edu/comer/public/images/",
            isRequired: false
        },
        {
            fieldName: "thumbnailUrl",
            displayName: "Thumbnail URL",
            inputType: "url",
            multiline: true,
            blank: "https://atecquilt01.utdallas.edu/comer/public/images/",
            isRequired: false
        },
        {
            fieldName: "medium",
            displayName: "Medium",
            isRequired: false
        },
        {
            fieldName: "width",
            displayName: "Image Width",
            isRequired: true,
            inputType: "number"
        },
        {
            fieldName: "height",
            displayName: "Image Height",
            isRequired: true,
            inputType: "number"
        },
        {
            fieldName: "matWidth",
            displayName: "Mat Width",
            inputType: "number",
            isRequired: false
        },
        {
            fieldName: "matHeight",
            displayName: "Mat Height",
            inputType: "number",
            isRequired: false
        },
        {
            fieldName: "copyright",
            displayName: "Copyright",
            inputType: "textarea",
            multiline: true,
            isRequired: false
        },
        {
            fieldName: "location",
            displayName: "Location",
            isRequired: false
        },
        {
            fieldName: "subject",
            displayName: "Subject",
            inputType: "textarea",
            multiline: true,
            isRequired: false
        },
        {
            fieldName: "condition",
            displayName: "Condition",
            inputType: "textarea",
            isRequired: false
        },
        {
            fieldName: "valuationNotes",
            displayName: "Valuation Notes",
            inputType: "textarea",
            multiline: true,
            isRequired: false
        },
        {
            fieldName: "otherNotes",
            displayName: "Other Notes",
            inputType: "textarea",
            multiline: true,
            isRequired: false
        }
    ];

    public static tableFields: TableFieldDefinition[] = [
        {
            columnDescription: "ID",
            TableCellComponent: ImageIDCell,
            generateSortableValue: (image: Item): SortableValue => image.id
        },
        {
            columnDescription: "Title",
            TableCellComponent: ImageTitleCell,
            generateSortableValue: (image: Item): SortableValue => (image.title as string).toLowerCase()
        },
        {
            columnDescription: "Preview",
            TableCellComponent: ImagePreviewThumbnailCell
        },
        {
            columnDescription: "Accession Number",
            TableCellComponent: ImageAccessionNumberCell,
            generateSortableValue: (image: Item): SortableValue => (image.accessionNumber as string).toLowerCase()
        },
        {
            columnDescription: "Year",
            TableCellComponent: ImageYearCell,
            generateSortableValue: (image: Item): SortableValue => image.year as number
        },
        {
            columnDescription: "Location",
            TableCellComponent: ImageLocationCell
        },
        {
            columnDescription: "Artists",
            TableCellComponent: ImageArtistAssignmentCell
        },
        {
            columnDescription: "Tags",
            TableCellComponent: ImageTagAssignmentCell
        },
        {
            columnDescription: "Exhibitions",
            TableCellComponent: ImageExhibitionCountCell
        },
        {
            columnDescription: "Options",
            TableCellComponent: ImageOptionsCell
        }
    ];
}

class DeletedImage extends Image {
    public static isTrash = true;

    public static hasTrash = false;

    public static baseUrl = "/api/deletedimages";

    public static deleteDialogAdditionalInstructions = "";

    public static plural = "images";

    public static DefaultIcon = DeleteIcon as React.FunctionComponent;

    public static fetcherUrl = "/Account/Admin/Images/Trash";

    public static tableFields: TableFieldDefinition[] = [
        {
            columnDescription: "ID",
            TableCellComponent: ImageIDCell,
            generateSortableValue: (image: Item): SortableValue => image.id
        },
        {
            columnDescription: "Title",
            TableCellComponent: ImageTitleCell,
            generateSortableValue: (image: Item): SortableValue => (image.title as string).toLowerCase()
        },
        {
            columnDescription: "Preview",
            TableCellComponent: ImagePreviewThumbnailCell
        },
        {
            columnDescription: "Accession Number",
            TableCellComponent: ImageAccessionNumberCell,
            generateSortableValue: (image: Item): SortableValue => (image.accessionNumber as string).toLowerCase()
        },
        {
            columnDescription: "Location",
            TableCellComponent: ImageLocationCell
        },
        {
            columnDescription: "Exhibitions",
            TableCellComponent: ImageExhibitionCountCell
        },
        {
            columnDescription: "Options",
            TableCellComponent: ImageDeletedOptionsCell
        }
    ];
}

export { Image, DeletedImage };
