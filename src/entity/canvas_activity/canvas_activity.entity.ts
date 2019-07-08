import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Canvas } from '../canvas/canvas.entity';

// Enum for the visibility levels of the canvas
enum EAction {
  allowedAccess,
  updated,
  starred,
}

/**
 * The canvas model describes everything stored per canvas
 * @type {Canvas}
 */
@Entity('canvas_activity')
export class CanvasActivity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('enum', { enum: EAction })
  public action: EAction;

  @Column('datetime')
  public utc: Date;

  @ManyToOne(() => Canvas, canvas => canvas.activity)
  public canvas: Canvas;

  @ManyToOne(() => User, user => user.canvasActivity)
  public user: User;
}
