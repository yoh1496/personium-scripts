import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-human-sprites';

export function generateSVG(seed: string) {
  let avatars = new Avatars(sprites);
  return avatars.create(seed, { dataUri: true })
}