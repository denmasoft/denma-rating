var System = require('systemjs');
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
System.register("entity/Vote", ["typeorm"], function (exports_1, context_1) {
    "use strict";
    var typeorm_1, Vote;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (typeorm_1_1) {
                typeorm_1 = typeorm_1_1;
            }
        ],
        execute: function () {
            Vote = class Vote {
            };
            __decorate([
                typeorm_1.PrimaryGeneratedColumn(),
                __metadata("design:type", Number)
            ], Vote.prototype, "id", void 0);
            __decorate([
                typeorm_1.Column(),
                __metadata("design:type", String)
            ], Vote.prototype, "client_id", void 0);
            __decorate([
                typeorm_1.Column("text"),
                __metadata("design:type", String)
            ], Vote.prototype, "url", void 0);
            __decorate([
                typeorm_1.Column({ type: "float", precision: 10, scale: 2, nullable: true }),
                __metadata("design:type", Number)
            ], Vote.prototype, "rating", void 0);
            __decorate([
                typeorm_1.Column(),
                __metadata("design:type", String)
            ], Vote.prototype, "salt", void 0);
            Vote = __decorate([
                typeorm_1.Entity()
            ], Vote);
            exports_1("Vote", Vote);
        }
    };
});
System.register("controller/voteController", ["typeorm", "entity/Vote"], function (exports_2, context_2) {
    "use strict";
    var typeorm_2, Vote_1;
    var __moduleName = context_2 && context_2.id;
    function voteGetByUrl(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const voteRepository = typeorm_2.getManager().getRepository(Vote_1.Vote);
            const votes = yield voteRepository.find({ where: { salt: request.params.url } });
            response.send(votes);
        });
    }
    exports_2("voteGetByUrl", voteGetByUrl);
    function voteSave(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const voteRepository = typeorm_2.getManager().getRepository(Vote_1.Vote);
            const newVote = voteRepository.create(request.body);
            yield voteRepository.save(newVote);
            response.send(newVote);
        });
    }
    exports_2("voteSave", voteSave);
    function voteGetByClientUrl(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const voteRepository = typeorm_2.getManager().getRepository(Vote_1.Vote);
            const votes = yield voteRepository.find({ where: { salt: request.params.url, client_id: request.params.client_id } });
            response.send(votes);
        });
    }
    exports_2("voteGetByClientUrl", voteGetByClientUrl);
    return {
        setters: [
            function (typeorm_2_1) {
                typeorm_2 = typeorm_2_1;
            },
            function (Vote_1_1) {
                Vote_1 = Vote_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("routes", ["controller/voteController"], function (exports_3, context_3) {
    "use strict";
    var voteController_1, AppRoutes;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (voteController_1_1) {
                voteController_1 = voteController_1_1;
            }
        ],
        execute: function () {
            /**
             * All application routes.
             */
            exports_3("AppRoutes", AppRoutes = [
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
            ]);
        }
    };
});
System.register("index", ["reflect-metadata", "cluster", "os", "typeorm", "express", "body-parser", "routes"], function (exports_4, context_4) {
    "use strict";
    var cluster, os_1, typeorm_3, express, bodyParser, routes_1, numCPUs;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (_1) {
            },
            function (cluster_1) {
                cluster = cluster_1;
            },
            function (os_1_1) {
                os_1 = os_1_1;
            },
            function (typeorm_3_1) {
                typeorm_3 = typeorm_3_1;
            },
            function (express_1) {
                express = express_1;
            },
            function (bodyParser_1) {
                bodyParser = bodyParser_1;
            },
            function (routes_1_1) {
                routes_1 = routes_1_1;
            }
        ],
        execute: function () {
            numCPUs = os_1.cpus().length;
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
                typeorm_3.createConnection().then((connection) => __awaiter(this, void 0, void 0, function* () {
                    const app = express();
                    app.use(bodyParser.json());
                    routes_1.AppRoutes.forEach(route => {
                        app[route.method](route.path, (request, response, next) => {
                            route.action(request, response)
                                .then(() => next)
                                .catch(err => next(err));
                        });
                    });
                    app.listen(3005);
                    console.log("Rating Api up and running on port 3005");
                })).catch(error => console.log("TypeORM connection error: ", error));
            }
        }
    };
});
//# sourceMappingURL=api.js.map
