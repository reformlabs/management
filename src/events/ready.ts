import { Events } from 'discord.js';
import { t } from '../utils/i18n.js';

export default {
    name: Events.ClientReady,
    once: true,
    execute(client: any) {
        console.log(t('system.ready_log', { user: client.user.tag }));
    },
};
