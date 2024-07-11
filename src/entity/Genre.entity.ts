import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable } from "typeorm";
import { Book } from "./Book.entity";
import { COLUMN_LENGTH } from '../../constants';

@Entity()
export class Genre extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: COLUMN_LENGTH.MEDIUM })
    name!: string;

    @Column({ type: 'varchar', length: COLUMN_LENGTH.MEDIUM, nullable: true })
    url!: string;

    // Mối quan hệ Many-to-Many với bảng Book thông qua bảng trung gian BookGenre
    @ManyToMany(() => Book, book => book.genres)
    @JoinTable({
        name: "book_genre",
        joinColumn: { name: "genre_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "book_id", referencedColumnName: "id" }
    })
    books!: Book[];

    // Getter methods
    getName(): string {
        return this.name;
    }

    getUrl(): string | null {
        return this.url || null;
    }

    getBooks(): Book[] {
        return this.books;
    }
}
