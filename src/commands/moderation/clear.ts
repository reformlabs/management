import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import type { Command } from '../../types/command.js';
import { t } from '../../utils/i18n.js';

const clearCommand: Command = {
    get data() {
        return new SlashCommandBuilder()
            .setName('clear')
            .setDescription(t('commands.moderation.clear.description'))
            .addIntegerOption(option => 
                option.setName('amount')
                    .setDescription(t('commands.moderation.clear.amount_desc'))
                    .setMinValue(1)
                    .setMaxValue(100)
                    .setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);
    },
    async execute(interaction: any): Promise<void> {
        const amount = interaction.options.getInteger('amount');
        const channel = interaction.channel;

        if (!channel || !('bulkDelete' in channel)) {
            await interaction.reply({ content: t('system.interaction_error'), ephemeral: true });
            return;
        }

        try {
            await channel.bulkDelete(amount!, true);
            await interaction.reply({ content: t('commands.moderation.clear.success', { amount }), ephemeral: true });
            return;
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: t('commands.moderation.clear.error'), ephemeral: true });
        }
    },
};

export default clearCommand;
