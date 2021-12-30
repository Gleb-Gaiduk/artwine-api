import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { JwtAccessTokenInput } from 'src/auth/dto/jwtToken.input';
import { UserRoles } from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import { Action } from './types';

type Subjects = InferSubjects<typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

export class CaslAbilityFactory {
  createForUser(userDataFromJWT: JwtAccessTokenInput) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);
    if (userDataFromJWT.roles) {
      if (userDataFromJWT.roles.includes(UserRoles.ADMIN)) {
        can(Action.Manage, 'all'); // read-write access to everything
      } else if (userDataFromJWT.roles.includes(UserRoles.CONTENT_MANAGER)) {
        can(Action.Read, 'all'); // read-only access to everything
      }
    } else {
      cannot(Action.Read, User);
    }
    // cannot(Action.Delete, User);

    // can(Action.Update, Article, { authorId: user.id });
    // cannot(Action.Delete, Article, { isPublished: true });

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
