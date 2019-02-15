import { Interface, Type } from 'graphql-codegen-core';
import * as Handlebars from 'handlebars';
import { parseMapper, pickMapper } from './mappers';

interface Modules {
  [path: string]: string[];
}

function extractVariable(type: string) {
  const m = /^[^\[\.]+/.exec(type);
  return m ? m[0] : type;
}

export function importMappers(
  types: Type[],
  interfaces: Interface[],
  options: Handlebars.HelperOptions
) {
  const config = options.data.root.config || {};
  const mappers = config.mappers || {};
  const defaultMapper: string | undefined = config.defaultMapper;
  const modules: Modules = {};
  const availableTypes = types.map(t => t.name);
  const availableInterfaces = interfaces.map(iface => iface.name);

  if (defaultMapper) {
    const mapper = parseMapper(defaultMapper);

    if (mapper.isExternal) {
      modules[mapper.source] = [mapper.type];
    }
  }

  for (const type in mappers) {
    if (mappers.hasOwnProperty(type)) {
      const mapper = pickMapper(type, mappers, options);

      // checks if mapper comes from a module
      // and if is used
      if (
        mapper &&
        mapper.isExternal &&
        (availableTypes.includes(type) || availableInterfaces.includes(type))
      ) {
        const path = mapper.source;
        const variable = extractVariable(mapper.type);

        if (!modules[path]) {
          modules[path] = [];
        }

        // checks for duplicates
        if (!modules[path].includes(variable)) {
          modules[path].push(variable);
        }
      }
    }
  }

  const imports: string[] = Object.keys(modules).map(
    path => `
      import { ${modules[path].join(', ')} } from '${path}';
    `
  );

  return imports.join('\n');
}
