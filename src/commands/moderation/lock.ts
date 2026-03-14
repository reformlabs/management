import { SlashCommandBuilder, PermissionFlagsBits, TextChannel } from 'discord.js';
import type { Command } from '../../types/command.js';
import { t } from '../../utils/i18n.js';

const lockCommand: Command = {
    get data() {
        return new SlashCommandBuilder()
            .setName('lock')
            .setDescription(t('commands.moderation.lock.description'))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);
    },
    async execute(interaction: any): Promise<void> {
        const channel = interaction.channel as TextChannel;

        if (!channel || !channel.permissionsFor(interaction.guild!.roles.everyone)) {
            await interaction.reply({ content: t('system.interaction_error'), ephemeral: true });
            return;
        }

        try {
            await channel.permissionOverwrites.edit(interaction.guild!.roles.everyone, {
                SendMessages: false
            });
            await interaction.reply({ content: t('commands.moderation.lock.success'), ephemeral: true });
            return;
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: t('commands.moderation.lock.error'), ephemeral: true });
        }
    },
};

export default lockCommand;
