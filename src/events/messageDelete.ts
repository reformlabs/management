import { Events, Message, EmbedBuilder, TextChannel } from 'discord.js';
import { t } from '../utils/i18n.js';
import GuildConfig from '../models/guildConfig.js';

export default {
    name: Events.MessageDelete,
    async execute(message: Message) {
        if (message.partial || message.author?.bot) return;

        const config = await GuildConfig.findOne({ guildId: message.guildId });
        const logChannelId = config?.logChannelId;
        if (!logChannelId) return;

        const logChannel = message.guild?.channels.cache.get(logChannelId) as TextChannel;
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setTitle(t('logs.message_delete.title'))
            .setColor('#ff0000')
            .setDescription(t('logs.message_delete.description', {
                channel: message.channel.toString(),
                author: message.author.tag,
                content: message.content || 'No content'
            }))
            .setTimestamp();

        try {
            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error sending delete log:', error);
        }
    },
};
