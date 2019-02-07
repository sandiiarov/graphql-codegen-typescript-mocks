import { GraphQLSchema } from 'graphql';
import { DocumentFile, PluginFunction } from 'graphql-codegen-core';
import {
  initCommonTemplate,
  TypeScriptCommonConfig,
} from 'graphql-codegen-typescript-mocks-common';
import * as Handlebars from 'handlebars';
import * as rootTemplate from './root.handlebars';

export interface TypeScriptServerConfig extends TypeScriptCommonConfig {
  schemaNamespace?: string;
}

export const plugin: PluginFunction<TypeScriptServerConfig> = async (
  schema: GraphQLSchema,
  documents: DocumentFile[],
  config: TypeScriptServerConfig
): Promise<string> => {
  const { templateContext } = initCommonTemplate(Handlebars, schema, config);

  return Handlebars.compile(rootTemplate)(templateContext);
};
