import { Exclude, Expose, Transform } from 'class-transformer';
import { UserRole } from '../../models/User';
import { Types } from 'mongoose';
import { TransformId } from '../../utils';
@Exclude()
export class UserResponseDto {
  @Expose()
  @TransformId()
  _id!: Types.ObjectId;

  @Expose()
  email!: string;

  @Expose()
  name!: string;

  @Expose()
  role!: UserRole;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  createdAt!: Date;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  updatedAt!: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
} 