import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { Length, IsAlphanumeric, IsAlpha, IsEmail, IsOptional } from 'class-validator';
import { UserNetwork } from './user-network.entity';
import { UserStatistics } from './user-statistics.entity';
import { UserSettings } from './user-settings.entity';
import { UserActivity } from './user-activity.entity';
import { Canvas } from './canvas.entity';
import { CanvasActivity } from './canvas-activity.entity';
import { Meme } from './meme.entity';
import { MemeActivity } from './meme-activity.entity';
import { CanvasInvites } from './canvas-invites.entity';

/**
 * The user model describes everything stored per user.
 */
@Entity('users')
export class User extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('varchar', { length: 100, nullable: true })
  @IsOptional()
  @Length(1, 100)
  public facebookId?: string; // Can be null

  @Column('varchar', { length: 100, nullable: true })
  @IsOptional()
  @Length(1, 100)
  public googleId?: string; // Can be null

  @Column('varchar', { length: 25, unique: true })
  @IsAlphanumeric()
  @Length(1, 25)
  public username: string;

  @Column('varchar', { length: 25 })
  @IsAlpha()
  @Length(1, 25)
  public firstname: string;

  @Column('varchar', { length: 255, nullable: true, unique: true })
  @IsOptional()
  @Length(1, 255)
  @IsEmail()
  public email?: string;

  @Column('varchar', { length: 128 })
  @Length(1, 128)
  public profileImg: string; // path of the image

  @OneToMany(() => UserNetwork, userNetwork => userNetwork.user)
  public network: UserNetwork[]; // This field gives access to all the user network info (like followers ecc..), it's used for make joins

  @OneToMany(() => UserActivity, userActivity => userActivity.user)
  public activity: UserActivity[]; // This field gives access to all the user activities

  @OneToMany(() => Canvas, canvas => canvas.user)
  public canvas: Canvas[]; // canvases of the client

  @OneToMany(() => Meme, meme => meme.user)
  public memes: Meme[]; // memes of the client

  @OneToMany(() => CanvasActivity, canvasActivity => canvasActivity.user)
  public canvasActivity: CanvasActivity[]; // actions over canvas

  @OneToMany(() => MemeActivity, memeActivity => memeActivity.user)
  public memeActivity: MemeActivity[]; // actions over memes

  @OneToOne(() => UserStatistics, userStatistics => userStatistics.user)
  public statistics: UserStatistics; // This field gives access to all user statistics

  @OneToOne(() => UserSettings, userSettings => userSettings.user)
  public settings: UserSettings; // This field gives access to all user settings

  @OneToMany(() => CanvasInvites, canvasInvites => canvasInvites.user)
  public canvasInvites: CanvasInvites[]; // List of all the canvases the user can been invited to edit

}
