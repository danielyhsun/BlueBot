import { type Command } from "../interfaces/Command";
import { addEvent } from "./addEvent";
import { addFine } from "./addFine";
import { fines } from "./fines";
import { getFine } from "./getFine";
import { register } from "./register";
import { stats } from "./stats";
import { events } from "./events";

export const CommandList: Command[] = [fines, events, stats, register];
