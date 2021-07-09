import 'reflect-metadata';
import { Application } from '@deepkit/framework';
import { injectable } from '@deepkit/injector';
import { http, RouteParameterResolverContext, RouteParameterResolverTag } from '@deepkit/http';
import { RouteParameterResolver } from '@deepkit/http/src/router';
import { ClassType } from '@deepkit/core';


class User {
    constructor(
        public username: string,
        public id: number = 0,
    ) {
    }
}

class UserDatabase {
    protected users: User[] = [
        new User('User 1', 1),
        new User('User 2', 2),
    ];

    public getUser(id: number): User | undefined {
        return this.users.find(v => v.id === id);
    }
}

@injectable()
class UserResolver implements RouteParameterResolver {
    constructor(protected database: UserDatabase) {
    }

    resolve(context: RouteParameterResolverContext): any {
        if (!context.parameters.id) throw new Error('No :id given');
        return this.database.getUser(parseInt(context.parameters.id));
    }

    supports(classType: ClassType): boolean {
        return classType === User;
    }

}

@http.controller()
class MyWebsite {
    @http.GET(':id')
    getUser(user: User) {
        return 'Hello ' + user.username;
    }
}

Application.create({
    controllers: [MyWebsite],
    providers: [
        UserDatabase,
        RouteParameterResolverTag.provide(UserResolver)
    ]
})
    .run();