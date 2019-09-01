import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { NodeDependency, NodeDependencyType, addPackageJsonDependency } from '@schematics/angular/utility/dependencies';
import { Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { NpmRegistryPackage, getLatestNodeVersion } from './../utility/npmjs';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function customPackages(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return chain([
      addPackageJsonDependencies(),
      installDependencies()
    ])(tree, _context);
  };
}

function addPackageJsonDependencies(): Rule {
  return (tree: Tree, _context: SchematicContext): Observable<Tree> => {
    return of('@ng-bootstrap/ng-bootstrap').pipe(
      concatMap(name => getLatestNodeVersion(name)),
      map((npmRegistryPackage: NpmRegistryPackage) => {
        const nodeDependency: NodeDependency = {
          type: NodeDependencyType.Default,
          name: npmRegistryPackage.name,
          version: npmRegistryPackage.version,
          overwrite: false
        };

        addPackageJsonDependency(tree, nodeDependency);
        _context.logger.info('✅️ Added dependency');

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

// function setupProject(options: string): Rule {
//   console.log(options);
//   return (tree: Tree, _context: SchematicContext) => {
//     return tree;
//   }
// }