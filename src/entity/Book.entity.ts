import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Author } from "./Author.entity";
import { BookInstance } from "./BookInstance.entity";
import { Genre } from "./Genre.entity";
import { COLUMN_LENGTH } from '../../constants';

@Entity()
export class Book extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: COLUMN_LENGTH.NUM_255 })
    title!: string;

    @Column({ type: 'varchar', length: COLUMN_LENGTH.NUM_255 })
    summary!: string;

    @Column({ type: 'varchar', length: COLUMN_LENGTH.NUM_255, nullable: true })
    isbn!: string;

    @Column({ type: 'int' })
    authorId!: number;

    @ManyToOne(() => Author, author => author.books)
    author!: Author;

    @OneToMany(() => BookInstance, instance => instance.book)
    instances!: BookInstance[];

    @ManyToMany(() => Genre)
    @JoinTable({
        name: "book_genre",
        joinColumn: { name: "book_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "genre_id", referencedColumnName: "id" }
    })
    genres!: Genre[];

    constructor(data?: Partial<Book>) {
        super();
        if (data) {
            Object.assign(this, data);
        }
    }

    getTitle(): string {
        return this.title;
    }

    getSummary(): string {
        return this.summary;
    }

    getISBN(): string | null {
        return this.isbn || null;
    }

    getAuthor(): Author {
        return this.author;
    }

    getInstances(): BookInstance[] {
        return this.instances;
    }
}
