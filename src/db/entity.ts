import { entity, isReference, t } from '@deepkit/type';
import { User } from './user';
import { isPlainObject } from '@deepkit/core';

function flattenReference(objectOrReference: any) {
  if (isReference(objectOrReference) || (
      '_id' in objectOrReference
      && isPlainObject(objectOrReference)
      && Object.keys(objectOrReference).every(key => key === '_id' || (objectOrReference as any)[key] === null)
    )) {
    return (objectOrReference as any)._id;
  }
  return objectOrReference;
}

@entity.name('entity')
export class Entity {
    @t.primary.mongoId _id!: string;
    @t.group('dates') createdAt: Date = new Date;
    @t.optional content?: string;

    @t.array(Entity).backReference({ mappedBy: 'parent' }) children?: Entity[] = [];

    constructor(
       @t.serialize(flattenReference, 'json').reference() public author: User,
       @t.serialize(flattenReference, 'json').optional.reference() public parent?: Entity,
    ) {}
}
