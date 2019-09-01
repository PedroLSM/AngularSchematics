import { Rule, Tree, SchematicContext, SchematicsException, url, template, move, mergeWith, apply, branchAndMerge, chain } from "@angular-devkit/schematics";
import { buildDefaultPath } from "@schematics/angular/utility/project";
import { parseName } from "@schematics/angular/utility/parse-name";
import { strings } from "@angular-devkit/core";
import { Schema } from "./schema";
import { addDeclarationToAppModule } from "../utility/add-declaration-to-module.rule";
import { metadataFields } from "./metadataFields";
export function navigation(_options: Schema) : Rule {

    return (tree: Tree, _context: SchematicContext) => {

        const workspaceConfigBuffer = tree.read('angular.json');
        if(!workspaceConfigBuffer) {
            throw new SchematicsException('Angular CLI workspace não foi encontrado');
        }

        const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());
        const projectName = _options.project || workspaceConfig.defaultProject;
        const project = workspaceConfig.projects[projectName];

        const defaultProjectPath = buildDefaultPath(project);

        const parsedPath = parseName(defaultProjectPath, 'navigation');

        const { name, path } = parsedPath;

        const sourceTemplates = url('./files');

        const sourceParametrizedTemplates = apply(sourceTemplates, [
            template({
                ..._options,
                ...strings,
                name
            }),
            move(path)
        ]);

        const appModule = '/src/app/app.module.ts';
        const metadataField = metadataFields.declarations;

        return chain([
            branchAndMerge(addDeclarationToAppModule(appModule, metadataField, 'HeaderComponent', './navigation/header/header.component', 'HeaderComponent')),
            branchAndMerge(addDeclarationToAppModule(appModule, metadataField, 'SidenavListComponent', './navigation/sidenav-list/sidenav-list.component', 'SidenavListComponent')),
            mergeWith(sourceParametrizedTemplates)
        ])(tree, _context);
    }

}