import { Database } from '@deepkit/orm';
import { MongoDatabaseAdapter } from '@deepkit/mongo';
import { User } from './db/user';
import { Entity } from './db/entity';

export class MongoDatabase extends Database {
    constructor() {
        super(new MongoDatabaseAdapter('mongodb://localhost/deepkit-tests-db'), [User, Entity]);


        this.queryEvents.onFetch.subscribe(async event => {
            const names = event.classSchema.getProperties().map(v => v.name);
            console.log('Names', names);
            //filter names however you want, then overwrite the original query
            // event.query = event.query.select(...names);
        });
    }
}