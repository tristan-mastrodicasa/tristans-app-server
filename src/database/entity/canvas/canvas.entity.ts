import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { IsOptional, Length, IsEnum, IsInt, IsDate, IsNotEmpty } from 'class-validator';
import { User } from '../user/user.entity';
import { CanvasActivity } from '../canvas-activity/canvas-activity.entity';
import { Meme } from '../meme/meme.entity';

// Enum for the visibility levels of the canvas
enum EVisibility {
  public,
  follwers,
  followBacks,
  specificUsers,
}

/**
 * The canvas model describes everything stored per canvas
 */
@Entity('canvas')
export class Canvas extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('text', { nullable: true })
  @IsOptional()
  @Length(1, 255)
  public description?: string;

  @Column('varchar', { length: 64, unique: true })
  @IsNotEmpty()
  public imagePath: string;

  @Column('enum', { enum: EVisibility })
  @IsEnum(EVisibility)
  public visibility: EVisibility;

  @Column('int')
  @IsInt()
  public stars: number;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  @IsOptional()
  @IsDate()
  public utc: Date;

  @ManyToOne(() => User, user => user.canvas)
  public user: User;

  @OneToMany(() => CanvasActivity, canvasActivity => canvasActivity.canvas)
  public activity: CanvasActivity[];

  @OneToMany(() => Meme, meme => meme.canvas)
  public memes: Meme[];

}
