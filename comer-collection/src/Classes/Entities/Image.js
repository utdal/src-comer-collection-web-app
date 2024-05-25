/* eslint-disable react/prop-types */
import { Entity } from "../Entity.js";
import { ImageIDCell } from "../../Components/TableCells/Image/ImageIDCell.js";
import { ImageTitleCell } from "../../Components/TableCells/Image/ImageTitleCell.js";
import { ImagePreviewThumbnailCell } from "../../Components/TableCells/Image/ImagePreviewThumbnailCell.js";
import { ImageAccessionNumberCell } from "../../Components/TableCells/Image/ImageAccessionNumberCell.js";
import { ImageYearCell } from "../../Components/TableCells/Image/ImageYearCell.js";
import { ImageLocationCell } from "../../Components/TableCells/Image/ImageLocationCell.js";
import { ImageArtistAssignmentCell } from "../../Components/TableCells/Image/ImageArtistAssignmentCell.js";
import { ImageTagAssignmentCell } from "../../Components/TableCells/Image/ImageTagAssignmentCell.js";
import { ImageExhibitionCountCell } from "../../Components/TableCells/Image/ImageExhibitionCountCell.js";
import { ImageOptionsCell } from "../../Components/TableCells/Image/ImageOptionsCell.js";
import { AddPhotoAlternateIcon } from "../../Imports/Icons.js";

class Image extends Entity {
    static baseUrl = "/api/admin/images";
    static singular = "image";
    static plural = "images";

    static MultiCreateButtonIcon = AddPhotoAlternateIcon;
    static multiCreateDialogSubtitle = "You can add artists and tags after creating the images.";

    static searchBoxFields = ["title", "valuationNotes", "otherNotes"];
    static searchBoxPlaceholder = ["Search images by title or notes"];

    static fieldDefinitions = [
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
            blank: "https://atecquilt01.utdallas.edu/comer/public/images/"
        },
        {
            fieldName: "thumbnailUrl",
            displayName: "Thumbnail URL",
            inputType: "url",
            multiline: true,
            blank: "https://atecquilt01.utdallas.edu/comer/public/images/"
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
            inputType: "number"
        },
        {
            fieldName: "matHeight",
            displayName: "Mat Height",
            inputType: "number"
        },
        {
            fieldName: "copyright",
            displayName: "Copyright",
            inputType: "textarea",
            multiline: true
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
            multiline: true
        },
        {
            fieldName: "condition",
            displayName: "Condition",
            inputType: "textarea"
        },
        {
            fieldName: "valuationNotes",
            displayName: "Valuation Notes",
            inputType: "textarea",
            multiline: true
        },
        {
            fieldName: "otherNotes",
            displayName: "Other Notes",
            inputType: "textarea",
            multiline: true
        }
    ];

    static tableFields = [
        {
            columnDescription: "ID",
            TableCellComponent: ImageIDCell,
            generateSortableValue: (image) => image.id
        },
        {
            columnDescription: "Title",
            TableCellComponent: ImageTitleCell,
            generateSortableValue: (image) => image.title.toLowerCase()
        },
        {
            columnDescription: "Preview",
            TableCellComponent: ImagePreviewThumbnailCell
        },
        {
            columnDescription: "Accession Number",
            TableCellComponent: ImageAccessionNumberCell,
            generateSortableValue: (image) => image.accessionNumber?.toLowerCase()
        },
        {
            columnDescription: "Year",
            TableCellComponent: ImageYearCell,
            generateSortableValue: (image) => image.year
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

class PublicImage extends Image {
    static baseUrl = "/api/public/images";
};

export { Image, PublicImage };
