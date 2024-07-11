import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Author } from "./Author.entity";
import { BookInstance } from "./BookInstance.entity";
import { Genre } from "./Genre.entity";
import { COLUMN_LENGTH } from '../../constants';

@Entity()
export class Book extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: COLUMN_LENGTH.MEDIUM })
    title!: string;

    @Column({ type: 'varchar', length: COLUMN_LENGTH.MEDIUM })
    summary!: string;

    @Column({ type: 'varchar', length: COLUMN_LENGTH.MEDIUM, nullable: true })
    isbn!: string;

    @Column({ type: 'varchar', length: COLUMN_LENGTH.MEDIUM, nullable: true })
    url!: string;

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

    getTitle(): string {
        return this.title;
    }

    getSummary(): string {
        return this.summary;
    }

    getISBN(): string | null {
        return this.isbn || null;
    }

    getUrl(): string | null {
        return this.url || null;
    }

    getAuthor(): Author {
        return this.author;
    }

    getInstances(): BookInstance[] {
        return this.instances;
    }

    getGenres(): Genre[] {
        return this.genres;
    }
}
