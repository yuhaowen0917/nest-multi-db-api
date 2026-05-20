import {
  Controller,
  Get,
  Post,
  Request,
  Query,
  Body,
  Param,
  Headers,
  Inject,
} from '@nestjs/common';
import { GirlService } from './girl.service';
// import { CreateUserDto } from './dto/create-user.dto';

@Controller('/girl')
export class GirlController {
  constructor(
    @Inject('girl') private girlService: GirlService,
    @Inject('girlArray') private girls: [],
    @Inject('MyFactory') private myFactory: string,
  ) {}
  // this.girlService = new GirlService()

  @Get()
  getGirls(): any {
    return this.girlService.getGirls();
  }

  @Post('/add')
  addGirls(): any {
    return this.girlService.addGirls();
  }

  // get 请求传参
  @Get('/getGirlsById')
  // getGirlsById(@Request() req): any {
  //   console.log(req.query);
  //   let id: number = parseInt(req.query.id);
  //   return this.girlService.getGirlsById(id);
  // }
  getGirlsById(@Query() query: { id: string }): any {
    console.log(query);
    const id: number = parseInt(query.id);
    return this.girlService.getGirlsById(id);
  }

  // post 请求传参
  @Post('/add-post')
  // addGirls_1(@Request() req): any {
  //   console.log(req.body);
  //   return this.girlService.addGirls();
  // }
  addGirls_1(@Body() body): any {
    console.log(body);
    return this.girlService.addGirls();
  }

  // 动态路由
  @Get('/findGirlsById/:id/:name')
  // findGirlsById(@Request() req): any {
  //   console.log(req.params);
  //   let id: number = parseInt(req.params.id);
  //   return this.girlService.getGirlsById(id);
  // }
  findGirlsById(@Param() params: { id: string }, @Headers() header): any {
    console.log(params);
    console.log('请求头==>', header);
    const id: number = parseInt(params.id);
    return this.girlService.getGirlsById(id);
  }

  // 连接数据库
  @Get('/add11')
  addGirl(): any {
    return this.girlService.addGirl();
  }

  @Get('/delete/:id')
  delGirl(@Param() params: { id: string }) {
    const id: number = parseInt(params.id);
    return this.girlService.deletaGirl(id);
  }

  @Get('/update/:id')
  updateGirl(@Param() params: { id: string }) {
    const id: number = parseInt(params.id);
    return this.girlService.updateGirl(id);
  }

  @Get('/find-all')
  getAllGirls() {
    return this.girlService.getAllGirls();
  }

  @Get('/find-girlname/:name')
  findGirlsByName(@Param() params: { name: string }) {
    const name: string = params.name;
    return this.girlService.getGirlsByName(name);
  }

  @Get('/test')
  test(): any {
    // return this.girls;
    return this.myFactory;
  }
}
