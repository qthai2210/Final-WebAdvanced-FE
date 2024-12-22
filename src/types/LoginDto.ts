export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginWithRecaptchaDto extends LoginDto {
  recaptchaToken: string;
}
