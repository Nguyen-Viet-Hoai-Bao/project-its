import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable } from "typeorm";
import { Book } from "./Book.entity";
import { COLUMN_LENGTH } from '../../constants';

@Entity()
export class Genre extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: COLUMN_LENGTH.NUM_255 })
    name!: string;

    @ManyToMany(() => Book, book => book.genres)
    @JoinTable({
        name: "book_genre",
        joinColumn: { name: "genre_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "book_id", referencedColumnName: "id" }
    })
    books!: Book[];

    constructor(data?: Partial<Genre>) {
        super();
        if (data) {
            Object.assign(this, data);
        }
    }

    getName(): string {
        return this.name;
    }

    getBooks(): Book[] {
        return this.books;
    }
}