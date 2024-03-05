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
  alpha: unknown;
  'color-${0 | 1 | 2}': unknown;
}