export type TUserName = {
  firstName: string;
  lastName: string;
};

export type TRole = 'admin' | 'agent' | 'user';

export type TUser = {
  name: TUserName;
  pin: string;
  mobileNumber: string;
  email: string;
  role: TRole;
  nidNumber: string;
};
