import path from 'path';
import { promises as fs } from 'fs';
import { DirectoryEntity } from './DirectoryEntity';

export default class Path extends String {
  public next: Path = null;
  public prev: Path = null;
  public entity: DirectoryEntity = null;

  getLastLevel() {
    return path.basename(this.toString());
  }

  join(...paths: string[]) {
    return new Path(path.join(this.toString(), ...paths));
  }

  upLevel() {
    return this.join('../');
  }

  async real() {
    return new Path(await fs.realpath(this.toString()));
  }

  // To check path is part of current path
  // e.g: new Path('/A/B/C').includesPath(new Path('/A/B')) => true
  includesPath(path: Path) {
    return (
      path.toString() === this.toString() ||
      this.toString().includes(path.toString() + '/')
    );
  }
}
