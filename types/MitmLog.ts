type RequestLog = {
  type: "request";
  flow_id: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
};

type ResponseLog = {
  type: "response";
  flow_id: string;
  status_code: number;
  url: string;
  headers: Record<string, string>;
  body: string | null;
};

export type MitmLog = RequestLog | ResponseLog;
