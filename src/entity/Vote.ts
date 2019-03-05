import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Vote {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    client_id: string;

    @Column("text")
    url: string;

	@Column({ type: "float", precision: 10, scale: 2, nullable: true})
    rating: number;
    
    @Column()
    salt: string;
}