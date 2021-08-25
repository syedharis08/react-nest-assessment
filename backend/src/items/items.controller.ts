import { Body,Controller, Get, Post,ValidationPipe,HttpException,HttpStatus } from '@nestjs/common';
import { AppService } from '../app.service';
import * as fs from "fs";
import * as path from "path";
import { ItemsDto } from './items.dto';
import itemData from '../const/data.json'

@Controller('items')

export class ItemsController {
    constructor(private readonly appService: AppService) { }
    @Get()
  getCategories():any {
      if(!fs.existsSync(path.join(__dirname,"products.json"))){
        const jsonData=itemData
        fs.writeFileSync(path.join(__dirname,"products.json"),JSON.stringify(jsonData))
      }
      const data = fs.readFileSync(path.join(__dirname,'products.json'), 'utf8')
      return data
  }
  @Post("/apply-tax")
  applyTax(@Body(ValidationPipe) itemDto:ItemsDto) {
    if(!fs.existsSync(path.join(__dirname,"products.json"))){
      throw new HttpException("No products in inventory",HttpStatus.NOT_FOUND)
    }
    const rawData = fs.readFileSync(path.join(__dirname,'products.json'), 'utf8')
    const jsonData=JSON.parse(rawData)
    for(let item of itemDto.applicableItems){
      const productIndex=jsonData.findIndex(x=>x.id===item)
      if(productIndex===-1) throw new HttpException("No products against this id",HttpStatus.NOT_FOUND)
      const product=jsonData[productIndex]
      product.amount_discounted=itemDto.rate
      product.amount=parseFloat((product.amount-(product.amount*itemDto.rate)).toFixed(2))
      jsonData[productIndex]=product
    }
    fs.writeFileSync(path.join(__dirname,"products.json"),JSON.stringify(jsonData))
    return  jsonData
  }
}
