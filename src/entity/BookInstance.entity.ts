import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { Book } from "./Book.entity";

@Entity()
export class BookInstance extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  imprint!: string;

  @Column({ type: 'varchar', length: 255 })
  status!: string;

  @Column({ type: 'date', nullable: true })
  due_back!: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url!: string;

  // Mối quan hệ Many-to-One với bảng Book
  @ManyToOne(() => Book, book => book.instances)
  book!: Book;
}
