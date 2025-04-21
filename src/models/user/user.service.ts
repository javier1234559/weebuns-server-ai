/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
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
import { UserResponse } from 'src/models/user/dto/auth-response.dto';
import {
  ProfileDto,
  TeacherDto,
  UpdateProfileUserDto,
} from 'src/models/user/dto/user-request.dto';
import {
  DeleteUserResponse,
  FindAllUserQuery,
  UsersResponse,
} from 'src/models/user/dto/user-response.dto';
import { User } from 'src/models/user/entities/user.entity';
import { UserServiceInterface } from 'src/models/user/interface/user-service.interface';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(private readonly prisma: PrismaService) {}

  private readonly userIncludeQuery = {
    include: {
      teacherProfile: true,
      studentProfile: true,
    },
  };

  private transformUserResponse(user: any): Omit<User, 'passwordHash'> {
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findAll(findAllUsersDto: FindAllUserQuery): Promise<UsersResponse> {
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
      ...this.userIncludeQuery,
    };

    const [users, totalItems] = await Promise.all([
      this.prisma.user.findMany(queryOptions),
      this.prisma.user.count({ where: queryOptions.where }),
    ]);

    return {
      data: users.map((user) => this.transformUserResponse(user)),
      pagination: calculatePagination(totalItems, findAllUsersDto),
    };
  }

  async findById(id: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      ...this.userIncludeQuery,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return { user: this.transformUserResponse(user) };
  }

  async createTeacher(teacherDto: TeacherDto): Promise<UserResponse> {
    const {
      password,
      specialization,
      qualification,
      teachingExperience,
      hourlyRate,
      ...userData
    } = teacherDto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: userData.email }, { username: userData.username }],
        ...notDeletedQuery,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = await this.prisma.user.create({
      data: {
        ...userData,
        passwordHash: hashedPassword,
        role: UserRole.teacher,
        authProvider: AuthProvider.local,
        teacherProfile: {
          create: {
            specialization,
            qualification,
            teachingExperience,
            hourlyRate,
          },
        },
      },
      ...this.userIncludeQuery,
    });

    return { user: this.transformUserResponse(newTeacher) };
  }

  async updateTeacher(
    id: string,
    teacherDto: TeacherDto,
  ): Promise<UserResponse> {
    const existingTeacher = await this.prisma.user.findFirst({
      where: {
        id,
        role: UserRole.teacher,
        ...notDeletedQuery,
      },
      ...this.userIncludeQuery,
    });

    if (!existingTeacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    const {
      password,
      specialization,
      qualification,
      teachingExperience,
      hourlyRate,
      username,
      email,
      ...userData
    } = teacherDto;

    if (username && username !== existingTeacher.username) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          username,
          ...notDeletedQuery,
        },
      });

      if (existingUser) {
        throw new ConflictException('Username already exists');
      }
    }

    if (email && email !== existingTeacher.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email,
          ...notDeletedQuery,
        },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    const updateData: any = {
      ...userData,
      username,
      email,
      teacherProfile: {
        update: {
          specialization,
          qualification,
          teachingExperience,
          hourlyRate,
        },
      },
    };

    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedTeacher = await this.prisma.user.update({
      where: { id },
      data: updateData,
      ...this.userIncludeQuery,
    });

    return { user: this.transformUserResponse(updatedTeacher) };
  }

  async updateProfileTeacher(
    userId: string,
    data: ProfileDto,
  ): Promise<UserResponse> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        role: UserRole.teacher,
        ...notDeletedQuery,
      },
      ...this.userIncludeQuery,
    });

    if (!user) {
      throw new NotFoundException('Teacher not found');
    }

    const {
      specialization,
      qualification,
      teachingExperience,
      hourlyRate,
      ...basicData
    } = data;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...basicData,
        teacherProfile: user.teacherProfile
          ? {
              update: {
                specialization,
                qualification,
                teachingExperience,
                hourlyRate,
              },
            }
          : {
              create: {
                specialization,
                qualification,
                teachingExperience,
                hourlyRate,
              },
            },
      },
      ...this.userIncludeQuery,
    });

    return { user: this.transformUserResponse(updatedUser) };
  }

  async updateProfileStudent(
    userId: string,
    data: ProfileDto,
  ): Promise<UserResponse> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        role: UserRole.user,
        ...notDeletedQuery,
      },
      ...this.userIncludeQuery,
    });

    if (!user) {
      throw new NotFoundException('Student not found');
    }

    const {
      targetStudyDuration,
      targetReading,
      targetListening,
      targetWriting,
      targetSpeaking,
      nextExamDate,
      ...basicData
    } = data;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...basicData,
        studentProfile: user.studentProfile
          ? {
              update: {
                targetStudyDuration,
                targetReading,
                targetListening,
                targetWriting,
                targetSpeaking,
                nextExamDate,
              },
            }
          : {
              create: {
                targetStudyDuration,
                targetReading,
                targetListening,
                targetWriting,
                targetSpeaking,
                nextExamDate,
                tokensBalance: 0,
              },
            },
      },
      ...this.userIncludeQuery,
    });

    return { user: this.transformUserResponse(updatedUser) };
  }

  async remove(id: string): Promise<DeleteUserResponse> {
    const user = await this.prisma.user.findFirst({
      where: { id, ...notDeletedQuery },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        ...softDeleteQuery,
      },
    });

    return { message: 'User deleted successfully' };
  }

  async updateProfile(
    id: string,
    updateUserInput: UpdateProfileUserDto,
  ): Promise<UserResponse> {
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
        username: updateUserInput.username,
        profilePicture: updateUserInput.profilePicture,
      },
      ...this.userIncludeQuery,
    });

    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return { user: userWithoutPassword };
  }
}
