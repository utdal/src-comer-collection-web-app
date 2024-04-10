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
    
}

export { Tag };