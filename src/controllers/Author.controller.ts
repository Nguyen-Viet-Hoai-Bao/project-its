import { Request, Response, NextFunction } from "express";
import asyncHandler from 'express-async-handler';
import { AppDataSource } from '../config/data-source';
import { Author } from '../entity/Author.entity';

const authorRepository = AppDataSource.getRepository(Author);

export const authorList = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const authors = await authorRepository.find(); 
  
    res.render('authors/index', { authors, title: 'List of Authors' });
  });

export const authorDetail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Get Author Detail");
    const authorId = parseInt(req.params.id, 10);
    const author = await authorRepository.findOne({ where: { id: authorId } });

    if (author) {
        res.json(author);
    } else {
        res.status(404).json({ message: 'Author not found' });
    }
});

export const authorCreate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Create Author");
    const { first_name, family_name, date_of_birth, date_of_death, name, url } = req.body;
    const newAuthor = authorRepository.create({ first_name, family_name, date_of_birth, date_of_death, name, url });

    await authorRepository.save(newAuthor);
    res.status(201).json(newAuthor);
});

export const authorDelete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Delete Author");
    const authorId = parseInt(req.params.id, 10);
    const author = await authorRepository.findOne({ where: { id: authorId } });

    if (author) {
        await authorRepository.remove(author);
        res.json({ message: 'Author deleted' });
    } else {
        res.status(404).json({ message: 'Author not found' });
    }
});

export const authorUpdate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Update Author");
    const authorId = parseInt(req.params.id, 10);
    const author = await authorRepository.findOne({ where: { id: authorId } });

    if (author) {
        const { first_name, family_name, date_of_birth, date_of_death, name, url } = req.body;
        author.first_name = first_name;
        author.family_name = family_name;
        author.date_of_birth = date_of_birth;
        author.date_of_death = date_of_death;
        author.name = name;
        author.url = url;

        const updatedAuthor = await authorRepository.save(author);
        res.json(updatedAuthor);
    } else {
        res.status(404).json({ message: 'Author not found' });
    }
});
