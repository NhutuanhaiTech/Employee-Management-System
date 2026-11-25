import * as z from 'zod';

export const userSchema = z.object({
  username: z.string().min(4, 'Tên đăng nhập phải từ 4 ký tự'),
  password: z.string().min(6, 'Mật khẩu phải từ 6 ký tự'),
  confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'), 
  fullName: z.string().min(2, 'Họ và tên không được để trống'),
  email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
  phone: z
  .string()
  .min(1, "Vui lòng nhập số điện thoại")
  .regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ"),
  roles: z.array(z.string()).min(1, { message: 'Vui lòng chọn ít nhất 1 vai trò' }),
  pos: z.string().min(1, 'Vui lòng chọn chức vụ'),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"], 
});