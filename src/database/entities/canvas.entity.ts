import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { IsOptional, Length, MaxLength, IsEnum, IsInt, IsDate } from 'class-validator';
import { User } from './user.entity';
import { CanvasReacts } from './canvas-reacts.entity';
import { CanvasInvites } from './canvas-invites.entity';
import { Meme } from './meme.entity';

import { EVisibility } from 'shared/models';

/**
 * The canvas model describes everything stored per canvas
 */
@Entity('canvas')
export class Canvas extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('varchar', { length: 255, nullable: true })
  @IsOptional()
  @MaxLength(255)
  public description?: string;

  @Column('varchar', { length: 64 })
  @Length(1, 64)
  public imagePath: string;

  @Column('varchar', { length: 15 })
  @Length(1, 15)
  public mimetype: string; // Header for when the user queries images to load

  @Column('enum', { enum: EVisibility })
  @IsEnum(EVisibility)
  public visibility: EVisibility;

  @Column('varchar', { length: 64, unique: true })
  @Length(64, 64)
  public uniqueKey: string; // Key associated with this canvas

  @Column('int', { default: () => 0 })
  @IsOptional()
  @IsInt()
  public stars?: number;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  @IsOptional()
  @IsDate()
  public utc?: Date;

  @ManyToOne(() => User, user => user.canvases, { onDelete: 'CASCADE' })
  public user: User;

  @OneToMany(() => CanvasReacts, canvasReacts => canvasReacts.canvas)
  public reacts: CanvasReacts[];

  @OneToMany(() => Meme, meme => meme.canvas)
  public memes: Meme[];

  @OneToMany(() => CanvasInvites, canvasInvites => canvasInvites.canvas)
  public invitations: CanvasInvites[];

}
