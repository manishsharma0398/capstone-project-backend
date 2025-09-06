import type { SchemaObject } from "@/utils";

export function OpenApi(schemaObj: SchemaObject) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const openApiData = {
      schemaObj,
      methodName: propertyKey,
    };

    Reflect.defineMetadata("openApi", openApiData, target, propertyKey);

    return descriptor;
  };
}
