import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { Command } from '../../types/command.js';
import { t } from '../../utils/i18n.js';

const serverInfoCommand: Command = {
    get data() {
        return new SlashCommandBuilder()
            .setName('serverinfo')
            .setDescription(t('commands.utility.serverinfo.description'));
    },
    async execute(interaction: any): Promise<void> {
        const guild = interaction.guild;
        if (!guild) return;

        const embed = new EmbedBuilder()
            .setTitle(guild.name)
            .setThumbnail(guild.iconURL())
            .addFields(
                { name: t('info.id'), value: guild.id, inline: true },
                { name: t('info.owner'), value: `<@${guild.ownerId}>`, inline: true },
                { name: t('info.members'), value: guild.memberCount.toString(), inline: true },
                { name: t('info.roles'), value: guild.roles.cache.size.toString(), inline: true },
                { name: t('info.created_at'), value: guild.createdAt.toLocaleDateString(), inline: true }
            )
            .setColor('#3498db')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
        return;
    },
};

export default serverInfoCommand;
