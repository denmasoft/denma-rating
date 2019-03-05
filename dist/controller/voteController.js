"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Vote_1 = require("../entity/Vote");
const typeorm_2 = require("typeorm");
function voteGetByUrl(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let connection;
        try {
            connection = yield typeorm_2.getConnection();
            if (!connection.isConnected) {
                yield connection.connect();
            }
        }
        catch (e) {
            connection = yield typeorm_2.createConnection();
        }
        const voteRepository = typeorm_1.getManager().getRepository(Vote_1.Vote);
        const votes = yield voteRepository.createQueryBuilder("vote")
            .select("AVG(vote.rating)", "avg")
            .addSelect("AVG(IF(vote.rating,100,0))", 'percent')
            .addSelect("count(vote.rating)", 'total')
            .where("vote.salt = :salt", { salt: request.params.url })
            .getRawOne();
        yield connection.close();
        response.send(votes);
    });
}
exports.voteGetByUrl = voteGetByUrl;
function voteSave(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const voteRepository = typeorm_1.getManager().getRepository(Vote_1.Vote);
        const newVote = voteRepository.create(request.body);
        yield voteRepository.save(newVote);
        response.send(newVote);
        /*console.log(request.body);
        await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Vote)
        .values([
            { client_id: request.body.client_id, url: request.body.url,rating: request.body.rating, salt: request.body.salt }
         ])
        .execute();
        response.send({});*/
    });
}
exports.voteSave = voteSave;
function voteGetByClientUrl(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const voteRepository = typeorm_1.getManager().getRepository(Vote_1.Vote);
        const votes = yield voteRepository.find({ where: { salt: request.params.url, client_id: request.params.client_id }, order: {
                id: "DESC"
            }, take: 1 });
        response.send(votes[0]);
    });
}
exports.voteGetByClientUrl = voteGetByClientUrl;
//# sourceMappingURL=voteController.js.map