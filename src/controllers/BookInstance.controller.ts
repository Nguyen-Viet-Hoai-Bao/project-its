import { Request, Response, NextFunction } from "express";
import asyncHandler from 'express-async-handler';
import { AppDataSource } from '../config/data-source';
import { BookInstance } from '../entity/BookInstance.entity';
import { Book } from '../entity/Book.entity';

const bookInstanceRepository = AppDataSource.getRepository(BookInstance);

// Display list of all BookInstances.
export const bookInstanceList = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Get BookInstance List");
    const instances = await bookInstanceRepository.find({ relations: ['book'] });
  
    res.render('book-instances/index', { instances, title: 'List of Book Instances' });
});

// Display detail page for a specific BookInstance.
export const bookInstanceDetail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Get BookInstance Detail");
    const instanceId = parseInt(req.params.id, 10);
    const instance = await bookInstanceRepository.findOne({ where: { id: instanceId } });

    if (instance) {
        res.render('book-instances/detail', { instance, title: 'Detail of Book Instances' });
    } else {
        res.status(404).json({ message: 'BookInstance not found' });
    }
});

// Handle BookInstance create on POST.
export const bookInstanceCreate = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Create BookInstance");
    const { imprint, status, due_back, url, bookId } = req.body;

    try {
        const book = await AppDataSource.getRepository(Book).findOne(bookId);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const newBookInstance = new BookInstance();
        newBookInstance.imprint = imprint;
        newBookInstance.status = status;
        newBookInstance.due_back = due_back;
        newBookInstance.url = url;
        newBookInstance.book = book;

        await bookInstanceRepository.save(newBookInstance);
        res.status(201).json(newBookInstance);
    } catch (error) {
        console.error('Failed to create book instance', error);
        res.status(500).json({ message: 'Failed to create book instance', error });
    }
};

// Handle BookInstance delete on DELETE.
export const bookInstanceDelete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Delete BookInstance");
    const instanceId = parseInt(req.params.id, 10);
    const instance = await bookInstanceRepository.findOne({ where: { id: instanceId } });

    if (instance) {
        await bookInstanceRepository.remove(instance);
        res.json({ message: 'BookInstance deleted' });
    } else {
        res.status(404).json({ message: 'BookInstance not found' });
    }
});

// Handle BookInstance update on PUT.// Handle BookInstance update on PUT.
export const bookInstanceUpdate = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Update BookInstance");
    const instanceId = parseInt(req.params.id, 10);
    const { imprint, status, due_back, url, bookId } = req.body;
    const instance = await bookInstanceRepository.findOne({ where: { id: instanceId } });

    if (instance) {
        try {
            const book = await AppDataSource.getRepository(Book).findOne(bookId);

            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            instance.imprint = imprint;
            instance.status = status;
            instance.due_back = due_back;
            instance.url = url;
            instance.book = book;

            const updatedInstance = await bookInstanceRepository.save(instance);
            return res.json(updatedInstance); // Ensure returning the response
        } catch (error) {
            return res.status(500).json({ message: 'Failed to update book', error }); // Ensure returning the response
        }
    } else {
        return res.status(404).json({ message: 'BookInstance not found' }); // Ensure returning the response
    }
};
