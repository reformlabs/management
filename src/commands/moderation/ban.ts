import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import type { Command } from '../../types/command.js';
import { t } from '../../utils/i18n.js';

const banCommand: Command = {
    get data() {
        return new SlashCommandBuilder()
            .setName('ban')
            .setDescription(t('commands.moderation.ban.description'))
            .addUserOption(option => 
                option.setName('user')
                    .setDescription(t('commands.moderation.ban.user_desc'))
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('reason')
                    .setDescription(t('commands.moderation.ban.reason_desc'))
                    .setRequired(false))
            .addIntegerOption(option =>
                option.setName('delete_messages')
                    .setDescription(t('commands.moderation.ban.delete_messages_desc'))
                    .setMinValue(0)
                    .setMaxValue(7)
                    .setRequired(false))
            .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);
    },
    async execute(interaction: any): Promise<void> {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const deleteMessages = interaction.options.getInteger('delete_messages') || 0;

        try {
            await interaction.guild?.members.ban(user!.id, { 
                reason, 
                deleteMessageSeconds: deleteMessages * 24 * 60 * 60 
            });
            await interaction.reply({ content: t('commands.moderation.ban.success', { user: user!.tag, reason }), ephemeral: true });
            return;
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: t('commands.moderation.ban.error'), ephemeral: true });
        }
    },
};

export default banCommand;
