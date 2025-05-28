import type { Schema, Struct } from '@strapi/strapi';

export interface ComponentsRequestForm extends Struct.ComponentSchema {
  collectionName: 'components_components_request_forms';
  info: {
    displayName: 'Request form';
  };
  attributes: {
    email: Schema.Attribute.Email;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'components.request-form': ComponentsRequestForm;
    }
  }
}
