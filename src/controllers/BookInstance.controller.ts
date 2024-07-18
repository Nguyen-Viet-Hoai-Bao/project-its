import { Request, Response, NextFunction } from "express";
import asyncHandler from 'express-async-handler';
import { findAllBookInstances, findBookInstanceById, createBookInstance, deleteBookInstance, updateBookInstance } from '../services/BookInstance.service';

export const bookInstanceList = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const instances = await findAllBookInstances();
    res.render('book-instances/index', { instances, title: 'List of Book Instances' });
});

export const bookInstanceDetail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const instanceId = parseInt(req.params.id, 10);
    const instance = await findBookInstanceById(instanceId);

    if (instance) {
        res.render('book-instances/detail', { instance, title: 'Detail of Book Instances' });
    } else {
        res.status(404).json({ message: 'BookInstance not found' });
    }
});

export const bookInstanceCreate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { imprint, status, due_back, bookId } = req.body;

    try {
        const newBookInstance = await createBookInstance({ imprint, status, due_back }, bookId);
        res.status(201).json(newBookInstance);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create book instance', error });
    }
});

export const bookInstanceDelete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const instanceId = parseInt(req.params.id, 10);
    const isDeleted = await deleteBookInstance(instanceId);

    if (isDeleted) {
        res.json({ message: 'BookInstance deleted' });
    } else {
        res.status(404).json({ message: 'BookInstance not found' });
    }
});

export const bookInstanceUpdate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const instanceId = parseInt(req.params.id, 10);
    const { imprint, status, due_back, bookId } = req.body;

    try {
        const updatedInstance = await updateBookInstance(instanceId, { imprint, status, due_back }, bookId);
        if (updatedInstance) {
            res.json(updatedInstance);
        } else {
            res.status(404).json({ message: 'BookInstance not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update book instance', error });
    }
});
