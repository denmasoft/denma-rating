"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const voteController_1 = require("./controller/voteController");
/**
 * All application routes.
 */
exports.AppRoutes = [
    {
        path: "/api/v1/votes/:url",
        method: "get",
        action: voteController_1.voteGetByUrl
    },
    {
        path: "/api/v1/client/:client_id/votes/:url",
        method: "get",
        action: voteController_1.voteGetByClientUrl
    },
    {
        path: "/api/v1/votes",
        method: "post",
        action: voteController_1.voteSave
    }
];
//# sourceMappingURL=routes.js.map