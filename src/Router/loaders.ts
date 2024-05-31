import { sendAuthenticatedRequest } from "../Helpers/APICalls.js";
import { Image } from "../Classes/Entities/Image.js";
import type { LoaderFunction, Params } from "react-router";

export const appUserLoader: LoaderFunction = async () => {
    if (localStorage.getItem("token") == null) {
        return false;
    }
    const response = await sendAuthenticatedRequest("GET", "/api/account/profile");
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error("Network request failed");
    }
};

export const exhibitionPageLoader: LoaderFunction = async ({ params }: {
    readonly params: Params;
}) => {
    const exhibitionId = parseInt((params as { exhibitionId: string }).exhibitionId);
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
