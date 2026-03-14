import { Events, GuildMember, EmbedBuilder, TextChannel } from 'discord.js';
import { t } from '../utils/i18n.js';
import GuildConfig from '../models/guildConfig.js';

export default {
    name: Events.GuildMemberAdd,
    async execute(member: GuildMember) {
        const config = await GuildConfig.findOne({ guildId: member.guild.id });
        const logChannelId = config?.logChannelId;
        if (!logChannelId) return;

        const logChannel = member.guild.channels.cache.get(logChannelId) as TextChannel;
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setTitle(t('logs.member_join.title'))
            .setColor('#00ff00')
            .setDescription(t('logs.member_join.description', {
                user: member.user.tag,
                count: member.guild.memberCount
            }))
            .setTimestamp();

        try {
            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error sending join log:', error);
        }
    },
};
