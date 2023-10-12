import { setupServer } from "msw/node";
import { rest } from 'msw';


interface IHandlerConfig {
    path: string;
    method?: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';
    res: (req: any, res: any, ctx: any) => any;
}


export function createServer(handlerConfig: IHandlerConfig[]) {

    const handlers = handlerConfig.map((config) => {

        const method = config.method || 'get';

        return rest[method](config.path, (req, res, ctx) => {
            return res(ctx.json(config.res(req, res, ctx)));
        });
    });

    const server = setupServer(...handlers);

    beforeAll(() => {
        server.listen();
    });
    afterEach(() => {
        server.resetHandlers();
    });
    afterAll(() => {
        server.close();
    });
}
