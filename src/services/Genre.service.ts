import { Genre } from '../entity/Genre.entity';
import { AppDataSource } from '../config/data-source';

const genreRepository = AppDataSource.getRepository(Genre);

export class GenreService {
  private genreRepository = AppDataSource.getRepository(Genre);

  async getIndexDataGenre() {
    return await this.genreRepository.count();
  }
}

export const getGenres = async () => {
  return genreRepository.find({
      order: { name: 'ASC' }
  });
};

export const getGenreById = async (genreId: number) => {
  return await genreRepository.findOne({ where: { id: genreId }, relations: ['books'] });
};

export const getGenreByName = async (genreName: string) => {
  return await genreRepository.findOne({ where: { name: genreName }, relations: ['books']  });
};

export const createGenre = async (genreData: Partial<Genre>) => {
  const genre = genreRepository.create(genreData);
  return await genreRepository.save(genre);
};