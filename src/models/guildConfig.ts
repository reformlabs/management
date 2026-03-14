import { Schema, model } from 'mongoose';

export interface IGuildConfig {
    guildId: string;
    logChannelId?: string;
    modRoleId?: string;
    automod?: {
        antiSpam: boolean;
        badWords: string[];
    };
}

const guildConfigSchema = new Schema<IGuildConfig>({
    guildId: { type: String, required: true, unique: true },
    logChannelId: { type: String },
    modRoleId: { type: String },
    automod: {
        antiSpam: { type: Boolean, default: false },
        badWords: [{ type: String }]
    }
});

export default model<IGuildConfig>('GuildConfig', guildConfigSchema);
