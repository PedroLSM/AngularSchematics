import { chain, Rule, schematic, SchematicContext, Tree } from '@angular-devkit/schematics';

export default function (options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        return chain([
            schematic('hello', options)
        ])(tree, _context);
    }
}