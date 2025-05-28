import { hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import admin from '@/utils/firebase';

class UserService {
  public users = userModel;

  public async findAllUser(): Promise<User[]> {
    const users: User[] = await this.users.find();
    return users;
  }

  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');

    const findUser: User = await this.users.findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(idToken: string): Promise<User> {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const userRecord = await admin.auth().getUser(uid);
    console.log('User data:', userRecord.toJSON());

    const hashedPassword = await hash('123', 10);

    const userData = {
      email: userRecord.email,
      displayName: userRecord.displayName,
      profileLogo: userRecord.photoURL ? userRecord.photoURL : null,
      phone: userRecord.phoneNumber ? userRecord.phoneNumber : null,
      userRole: 'user',
      password: hashedPassword,
    };

    const userDetails: User = await this.users.findOneAndUpdate({email:userRecord.email}, userData, { upsert: true });

    return userDetails;
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    if (userData.email) {
      const findUser: User = await this.users.findOne({ email: userData.email });
      if (findUser && findUser._id != userId) throw new HttpException(409, `This email ${userData.email} already exists`);
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    const updateUserById: User = await this.users.findByIdAndUpdate(userId, { userData });
    if (!updateUserById) throw new HttpException(409, "User doesn't exist");

    return updateUserById;
  }

  public async deleteUser(userId: string): Promise<User> {
    const deleteUserById: User = await this.users.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(409, "User doesn't exist");

    return deleteUserById;
  }
}

export default UserService;
