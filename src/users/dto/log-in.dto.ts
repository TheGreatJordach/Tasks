import { OmitType } from "@nestjs/mapped-types";
import { SignUpDto } from "./sign-up.dto";

export class LogInDto extends OmitType(SignUpDto, ["name", "tasks"]) {}
