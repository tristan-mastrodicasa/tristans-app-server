import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsEnum, IsDate, IsOptional } from 'class-validator';
import { User } from './user.entity';
import { Canvas } from './canvas.entity';

// Enum for the visibility levels of the canvas
enum EAction {
  starred,
}

/**
 * The canvas model describes everything stored per canvas
 */
@Entity('canvas_activity')
export class CanvasActivity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('enum', { enum: EAction })
  @IsEnum(EAction)
  public action: EAction;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  @IsOptional()
  @IsDate()
  public utc?: Date;

  @ManyToOne(() => Canvas, canvas => canvas.activity)
  public canvas: Canvas;

  @ManyToOne(() => User, user => user.canvasActivity)
  public user: User;

}
