import { Events, GuildMember, EmbedBuilder, TextChannel } from 'discord.js';
import { t } from '../utils/i18n.js';
import GuildConfig from '../models/guildConfig.js';

export default {
    name: Events.GuildMemberRemove,
    async execute(member: GuildMember) {
        const config = await GuildConfig.findOne({ guildId: member.guild.id });
        const logChannelId = config?.logChannelId;
        if (!logChannelId) return;

        const logChannel = member.guild.channels.cache.get(logChannelId) as TextChannel;
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setTitle(t('logs.member_leave.title'))
            .setColor('#ff7f00')
            .setDescription(t('logs.member_leave.description', {
                user: member.user.tag,
                count: member.guild.memberCount
            }))
            .setTimestamp();

        try {
            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error sending leave log:', error);
        }
    },
};
