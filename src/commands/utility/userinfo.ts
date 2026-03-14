import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { Command } from '../../types/command.js';
import { t } from '../../utils/i18n.js';

const userInfoCommand: Command = {
    get data() {
        return new SlashCommandBuilder()
            .setName('userinfo')
            .setDescription(t('commands.utility.userinfo.description'))
            .addUserOption(option =>
                option.setName('user')
                    .setDescription(t('commands.utility.userinfo.user_description'))
                    .setRequired(false));
    },
    async execute(interaction: any): Promise<void> {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = await interaction.guild?.members.fetch(user.id);

        const embed = new EmbedBuilder()
            .setTitle(user.tag)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: t('info.id'), value: user.id, inline: true },
                { name: t('info.created_at'), value: user.createdAt.toLocaleDateString(), inline: true }
            )
            .setColor('#2ecc71')
            .setTimestamp();

        if (member) {
            embed.addFields(
                { name: t('info.joined_at'), value: member.joinedAt?.toLocaleDateString() || 'N/A', inline: true },
                { name: t('info.roles'), value: member.roles.cache.size.toString(), inline: true }
            );
        }

        await interaction.reply({ embeds: [embed] });
        return;
    },
};

export default userInfoCommand;
