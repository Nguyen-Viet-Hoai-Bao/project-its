import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { Book } from "./Book.entity";
import { COLUMN_LENGTH } from '../../constants';

@Entity()
export class BookInstance extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: COLUMN_LENGTH.MEDIUM })
    imprint!: string;

    @Column({ type: 'varchar', length: COLUMN_LENGTH.MEDIUM })
    status!: string;

    @Column({ type: 'date', nullable: true })
    due_back!: Date;

    @Column({ type: 'varchar', length: COLUMN_LENGTH.MEDIUM, nullable: true })
    url!: string;

    // Mối quan hệ Many-to-One với bảng Book
    @ManyToOne(() => Book, book => book.instances)
    book!: Book;

    getImprint(): string {
        return this.imprint;
    }

    getStatus(): string {
        return this.status;
    }

    getDueBack(): Date | null {
        return this.due_back || null;
    }

    getUrl(): string | null {
        return this.url || null;
    }

    getBook(): Book {
        return this.book;
    }
}
