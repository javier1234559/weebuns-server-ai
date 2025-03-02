import { ApiProperty } from '@nestjs/swagger';

import { PaginationOutputDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/models/user/entities/user.entity';

export class UserResponse {
  @ApiProperty()
  user: Omit<User, 'passwordHash'>;
}

export class UsersResponse {
  @ApiProperty({ type: [User] })
  users: Omit<User, 'passwordHash'>[];

  @ApiProperty()
  @ApiProperty({ type: PaginationOutputDto })
  pagination: PaginationOutputDto;
}

export class CreateUserResponse {
  @ApiProperty()
  @ApiProperty({ type: User })
  user: Omit<User, 'passwordHash'>;
}

export class UpdateUserResponse {
  @ApiProperty()
  @ApiProperty({ type: User })
  user: Omit<User, 'passwordHash'>;
}

export class DeleteUserResponse {
  @ApiProperty()
  @ApiProperty({ type: User })
  user: Omit<User, 'passwordHash'>;
}
