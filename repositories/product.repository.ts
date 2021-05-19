import {Repository} from "./repository.ts";

export class ProductRepository extends Repository {
    table(): string {
        return "products";
    }
}
