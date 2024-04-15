import { Entity } from "../Entity.js";

class Artist extends Entity {
    static baseUrl = "/api/admin/artists";
    static singular = "artist";
    static plural = "artists";

    static fieldDefinitions = [
        {
            fieldName: "familyName",
            displayName: "Last Name",
            isRequired: true
        },
        {
            fieldName: "givenName",
            displayName: "First Name",
            isRequired: true
        },
        {
            fieldName: "website",
            displayName: "Website",
            isRequired: false,
            inputType: "url"
        },
        {
            fieldName: "notes",
            displayName: "Notes",
            isRequired: false,
            inputType: "textarea",
            multiline: true,
            blank: ""
        }
    ];
}

export { Artist };
