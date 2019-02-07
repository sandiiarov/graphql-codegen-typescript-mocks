import { GraphQLSchema } from 'graphql';
import { DocumentFile, PluginFunction } from 'graphql-codegen-core';
import {
  initCommonTemplate,
  TypeScriptCommonConfig,
} from 'graphql-codegen-typescript-mocks-common';
import * as Handlebars from 'handlebars';
import { getContext, importContext } from './context';
import * as directive from './directive.handlebars';
import {
  getFieldResolver,
  getFieldResolverName,
  getFieldType,
  getTypenames,
  importFromGraphQL,
} from './helpers';
import { importMappers } from './import-mappers';
import { getParentType, getParentTypes } from './parent-type';
import * as resolveType from './resolve-type.handlebars';
import * as resolver from './resolver.handlebars';
import * as rootTemplate from './root.handlebars';
import * as scalar from './scalar.handlebars';

export interface TypeScriptServerResolversConfig
  extends TypeScriptCommonConfig {
  strict?: boolean;
  noNamespaces?: boolean;
  contextType?: string;
  mappers?: { [name: string]: string };
  defaultMapper?: string;
  fieldResolverNamePrefix?: string;
}

export const plugin: PluginFunction<TypeScriptServerResolversConfig> = async (
  schema: GraphQLSchema,
  documents: DocumentFile[],
  config: TypeScriptServerResolversConfig
): Promise<string> => {
  const { templateContext, convert } = initCommonTemplate(
    Handlebars,
    schema,
    config
  );
  Handlebars.registerPartial('resolver', resolver);
  Handlebars.registerPartial('resolveType', resolveType);
  Handlebars.registerPartial('directive', directive);
  Handlebars.registerPartial('scalar', scalar);
  Handlebars.registerHelper(
    'getFieldResolverName',
    getFieldResolverName(convert, config)
  );
  Handlebars.registerHelper('getFieldResolver', getFieldResolver(convert));
  Handlebars.registerHelper('getTypenames', getTypenames);
  Handlebars.registerHelper('getParentType', getParentType(convert));
  Handlebars.registerHelper('getParentTypes', getParentTypes(convert));
  Handlebars.registerHelper('getFieldType', getFieldType(convert));
  Handlebars.registerHelper('importMappers', importMappers);
  Handlebars.registerHelper('importContext', importContext);
  Handlebars.registerHelper('importFromGraphQL', importFromGraphQL);
  Handlebars.registerHelper('getContext', getContext);

  return Handlebars.compile(rootTemplate)(templateContext);
};
