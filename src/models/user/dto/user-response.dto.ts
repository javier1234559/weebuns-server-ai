import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import {
  PaginationInputDto,
  PaginationOutputDto,
} from 'src/common/dto/pagination.dto';
import { User } from 'src/models/user/entities/user.entity';

export class FindAllUsersDto extends PaginationInputDto {
  //docs
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}

export class UserResponse {
  @ApiProperty()
  user: Omit<User, 'passwordHash'>;
}

export class UsersResponse {
  @ApiProperty()
  data: Omit<User, 'passwordHash'>[];
  @ApiProperty()
  pagination: PaginationOutputDto;
}

export class DeleteUserResponse {
  @ApiProperty()
  message: string;
}

export class CreateUserResponse {
  @ApiProperty()
  user: Omit<User, 'passwordHash'>;
}
