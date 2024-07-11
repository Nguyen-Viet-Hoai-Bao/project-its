// import './pre-start'; // Must be the first import
// import logger from 'jet-logger';

// import EnvVars from '@src/common/EnvVars';
// import server from './server';


// // **** Run **** //

// const SERVER_START_MSG = ('Express server started on port: ' + 
//   EnvVars.Port.toString());

// server.listen(EnvVars.Port, () => logger.info(SERVER_START_MSG));
// // **** Run **** //// // **** Run **** //// // **** Run **** //// // **** Run **** //// // **** Run **** //// // **** Run **** //

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

    // Tìm tất cả các tác giả
    const authors: Author[] = await authorRepository.find();
    console.log('List of authors:', authors);

    // Tìm tác giả theo id
    const author = await authorRepository.findOneBy({ id: 1 });
    if (author) {
      author.first_name = "Umed";
      await authorRepository.save(author);
    } else {
      console.log("Author not found");
    }
    const author_new = await authorRepository.find();
    console.log('List of new authors:', author_new);

    // Sử dụng createQueryBuilder để tìm tác giả có tên là "John"
    const authors3 = await authorRepository
      .createQueryBuilder("author")
      .where("author.first_name = :first_name", { first_name: "John" })
      .getMany();
    console.log('List of new authors - createQueryBuilder:', authors3);

    // Lấy giá trị thuộc tính cột chính của thực thể
    const userId = authorRepository.getId(authors3[0]); // userId === 1
    console.log('getId :', userId);

    // Tạo mới một tác giả
    const autor_tmp = authorRepository.create({
      id: 1003,
      first_name: "Timber",
      family_name: "Saw",
      date_of_birth: "2003-12-8",
      name: "Tim",
    });
    await authorRepository.save(autor_tmp);
    const author4 = await authorRepository.find();
    console.log('List of new authors - 4:', author4);

    // Sử dụng merge để gộp dữ liệu vào đối tượng hiện có
    const author5 = new Author();
    authorRepository.merge(author5, { id: 1004 }, { first_name: "Johan" }, { family_name: "Tom" });
    await authorRepository.save(author5);
    const author6 = await authorRepository.find();
    console.log('List of new authors - merge:', author6);

    // Thực hiện UPDATE
    await authorRepository.update({ id: 1 }, { name: "ADULT" });
    await authorRepository.upsert(
      [
        { id: 1, first_name: "Rizzrak" },
        { id: 1004, first_name: "Karzzir" }
      ],
      ["id"]
    );

    // Kiểm tra sự tồn tại của thực thể và lấy các thông tin khác
    const exists = await authorRepository.exist({ where: { first_name: "Timber" } });
    const count = await authorRepository.count({ where: { first_name: "Timber" } });
    const rawData = await authorRepository.query(`SELECT * FROM author`);

    console.log(" -- Exists: ", exists, "\n -- Count: ", count, "\n -- author: ", rawData);

    // Repository cho Book
    const bookRepository: Repository<Book> = AppDataSource.getRepository(Book);
    const books: Book[] = await bookRepository.find();
    console.log('List of books:', books);

  } catch (error) {
    console.error('Error fetching authors:', error);
  }
}

main();



// // **** Run **** //// // **** Run **** //// // **** Run **** //// // **** Run **** //// // **** Run **** //// // **** Run **** //

    // createQueryBuilder - Creates a query builder use to build SQL queries.
    // tạo một truy vấn để tìm tất cả các người dùng có tên là "John". 
    // const authors3 = await authorRepository
    //   .createQueryBuilder("author")
    //   .where("author.first_name = :first_name", { first_name: "John" })
    //   .getMany();
    // console.log('List of new authors - createQueryBuilder:', authors3);

    // getId: Lấy giá trị thuộc tính cột chính của thực thể.
    // const userId = authorRepository.getId(authors3[0]); // userId === 1
    // console.log('getId :', userId);

    // same as const user = new User();
    //const user = repository.create(); 
    // const autor_tmp = authorRepository.create({
    //   id: 1003,
    //   first_name: "Timber",
    //   family_name: "Saw",
    //   date_of_birth: "2003-12-8",
    //   name: "Tim",
    // }); 
    // await authorRepository.save(autor_tmp);
    // const author4 = await authorRepository.find();
    // console.log('List of new authors - 4:', author4);

    // Sử dụng merge() để gộp dữ liệu vào đối tượng hiện có
    // const author5 = new Author();
    // authorRepository.merge(author5, { id: 1004 }, { first_name: "Johan" }, { family_name: "Tom" });

    // await authorRepository.save(author5);
    // const author6 = await authorRepository.find();
    // console.log('List of new authors - merge:', author6);

    // Lưu một mảng các thực thể
    // await authorRepository.save([category1, category2, category3]);
    // Xóa một mảng các thực thể
    // await authorRepository.remove([category1, category2, category3]);

    // insert:
    //   - Chỉ chèn các thực thể mới.
    //   - Không kiểm tra xem thực thể đã tồn tại hay chưa.
    // save:
    //   - Kiểm tra xem thực thể đã tồn tại chưa.
    //   - Nếu thực thể đã tồn tại, nó sẽ được cập nhật. Nếu không, nó sẽ được chèn vào.
    // await authorRepository.insert([
    //   {
    //   id: 1005,
    //   first_name: "Foo",
    //   family_name: "Bar",
    //   },
    //   {
    //   id: 1006,
    //   first_name: "Rizz",
    //   family_name: "Rak",
    //   },
    // ]);

    // **** Update **** //// **** Update **** //// **** Update **** //// **** Update **** //// **** Update **** //
    // Thực hiện câu lệnh UPDATE author SET name = 'ADULT' WHERE id = 11
    // await authorRepository.update({ id: 1 }, { name: "ADULT" });
    // Thực hiện chèn mới hoặc cập nhật các thực thể dựa trên Id
    // await authorRepository.upsert(
    //   [
    //     { id: 1, first_name: "Rizzrak" },
    //     { id: 1004, first_name: "Karzzir" }
    //   ],
    //   ["id"]
    // );

    // **** Delete **** //// **** Delete **** //// **** Delete **** //// **** Delete **** //// **** Delete **** //
    // await authorRepository.delete(1);
    // // Thực hiện xóa thực thể với id = 1
    // await authorRepository.delete([1, 2, 3]);
    // await authorRepository.delete({ first_name: "Timber" });

    // // Thực hiện xóa mềm thực thể với id = 1
    // await authorRepository.softDelete(1);
    // // Thực hiện khôi phục thực thể với id = 1
    // await authorRepository.restore(1);

    // **** Find/Check **** //// **** Find/Check **** //// **** Find/Check **** //// **** Find/Check **** //// **** Find/Check **** //
    // Kiểm tra xem có tồn tại bất kỳ thực thể nào khớp với FindOptionsWhere.
    // const exists = await authorRepository.existsBy({ first_name: "Timber" });
    // const count = await authorRepository.count({
    //   where: { first_name: "Timber" },
    // });
    // const maximum = await authorRepository.maximum("id", { first_name: "Timber" });
    // const timber1 = await authorRepository.find({
    //   where: { first_name: "Timber", },
    // });
    // const timber2 = await authorRepository.findBy({
    //   first_name: "Timber",
    // });
    // const timber3 = await authorRepository.findOne({
    //   where: { first_name: "Timber" },
    //   });
    // const timber4 = await authorRepository.findOneBy({ first_name: "Timber" });
    // const timber5 = await authorRepository.findOneOrFail({
    // where: { first_name: "Timber" },
    // });
    // const timber6 = await authorRepository.findOneByOrFail({ first_name: "Timber" });
    // const rawData = await authorRepository.query(`SELECT * FROM author`);
    // // await authorRepository.clear();

    // console.log(" -- Exists: ", exists, "/n -- Count: ", count, "/n -- maximum: ", maximum, 
    //   "/n -- timber1: ", timber1, "/n -- timber2: ", timber2, 
    //   "/n -- timber3: ", timber3, "/n -- timber4: ", timber4, 
    //   "/n -- timber5: ", timber5, "/n -- timber6: ", timber6, "/n -- author: ", rawData);

    // // Find all book
    // const bookRepository: Repository<Book> = connection.getRepository(Book);
    // const books: Book[] = await bookRepository.find();
    // console.log('List of books:', books);









