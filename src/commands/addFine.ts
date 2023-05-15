import { EmbedBuilder, 
    SlashCommandBuilder, 
    PermissionFlagsBits } from "discord.js";
import { Command } from "../interfaces/Command";
import { getMemberData } from "../modules/getMemberData";
import { updateMemberData } from "../modules/updateMemberData";

export const addFine: Command = {
    data: new SlashCommandBuilder()
        .setName("addfine")
        .setDescription("Add a fine to a member")
        .addUserOption((option) => 
            option
                .setName("member")
                .setDescription("Member to add fine to")
                .setRequired(true)
        )
        .addNumberOption((option) => 
            option
                .setName("amount")
                .setDescription("Amount to add")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    run: async (interaction) => {
        await interaction.deferReply();
        const { user } = interaction;
        const memberOption = interaction.options.get("member");
        const targetMember = await getMemberData(memberOption?.value as string);
        if (targetMember !== null) {
        const amtOption = interaction.options.get("amount");
        const amt = amtOption?.value as number;
        const updatedMember = await updateMemberData(targetMember, amt);
        const fineEmbed = new EmbedBuilder();
        fineEmbed
            .setTitle(`Fine for @${ memberOption?.user }`)
            .addFields(
                // { name: "Amount to Add", value: amt.toString },
                { name: "Current Fine", value: targetMember.fine.toString() });
        await interaction.editReply({ embeds: [fineEmbed] });
        } else {
            await interaction.editReply("That user isn't a registered member yet!");
        }
    }
}