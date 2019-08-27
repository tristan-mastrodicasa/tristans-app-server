import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsEnum, IsOptional, IsDate } from 'class-validator';
import { User } from './user.entity';

enum EAction {
  profileUpdate,
}

/**
 * The user model describes everything stored per user.
 */
@Entity('user_activity')
export class UserActivity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('enum', { enum: EAction })
  @IsEnum(EAction)
  public action: EAction;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  @IsOptional()
  @IsDate()
  public utc?: Date; // Date of following

  @ManyToOne(() => User, user => user.network)
  public user: User; // This field it's related with the profile activity

  @ManyToOne(() => User, user => user.network)
  public follower: User; // This field is the id of the user that related to the user profile activity

}
