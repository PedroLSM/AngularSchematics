import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';


const collectionPath = path.join(__dirname, '../collection.json');
const runner = new SchematicTestRunner('schematics', collectionPath);

let appTree: UnitTestTree;

describe('Schematic: Hello', () => {
  beforeEach(() => {
    appTree = runner.runExternalSchematic(
      '@schematics/angular',
      'workspace',
      {}
    );

    appTree = runner.runExternalSchematic(
      '@schematics/angular',
      'application',
      {},
      appTree
    );
  });

  it('should create a hello component', () => {
    const options = { name: 'Pedro' }

    const tree = runner.runSchematic('hello', options, appTree);

    const hasFile = tree.files.includes('/projects/bar/src/app/hello-pedro/hello-pedro.ts');
    
    expect(hasFile).toEqual(true);
  });

});
