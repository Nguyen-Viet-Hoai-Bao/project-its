// // src/controllers/book.controller.ts
// import { Request, Response, NextFunction } from 'express';
// import { getAppConnection } from '../config/data-source';
// import { Book } from '@src/entity/Book.entity';
// import { BookInstance } from '@src/entity/BookInstance.entity';
// import { Author } from '@src/entity/Author.entity';
// import { Genre } from '@src/entity/Genre.entity';
// import { title } from 'process';

// export const index = async (req: Request, res: Response) => {
//   try {
//     const connection = getAppConnection();
//     const bookRepository = connection.getRepository(Book);
//     const bookInstanceRepository = connection.getRepository(BookInstance);
//     const authorRepository = connection.getRepository(Author);
//     const genreRepository = connection.getRepository(Genre);

//     const [numBooks, numBookInstances, availableBookInstances, numAuthors, numGenres] = await Promise.all([
//       bookRepository.count(),
//       bookInstanceRepository.count(),
//       bookInstanceRepository.count({ where: { status: 'Available' } }),
//       authorRepository.count(),
//       genreRepository.count(),
//     ]);
//     console.error('fetching data:');

//     res.render('index', {
//       title: 'Local Library Home',
//       numBooks,
//       numBookInstances,
//       numAvailableBookInstances: availableBookInstances,
//       numAuthors,
//       numGenres,
//     });
//     console.error('render data:', title, ' --- ', numBooks, ' --- ', numBookInstances, ' --- ',
//         availableBookInstances, ' --- ', numAuthors, ' --- ', numGenres);

//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).send('Error fetching data');
//   }
// };


// export const bookList = async (req: Request, res: Response, next: NextFunction) => {
//     console.log("Get Books");
//     const connection = getAppConnection();
//     const bookRepository = connection.getRepository(Book);
//     const books = await bookRepository.find();
//     res.json(books);
// };
