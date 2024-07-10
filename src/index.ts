// import tutorial from "./routes/tutorial";
// app.use('/tutorial', tutorial);

import { AppDataSource } from './config/data-source';
import { Author } from './entity/Author.entity';
import { Book } from './entity/Book.entity';
import { Repository } from 'typeorm';

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");

    // Repository cho Author
    const authorRepository: Repository<Author> = AppDataSource.getRepository(Author);
    await authorRepository.delete({ first_name: "Rizz" });

    
    const author_new = await authorRepository.find();
    console.log('List of new authors:', author_new);

  } catch (error) {
    console.error('Error fetching authors:', error);
  }
}

main();
