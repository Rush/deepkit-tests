import { http } from '@deepkit/http';
import { MongoDatabase } from './database';
import { User } from './db/user';
import { classToPlain, t } from '@deepkit/type';
import { Entity } from './db/entity';

@http.controller()
export class HelloController {
    constructor(private db: MongoDatabase) {    }

    @http.GET(':id')
    async getOne(id: string) {
        const user = await this.db.query(User).filter({
            _id: id,
        }).findOne();

        return classToPlain(User, user, { groupsExclude: ['dates' ] });
    }

    @http.GET('children/:entity')
    @t.array(Entity)
    async getChildren(entity: string, someEntity: Entity) {
        console.log('Some entity', someEntity);

        const results = await this.db.query(Entity).filter({
            _id: entity,
        }).useJoinWith('children').end().findOne();

        return results;
    }
    
    @http.POST('make-entity/:owner')
    async makeEntity(owner: string) {
        console.log('Owner', owner);
        const entity = new Entity(this.db.getReference(User, owner));
        entity.parent = this.db.getReference(Entity, '60d401595a76dfa0ac12a030')
        await this.db.persist(entity);

        return entity._id;
    }

    @http.GET('hello-world')
    async helloWorld() {
        const user = new User('rushpl2@gmail.com');
        this.db.persist(user);

        return {
            hello: 'world',
        };
    }
}