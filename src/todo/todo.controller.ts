import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseIntPipe,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
  import { TodoService } from './todo.service';
  import { CreateTodoDto } from './dto/create-todo.dto';
  import { UpdateTodoDto } from './dto/update-todo.dto';
  import { Todo } from './entities/todo.entity';
  import { PaginatedTodoResponse, TodoResponse } from './interfaces/todo-response.interface';
  
  @ApiTags('todos')
  @Controller('todos')
  export class TodoController {
    constructor(private readonly todoService: TodoService) {}
  
    @Post()
    @ApiOperation({ summary: 'Создать новую задачу' })
    @ApiResponse({ 
      status: 201, 
      description: 'Задача успешно создана',
      type: TodoResponse 
    })
    create(@Body() createTodoDto: CreateTodoDto): Promise<TodoResponse> {
      return this.todoService.create(createTodoDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Получить список задач' })
    @ApiResponse({ 
      status: 200,
      description: 'Список задач успешно получен',
      type: PaginatedTodoResponse
    })
    @ApiQuery({ 
      name: 'page', 
      required: false, 
      type: Number,
      description: 'Номер страницы (по умолчанию: 1)' 
    })
    @ApiQuery({ 
      name: 'limit', 
      required: false, 
      type: Number,
      description: 'Количество элементов на странице (по умолчанию: 10)' 
    })
    findAll(
      @Query('page', new ParseIntPipe({ optional: true })) page?: number,
      @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    ): Promise<PaginatedTodoResponse> {
      return this.todoService.findAll(page, limit);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Получить задачу по ID' })
    @ApiResponse({ 
      status: 200,
      description: 'Задача успешно найдена',
      type: TodoResponse 
    })
    @ApiResponse({ 
      status: 404,
      description: 'Задача не найдена'
    })
    findOne(@Param('id', ParseIntPipe) id: number): Promise<TodoResponse> {
      return this.todoService.findOne(id);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Обновить задачу' })
    @ApiResponse({ 
      status: 200,
      description: 'Задача успешно обновлена',
      type: TodoResponse 
    })
    @ApiResponse({ 
      status: 404,
      description: 'Задача не найдена'
    })
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateTodoDto: UpdateTodoDto,
    ): Promise<TodoResponse> {
      return this.todoService.update(id, updateTodoDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Удалить задачу' })
    @ApiResponse({ 
      status: 200,
      description: 'Задача успешно удалена',
      type: TodoResponse 
    })
    @ApiResponse({ 
      status: 404,
      description: 'Задача не найдена'
    })
    remove(@Param('id', ParseIntPipe) id: number): Promise<TodoResponse> {
      return this.todoService.remove(id);
    }
  
    @Patch(':id/complete')
    @ApiOperation({ summary: 'Отметить задачу как выполненную' })
    @ApiResponse({ 
      status: 200,
      description: 'Задача отмечена как выполненная',
      type: TodoResponse 
    })
    @ApiResponse({ 
      status: 404,
      description: 'Задача не найдена'
    })
    complete(@Param('id', ParseIntPipe) id: number): Promise<TodoResponse> {
      return this.todoService.complete(id);
    }
  
    @Post('generate')
    @ApiOperation({ summary: 'Сгенерировать начальные задачи' })
    @ApiResponse({ 
      status: 201,
      description: 'Начальные задачи успешно созданы',
      type: [TodoResponse],
      schema: {
        example: [{
          success: true,
          data: {
            id: 1,
            title: "Изучить NestJS",
            description: "Пройти официальную документацию и туториалы",
            isCompleted: false,
            createdAt: "2024-12-19T19:15:23.456Z"
          },
          message: "Задача успешно создана"
        }]
      }
    })
    generateInitial(): Promise<TodoResponse[]> {
      return this.todoService.generateInitialTodos();
    }
  }