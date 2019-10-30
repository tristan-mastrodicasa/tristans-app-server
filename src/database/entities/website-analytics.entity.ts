import { Column, BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsOptional, IsDate, IsEnum } from 'class-validator';

import { EDeviceType } from 'shared/models';

/**
 * This entity stores analytical data to measure how users use the website
 */
@Entity('website_analytics')
export class WebsiteAnalytics extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('varchar', { length: 40, nullable: false })
  public ip: string;

  @Column('varchar', { length: 200, nullable: false })
  public endPoint: string;

  @Column('varchar', { length: 200, nullable: true })
  public query: string; // url encoded parameters

  @Column('enum', { enum: EDeviceType })
  @IsEnum(EDeviceType)
  public deviceType: EDeviceType; // url encoded parameters

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  @IsOptional()
  @IsDate()
  public utc?: Date;

}
