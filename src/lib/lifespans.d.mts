export type LifespanSource={name:string;url:string;evidence:string;sourceUpdated?:string};
export type Lifespan={rows:{id?:string;label:string;value:string;source:string}[];description:string;sources:string[];note:string;scope:string;updatedAt:string};
export const lifespanUpdated:string;
export const lifespanDisclaimer:string;
export const lifespanSources:Record<string,LifespanSource>;
export const lifespanPublicNotes:Record<string,string>;
export const lifespans:Record<string,Lifespan>;
