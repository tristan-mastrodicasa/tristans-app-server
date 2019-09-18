import { EContentType } from './content-type.enum';
import { BasicUser } from './basic-user.interface';

/**
 * A complex type that defines the content card
 * The content card is defined in two ways depending on the type of card
 */
export type ContentCard = {
  type: EContentType.Meme;
  id: number;
  cid: number;
  users: {
    primary: BasicUser;
    secondary: BasicUser;
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
    primary: BasicUser;
    secondary?: never;
  },
  imagePath: string;
  description?: string;
  stars: number;
  starred: boolean;
  utcTime: number;
};
