import { entity, t } from '@deepkit/type';
import { mixin } from '@deepkit/type';
import { ActiveRecord } from '@deepkit/orm';

@entity.name('user')
export class User {
    @t.primary.mongoId _id!: string;
    @t.group('dates') createdAt: Date = new Date;

    @t lastName?: string;
    @t firstName?: string;

    @t.pattern(/^\S+@\S+\.\S+$/).index()
    email?: string;

    constructor(
       @t.index({ unique: true }).minLength(3) public username: string
    ) {}
}
