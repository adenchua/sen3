export default function transformQueryParam<T>(
  queryParam: string | undefined,
  typeConstructor: NumberConstructor | BooleanConstructor | ArrayConstructor,
): T | undefined {
  if (queryParam == undefined) {
    return undefined;
  }

  // for boolean need to typecast to number
  // as strings will return true for most scenarios
  if (typeConstructor === Boolean) {
    return typeConstructor(+queryParam) as T;
  }

  if (typeConstructor === Array) {
    return String(queryParam).split(",") as T;
  }

  return typeConstructor(queryParam) as T;
}
