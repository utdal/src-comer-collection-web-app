import type { APIResponse } from "../Helpers/APICalls";
import { sendAuthenticatedRequest } from "../Helpers/APICalls";
import { Image } from "../Classes/Entities/Image";
import type { LoaderFunction, Params } from "react-router";
import type { ExhibitionDataAsString, ExhibitionMetadata } from "../Components/ExhibitionPage/ExhibitionDispatchActionTypes";

export const appUserLoader: LoaderFunction = async () => {
    if (localStorage.getItem("token") == null) {
        return false;
    }
    const response = await sendAuthenticatedRequest("GET", "/api/account/profile");
    if (response.status === 200) {
        console.log(response.data);
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
        const [{ data: exhibitionDataAndMetadata }, { data: globalImageCatalog }] = await Promise.all([
            sendAuthenticatedRequest("GET", exhibitionUrl),
            sendAuthenticatedRequest("GET", Image.baseUrl)
        ]) as [APIResponse, APIResponse];
        const { data: exhibitionDataAsString, ...exhibitionMetadata } = exhibitionDataAndMetadata as {
            data: ExhibitionDataAsString;
            exhibitionMetadata: ExhibitionMetadata;
        };
        return { exhibitionDataAsString, exhibitionMetadata, globalImageCatalog };
    } catch (e) {
        throw new Error(`Exhibition Unavailable ${(e as Error).message}`);
    }
};
