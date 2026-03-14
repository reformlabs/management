import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import type { Command } from '../../types/command.js';
import { t } from '../../utils/i18n.js';

const timeoutCommand: Command = {
    get data() {
        return new SlashCommandBuilder()
            .setName('timeout')
            .setDescription(t('commands.moderation.timeout.description'))
            .addUserOption(option => 
                option.setName('user')
                    .setDescription(t('commands.moderation.timeout.user_desc'))
                    .setRequired(true))
            .addIntegerOption(option =>
                option.setName('duration')
                    .setDescription(t('commands.moderation.timeout.duration_desc'))
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('reason')
                    .setDescription(t('commands.moderation.timeout.reason_desc'))
                    .setRequired(false))
            .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);
    },
    async execute(interaction: any): Promise<void> {
        const user = interaction.options.getUser('user');
        const duration = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = await interaction.guild?.members.fetch(user!.id);

        if (!member) {
            await interaction.reply({ content: t('system.interaction_error'), ephemeral: true });
            return;
        }

        try {
            await member.timeout(duration! * 60 * 1000, reason);
            await interaction.reply({ content: t('commands.moderation.timeout.success', { user: user!.tag, duration, reason }), ephemeral: true });
            return;
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: t('commands.moderation.timeout.error'), ephemeral: true });
        }
    },
};

export default timeoutCommand;
