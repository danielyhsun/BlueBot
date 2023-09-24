import {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
  CommandInteraction,
  CommandInteractionOptionResolver,
  CacheType,
} from "discord.js";
import { type Command } from "../interfaces/Command";
import { getMemberData } from "../modules/getMemberData";
import { updateMemberDataAddFine } from "../modules/updateMemberData";
import { MemberInt } from "../db/models/MemberModel";

export const fines: Command = {
  data: new SlashCommandBuilder()
    .setName("fines")
    .setDescription("Commands for fines")
    // "add" subcommand
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a fine to a member")
        .addUserOption((option) =>
          option.setName("member").setDescription("Member to add fine to").setRequired(true)
        )
        .addNumberOption((option) =>
          option.setName("amount").setDescription("Amount to add").setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("reason").setDescription("Reason for fine").setRequired(true)
        )
    )
    // "list" subcommand
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("List fines for a member")
        .addUserOption((option) =>
          option.setName("member").setDescription("Member to check fine of").setRequired(false)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  run: async (interaction) => {
    await interaction.deferReply();
    const options = interaction.options as CommandInteractionOptionResolver<CacheType>;
    const command = options.getSubcommand();

    if (command == "add") {
      // const { user } = interaction;
      const memberOption = options.get("member");
      const targetMember = await getMemberData(memberOption?.value as string);
      if (targetMember !== null) {
        const amtOption = interaction.options.get("amount");
        const amt = amtOption?.value as number;
        const reasonOption = interaction.options.get("reason");
        const reason = reasonOption?.value as string;
        await updateMemberDataAddFine(targetMember, amt, reason);
        const fineEmbed = new EmbedBuilder();
        fineEmbed.setTitle("Fine Updated").addFields(
          // { name: "Amount to Add", value: amt.toString },
          { name: "Member", value: `${memberOption?.user}` },
          { name: "Reason", value: reason },
          { name: "Amount Added", value: amt.toString(), inline: true },
          { name: "Updated Fine", value: targetMember.fineTotal.toString(), inline: true }
        );
        await interaction.editReply({ embeds: [fineEmbed] });
      } else {
        await interaction.editReply("User is not a registered member yet!");
      }
    } else if (command == "list") {
      const memberOption = interaction.options.get("member");
      let targetMember: MemberInt | null;
      if (memberOption) {
        const member = memberOption;
        targetMember = await getMemberData(member.value as string);
      } else {
        const { user } = interaction;
        targetMember = await getMemberData(user.id);
      }

      if (targetMember !== null) {
        const fineEmbed = new EmbedBuilder();

        let finesAndReasons = "";
        targetMember.fines.forEach((fine, index) => {
          finesAndReasons += `**${index + 1}.** \`${fine.amount} - ${fine.reason}\`\n`;
        });

        const fineTotal = targetMember.fineTotal;

        fineEmbed
          .setTitle("Fines")
          .setDescription(`for ${interaction.options.get("member")?.user}`)
          .addFields(
            { name: "Total", value: fineTotal.toString() },
            { name: "Fines", value: finesAndReasons }
          );
        await interaction.editReply({ embeds: [fineEmbed] });
      } else {
        await interaction.editReply("User is not a registered member!");
      }
    }
  },
};
