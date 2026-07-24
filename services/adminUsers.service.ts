import axios from "axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export interface UsersParams {
  page?: number;
  limit?: number;
  search?: string;
  accountStatus?: string;
  isVerified?: boolean;
  tier?: string;
}

const getUsers = async (params: UsersParams) => {
  const response = await axios.get(API_ENDPOINTS.ADMIN_AUTH.ALL_USERS, {
    params,
    withCredentials: true,
  });
  return response.data;
};

const adminUsersService = {
  getUsers,
};

export default adminUsersService;
