export interface MitmLog {
  id: number;
  timestamp: string; // ISO 8601 datetime string
  flow_id: string;
  request?: FlowRequest;
  response?: FlowResponse;
}

export interface FlowRequest {
  flow_id: string;
  method: string;
  host: string;
  path: string;
  url: string;
  headers: Record<string, string>;
  content_length: number;
  body: string | null;
  timestamp: number; // UNIX timestamp in seconds
}

export interface FlowResponse {
  flow_id: string;
  status_code: number;
  headers: Record<string, string>;
  content_length: number;
  body: string | null;
  timestamp: number; // UNIX timestamp in seconds
}


