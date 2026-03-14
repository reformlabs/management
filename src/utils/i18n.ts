import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initI18n() {
    await i18next
        .use(Backend)
        .init({
            fallbackLng: 'en',
            preload: [
                'en', 'tr', 'de', 'pt', 'ja', 'ru', 'ko', 'kn', 'ka', 'it', 'id', 'fr',
                'es', 'nl', 'da', 'sv', 'no', 'fi', 'cs', 'hu', 'ro', 'bg', 'hr', 'lt',
                'el', 'uk', 'hi', 'th', 'zh', 'vi'
            ],
            backend: {
                loadPath: path.join(__dirname, '../locales/{{lng}}.json')
            },
            interpolation: {
                escapeValue: false
            }
        }, (err, t) => {
            if (err) return console.error('[ERR] i18n başlatılamadı:', err);
            console.log('[SYS] i18n başarıyla başlatıldı.');
        });
}

export function t(key: string, options?: any): string {
    return i18next.t(key, options) as string;
}
