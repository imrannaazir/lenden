export type TUserName = {
  firstName: string;
  lastName: string;
};

export type TRole = 'admin' | 'agent' | 'user';

export type TUserStatus = 'active' | 'blocked' | 'pending';

export type TUser = {
  status: TUserStatus;
  name: TUserName;
  pin: string;
  mobileNumber: string;
  email: string;
  role: TRole;
  nidNumber: string;
  balance: number;
  token?: string;
};
