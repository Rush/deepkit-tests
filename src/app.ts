import 'reflect-metadata';
import { Application, KernelModule, onServerMainBootstrap, onServerMainBootstrapDone, ServerBootstrapEvent } from '@deepkit/framework';
import { Logger } from '@deepkit/logger';
import { cli, Command } from '@deepkit/app';
import { HelloController } from './hello.controller';
import { MongoDatabase } from './database';
import { HttpKernel, httpWorkflow, RouteParameterResolverTag  } from '@deepkit/http';
import { Entity } from './db/entity';
import { EntityResolver } from './entity.resolver';
import { User } from './db/user';

import express from 'express';
import { changeClass } from '@deepkit/core';
import { HttpRequest } from '@deepkit/http';

import { eventDispatcher, EventDispatcher } from '@deepkit/event';

const expressApp = express();
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
        await session.commit();
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

// flattenReferences(objectOrArray: any) {
//     if (Array.)
// }

class ResponseWrapper {
    @eventDispatcher.listen(httpWorkflow.onResponse)
    onResponse(event: typeof httpWorkflow.onResponse.event) {
        console.log('Event', event);

        event.result = {
            processingTime: (event as any).controllerActionTime,
            data: event.result,
        };
    }
}

const app = Application.create({
    controllers: [TestCommand, HelloController],
    listeners: [ ResponseWrapper ],
    providers: [
        MongoDatabase,
        RouteParameterResolverTag.provide(EntityResolver),
    ],
    imports: [
        KernelModule.configure({
            port: 8081,
            databases: [ MongoDatabase ],
            migrateOnStartup: true,
        }),
    ]
});

const httpKernel = app.get(HttpKernel);

expressApp.use((req, res) => {
    const deepKitRequest = changeClass(req, HttpRequest);

    httpKernel.handleRequest(
        deepKitRequest,
        res,
    );
});

async function init() {
    const eventDispatcher = app.get(EventDispatcher);
    await eventDispatcher.dispatch(onServerMainBootstrap, new ServerBootstrapEvent());
    await eventDispatcher.dispatch(onServerMainBootstrapDone, new ServerBootstrapEvent());
}

expressApp.listen(8081, init);

// app.run();
