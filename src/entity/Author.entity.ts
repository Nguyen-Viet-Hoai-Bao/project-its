import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { Book } from "./Book.entity";

@Entity()
export class Author extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    first_name!: string;

    @Column({ type: 'varchar', length: 255 })
    family_name!: string;

    @Column({ type: 'date', nullable: true })
    date_of_birth!: Date;

    @Column({ type: 'date', nullable: true })
    date_of_death!: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    url!: string;

    @OneToMany(() => Book, book => book.author)
    books!: Book[];
}
