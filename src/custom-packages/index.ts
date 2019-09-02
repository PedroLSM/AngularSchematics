import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { NodeDependency, NodeDependencyType, addPackageJsonDependency } from '@schematics/angular/utility/dependencies';
import { Observable, from } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { NpmRegistryPackage, getLatestNodeVersion } from './../utility/npmjs';
import { Schema } from './schema.d';
import { SchemaPackages } from './schema-packages';

export function customPackages(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    const packages: string[] = packagesToInstall(_options);

    return chain([
      addPackageJsonDependencies(packages),
      installDependencies()
    ])(tree, _context);
  };
}

function addPackageJsonDependencies(packages: string[]): Rule {
  return (tree: Tree, _context: SchematicContext): Observable<Tree> => {
    return from(packages).pipe(
      concatMap(name => getLatestNodeVersion(name)),
      map((npmRegistryPackage: NpmRegistryPackage) => {
        const nodeDependency: NodeDependency = {
          type: NodeDependencyType.Default,
          name: npmRegistryPackage.name,
          version: npmRegistryPackage.version,
          overwrite: false
        };

        addPackageJsonDependency(tree, nodeDependency);
        _context.logger.info(`✅️  Added dependency, name: ${npmRegistryPackage.name}`);

        return tree;
      })
      
    );
  }
}

function installDependencies(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    _context.addTask(new NodePackageInstallTask())
    _context.logger.info('✅️ Dependencies installed');
    return tree;
  }
}

function packagesToInstall(options: any): string[] {
  let packages: string[] = [];
  const schema: any = new SchemaPackages(); 
  for (const key in options) {
    if (options[key]) { packages = [...packages, ...schema[key]]; }
  }
  
  return packages;
}