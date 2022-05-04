/**
 * Timebank
 * Timebank API documentation
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { RequestFile } from './models';

export class TimeEntry {
    'externalId': string;
    'person': number;
    'internalTime': number;
    'projectTime': number;
    'logged': number;
    'expected': number;
    'total': number;
    'date': Date;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "externalId",
            "baseName": "externalId",
            "type": "string"
        },
        {
            "name": "person",
            "baseName": "person",
            "type": "number"
        },
        {
            "name": "internalTime",
            "baseName": "internalTime",
            "type": "number"
        },
        {
            "name": "projectTime",
            "baseName": "projectTime",
            "type": "number"
        },
        {
            "name": "logged",
            "baseName": "logged",
            "type": "number"
        },
        {
            "name": "expected",
            "baseName": "expected",
            "type": "number"
        },
        {
            "name": "total",
            "baseName": "total",
            "type": "number"
        },
        {
            "name": "date",
            "baseName": "date",
            "type": "Date"
        }    ];

    static getAttributeTypeMap() {
        return TimeEntry.attributeTypeMap;
    }
}
