import { Request, Response, NextFunction } from "express";
import asyncHandler from 'express-async-handler';
import { AppDataSource } from '../config/data-source';
import { Author } from '../entity/Author.entity';

// Display list of all Authors.
export const authorList = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Get Authors");
    const authorRepository = AppDataSource.getRepository(Author);
    const authors = await authorRepository.find();
    res.json(authors);
});

// Display detail page for a specific Author.
export const authorDetail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Get Author Detail");
    const authorRepository = AppDataSource.getRepository(Author);
    const author = await authorRepository.findOneBy({ id: parseInt(req.params.id, 10) });

    if (author) {
        res.json(author);
    } else {
        res.status(404).json({ message: 'Author not found' });
    }
});

// Handle Author create on POST.
export const authorCreate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Create Author");
    const { first_name, family_name, date_of_birth, date_of_death, name, url } = req.body;
    const authorRepository = AppDataSource.getRepository(Author);
    const newAuthor = authorRepository.create({ first_name, family_name, date_of_birth, date_of_death, name, url });

    await authorRepository.save(newAuthor);
    res.status(201).json(newAuthor);
});

// Handle Author delete on POST.
export const authorDelete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Delete Author");
    const authorRepository = AppDataSource.getRepository(Author);
    const author = await authorRepository.findOneBy({ id: parseInt(req.params.id, 10) });

    if (author) {
        await authorRepository.remove(author);
        res.json({ message: 'Author deleted' });
    } else {
        res.status(404).json({ message: 'Author not found' });
    }
});

// Handle Author update on POST.
export const authorUpdate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Update Author");
    const authorRepository = AppDataSource.getRepository(Author);
    const author = await authorRepository.findOneBy({ id: parseInt(req.params.id, 10) });

    if (author) {
        const { first_name, family_name, date_of_birth, date_of_death, name, url } = req.body;
        authorRepository.merge(author, { first_name, family_name, date_of_birth, date_of_death, name, url });
        const updatedAuthor = await authorRepository.save(author);
        res.json(updatedAuthor);
    } else {
        res.status(404).json({ message: 'Author not found' });
    }
});