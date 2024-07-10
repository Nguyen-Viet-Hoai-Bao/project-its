import { Get } from "routing-controllers";
import { Author } from "@src/entity/Author.entity";
import { AppDataSource } from "../config/data-source";

export class AuthorController {
    @Get("/author")
    getAll() {
    return AppDataSource.manager.find(Author);
    }
}