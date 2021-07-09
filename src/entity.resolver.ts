import { RouteParameterResolver, RouteParameterResolverContext  } from '@deepkit/http';
import { MongoDatabase } from './database';
import { injectable } from '@deepkit/injector';
import { ClassType } from '@deepkit/core';
import { Entity } from './db/entity';

@injectable()
export class EntityResolver implements RouteParameterResolver {
  constructor(private db: MongoDatabase) {

  }

  async resolve(context: RouteParameterResolverContext) {
    return await this.db.query(Entity).filter({ _id: context.parameters.entity}).findOne();
  }

  supports(classType: ClassType): boolean {
    return classType === Entity;
  }
}
