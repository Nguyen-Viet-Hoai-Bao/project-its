import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { Book } from "./Book.entity";
import { COLUMN_LENGTH } from '../../constants';

@Entity()
export class BookInstance extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: COLUMN_LENGTH.NUM_255 })
    imprint!: string;

    @Column({ type: 'varchar', length: COLUMN_LENGTH.NUM_255 })
    status!: string;

    @Column({ type: 'date', nullable: true })
    due_back!: Date;

    @ManyToOne(() => Book, book => book.instances)
    book!: Book;

    constructor(data?: Partial<BookInstance>) {
        super();
        if (data) {
            Object.assign(this, data);
        }
    }

    getImprint(): string {
        return this.imprint;
    }

    getStatus(): string {
        return this.status;
    }

    getDueBack(): Date | null {
        return this.due_back || null;
    }

    getBook(): Book {
        return this.book;
    }
}
