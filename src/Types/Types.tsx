import React from 'react';

export type TEvents = {
    id: number,
    title: string,
    active: boolean,
}

export class CEvents {
    id!: number;
    title!: string;
    active: boolean = true;
}