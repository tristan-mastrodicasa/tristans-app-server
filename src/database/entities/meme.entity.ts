import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { IsBoolean, IsInt, IsDate, IsOptional, Length } from 'class-validator';
import { User } from './user.entity';
import { Canvas } from './canvas.entity';
import { MemeActivity } from './meme-activity.entity';

/**
 * The canvas model describes everything stored per canvas
 */
@Entity('memes')
export class Meme extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('varchar', { length: 64, unique: true })
  @Length(1, 64)
  public imagePath: string;

  @Column('int', { default: () => '0' })
  @IsOptional()
  @IsInt()
  public stars?: number;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  @IsOptional()
  @IsDate()
  public utc?: Date;

  @Column('boolean', { default: () => 'false' })
  @IsOptional()
  @IsBoolean()
  public deleted?: boolean;

  @ManyToOne(() => User, user => user.memes, { onDelete: 'CASCADE' })
  public user: User;

  @ManyToOne(() => Canvas, canvas => canvas.memes, { onDelete: 'CASCADE' })
  public canvas: Canvas;

  @OneToMany(() => MemeActivity, memeActivity => memeActivity.meme)
  public activity: MemeActivity[];

}
