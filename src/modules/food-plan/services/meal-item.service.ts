import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MealItemEntity } from "../entities/meal-item.entity";
import { Repository } from "typeorm";
import { MealItemDto, RemoveMealItemDto } from "../dtos/meal-item.dto";
import { FoodService } from "src/modules/food/services/food.service";
import { NotFoundMessage, PublicMessage } from "src/common/enum/message.enum";
import { MealEntity } from "../entities/meal.entity";

@Injectable()
export class MealItemService {
  constructor(
    @InjectRepository(MealItemEntity)
    private ItemRepository: Repository<MealItemEntity>,
    @InjectRepository(MealEntity)
    private mealRepository: Repository<MealEntity>,
    private foodService: FoodService
  ) {}

  async addToMeal(itemDto: MealItemDto) {
    const { foodId, count, mealId } = itemDto;
    const food = await this.foodService.findOneById(foodId);
    const meal = await this.mealRepository.findOneBy({ id: mealId });
    let item = await this.ItemRepository.findOneBy({ foodId, mealId });
    if (item) {
      item.count = count;
      item.kaleri = count * item.kaleri;
      item.sugar = count * item.sugar;
      item.fat = count * item.fat;
      item.protoen = count * item.protoen;
    } else {
      item = this.ItemRepository.create({
        foodId,
        mealId,
        count,
        kaleri: count * food.kaleri,
        fat: count * food.fat,
        sugar: count * food.sugar,
        protoen: count * food.protoen,
      });
    }
    await this.ItemRepository.save(item);
    return {
      message: PublicMessage.AddItemToMeal,
    };
  }

  async getItemById(id: number) {
    const item = await this.ItemRepository.findOne({
      where: { id },
      relations: { food: true },
    });
    if (!item) throw new NotFoundException(NotFoundMessage.Notfound);
    return item;
  }

  async removeItem(id: number) {
    const item = await this.ItemRepository.findOneBy({ id });
    if (!item) throw new NotFoundException(NotFoundMessage.Notfound);
    await this.ItemRepository.delete({ id });
    return {
      message: PublicMessage.Deleted,
    };
  }
  async getItemsOfMeal(mealId: number) {
    let mealKaleri = 0;
    let mealFat = 0;
    let mealProtoen = 0;
    let mealSugar = 0;
    let foodItems = [];
    const items = await this.ItemRepository.find({
      relations: { food: true },
      where: { mealId },
    });
    if (items.length < 1)
      throw new ConflictException("هیچ آیتمی در وعده غذایی شما وجود ندارد");
    for (const item of items) {
      let foodItem = {};
      const { fat, kaleri, sugar, protoen, count, food } = item;
      mealKaleri += parseInt(kaleri.toString());
      mealFat += parseInt(fat.toString());
      mealProtoen += parseInt(protoen.toString());
      mealSugar += parseInt(sugar.toString());
      foodItem = { title: food.title, count, fat, kaleri, sugar, protoen };
      foodItems.push(foodItem);
    }
    return {
      kaleri: mealKaleri,
      fat: mealFat,
      sugar: mealSugar,
      protoien: mealProtoen,
      items: foodItems,
    };
  }
}
