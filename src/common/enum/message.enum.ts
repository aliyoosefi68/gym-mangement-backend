export enum BadRequestMessage {
  InvalidLoginData = "اطلاعات برای ورود صحیح نیست",
  InvalidRegisterData = "اطلاعات برای ثبتنام صحیح نیست",
  SomeThingWrong = "خطایی پیش آمده. دوباره تلاش کنید!",
  InvalidEmail = "ایمیل وارد شده  ایراد دارد",
  InvalidCategoties = "دستبندی ها را درست وارد کنید!",
  AlreadyAccepted = "نظر انتخاب شده قبلا تایید شده!",
  AlreadyRejected = "نظر انتخاب شده قبلا رد شده!",
  ALreadyExistPlan = "این پلن عضویت از قبل وجود دارد.",
  ALreadyExistPlanInBasket = "این پلن قبلا در سبد خریدتان وجود دارد",
  DurationTime = "مدت زمان انتخابی را بررسی کنید",
  BasketEmpty = "سبد خرید شما خالی است",
}
export enum ConflictMessage {
  CategoryTitle = "عنوان دسته بندی از قبل وجود دارد !",
  Email = "ایمیل شما درست نمی باشد!",
  Phone = "شماره موبایل شما درست نمی باشد!",
  Usename = "این نام کاربری از قبل وجود دارد",
}
export enum AuthMessage {
  NotFoundAccount = "کاربری یافت نشد!",
  ExistUser = "کاربری با این مشخصات از قبل وجود دارد !",
  ExpiredCode = "کد یکبار مصرف شما منقضی شده!",
  TryAgain = "دوباره تلاش کنید",
  LoginAgain = "مجددا وارد حساب کاربری خود شوید!",
  LoginIsRequired = "وارد حساب کاربری خود شوید !",
  Blocked = "حساب کاربری شما مسدود شده است!لطفا با پشتیبانی تماس بگیرید",
}

export enum PublicMessage {
  SendOtp = "کد با موفقیت ارسال شد",
  LoginSuccessfully = "ورود با موفقیت انجام شد !",
  Created = "دسته بندی جدید با موفقیت ساخته شد !",
  Deleted = "با موفقیت حذف شد!",
  Updated = "با موفقیت بروز رسانی شد",
  Like = "پسندیده شد",
  DisLike = "لغو پسندیده شدن",
  Bookmark = "پست ذخیره شد",
  UnBookmark = "پست حذف شد",
  CreateComment = "نظر شما با موفقیت ثبت شد",
  Follow = "کاربر مورد نظر با موفیت فالوو شد",
  Unfollow = "کاربر مورد نظر از لیست دنبال شنده ها حذف شد",
  Block = "کاربر مورد نظر بلاک شد",
  UnBlock = "کاربر شما رفع بلاک شد",
  CreatePlan = "پلن شما با موفقیت ساخته شد",
  AddToBasket = "پلن با موفقیت به سبد خریدتان اضافه شد",
  CreateMemberShip = "عضویت با موفقیت انجام شد",
  AddWeight = "وزن شما با موفقیت ثبت شد",
}
export enum NotFoundMessage {
  Notfound = "مورد یافت نشد",
  NotfoundCategory = "دسته بندی موردنظر یافت نشد",
  NotfoundUser = "کاربر  موردنظر یافت نشد",
  NotfoundPost = "پست موردنظر یافت نشد",
  NotfoundPlan = "پلن مورد نظر یافت نشد",
  NotFoundPayment = "پرداخت با این مشخصات یافت نشد",
}
export enum ValidationMessage {
  ImageFormatInvalid = "فرمت تصویر شما صحیح نمیباشد!",
  InvalidEmail = "فرمت ایمیل شما اشتباه است!",
  InvalidPhone = "فرمت شماره موبایل شما اشتباه است!",
}
