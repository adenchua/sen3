export default interface ApiResponseWrapper<T> {
  data: T;
  status: string;
  datetime: string;
}
