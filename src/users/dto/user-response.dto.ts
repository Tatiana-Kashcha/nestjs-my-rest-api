class UserData {
  id: number;
  email: string;
  name: string;
}

export class UserResponseDto {
  user: UserData;
  token: string;
}
