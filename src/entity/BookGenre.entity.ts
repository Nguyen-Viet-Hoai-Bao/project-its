import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Author } from "./Author.entity";
import { BookInstance } from "./BookInstance.entity";
import { Genre } from "./Genre.entity";

@Entity()
export class Book extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    title!: string;

    @Column({ type: 'varchar', length: 255 })
    summary!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    isbn!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    url!: string;

    // Mối quan hệ Many-to-One với bảng Author
    @ManyToOne(() => Author, author => author.books)
    author!: Author;

    // Mối quan hệ One-to-Many với bảng BookInstance
    @OneToMany(() => BookInstance, instance => instance.book)
    instances!: BookInstance[];

    // Mối quan hệ Many-to-Many với bảng Genre thông qua bảng trung gian BookGenre
    @ManyToMany(() => Genre)
    @JoinTable({
        name: "book_genre",
        joinColumn: { name: "book_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "genre_id", referencedColumnName: "id" }
    })
    genres!: Genre[];
}