import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsOptional, IsDate } from 'class-validator';
import { User } from 'database/entities/user.entity';

/**
 * The user model describes everything stored per user.
 */
@Entity('user_network')
export class UserNetwork extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  @IsOptional()
  @IsDate()
  public utc?: Date; // Date of following

  @ManyToOne(() => User, user => user.network)
  public user: User; // This field it's related with the profile network

  @ManyToOne(() => User, user => user.network)
  public follower: User; // This field is the id of the user that related to the user profile network

}
