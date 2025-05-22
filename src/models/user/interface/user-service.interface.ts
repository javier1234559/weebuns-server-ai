import { UserResponse } from 'src/models/user/dto/auth-response.dto';
import {
  TeacherDto,
  ProfileDto,
  UpdateUserDto,
  UpdateProfileTeacherDto,
  CreateUserDto,
} from 'src/models/user/dto/user-request.dto';
import {
  DeleteUserResponse,
  FindAllUserQuery,
  UsersResponse,
} from 'src/models/user/dto/user-response.dto';

export interface UserServiceInterface {
  updateUser(userId: string, data: UpdateUserDto): Promise<UserResponse>;
  updateProfileTeacher(
    userId: string,
    data: UpdateProfileTeacherDto,
  ): Promise<UserResponse>;
  updateProfileStudent(userId: string, data: ProfileDto): Promise<UserResponse>;

  findAll(dto: FindAllUserQuery): Promise<UsersResponse>;
  findById(id: string): Promise<UserResponse>;
  findByUsername(username: string): Promise<UserResponse>;

  createUser(data: CreateUserDto): Promise<UserResponse>;
  createTeacher(data: TeacherDto): Promise<UserResponse>;
  updateTeacher(id: string, data: TeacherDto): Promise<UserResponse>;
  remove(id: string): Promise<DeleteUserResponse>;
}
