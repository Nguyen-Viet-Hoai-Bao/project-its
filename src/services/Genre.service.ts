import { AppDataSource } from '../config/data-source';
import { Genre } from '../entity/Genre.entity';

const genreRepository = AppDataSource.getRepository(Genre);

export const findAllGenres = async () => {
    return await genreRepository.find();
};

export const findGenreById = async (id: number) => {
    return await genreRepository.findOne({ where: { id } });
};

export const createGenre = async (genreData: Partial<Genre>) => {
    const genre = genreRepository.create(genreData);
    return await genreRepository.save(genre);
};

export const updateGenre = async (id: number, genreData: Partial<Genre>) => {
    const genre = await findGenreById(id);
    if (genre) {
        Object.assign(genre, genreData);
        return await genreRepository.save(genre);
    }
    return null;
};

export const deleteGenre = async (id: number) => {
    const genre = await findGenreById(id);
    if (genre) {
        await genreRepository.remove(genre);
        return true;
    }
    return false;
};
