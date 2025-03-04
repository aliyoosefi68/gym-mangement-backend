import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class PaymentDto {
  @ApiPropertyOptional()
  description?: string;
}

export class PaymentDataDto {
  amount: number;
  invoice_number: string;
  orderId: number;
  status: boolean;
  userId: number;
}
