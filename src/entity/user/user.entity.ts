import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { UserNetwork } from '../user_network/user_network.entity';
import { UserStatistics } from '../user_statistics/user_statistics.entity';
import { UserActivity } from '../user_activity/user_activity.entity';
import { Canvas } from '../canvas/canvas.entity';
import { CanvasActivity } from '../canvas_activity/canvas_activity.entity';
import { Meme } from '../meme/meme.entity';
import { MemeActivity } from '../meme_activity/meme_activity.entity';

/**
 * The user model describes everything stored per user.
 * @type {User}
 */
@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('varchar', { nullable: true })
  public facebookId?: string; // Can be null

  @Column('varchar', { length: 25 })
  public username: string;

  @Column('varchar', { length: 25 })
  public firstname: string;

  @Column('varchar', { length: 255, unique: true })
  public email: string;

  @Column('varchar', { length: 64 })
  public profileImg: string; // path of the image

  @OneToMany(() => UserNetwork, userNetwork => userNetwork.user)
  public network: UserNetwork[]; // This field gives access to all the user network info (like followers ecc..), it's used for make joins

  @OneToMany(() => UserActivity, userActivity => userActivity.user)
  public activity: UserActivity[]; // This field gives access to all the user activities

  @OneToMany(() => Canvas, canvas => canvas.user)
  public canvas: Canvas[]; // canvas of the client

  @OneToMany(() => Meme, meme => meme.user)
  public memes: Meme[]; // memes of the client

  @OneToMany(() => CanvasActivity, canvasActivity => canvasActivity.user)
  public canvasActivity: CanvasActivity[]; // actions over canvas

  @OneToMany(() => MemeActivity, memeActivity => memeActivity.user)
  public memeActivity: MemeActivity[]; // actions over memes

  @OneToOne(() => UserStatistics, userStatistics => userStatistics.user)
  public statistics: UserStatistics; // This field gives access to all user statistics
}
