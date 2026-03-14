import type { Command } from '../../types/command.js';
import { t } from '../../utils/i18n.js';
import { SlashCommandBuilder } from 'discord.js';

const pingCommand: Command = {
    get data() {
        return new SlashCommandBuilder()
            .setName('ping')
            .setDescription(t('commands.utility.ping.description'));
    },
    async execute(interaction: any): Promise<void> {
        const lng = interaction.locale.split('-')[0] || 'en';
        const latency = Math.abs(Date.now() - interaction.createdTimestamp);
        await interaction.reply({ content: t('commands.utility.ping.response', { latency, lng }) });
        return;
    },
};

export default pingCommand;
