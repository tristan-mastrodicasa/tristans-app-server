import { BaseEntity, Entity, Index, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { Length, IsAlphanumeric, IsAlpha, IsEmail, IsOptional, IsDate } from 'class-validator';
import { UserNetwork } from './user-network.entity';
import { UserStatistics } from './user-statistics.entity';
import { UserSettings } from './user-settings.entity';
import { Canvas } from './canvas.entity';
import { CanvasReacts } from './canvas-reacts.entity';
import { Meme } from './meme.entity';
import { MemeReacts } from './meme-reacts.entity';
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

  @Index({ fulltext: true }) // Increases search speed
  @Column('varchar', { length: 25 })
  @IsAlphanumeric()
  @Length(1, 25)
  public username: string; // must be unique (check during validation)

  @Index({ fulltext: true }) // Increases search speed
  @Column('varchar', { length: 25 })
  @IsAlpha()
  @Length(1, 25)
  public firstName: string;

  @Column('varchar', { length: 255, nullable: true, unique: true })
  @IsOptional()
  @Length(1, 255)
  @IsEmail()
  public email?: string;

  @Column('varchar', { length: 128 })
  @Length(1, 128)
  public profileImg: string; // path of the image

  @Column('varchar', { length: 15 })
  @Length(1, 15)
  public profileImgMimeType: string; // Profile image type

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  @IsOptional()
  @IsDate()
  public utc?: Date;

  @OneToMany(() => UserNetwork, userNetwork => userNetwork.user)
  public network: UserNetwork[]; // This field gives access to all the user network info (like followers ecc..), it's used for make joins

  @OneToMany(() => Canvas, canvas => canvas.user)
  public canvases: Canvas[]; // canvases of the client

  @OneToMany(() => Meme, meme => meme.user)
  public memes: Meme[]; // memes of the client

  @OneToMany(() => CanvasReacts, canvasReacts => canvasReacts.user)
  public canvasReacts: CanvasReacts[]; // actions over canvas

  @OneToMany(() => MemeReacts, memeReacts => memeReacts.user)
  public memeReacts: MemeReacts[]; // actions over memes

  @OneToOne(() => UserStatistics, userStatistics => userStatistics.user)
  public statistics: UserStatistics; // This field gives access to all user statistics

  @OneToOne(() => UserSettings, userSettings => userSettings.user)
  public settings: UserSettings; // This field gives access to all user settings

  @OneToMany(() => CanvasInvites, canvasInvites => canvasInvites.user)
  public canvasInvites: CanvasInvites[]; // List of all the canvases the user can been invited to edit

}
