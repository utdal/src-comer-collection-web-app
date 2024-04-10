import { Entity } from "../Entity.js";

class Image extends Entity {
    static baseUrl = "/api/admin/images";
    static singular = "image";
    static plural = "images";

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
}

export { Image };