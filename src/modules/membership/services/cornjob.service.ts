import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThanOrEqual } from "typeorm";
import { Cron } from "@nestjs/schedule";
import { MembershipEntity } from "../entity/membership.entity";

@Injectable()
export class SubscriptionReminderService {
  constructor(
    @InjectRepository(MembershipEntity)
    private membershipRepository: Repository<MembershipEntity>
  ) {}

  /**
   * کرون جاب برای ارسال یادآوری تمدید اشتراک
   * هر روز رأس ساعت 00:00 اجرا می‌شود
   */
  @Cron("0 0 * * *") // اجرای کرون جاب هر روز ساعت 00:00
  async sendSubscriptionReminders() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // گرفتن تاریخ فردا

    // پیدا کردن اشتراک‌هایی که فردا منقضی می‌شوند
    const expiringMemberships = await this.membershipRepository.find({
      where: { endDate: LessThanOrEqual(tomorrow) },
      relations: ["user"], // فرض بر این است که رابطه `user` در MembershipEntity تعریف شده است
    });

    for (const membership of expiringMemberships) {
      await this.sendReminder(membership.user.mobile);
    }
  }

  /**
   * ارسال ایمیل یادآوری (اینجا فقط لاگ می‌کنیم، ولی می‌توان به سیستم ایمیل متصل کرد)
   */
  private async sendReminder(mobile: string) {
    console.log(`🔔 ارسال یادآوری تمدید اشتراک به ایمیل: ${mobile}`);

    // اینجا می‌توان از nodemailer یا Twilio برای ارسال ایمیل/پیامک استفاده کرد
  }
}
