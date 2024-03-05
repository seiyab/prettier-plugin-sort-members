type Endpoint<T> = T | unknown;
type UserResponse = unknown;
type RepairOrdersResponse = unknown;

export type DataEndpoints = {
    user: Endpoint<UserResponse>;
    'repair-orders': Endpoint<RepairOrdersResponse>;
  };