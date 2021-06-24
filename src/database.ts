import { Database } from '@deepkit/orm';
import { MongoDatabaseAdapter } from '@deepkit/mongo';
import { User } from './db/user';
import { Entity } from './db/entity';

export class MongoDatabase extends Database {
    constructor() {
        super(new MongoDatabaseAdapter('mongodb://localhost/deepkit-tests-db'), [User, Entity]);
    }
}