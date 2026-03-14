import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import type { Command } from '../../types/command.js';
import { t } from '../../utils/i18n.js';

const unbanCommand: Command = {
    get data() {
        return new SlashCommandBuilder()
            .setName('unban')
            .setDescription(t('commands.moderation.unban.description'))
            .addStringOption(option => 
                option.setName('userid')
                    .setDescription(t('commands.moderation.unban.id_desc'))
                    .setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);
    },
    async execute(interaction: any): Promise<void> {
        const userId = interaction.options.getString('userid');

        try {
            await interaction.guild?.members.unban(userId!);
            await interaction.reply({ content: t('commands.moderation.unban.success', { id: userId }), ephemeral: true });
            return;
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: t('commands.moderation.unban.error'), ephemeral: true });
        }
    },
};

export default unbanCommand;
