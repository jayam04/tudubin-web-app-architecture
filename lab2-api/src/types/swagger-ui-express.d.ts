declare module "swagger-ui-express" {
    import { RequestHandler } from "express";

    interface SwaggerUiOptions {
        explorer?: boolean;
        customCss?: string;
        customJs?: string;
        customfavIcon?: string;
        swaggerUrl?: string;
        swaggerUrls?: { url: string; name: string }[];
        swaggerOptions?: object;
        routePrefix?: string;
    }

    export function serve(): RequestHandler;
    export function setup(swaggerDoc: object, options?: SwaggerUiOptions): RequestHandler;
}
