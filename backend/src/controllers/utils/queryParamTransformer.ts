export default function transformQueryParam<T>(
  queryParam: string | number | undefined,
  typeConstructor: NumberConstructor | BooleanConstructor,
): T | undefined {
  if (queryParam == undefined) {
    return undefined;
  }

  // for boolean need to typecast to number
  // as strings will return true for most scenarios
  if (typeConstructor === Boolean) {
    return typeConstructor(+queryParam) as T;
  }

  return typeConstructor(queryParam) as T;
}
