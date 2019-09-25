import { BaseEntity, Entity, Column, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { IsBoolean, IsOptional } from 'class-validator';

/**
 * The user model describes the statistics of the user using an 1:1 Relation.
 */
@Entity('user_settings')
export class UserSettings extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('boolean', { default: () => 'true' })
  @IsOptional()
  @IsBoolean()
  public nCanvasInvites?: boolean; // Get notifications when people invite you to meme their canvas

  @Column('boolean', { default: () => 'true' })
  @IsOptional()
  @IsBoolean()
  public nSubscriptionUploadedACanvas?: boolean; // Get notifications when the people you follow upload canvases

  @Column('boolean', { default: () => 'true' })
  @IsOptional()
  @IsBoolean()
  public nUserMemedMyCanvas?: boolean; // Get notifications for when your canvas is memed

  @Column('boolean', { default: () => 'true' })
  @IsOptional()
  @IsBoolean()
  public nPointsUpdate?: boolean; // Get notifications for when you reach certain influence point thresholds

  @OneToOne(() => User, user => user.settings, { onDelete: 'CASCADE' })
  @JoinColumn()
  public user: User; // Foreign key of the user entity used also the primary key

}
