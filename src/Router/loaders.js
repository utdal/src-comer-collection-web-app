import { sendAuthenticatedRequest } from "../Helpers/APICalls.js";
import { Image } from "../Classes/Entities/Image.ts";

export const appUserLoader = async () => {
    if (!localStorage.getItem("token")) {
        return false;
    }
    const response = await sendAuthenticatedRequest("GET", "/api/account/profile");
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error("Network request failed");
    }
};

export const exhibitionPageLoader = async ({ params }) => {
    const exhibitionId = parseInt(params.exhibitionId);
    const exhibitionUrl = `/api/exhibitions/${exhibitionId}/data`;
    try {
        const [{ data: exhibitionData }, { data: globalImageCatalog }] = await Promise.all([
            sendAuthenticatedRequest("GET", exhibitionUrl),
            sendAuthenticatedRequest("GET", Image.baseUrl)
        ]);
        return { exhibitionData, globalImageCatalog };
    } catch (e) {
        throw new Error("Exhibition Unavailable");
    }
};
