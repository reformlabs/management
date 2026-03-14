import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import type { Command } from '../../types/command.js';
import { t } from '../../utils/i18n.js';
import GuildConfig from '../../models/guildConfig.js';

const setupCommand: Command = {
    get data() {
        return new SlashCommandBuilder()
            .setName('setup')
            .setDescription(t('commands.moderation.setup.description'))
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .addSubcommand(sub =>
                sub.setName('logchannel')
                    .setDescription(t('commands.moderation.setup.logchannel_desc'))
                    .addChannelOption(opt =>
                        opt.setName('channel')
                            .setDescription(t('commands.moderation.setup.logchannel_opt_desc'))
                            .addChannelTypes(ChannelType.GuildText)
                            .setRequired(true)))
            .addSubcommand(sub =>
                sub.setName('modrole')
                    .setDescription(t('commands.moderation.setup.modrole_desc'))
                    .addRoleOption(opt =>
                        opt.setName('role')
                            .setDescription(t('commands.moderation.setup.modrole_opt_desc'))
                            .setRequired(true)));
    },
    async execute(interaction: any): Promise<void> {
        const subcommand = interaction.options.getSubcommand();
        const guildId = interaction.guildId;

        try {
            let config = await GuildConfig.findOne({ guildId });
            if (!config) config = new GuildConfig({ guildId });

            if (subcommand === 'logchannel') {
                const channel = interaction.options.getChannel('channel');
                config.logChannelId = channel.id;
                await config.save();
                await interaction.reply({ 
                    content: t('commands.moderation.setup.success', { type: 'Log kanalı', value: channel.toString() }), 
                    ephemeral: true 
                });
            } else if (subcommand === 'modrole') {
                const role = interaction.options.getRole('role');
                config.modRoleId = role.id;
                await config.save();
                await interaction.reply({ 
                    content: t('commands.moderation.setup.success', { type: 'Yetkili rolü', value: role.toString() }), 
                    ephemeral: true 
                });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: t('commands.moderation.setup.error'), ephemeral: true });
        }
    },
};

export default setupCommand;
