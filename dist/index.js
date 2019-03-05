"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const cluster = require("cluster");
const os_1 = require("os");
const express = require("express");
const bodyParser = require("body-parser");
const routes_1 = require("./routes");
const cors = require("cors");
const numCPUs = os_1.cpus().length;
if (cluster.isMaster) {
    console.log(`This machine has ${numCPUs} CPUs.`);
    for (let i = 0; i < 1; i++) {
        cluster.fork();
    }
    cluster.on("online", (worker) => {
        console.log(`Worker ${worker.process.pid} is online`);
    });
    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
        console.log("Starting a new worker...");
        cluster.fork();
    });
}
else {
    /*createConnection().then(async connection => {
        
    }).catch(error => console.log("TypeORM connection error: ", error));   */
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());
    routes_1.AppRoutes.forEach(route => {
        app[route.method](route.path, (request, response, next) => {
            route.action(request, response)
                .then(() => next)
                .catch(err => next(err));
        });
    });
    app.listen(3005);
    console.log("Rating Api up and running on port 3005");
}
//# sourceMappingURL=index.js.map