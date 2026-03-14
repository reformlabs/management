import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import type { Command } from '../../types/command.js';
import { t } from '../../utils/i18n.js';

const kickCommand: Command = {
    get data() {
        return new SlashCommandBuilder()
            .setName('kick')
            .setDescription(t('commands.moderation.kick.description'))
            .addUserOption(option => 
                option.setName('user')
                    .setDescription(t('commands.moderation.kick.user_desc'))
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('reason')
                    .setDescription(t('commands.moderation.kick.reason_desc'))
                    .setRequired(false))
            .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);
    },
    async execute(interaction: any): Promise<void> {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = await interaction.guild?.members.fetch(user!.id);

        if (!member) {
            await interaction.reply({ content: t('system.interaction_error'), ephemeral: true });
            return;
        }

        try {
            await member.kick(reason);
            await interaction.reply({ content: t('commands.moderation.kick.success', { user: user!.tag, reason }), ephemeral: true });
            return;
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: t('commands.moderation.kick.error'), ephemeral: true });
        }
    },
};

export default kickCommand;
