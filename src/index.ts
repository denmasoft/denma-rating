import "reflect-metadata";
import * as cluster from "cluster";
import {cpus} from "os"; 
import {Request, Response} from "express";
import * as express from "express";
import * as bodyParser from "body-parser";
import {AppRoutes} from "./routes";
import * as cors from "cors";
const numCPUs = cpus().length;
 
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
 
} else {
    /*createConnection().then(async connection => {
        
    }).catch(error => console.log("TypeORM connection error: ", error));   */
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());
    AppRoutes.forEach(route => {
        app[route.method](route.path, (request: Request, response: Response, next: Function) => {
            route.action(request, response)
                .then(() => next)
                .catch(err => next(err));
        });
    });
    app.listen(3005);
    console.log("Rating Api up and running on port 3005");
}

