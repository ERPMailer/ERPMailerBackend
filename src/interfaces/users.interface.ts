export interface User {
  _id?: string;
  email: string;
  displayName:string;
  profileLogo:string;
  password: string;
  phone?: string;
  userRole: string;
  createdAt?: Date;
  updatedAt?: Date;
}
