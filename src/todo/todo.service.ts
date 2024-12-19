import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PaginatedTodoResponse, TodoResponse } from './interfaces/todo-response.interface';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<TodoResponse> {
    const todo = this.todoRepository.create(createTodoDto);
    const savedTodo = await this.todoRepository.save(todo);
    
    return {
      success: true,
      data: savedTodo,
      message: 'Задача успешно создана'
    };
  }

  async findAll(page: number = 1, limit: number = 10): Promise<PaginatedTodoResponse> {
    const [items, total] = await this.todoRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'ASC' },
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: number): Promise<TodoResponse> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Задача с ID ${id} не найдена`);
    }

    return {
      success: true,
      data: todo,
      message: 'Задача найдена'
    };
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<TodoResponse> {
    const todo = await this.findOne(id);
    
    const updatedTodo = await this.todoRepository.save({
      ...todo.data,
      ...updateTodoDto,
    });

    return {
      success: true,
      data: updatedTodo,
      message: 'Задача успешно обновлена'
    };
  }

  async remove(id: number): Promise<TodoResponse> {
    const todo = await this.findOne(id);
    await this.todoRepository.remove(todo.data);

    return {
      success: true,
      data: todo.data,
      message: 'Задача успешно удалена'
    };
  }

  async complete(id: number): Promise<TodoResponse> {
    const todo = await this.findOne(id);
    
    const completedTodo = await this.todoRepository.save({
      ...todo.data,
      isCompleted: true
    });

    return {
      success: true,
      data: completedTodo,
      message: 'Задача отмечена как выполненная'
    };
  }

  async generateInitialTodos(): Promise<TodoResponse[]> {
    const initialTodos = [
      {
        title: 'Изучить NestJS',
        description: 'Пройти официальную документацию и туториалы',
        isCompleted: false,
      },
      {
        title: 'Создать проект TodoList',
        description: 'Реализовать API с использованием NestJS и PostgreSQL',
        isCompleted: true,
      },
      {
        title: 'Добавить Swagger',
        description: 'Настроить документацию API с помощью Swagger',
        isCompleted: false,
      },
      {
        title: 'Написать тесты',
        description: 'Добавить unit и e2e тесты для проекта',
        isCompleted: false,
      },
      {
        title: 'Добавить авторизацию',
        description: 'Реализовать JWT авторизацию',
        isCompleted: false,
      }
    ];

    const responses: TodoResponse[] = [];

    for (const todoData of initialTodos) {
      const response = await this.create(todoData);
      responses.push(response);
    }

    return responses;
  }
}