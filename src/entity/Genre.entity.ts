import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable } from "typeorm";
import { Book } from "./Book.entity";

@Entity()
export class Genre extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url!: string;

  // Mối quan hệ Many-to-Many với bảng Book thông qua bảng trung gian BookGenre
  @ManyToMany(() => Book, book => book.genres)
  @JoinTable({
    name: "book_genre",
    joinColumn: { name: "genre_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "book_id", referencedColumnName: "id" }
  })
  books!: Book[];
}
