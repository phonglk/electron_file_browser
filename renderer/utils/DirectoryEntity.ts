import { constants, Stats } from 'fs';
import { Dirent, promises as fs, PathLike } from 'fs-extra';
import Path from './Path';

export abstract class DirectoryEntity {
  protected path: Path = null;
  public resolvedEntity: DirectoryEntity = null;

  constructor(path: Path) {
    this.path = path;
    this.resolvedEntity = this;
  }

  public async init(_stats: Stats) {
    return;
  }
  public getName(): string {
    return this.path.getLastLevel();
  }

  public getPath(): Path {
    return this.path;
  }

  public static async read(path: Path) {
    try {
      const access = await fs.access(path.toString(), constants.R_OK);
      const stats = await fs.lstat(path.toString());
      const initWrapper = async (entity: DirectoryEntity) => {
        await entity.init(stats);
        return entity;
      };
      if (path.includes('agentx')) {
        debugger;
        console.log(stats);
      }

      switch (true) {
        case stats.isSymbolicLink():
          return initWrapper(new SymlinkEntity(path));
        case stats.isDirectory():
          return initWrapper(new FolderEntity(path));
        case stats.isFile():
          return initWrapper(new FileEntity(path));
        default:
          return initWrapper(new UnknownEntity(path));
      }
    } catch (err) {
      return new ReadErrorEntity(path, err);
    }
  }
}

export class FolderEntity extends DirectoryEntity {
  public entities: DirectoryEntity[] = [];
  public async getEntities(
    postProcess: Array<(entities: DirectoryEntity[]) => DirectoryEntity[]> = []
  ): Promise<DirectoryEntity[]> {
    const dirs = await fs.readdir(this.path.toString());
    let entities = await Promise.all(
      dirs.map((name) =>
        DirectoryEntity.read(this.path.join(name)).catch(
          (error) => new ReadErrorEntity(this.path.join(name), error)
        )
      )
    );

    postProcess.forEach((fn) => {
      try {
        entities = fn(entities);
      } catch (err) {
        console.log(`Error while applying postProcess fn: ${err.message}`);
      }
    });
    return entities;
  }
}

export class SymlinkEntity extends DirectoryEntity {
  public async init(_stats: Stats): Promise<void> {
    const resolvedPath = await this.path.real();
    this.resolvedEntity = await DirectoryEntity.read(resolvedPath);
  }
}

export class FileEntity extends DirectoryEntity {}

export class UnknownEntity extends DirectoryEntity {}

export class ReadErrorEntity extends DirectoryEntity {
  public error: Error = null;
  constructor(path: Path, error: Error) {
    super(path);
    this.error = error;
  }
}
