import { Events, Message, EmbedBuilder, TextChannel } from 'discord.js';
import { t } from '../utils/i18n.js';
import GuildConfig from '../models/guildConfig.js';

export default {
    name: Events.MessageUpdate,
    async execute(oldMessage: Message, newMessage: Message) {
        if (oldMessage.partial || oldMessage.author?.bot || oldMessage.content === newMessage.content) return;

        const config = await GuildConfig.findOne({ guildId: oldMessage.guildId });
        const logChannelId = config?.logChannelId;
        if (!logChannelId) return;

        const logChannel = oldMessage.guild?.channels.cache.get(logChannelId) as TextChannel;
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setTitle(t('logs.message_update.title'))
            .setColor('#ffff00')
            .setDescription(t('logs.message_update.description', {
                channel: oldMessage.channel.toString(),
                author: oldMessage.author.tag,
                oldContent: oldMessage.content || 'No content',
                newContent: newMessage.content || 'No content'
            }))
            .setTimestamp();

        try {
            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error sending edit log:', error);
        }
    },
};
