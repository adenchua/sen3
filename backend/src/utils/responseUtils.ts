interface ResponsePayload<T> {
  data: T;
  status: string;
  meta: {
    datetime: string;
  };
}

export default function wrapResponse<T>(payload: T): ResponsePayload<T> {
  return {
    data: payload,
    status: "success",
    meta: {
      datetime: new Date().toISOString(),
    },
  };
}
