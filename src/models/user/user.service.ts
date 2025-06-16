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
  UpdateProfileTeacherDto,
  UpdateUserDto,
  CreateUserDto,
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

  async createUser(data: CreateUserDto): Promise<UserResponse> {
    const { password, ...userData } = data;

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: userData.email }, { username: userData.username }],
        ...notDeletedQuery,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email or username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let buildProfile = {};

    if (userData.role === UserRole.teacher) {
      buildProfile = {
        teacherProfile: {
          create: {
            longBio: '',
            introVideoUrlEmbed: '',
            certifications: '',
            teachingExperience: '',
            other: '',
          },
        },
      };
    } else if (userData.role === UserRole.user) {
      buildProfile = {
        studentProfile: {
          create: {
            targetStudyDuration: 0,
            targetReading: 0,
            targetListening: 0,
            targetWriting: 0,
            targetSpeaking: 0,
            nextExamDate: null,
          },
        },
      };
    }

    // Create new user
    const newUser = await this.prisma.user.create({
      data: {
        ...userData,
        passwordHash: hashedPassword,
        role: userData.role || UserRole.user,
        authProvider: AuthProvider.local,
        isEmailVerified: true, // admin created user
        ...buildProfile,
      },
      ...this.userIncludeQuery,
    });

    return { user: this.transformUserResponse(newUser) };
  }

  async findAll(findAllUsersDto: FindAllUserQuery): Promise<UsersResponse> {
    const { page, perPage, search, role, username, email, createdAt } =
      findAllUsersDto;

    const queryOptions = {
      where: {
        ...notDeletedQuery,
        ...(search
          ? searchQuery(search, ['username', 'email', 'firstName', 'lastName'])
          : {}),
        ...(role ? { role } : {}),
        ...(username ? { username: { contains: username } } : {}),
        ...(email ? { email: { contains: email } } : {}),
        ...(createdAt ? { createdAt: { gte: new Date(createdAt) } } : {}),
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

  async findByUsername(username: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      ...this.userIncludeQuery,
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return { user: this.transformUserResponse(user) };
  }

  async createTeacher(teacherDto: TeacherDto): Promise<UserResponse> {
    const {
      password,
      longBio,
      introVideoUrlEmbed,
      certifications,
      teachingExperience,
      bankingqr_image_url,
      other,
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
            longBio,
            introVideoUrlEmbed,
            certifications,
            teachingExperience,
            bankingqr_image_url,
            other,
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
      longBio,
      introVideoUrlEmbed,
      certifications,
      teachingExperience,
      bankingqr_image_url,
      other,
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
          longBio,
          introVideoUrlEmbed,
          certifications,
          teachingExperience,
          bankingqr_image_url,
          other,
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
    data: UpdateProfileTeacherDto,
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
      username,
      email,
      firstName,
      lastName,
      bio,
      profilePicture,
      longBio,
      introVideoUrlEmbed,
      certifications,
      teachingExperience,
      bankingqr_image_url,
      other,
    } = data;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email,
        firstName,
        lastName,
        bio,
        profilePicture,
        teacherProfile: user.teacherProfile
          ? {
              update: {
                longBio,
                introVideoUrlEmbed,
                certifications,
                teachingExperience,
                bankingqr_image_url,
                other,
              },
            }
          : {
              create: {
                longBio,
                introVideoUrlEmbed,
                certifications,
                teachingExperience,
                bankingqr_image_url,
                other,
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
      include: {
        teacherProfile: true,
        studentProfile: true,
        lessons: true,
        submissions: true,
        gradedSubmissions: true,
        vocabularies: true,
        comments: true,
        reactions: true,
        notifications: true,
        createdNotifications: true,
        VocabularyPractice: true,
        StudyActivity: true,
        TokenWallet: true,
        Transaction: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if user has any relations
    const hasRelations =
      user.lessons.length > 0 ||
      user.submissions.length > 0 ||
      user.gradedSubmissions.length > 0 ||
      user.vocabularies.length > 0 ||
      user.comments.length > 0 ||
      user.reactions.length > 0 ||
      user.notifications.length > 0 ||
      user.createdNotifications.length > 0 ||
      user.VocabularyPractice.length > 0 ||
      user.StudyActivity.length > 0 ||
      user.TokenWallet !== null ||
      user.Transaction.length > 0;

    if (hasRelations) {
      // Soft delete if user has relations
      await this.prisma.user.update({
        where: { id },
        data: {
          ...softDeleteQuery,
        },
      });
      return { message: 'User soft deleted successfully' };
    } else {
      // Hard delete if no relations
      await this.prisma.user.delete({
        where: { id },
      });
      return { message: 'User permanently deleted successfully' };
    }
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

  async updateUser(userId: string, data: UpdateUserDto): Promise<UserResponse> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, ...notDeletedQuery },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        username: data.username,
        profilePicture: data.profilePicture,
        bio: data.bio,
      },
      ...this.userIncludeQuery,
    });

    return { user: this.transformUserResponse(updatedUser) };
  }
}
