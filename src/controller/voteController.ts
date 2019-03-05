import {Request, Response} from "express";
import {getManager} from "typeorm";
import {Vote} from "../entity/Vote";
import * as _ from "lodash";
import {getConnection,createConnection} from "typeorm";
export async function voteGetByUrl(request: Request, response: Response) {

	let connection;
	try {
	   connection = await getConnection();
	   if (!connection.isConnected) {
	     await connection.connect();
	   }
	} catch (e) {
	  connection = await createConnection();
	}
    const voteRepository = getManager().getRepository(Vote);
    const votes = await voteRepository.createQueryBuilder("vote")
    .select("AVG(vote.rating)", "avg")
    .addSelect("AVG(IF(vote.rating,100,0))",'percent')
    .addSelect("count(vote.rating)",'total')
    .where("vote.salt = :salt", { salt: request.params.url })
    .getRawOne();
    await connection.close();
    response.send(votes);
}
export async function voteSave(request: Request, response: Response) {
    const voteRepository = getManager().getRepository(Vote);
    const newVote = voteRepository.create(request.body);
    await voteRepository.save(newVote);
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
}
export async function voteGetByClientUrl(request: Request, response: Response) {
    const voteRepository = getManager().getRepository(Vote);
    const votes = await voteRepository.find({ where: { salt: request.params.url, client_id: request.params.client_id},order: {
        id: "DESC"
    },take: 1 });
    response.send(votes[0]);
}