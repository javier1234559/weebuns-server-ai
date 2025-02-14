import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthGuard } from 'src/common/auth/auth.guard';
import { RolesGuard } from 'src/common/auth/role.guard';
import { Roles, UserRole } from 'src/common/decorators/role.decorator';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { FindAllUsersDto } from 'src/user/dtos/find-all-user.dto';
import { UpdateProfileUserDto } from 'src/user/dtos/update-profile-user.dto';
import { UpdateUserDto } from 'src/user/dtos/update-user.dto';
import {
  CreateUserResponse,
  DeleteUserResponse,
  UpdateUserResponse,
  UserResponse,
  UsersResponse,
} from 'src/user/dtos/user-response.dto';
import { UserService } from 'src/user/user.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiQuery({
    type: FindAllUsersDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UsersResponse,
  })
  async findAll(
    @Query() findAllUsersDto: FindAllUsersDto,
  ): Promise<UsersResponse> {
    return this.userService.findAll(findAllUsersDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponse,
  })
  async findOne(@Param('id') id: string): Promise<UserResponse> {
    return this.userService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateUserResponse,
  })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponse> {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: String,
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
    type: UpdateUserResponse,
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponse> {
    return this.userService.update(id, updateUserDto);
  }

  @Patch(':id')
  @Roles(UserRole.USER)
  @ApiParam({
    name: 'id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
    type: UpdateUserResponse,
  })
  async updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateProfileUserDto,
  ): Promise<UpdateUserResponse> {
    return this.userService.updateProfile(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: String,
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted successfully',
    type: DeleteUserResponse,
  })
  async remove(@Param('id') id: string): Promise<DeleteUserResponse> {
    return this.userService.remove(id);
  }
}
