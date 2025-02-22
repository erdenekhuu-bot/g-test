import { PrismaClient } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { storePermissions } from "./auth_service";

interface AuthUserRawType {
  id: string;
  username: string;
  mobile: string;
  email: string;
  status: string;
}

const prisma = new PrismaClient();

export class AuthUserSyncService {
  baseURL: string | undefined;

  constructor() {
    this.baseURL = "http://192.168.200.216:8080";
  }

  async sync() {
    const response: AxiosResponse = await axios.get(
      `${this.baseURL}/service.php/user/list`
    );
    const { status, data } = response;
    if (status !== 200) {
      return;
    }

    for (const AuthUserInfo of data) {
      await this.syncAuthUser(AuthUserInfo);
      await storePermissions(parseInt(AuthUserInfo.id));
    }
  }

  async syncAuthUser(data: AuthUserRawType) {
    let AuthUser = await prisma.authUser.findUnique({
      where: {
        id: parseInt(data.id),
      },
    });
    if (!AuthUser) {
      AuthUser = await prisma.authUser.create({
        data: {
          id: parseInt(data.id),
          username: data.username,
          mobile: data.mobile,
          email: data.email,
          status: data.status,
        },
      });
      console.log(`${AuthUser.id}. ${AuthUser.username} == created`);
    } else {
      const isChanged =
        AuthUser.id !== parseInt(data.id) ||
        AuthUser.username !== data.username ||
        AuthUser.mobile !== data.mobile ||
        AuthUser.email !== data.email ||
        AuthUser.status !== data.status;
      // console.log(
      //   AuthUser.id !== parseInt(data.id),
      //   AuthUser.username !== data.username,
      //   AuthUser.email !== data.email,
      //   AuthUser.mobile !== data.mobile,
      //   AuthUser.status !== data.status,
      // );

      if (isChanged) {
        await prisma.authUser.update({
          where: { id: AuthUser.id },
          data: {
            username: data.username,
            mobile: data.mobile,
            email: data.email,
            status: data.status,
          },
        });
        console.log(`${AuthUser.id}, ${AuthUser.username} == updated`);
      } else {
      }
    }
  }
}

export default AuthUserSyncService;
