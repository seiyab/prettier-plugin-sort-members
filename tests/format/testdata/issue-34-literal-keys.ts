type Endpoint<T> = T | unknown;
type UserResponse = unknown;
type RepairOrdersResponse = unknown;

export type DataEndpoints = {
    user: Endpoint<UserResponse>;
    'repair-orders': Endpoint<RepairOrdersResponse>;
  };
  
type X = {
  data: unknown;
  'background-color': unknown;
  ['color']: unknown;
  alpha: unknown;
}

const alpha = Symbol()
type Y = {
  date: Date;
  'best': unknown;
  ['circle']: unknown;
  [alpha]: unknown; 
  alpha: unknown;
}

type Z = {
  edge: () => void;
  dog: unknown
  'change-value': () => void;
  'big-value': number;
  'another-one': 0;
}

interface A {
  [alpha]: unknown;
  'one': unknown;
  ['two']: unknown;
  ['three'](): void;
  four: unknown;
  five(): void;
}