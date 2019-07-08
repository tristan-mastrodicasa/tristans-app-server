import { BaseEntity, Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

/**
 * The user model describes the statistics of the user using an 1:1 Relation.
 * @type {UserStatistics}
 */
@Entity('user_statistics')
export class UserStatistics extends BaseEntity {
  @Column('int')
  public influence: number;

  @Column('int')
  public contentNum: number; // Number of meme's/canvas

  @Column('int')
  public followers: number; // number of followers

  @Column('int')
  public following: number; // number of users following

  @OneToOne(() => User, user => user.statistics, { primary: true })
  @JoinColumn()
  public user: User; // Foreign key of the user entity used also the primary key
}
