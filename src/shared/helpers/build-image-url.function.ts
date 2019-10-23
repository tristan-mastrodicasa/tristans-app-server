import env from 'conf/env';

/**
 * Build's how the url should look when requesting an image from the client
 * @todo Write unit tests in the routes that use this function to ensure it functions correctly
 * @param  imageType Type of image asset (where to get the image from)
 * @param  imagePath path stored in record in database
 * @return           Image url
 */
export function buildImageUrl(imageType: 'canvas' | 'user' | 'meme', imagePath: string): string {
  if (imagePath.slice(0, 4) === 'http') return imagePath; // If a test image
  if (imagePath.slice(0, 1) === '/') return imagePath; // If a local image

  // Access test image storage //
  if (!env.production) return `${env.host}/api/${imageType}/image/${imagePath}`;

  // In production return the files from the buckets //
  return `https://${env.awsS3Buckets[imageType]}.s3-ap-southeast-2.amazonaws.com/${imagePath}`;
}
