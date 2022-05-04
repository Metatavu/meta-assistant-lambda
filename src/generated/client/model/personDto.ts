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

export class PersonDto {
    'id': number;
    'firstName': string;
    'lastName': string;
    'email': string;
    'userType': string;
    'clientId': number;
    'holidayCalendarId': number;
    'monday': number;
    'tuesday': number;
    'wednesday': number;
    'thursday': number;
    'friday': number;
    'saturday': number;
    'sunday': number;
    'active': boolean;
    'defaultRole': number;
    'cost': number;
    'language': string;
    'createdBy': number;
    'updatedBy': number;
    'createdAt': Date;
    'updatedAt': Date;
    'startDate': string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "id",
            "baseName": "id",
            "type": "number"
        },
        {
            "name": "firstName",
            "baseName": "first_name",
            "type": "string"
        },
        {
            "name": "lastName",
            "baseName": "last_name",
            "type": "string"
        },
        {
            "name": "email",
            "baseName": "email",
            "type": "string"
        },
        {
            "name": "userType",
            "baseName": "user_type",
            "type": "string"
        },
        {
            "name": "clientId",
            "baseName": "client_id",
            "type": "number"
        },
        {
            "name": "holidayCalendarId",
            "baseName": "holiday_calendar_id",
            "type": "number"
        },
        {
            "name": "monday",
            "baseName": "monday",
            "type": "number"
        },
        {
            "name": "tuesday",
            "baseName": "tuesday",
            "type": "number"
        },
        {
            "name": "wednesday",
            "baseName": "wednesday",
            "type": "number"
        },
        {
            "name": "thursday",
            "baseName": "thursday",
            "type": "number"
        },
        {
            "name": "friday",
            "baseName": "friday",
            "type": "number"
        },
        {
            "name": "saturday",
            "baseName": "saturday",
            "type": "number"
        },
        {
            "name": "sunday",
            "baseName": "sunday",
            "type": "number"
        },
        {
            "name": "active",
            "baseName": "active",
            "type": "boolean"
        },
        {
            "name": "defaultRole",
            "baseName": "default_role",
            "type": "number"
        },
        {
            "name": "cost",
            "baseName": "cost",
            "type": "number"
        },
        {
            "name": "language",
            "baseName": "language",
            "type": "string"
        },
        {
            "name": "createdBy",
            "baseName": "created_by",
            "type": "number"
        },
        {
            "name": "updatedBy",
            "baseName": "updated_by",
            "type": "number"
        },
        {
            "name": "createdAt",
            "baseName": "created_at",
            "type": "Date"
        },
        {
            "name": "updatedAt",
            "baseName": "updated_at",
            "type": "Date"
        },
        {
            "name": "startDate",
            "baseName": "start_date",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return PersonDto.attributeTypeMap;
    }
}
