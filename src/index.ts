import { 
    Client, 
    Collection, 
    Events, 
    GatewayIntentBits, 
    REST, 
    Routes 
} from 'discord.js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { initI18n, t } from './utils/i18n.js';
import { Command } from './types/command.js';
import mongoose from 'mongoose';

import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration
    ] 
});
const commands = new Collection<string, Command>();

async function main() {
    await initI18n();

    // MongoDB Connection
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('[SYS] MongoDB bağlantısı başarılı.');
    } catch (error) {
        console.error('[ERR] MongoDB bağlantı hatası:', error);
    }

    // Command Loader (Recursive)
    const commandsPath = path.join(__dirname, 'commands');
    const loadCommands = async (dir: string) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                await loadCommands(filePath);
            } else if ((file.endsWith('.ts') || file.endsWith('.js')) && !file.endsWith('.d.ts') && !file.endsWith('.map')) {
                const fileUrl = path.isAbsolute(filePath) ? `file://${filePath}` : filePath;
                const command = (await import(fileUrl)).default;
                if (command && 'data' in command && 'execute' in command) {
                    commands.set(command.data.name, command);
                }
            }
        }
    };
    await loadCommands(commandsPath);

    // Event Loader
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => 
        (file.endsWith('.ts') || file.endsWith('.js')) && !file.endsWith('.d.ts') && !file.endsWith('.map')
    );

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const fileUrl = path.isAbsolute(filePath) ? `file://${filePath}` : filePath;
        const event = (await import(fileUrl)).default;
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const command = commands.get(interaction.commandName);

        if (!command) return;

        // Discord locale mapping
        let lng = interaction.locale.split('-')[0];
        
        // Special case mapping if needed
        if (interaction.locale === 'zh-CN' || interaction.locale === 'zh-TW') lng = 'zh';

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: t('system.interaction_error', { lng }), ephemeral: true });
        }
    });

    await client.login(process.env.DISCORD_TOKEN);
    await registerCommands();
}

// Function to register slash commands
export async function registerCommands() {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
    const commandsData = Array.from(commands.values()).map(cmd => {
        const data = typeof cmd.data === 'function' ? cmd.data() : cmd.data;
        return data.toJSON();
    });

    try {
        console.log(`[SYS] ${commandsData.length} slash komutu kaydediliyor...`);
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID!),
            { body: commandsData },
        );
        console.log('[SYS] Slash komutları başarıyla kaydedildi!');
    } catch (error) {
        console.error('[ERR] Komut kaydı sırasında hata:', error);
    }
}

main();
