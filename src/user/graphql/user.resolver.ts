import { Resolver } from '@nestjs/graphql';

import { User } from '../entities/user.entity';
import { UserService } from '../user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // @Query(() => UsersResponse, { name: 'users' })
  // @UseGuards(AuthGuard)
  // @UseGuards(RolesGuard)
  // @Roles(UserRole.ADMIN)
  // async findAll(@Args('findAllUsersDto') findAllUsersDto: FindAllUsersDto) {
  //   return this.userService.findAll(findAllUsersDto);
  // }

  // @Query(() => User, { name: 'user' })
  // @UseGuards(AuthGuard)
  // @UseGuards(RolesGuard)
  // @Roles(UserRole.ADMIN)
  // async findOne(@Args('id', { type: () => String }) id: string) {
  //   return this.userService.findOne(id);
  // }

  // @Mutation(() => User)
  // @UseGuards(AuthGuard)
  // @UseGuards(RolesGuard)
  // @Roles(UserRole.ADMIN)
  // async createUser(@Args('createUserInput') createUserInput: CreateUserDto) {
  //   return this.userService.create(createUserInput);
  // }

  // @Mutation(() => User)
  // @UseGuards(AuthGuard)
  // @UseGuards(RolesGuard)
  // @Roles(UserRole.ADMIN)
  // async updateUser(
  //   @Args('id', { type: () => String }) id: string,
  //   @Args('updateUserInput') updateUserInput: UpdateUserDto,
  // ) {
  //   return this.userService.update(id, updateUserInput);
  // }

  // @Mutation(() => User)
  // @UseGuards(AuthGuard)
  // @UseGuards(RolesGuard)
  // @Roles(UserRole.ADMIN)
  // async removeUser(@Args('id', { type: () => String }) id: string) {
  //   return this.userService.remove(id);
  // }
}
