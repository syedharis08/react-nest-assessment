import { ArrayNotEmpty, IsArray, IsNumber, IsString } from "class-validator"


export class ItemsDto{
    @IsArray()
    @ArrayNotEmpty()
    applicableItems:Array<number>
    @IsString()
    appliedTo:string
    @IsString()
    name:string
    @IsNumber()
    rate:number
}   