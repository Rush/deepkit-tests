import { entity, t } from '@deepkit/type';
import { User } from './user';
import { RouteParameterResolverContext  } from '@deepkit/http';
import { Injector } from '@deepkit/injector';
import { MongoDatabase } from '../database';

@entity.name('entity')
export class Entity {
    @t.primary.mongoId _id!: string;
    @t createdAt: Date = new Date;
    @t.optional content?: string;

    @t.array(Entity).backReference({ mappedBy: 'parent' }) children?: Entity[] = [];

    constructor(
       @t.group('author').reference() public author: User,
       @t.optional.reference() public parent?: Entity,
    ) {}
}

export class EntityResolver {
  async resolve(context: RouteParameterResolverContext, db: MongoDatabase) {
    // need access to MongoDatabase
    console.log('Entity id is', context.parameters.entity);
    // now if we only had access to the DB, we could find it and expose to the controller
    return 'foo';
  }
}