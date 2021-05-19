import {connect} from "https://deno.land/x/cotton@v0.7.5/mod.ts";

export abstract class Repository {
    abstract table(): string;

    async client() {
        return await connect({
            "type": "mysql",
            "port": 3306,
            "database": "deno_search",
            "hostname": "localhost",
            "username": "root",
            "password": "rootroot"
        })
    }

    async find() {
        const db = await this.client();

        return await db.table(this.table()).execute();
    }

    async getBuilder() {
        const db = await this.client();

        return await db.table(this.table());
    }
}
