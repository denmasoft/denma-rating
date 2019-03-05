import {voteGetByUrl,voteGetByClientUrl,voteSave} from "./controller/voteController";

/**
 * All application routes.
 */
export const AppRoutes = [
    {
        path: "/api/v1/votes/:url",
        method: "get",
        action: voteGetByUrl
    },
    {
        path: "/api/v1/client/:client_id/votes/:url",
        method: "get",
        action: voteGetByClientUrl
    },
    {
        path: "/api/v1/votes",
        method: "post",
        action: voteSave
    }
];