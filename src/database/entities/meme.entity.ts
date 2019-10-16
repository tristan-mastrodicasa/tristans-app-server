import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { IsInt, IsDate, IsOptional, Length } from 'class-validator';
import { User } from './user.entity';
import { Canvas } from './canvas.entity';
import { MemeReacts } from './meme-reacts.entity';

/**
 * The meme model describes everything stored per meme
 */
@Entity('memes')
export class Meme extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('varchar', { length: 64 })
  @Length(1, 64)
  public imagePath: string;

  @Column('varchar', { length: 15 })
  @Length(1, 15)
  public mimetype: string; // Header for when the user queries images to load

  @Column('int', { default: () => '0' })
  @IsOptional()
  @IsInt()
  public stars?: number; /** @todo remove and rely on COUNT(*) from meme_reacts */

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  @IsOptional()
  @IsDate()
  public utc?: Date;

  @ManyToOne(() => User, user => user.memes, { onDelete: 'CASCADE' })
  public user: User;

  @ManyToOne(() => Canvas, canvas => canvas.memes, { onDelete: 'CASCADE' })
  public canvas: Canvas;

  @OneToMany(() => MemeReacts, memeReacts => memeReacts.meme)
  public reacts: MemeReacts[];

}
