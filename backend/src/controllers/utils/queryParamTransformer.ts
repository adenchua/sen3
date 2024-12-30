export default function transformQueryParam<T>(
  queryParam: string | number | undefined,
  typeConstructor: NumberConstructor | BooleanConstructor,
): T | undefined {
  if (queryParam == undefined) {
    return;
  }

  return typeConstructor(queryParam) as T;
}
