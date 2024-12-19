import { ApiProperty } from '@nestjs/swagger';
import { Todo } from '../entities/todo.entity';

export class PaginatedTodoResponse {
  @ApiProperty({ type: [Todo] })
  items: Todo[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}

export class TodoResponse {
  @ApiProperty()
  success: boolean;

  @ApiProperty({ type: Todo })
  data: Todo;

  @ApiProperty()
  message: string;
}