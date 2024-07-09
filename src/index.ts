// import './pre-start'; // Must be the first import
// import logger from 'jet-logger';

// import EnvVars from '@src/common/EnvVars';
// import server from './server';


// // **** Run **** //

// const SERVER_START_MSG = ('Express server started on port: ' + 
//   EnvVars.Port.toString());

// server.listen(EnvVars.Port, () => logger.info(SERVER_START_MSG));
// // **** Run **** //


// import { AppDataSource } from "./data-source";

// AppDataSource.initialize()
//   .then(() => {
//     console.log("Database initialized");
//   })
//   .catch((error) => {
//     console.log("Database connection failed: ", error);
//   });




// import { AppDataSource } from "./config/data-source";
// import { Author } from "./entity/Author.entity";

// async function main() {
//   const userRepository = AppDataSource.getRepository(Author);

//   // const users = await userRepository.find();
//   const user = await userRepository.findOneBy({
//     id: 1,
//     });

//   console.log(user);
// }

// main().catch(error => console.error(error));


// import { AppDataSource } from './data-source'
// // Connect DB
// AppDataSource.initialize()
// .then(() => {
// console.log('Datasource has been initialized')
// })
// .catch((err) => {
// console.error('Error during Datasource initialization: ', err)
// })


// import { Author } from "./entity/Author.entity";
// import { AppDataSource } from "./config/data-source";

// async function main() {
//   const connection = await AppDataSource; // Đợi cho kết nối cơ sở dữ liệu được thiết lập
//   const authorRepository = connection.getRepository(Author);

//   // Tạo một tác giả mới và lưu vào cơ sở dữ liệu
//   const author = new Author();
//   author.name = "Nguyen";
//   await authorRepository.save(author);

//   // Lấy tất cả các tác giả từ cơ sở dữ liệu
//   const authors = await authorRepository.find();

//   console.log("Tất cả các tác giả:", authors);
// }

// main().catch(error => console.error(error));


// import { Author } from "./entity/Author.entity";
// import { AppDataSource } from "./config/data-source";

// async function main() {
//   try {
//     const connection = await AppDataSource;

//     // Kiểm tra xem kết nối đã được thiết lập thành công hay chưa
//     if (connection.isConnected) {
//       console.log("Connected to database successfully.");

//       // Đồng bộ hóa cơ sở dữ liệu nếu cần thiết
//       await connection.synchronize();

//       // Lấy repository của entity Author
//       const authorRepository = connection.getRepository(Author);

//       // Tạo một instance của Author và lưu vào database
//       const author = new Author();
//       author.name = "Nguyen";
//       await authorRepository.save(author);

//       // Lấy tất cả các authors từ database
//       const authors = await authorRepository.find();
//       console.log(authors);
//     } else {
//       console.error("Failed to connect to database.");
//     }
//   } catch (error) {
//     console.error("Error occurred:", error);
//   }
// }

// main();


import { createConnection, Repository } from 'typeorm';
import { Author } from './entity/Author.entity';
import { AppDataSource } from './config/data-source';
import { Book } from './entity/Book.entity';

async function main() {
  try {
    const connection = await createConnection(AppDataSource);

    const authorRepository: Repository<Author> = connection.getRepository(Author);
    const authors: Author[] = await authorRepository.find();

    console.log('List of authors:', authors);

    const bookRepository: Repository<Book> = connection.getRepository(Book);
    const books: Book[] = await bookRepository.find();

    console.log('List of books:', books);
  } catch (error) {
    console.error('Error fetching authors:', error);
  }
}

main();








