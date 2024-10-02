import { PartialType } from "@nestjs/mapped-types";
import { CreateTodoDto } from "./create-todo.dto";

export class UpdateToDoTaskDTO extends PartialType(CreateTodoDto) {}
