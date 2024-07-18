import { AppDataSource } from '../config/data-source';
import { Author } from '../entity/Author.entity';

const authorRepository = AppDataSource.getRepository(Author);

export const findAllAuthors = async () => {
    return await authorRepository.find();
};

export const findAuthorById = async (id: number) => {
    return await authorRepository.findOne({ where: { id: id }});
};

export const createAuthor = async (authorData: Partial<Author>) => {
    const newAuthor = authorRepository.create(authorData);
    return await authorRepository.save(newAuthor);
};

export const deleteAuthor = async (id: number) => {
    const author = await findAuthorById(id);
    if (author) {
        await authorRepository.remove(author);
        return true;
    }
    return false;
};

export const updateAuthor = async (id: number, authorData: Partial<Author>) => {
    const author = await findAuthorById(id);
    if (author) {
        Object.assign(author, authorData);
        return await authorRepository.save(author);
    }
    return null;
};
