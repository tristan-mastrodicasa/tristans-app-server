import { EContentType } from './content-type.enum';
import { IUser } from './user.interface';

/**
 * A complex type that defines the content card
 * The content card is defined in different ways depending on the type of card
 */
export type ContentCard = {
  type: EContentType.MemeWithHost;
  id: number;
  cid: number;
  users: {
    primary: Pick<IUser, 'id' | 'firstName' | 'username' | 'photo'>;
    secondary: Pick<IUser, 'id' | 'firstName' | 'username' | 'photo'>;
  },
  imagePath: string;
  description?: string;
  stars: number;
  starred: boolean;
  utcTime: number;
} | {
  type: EContentType.Canvas;
  id: number;
  cid?: never;
  users: {
    primary: Pick<IUser, 'id' | 'firstName' | 'username' | 'photo'>;
    secondary?: never;
  },
  imagePath: string;
  description?: string;
  stars: number;
  starred: boolean;
  utcTime: number;
} | {
  type: EContentType.Meme;
  id: number;
  cid?: never;
  users: {
    primary: Pick<IUser, 'id' | 'firstName' | 'username' | 'photo'>;
    secondary?: never;
  },
  imagePath: string;
  description?: never;
  stars: number;
  starred: boolean;
  utcTime: number;
};
