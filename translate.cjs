const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Sequential Translation Script
 * Usage: node translate.cjs [lang1,lang2,...]
 * If no languages provided, it uses the default Discord set.
 */

const defaultLanguages = [
    'es', 'fr', 'pl', 'nl', 'da', 'sv', 'no', 'fi', 'cs',
    'hu', 'ro', 'bg', 'hr', 'lt', 'el', 'uk', 'hi', 'th', 'zh', 'vi'
];

const args = process.argv.slice(2);
const languages = args.length > 0 ? args[0].split(',') : defaultLanguages;

const localesDir = path.join(process.cwd(), 'src', 'locales');
const sourceFile = path.join(localesDir, 'tr.json');

if (!fs.existsSync(sourceFile)) {
    console.error(`Source file not found: ${sourceFile}`);
    process.exit(1);
}

for (const lang of languages) {
    try {
        console.log(`\n--- Translating to [${lang}] ---`);
        execSync(`qlit i18n src/locales/tr.json --to ${lang}`, { stdio: 'inherit' });

        const generatedFile = path.join(localesDir, `tr.${lang}.json`);
        const targetFile = path.join(localesDir, `${lang}.json`);

        if (fs.existsSync(generatedFile)) {
            // Move and overwrite the existing locale file
            if (fs.existsSync(targetFile)) {
                fs.unlinkSync(targetFile);
            }
            fs.renameSync(generatedFile, targetFile);
            console.log(`Successfully saved: ${lang}.json`);
        } else {
            console.warn(`Warning: qlit finished but ${generatedFile} was not found.`);
        }
    } catch (error) {
        console.error(`Failed to translate to ${lang}:`, error.message);
    }
}

console.log('\nAll tasks completed.');
