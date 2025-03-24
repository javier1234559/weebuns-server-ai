import { UserResponse } from 'src/models/user/dto/auth-response.dto';
import { TeacherDto, ProfileDto } from 'src/models/user/dto/user-request.dto';
import {
  DeleteUserResponse,
  FindAllUserQuery,
  UsersResponse,
} from 'src/models/user/dto/user-response.dto';

export interface UserServiceInterface {
  updateProfileTeacher(userId: string, data: ProfileDto): Promise<UserResponse>;
  updateProfileStudent(userId: string, data: ProfileDto): Promise<UserResponse>;

  findAll(dto: FindAllUserQuery): Promise<UsersResponse>;
  findById(id: string): Promise<UserResponse>;
  createTeacher(data: TeacherDto): Promise<UserResponse>;
  updateTeacher(id: string, data: TeacherDto): Promise<UserResponse>;
  remove(id: string): Promise<DeleteUserResponse>;
}
