import { Rule, SchematicContext, Tree, url, apply, template, mergeWith, SchematicsException, move  } from '@angular-devkit/schematics';

import { parseName } from '@schematics/angular/utility/parse-name';
import { buildDefaultPath } from '@schematics/angular/utility/project';

import { Schema } from './schema';

import { strings } from '@angular-devkit/core';
import { WorkspaceSchema } from '@angular-devkit/core/src/experimental/workspace';

function addExclamation(value: string): string {
  return value + '!';
}

export function hello(_options: Schema): Rule {

  return (tree: Tree, _context: SchematicContext) => {
    
    const workspaceConfigBuffer = tree.read('angular.json');
    if (!workspaceConfigBuffer) {
      throw new SchematicsException('Not an Angular CLI workspace');
    }

    const workspaceConfig: WorkspaceSchema = JSON.parse(workspaceConfigBuffer.toString());
    const projectName = _options.project || workspaceConfig.defaultProject || 'hello';
    const project: any  = workspaceConfig.projects[projectName];

    const defaultProjectPath = buildDefaultPath(project);

    const parsedPath = parseName(defaultProjectPath, _options.name);

    const { name, path } = parsedPath;
    
    // Indicar local dos templates e arquivos
    const sourceTemplates = url('./files');

    // Parametros do template
    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ..._options,
        ...strings,
        name,
        addExclamation
      }),
      move(path)
    ]);

    // Merge template dentro da arvore
    return mergeWith(sourceParametrizedTemplates)(tree, _context);
  };
}
