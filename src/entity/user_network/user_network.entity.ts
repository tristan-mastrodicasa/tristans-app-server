import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

/**
 * The user model describes everything stored per user.
 * @type {UserNetwork}
 */
@Entity('user_network')
export class UserNetwork extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('datetime')
  public utc: Date; // Date of following

  @ManyToOne(() => User, user => user.network)
  public user: User; // This field it's related with the profile network

  @ManyToOne(() => User, user => user.network)
  public follower: User; // This field is the id of the user that related to the user profile network
}
