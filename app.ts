import {Application, Router, RouterContext} from "https://deno.land/x/oak/mod.ts";
import {oakCors} from "https://deno.land/x/cors@v1.2.1/mod.ts";
import {ProductRepository} from "./repositories/product.repository.ts";
import {Q} from "https://deno.land/x/cotton@v0.7.5/mod.ts";

const app = new Application();
const router = new Router();

app.use(oakCors({
    origin: /^.+localhost:(3000|4200|8080)$/
}))


router.get('/api/products/frontend', async ({response}: RouterContext) => {
    const repository = new ProductRepository();
    response.body = await repository.find();
})

router.get('/api/products/backend', async ({request, response}: RouterContext) => {
    const repository = new ProductRepository();
    const query = await repository.getBuilder()
    const countQuery = await repository.getBuilder()

    const s = request.url.searchParams.get('s') || '';

    if (s) {
        query.where("title", Q.like(`%${s}%`)).or("description", Q.like(`%${s}%`))
        countQuery.where("title", Q.like(`%${s}%`)).or("description", Q.like(`%${s}%`))
    }

    const sort = request.url.searchParams.get('sort') || '';

    if (sort) {
        query.order('price', sort as any)
    }

    const page: number = parseInt(request.url.searchParams.get('page') as any) || 1;
    const perPage = 9;
    const [result] = await countQuery.count('id').execute()
    const total: number = result["COUNT(`products`.`id`)"] as any;

    response.body = {
        data: await query.limit(perPage).offset((page - 1) * perPage).execute(),
        total,
        page,
        last_page: Math.ceil(total / perPage)
    };
})

app.use(router.routes())
app.use(router.allowedMethods())

console.log('Listening to port 8000!')
await app.listen({port: 8000});
