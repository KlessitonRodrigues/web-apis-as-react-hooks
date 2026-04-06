export namespace AWS {
  export type LambdasProps = Record<string, string>;

  export type APIGatewayHandler = (event: any) => Promise<any>;

  export type CreateResponseOptions = (
    code: number,
    data: any,
    headers?: Record<string, string>,
  ) => AWS.APIGatewayResponse;

  export type CreateResponseWithCookiesOptions = (
    origin: string,
    code: number,
    data: any,
    headers?: Record<string, string>,
  ) => AWS.APIGatewayResponse;

  export interface APIGatewayResponse {
    statusCode: number;
    body: string;
    headers: Record<string, string | number | boolean>;
  }
}
