import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserNotExistsByIDInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    let userIdParam;

    const updateUserInputMutation = context.getArgs().find((obj) => {
      if (obj) {
        return obj.updateUserInput;
      }
    });

    if (updateUserInputMutation) {
      userIdParam = updateUserInputMutation.updateUserInput.id;
    } else {
      userIdParam = context.getArgs().find((obj) => {
        if (obj) return obj.id;
      })?.id;
    }

    if (!userIdParam)
      throw new BadRequestException('User ID parameter was not provided');

    const existingUser = await this.users.findOne(userIdParam);

    if (!existingUser)
      throw new BadRequestException(
        `User with ID ${userIdParam} doesn't exist`,
      );

    return next.handle();
  }
}
