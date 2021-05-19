import {Schema} from "https://deno.land/x/cotton@v0.7.5/mod.ts";
import {faker} from "https://deno.land/x/deno_faker@v1.0.3/mod.ts";

export async function up(schema: Schema) {
    await schema.createTable('products', (table) => {
        table.id()
        table.varchar('title')
        table.text('description')
        table.varchar('image')
        table.integer('price')
    })

    let values = []

    for (let i = 0; i < 50; i++) {
        values.push(`('${faker.lorem.words(2)}',
                      '${faker.lorem.words(10)}',
                      '${faker.image.imageUrl()}',
                      '${faker.random.number(100)}')`)
    }

    await schema.query(`INSERT INTO products(title, description, image, price)
                        VALUES ${values.join(',')}`)
}

export async function down(schema: Schema) {
    await schema.dropTable('products')
}
