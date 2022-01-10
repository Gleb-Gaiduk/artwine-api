import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { JwtAccessTokenInput } from 'src/auth/dto/jwtToken.input';
import { Role, UserRoles } from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import { Action } from './types';
import { hasRole } from './utils/hasRole.utils';

type Subjects = InferSubjects<typeof User | typeof Role> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: JwtAccessTokenInput) {
    const {
      can: allow,
      cannot: forbid,
      build,
    } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    if (hasRole(user.roles, UserRoles.ADMIN)) {
      allow(Action.Manage, 'all');
      allow(Action.Delete, User);
    } else {
      forbid(Action.Delete, User);
      forbid(Action.Manage, Role);
    }

    allow(Action.Read, User, { id: user.sub });
    allow(Action.Update, User, { id: user.sub });

    // if (user.role === Role.Admin) {
    //   can(Action.MANAGE, 'all');
    //   can(Action.DELETE, Post);
    // } else {
    //   can(Action.READ, Post);
    //   can(Action.UPDATE, User, { id: user.id });
    //   can(Action.READ, User, { id: user.id });
    //   can(Action.READ, User, { login: user.login });
    //   can(Action.CREATE, Post);
    //   cannot(Action.DELETE, Post);

    //   can<FlatAttachedFile>(Action.DELETE, AttachedFile, {
    //     'post.author.id': user.id,
    //   });
    // }

    // can<FlatPost>(Action.UPDATE, Post, { 'author.id': user.id });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
