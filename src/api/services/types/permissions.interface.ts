export interface UserPermission {
  user: string;
  view: boolean;
  edit: boolean;
  publish: boolean;
}

export interface PermissionsResponse {
  data: UserPermission[];
}
