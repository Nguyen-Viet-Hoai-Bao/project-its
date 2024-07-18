import { Request, Response, NextFunction } from "express";
import asyncHandler from 'express-async-handler';
import { findAllAuthors, findAuthorById, createAuthor, deleteAuthor, updateAuthor } from '../services/Author.service';
import { findBookByAuthorId } from "@src/services/Book.service";

export const authorList = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const authors = await findAllAuthors();
    res.render('authors/index', { authors, title: 'List of Authors' });
});

export const authorDetail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = parseInt(req.params.id, 10);
    const author = await findAuthorById(authorId);

    if (author) {
        res.render('authors/detail', { author, title: 'Detail of Authors' });
    } else {
        res.status(404).json({ message: 'Author not found' });
    }
});

export const authorCreate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { first_name, family_name, date_of_birth, date_of_death } = req.body;
    const newAuthor = await createAuthor({ first_name, family_name, date_of_birth, date_of_death });
    res.status(201).json(newAuthor);
});

export const authorDeleteGet = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(404).send('Invalid author ID');
            return;
        }

        const author = await findAuthorById(id);
        if (!author) {
            res.redirect('/authors');
            return;
        }

        const authorBooks = await findBookByAuthorId(id);
        res.render('authors/delete', { title: 'Delete Author', author: author, authorBooks: authorBooks });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch author details', error });
    }
});

export const authorDeletePost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.body.authorid, 10);
        if (isNaN(id)) {
            res.status(404).send('Invalid author ID');
            return;
        }
        const author = await findAuthorById(id);
        if (!author) {
            res.redirect('/authors');
            return;
        }

        const authorBooks = await findBookByAuthorId(id);
        if (authorBooks.length > 0) {
            res.render('authors/delete', { title: 'Delete Author', author: author, authorBooks: authorBooks });
            return;
        } else {
            await deleteAuthor(id);
            res.redirect('/authors');
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete author', error });
    }
});

export const authorUpdate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = parseInt(req.params.id, 10);
    const { first_name, family_name, date_of_birth, date_of_death} = req.body;
    const updatedAuthor = await updateAuthor(authorId, { first_name, family_name, date_of_birth, date_of_death });

    if (updatedAuthor) {
        res.json(updatedAuthor);
    } else {
        res.status(404).json({ message: 'Author not found' });
    }
});
