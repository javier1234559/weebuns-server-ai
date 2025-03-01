/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';

import { AuthProvider, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import {
  notDeletedQuery,
  paginationQuery,
  searchQuery,
  softDeleteQuery,
} from 'src/common/helper/prisma-queries.helper';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { calculatePagination } from 'src/common/utils/pagination';
import { CreateUserDto } from 'src/models/user/dtos/create-user.dto';
import { FindAllUsersDto } from 'src/models/user/dtos/find-all-user.dto';
import { UpdateProfileUserDto } from 'src/models/user/dtos/update-profile-user.dto';
import { UpdateUserDto } from 'src/models/user/dtos/update-user.dto';
import {
  CreateUserResponse,
  DeleteUserResponse,
  UpdateUserResponse,
  UserResponse,
  UsersResponse,
} from 'src/models/user/dtos/user-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserInput: CreateUserDto): Promise<CreateUserResponse> {
    const { password, ...userData } = createUserInput;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        // nativeLanguage: userData.nativeLanguage,
        profilePicture: userData.profile_picture,
        passwordHash: hashedPassword,
        role: userData.role || UserRole.user,
        authProvider: AuthProvider.local,
      },
    });

    const { passwordHash, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword };
  }

  async findAll(findAllUsersDto: FindAllUsersDto): Promise<UsersResponse> {
    const { page, perPage, search } = findAllUsersDto;

    const queryOptions = {
      where: {
        ...notDeletedQuery,
        ...(search
          ? searchQuery(search, ['username', 'email', 'firstName', 'lastName'])
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      ...paginationQuery(page, perPage),
    };

    const [users, totalItems] = await Promise.all([
      this.prisma.user.findMany(queryOptions),
      this.prisma.user.count({ where: queryOptions.where }),
    ]);

    return {
      users: users.map(({ passwordHash, ...user }) => user),
      pagination: calculatePagination(totalItems, findAllUsersDto),
    };
  }

  async findOne(id: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id, ...notDeletedQuery },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  }

  async update(
    id: string,
    updateUserInput: UpdateUserDto,
  ): Promise<UpdateUserResponse> {
    const user = await this.prisma.user.findFirst({
      where: { id, ...notDeletedQuery },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserInput,
        firstName: updateUserInput.first_name,
        lastName: updateUserInput.last_name,
      },
    });

    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return { user: userWithoutPassword };
  }

  async updateProfile(
    id: string,
    updateUserInput: UpdateProfileUserDto,
  ): Promise<UpdateUserResponse> {
    const user = await this.prisma.user.findFirst({
      where: { id, ...notDeletedQuery },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        firstName: updateUserInput.firstName,
        lastName: updateUserInput.lastName,
        email: updateUserInput.email,
        // nativeLanguage: updateUserInput.nativeLanguage,
        username: updateUserInput.username,
        profilePicture: updateUserInput.profilePicture,
      },
    });

    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return { user: userWithoutPassword };
  }

  async remove(id: string): Promise<DeleteUserResponse> {
    const user = await this.prisma.user.findFirst({
      where: { id, ...notDeletedQuery },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const deletedUser = await this.prisma.user.update(softDeleteQuery(id));
    const { passwordHash, ...userWithoutPassword } = deletedUser;
    return { user: userWithoutPassword };
  }
}
