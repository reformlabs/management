import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import type { Command } from '../../types/command.js';
import { t } from '../../utils/i18n.js';

const slowmodeCommand: Command = {
    get data() {
        return new SlashCommandBuilder()
            .setName('slowmode')
            .setDescription(t('commands.moderation.slowmode.description'))
            .addIntegerOption(option => 
                option.setName('duration')
                    .setDescription(t('commands.moderation.slowmode.duration_desc'))
                    .setMinValue(0)
                    .setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);
    },
    async execute(interaction: any): Promise<void> {
        const duration = interaction.options.getInteger('duration');
        const channel = interaction.channel;

        if (!channel || !('setRateLimitPerUser' in channel)) {
            await interaction.reply({ content: t('system.interaction_error'), ephemeral: true });
            return;
        }

        try {
            await channel.setRateLimitPerUser(duration!);
            await interaction.reply({ content: t('commands.moderation.slowmode.success', { duration }), ephemeral: true });
            return;
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: t('commands.moderation.slowmode.error'), ephemeral: true });
        }
    },
};

export default slowmodeCommand;
