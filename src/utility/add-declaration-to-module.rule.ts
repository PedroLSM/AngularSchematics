import { Rule, Tree, SchematicsException } from '@angular-devkit/schematics';
import { normalize } from '@angular-devkit/core';
import { addSymbolToNgModuleMetadata } from './ast-utils';
import * as ts from 'typescript';
import { InsertChange } from './change';

export function addDeclarationToAppModule(appModule: string, metadataField: string, symbolName: string, importPath: string, importText: string): Rule {
    return (host: Tree) => {
        // Verificar se appModule não é uma string truthy
        if (!appModule) { return host; }

        // Lear o arquivo app.module
        const modulePath = normalize('/' + appModule);

        const text = host.read(modulePath);
        if (text === null) {
            throw new SchematicsException(`File ${modulePath} does not exist.`);
        }
        const sourceText = text.toString('utf-8');
        const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);

        // Realizar modificações
        // const changes = addSymbolToNgModuleMetadata(source, modulePath, 'imports', 'LoggerModule', '@my/logger-lib', 'LoggerModule.forRoot({ enableDebug: true })');
        const changes = addSymbolToNgModuleMetadata(source, modulePath, metadataField, symbolName, importPath, importText);

        // Aplicar Mudanças
        const recorder = host.beginUpdate(modulePath);
        for (const change of changes) {
            if (change instanceof InsertChange) {
                recorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(recorder);

        return host;
    };
}