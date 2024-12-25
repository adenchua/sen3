interface ResponsePayload<T> {
  data: T;
  status: string;
  datetime: string;
}

export default function wrapResponse<T>(payload: T): ResponsePayload<T> {
  return {
    data: payload,
    status: "success",
    datetime: new Date().toISOString(),
  };
}
