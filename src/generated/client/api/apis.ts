export * from './systemApi';
import { SystemApi } from './systemApi';
export * from './timebankApi';
import { TimebankApi } from './timebankApi';
import * as http from 'http';

export class HttpError extends Error {
    constructor (public response: http.IncomingMessage, public body: any, public statusCode?: number) {
        super('HTTP request failed');
        this.name = 'HttpError';
    }
}

export { RequestFile } from '../model/models';

export const APIS = [SystemApi, TimebankApi];
