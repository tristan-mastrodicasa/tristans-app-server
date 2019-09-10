import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { IsOptional, Length, IsEnum, IsInt, IsDate, MaxLength } from 'class-validator';
import { User } from 'database/entities/user.entity';
import { CanvasActivity } from 'database/entities/canvas-activity.entity';
import { CanvasInvites } from 'database/entities/canvas-invites.entity';
import { Meme } from 'database/entities/meme.entity';

import { EVisibility } from 'models/enums';

/**
 * The canvas model describes everything stored per canvas
 */
@Entity('canvas')
export class Canvas extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('varchar', { length: 255, nullable: true })
  @IsOptional()
  @Length(1, 255)
  public description?: string;

  @Column('varchar', { length: 64, unique: true })
  @MaxLength(64)
  public imagePath: string;

  @Column('enum', { enum: EVisibility })
  @IsEnum(EVisibility)
  public visibility: EVisibility;

  @Column('varchar', { length: 64 })
  @MaxLength(64)
  // When accessing publicly this access key must be passes as a param (so only people with the link can see it)
  public publicAccessKey: string;

  @Column('int')
  @IsInt()
  public stars: number;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  @IsOptional()
  @IsDate()
  public utc?: Date;

  @ManyToOne(() => User, user => user.canvas)
  public user: User;

  @OneToMany(() => CanvasActivity, canvasActivity => canvasActivity.canvas)
  public activity: CanvasActivity[];

  @OneToMany(() => Meme, meme => meme.canvas)
  public memes: Meme[];

  @OneToMany(() => CanvasInvites, canvasInvites => canvasInvites.canvas)
  public invitations: CanvasInvites[];

}
