import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { Book } from "./Book.entity";
import { COLUMN_LENGTH } from '../../constants';

@Entity()
export class Author extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: COLUMN_LENGTH.MEDIUM })
    first_name!: string;

    @Column({ type: 'varchar', length: COLUMN_LENGTH.MEDIUM, nullable: true })
    family_name!: string;

    @Column({ type: 'date', nullable: true })
    date_of_birth!: Date;

    @Column({ type: 'date', nullable: true })
    date_of_death!: Date;

    @Column({ type: 'varchar', length: COLUMN_LENGTH.MEDIUM, nullable: true })
    name!: string;

    @Column({ type: 'varchar', length: COLUMN_LENGTH.MEDIUM, nullable: true })
    url!: string;

    @OneToMany(() => Book, book => book.author)
    books!: Book[];

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

    getName(): string | null {
        return this.name || null;
    }

    getUrl(): string | null {
        return this.url || null;
    }
}
