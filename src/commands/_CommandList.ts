import { Command } from "../interfaces/Command";
import { addFine } from "./addFine";
import { getFine } from "./getFine";

export const CommandList: Command[] = [getFine, addFine];