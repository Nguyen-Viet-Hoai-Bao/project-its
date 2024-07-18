import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { Book } from "./Book.entity";
import { COLUMN_LENGTH } from '../../constants';

@Entity()
export class Author extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: COLUMN_LENGTH.NUM_255 })
    first_name!: string;

    @Column({ type: 'varchar', length: COLUMN_LENGTH.NUM_255, nullable: true })
    family_name!: string;

    @Column({ type: 'date', nullable: true })
    date_of_birth!: Date;

    @Column({ type: 'date', nullable: true })
    date_of_death!: Date;

    @OneToMany(() => Book, books => books.author)
    books!: Book[];

    constructor(data?: Partial<Author>) {
        super();
        if (data) {
            Object.assign(this, data);
        }
    }

    getFirstName(): string {
        return this.first_name;
    }

    getFamilyName(): string | null {
        return this.family_name || null;
    }

    getDateOfBirth(): Date | null {
        return this.date_of_birth || null;
    }

    getDateOfDeath(): Date | null {
        return this.date_of_death || null;
    }
}
