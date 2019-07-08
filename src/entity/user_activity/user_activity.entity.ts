import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

enum EAction {
  profileUpdate,
}

/**
 * The user model describes everything stored per user.
 * @type {UserActivity}
 */
@Entity('user_activity')
export class UserActivity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('datetime')
  public utc: Date; // Date of following

  @Column('enum', { enum: EAction })
  public action: EAction;

  @ManyToOne(() => User, user => user.network)
  public user: User; // This field it's related with the profile activity

  @ManyToOne(() => User, user => user.network)
  public follower: User; // This field is the id of the user that related to the user profile activity
}
