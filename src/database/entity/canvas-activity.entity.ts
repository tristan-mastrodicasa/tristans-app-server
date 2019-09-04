import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsEnum, IsDate, IsOptional } from 'class-validator';
import { User } from './user.entity';
import { Canvas } from './canvas.entity';
import { ECanvasActions } from '../../models/enums';

/**
 * The canvas model describes everything stored per canvas
 */
@Entity('canvas_activity')
export class CanvasActivity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('enum', { enum: ECanvasActions })
  @IsEnum(ECanvasActions)
  public action: ECanvasActions;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  @IsOptional()
  @IsDate()
  public utc?: Date;

  @ManyToOne(() => Canvas, canvas => canvas.activity)
  public canvas: Canvas;

  @ManyToOne(() => User, user => user.canvasActivity)
  public user: User;

}
