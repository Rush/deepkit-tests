import 'reflect-metadata';
import { Application, KernelModule } from '@deepkit/framework';
import { Logger } from '@deepkit/logger';
import { cli, Command } from '@deepkit/app';
import { HelloController } from './hello.controller';
import { MongoDatabase } from './database';
import { RouteParameterResolverTag  } from '@deepkit/http';
import { Entity, EntityResolver } from './db/entity';
import { User } from './db/user';

@cli.controller('initDb')
export class TestCommand implements Command {
    private async setupDbForTests() {
        const user = new User('foo@bar.com')

        const entity1 = new Entity(user);
        entity1._id = '60d401595a76dfa0ac12a030';
        const entity2 = new Entity(user, entity1);
        const entity3 = new Entity(user, entity1);
        const session = this.db.createSession();
        session.add(entity1, entity2, entity3);
        session.commit();
        await session.hydrateEntity(entity1);
        console.log(`now start the server and run:
        curl http://localhost:8081/children/${entity1._id}
        `);
    }

    constructor(protected logger: Logger, private db: MongoDatabase) {
    }

    async execute() {
        await this.setupDbForTests();
    }
}

Application.create({
    controllers: [TestCommand, HelloController],
    providers: [
        RouteParameterResolverTag.provide(EntityResolver),
    ],
    imports: [
        KernelModule.configure({
            port: 8081,
            databases: [ MongoDatabase ],
            migrateOnStartup: true,
        }),
    ]
}).run();