import { Command } from "../interfaces/Command";
import { addEvent } from "./addEvent";
import { addFine } from "./addFine";
import { getFine } from "./getFine";
import { register } from "./register";
import { stats } from "./stats";

export const CommandList: Command[] = [getFine, addFine, addEvent, stats, register];