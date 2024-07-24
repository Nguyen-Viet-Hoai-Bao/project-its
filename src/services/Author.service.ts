import { AppDataSource } from '../config/data-source';
import { Author } from '../entity/Author.entity';

const authorRepository = AppDataSource.getRepository(Author);

export class AuthorService {
  private authorRepository = AppDataSource.getRepository(Author);

  async getIndexDataAuthor() {
    return await this.authorRepository.count();
  }
}

export const getAuthors = async () => {
  return authorRepository.find({
      order: { family_name: 'ASC' },
  });
};

export const getAuthorById = async (authorId: number) => {
  return await authorRepository.findOne({ where: { id: authorId }, relations: ['books'] });
};

export async function createAuthor(authorInput: any): Promise<Author> {
  const { first_name, family_name, date_of_birth, date_of_death } = authorInput;
  
  const newAuthor = authorRepository.create({
    first_name,
    family_name,
    date_of_birth,
    date_of_death
  });
  
  return await authorRepository.save(newAuthor);
}

export const deleteAuthor = async (id: number) => {
  const author = await getAuthorById(id);
  if (author) {
      await authorRepository.remove(author);
      return true;
  }
  return false;
};

export const updateAuthor = async (id: number, authorData: Partial<Author>) => {
  const author = await getAuthorById(id);
  if (author) {
      Object.assign(author, authorData);
      return await authorRepository.save(author);
  }
  return null;
};