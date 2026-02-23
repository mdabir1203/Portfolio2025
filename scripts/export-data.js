import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const dataDir = path.join(rootDir, 'src', 'data');
const outputFile = path.join(rootDir, 'public', 'data.json');

const filesToExport = [
    { name: 'projects', file: 'projects.ts', varName: 'projects' },
    { name: 'awards', file: 'awards.ts', varName: 'awards' },
    { name: 'recommendations', file: 'linkedin-recommendations.ts', varName: 'linkedinRecommendations' }
];

function extractArray(content, varName) {
    const regex = new RegExp(`export const ${varName}:?.*?\\s*=\\s*(\\[[\\s\\S]*?\\]);`, 'm');
    const match = content.match(regex);
    if (!match) return null;

    let jsonString = match[1];

    // Basic cleanup to make it closer to valid JSON
    // Remove trailing commas
    jsonString = jsonString.replace(/,\s*([\]}])/g, '$1');
    // Quote keys
    jsonString = jsonString.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');
    // Handle single quotes to double quotes for strings
    // This is tricky if strings contain double quotes, but for our data it should be mostly fine or we can improve it.
    // Actually, a better way is to use a small JS parser if needed, but let's try a simpler approach.

    try {
        // Try to evaluate it as JS first to get the object, then stringify
        // This is safer for JS objects than regex-to-json
        const evaluate = new Function(`return ${match[1]}`);
        return evaluate();
    } catch (e) {
        console.error(`Error parsing ${varName}:`, e);
        return null;
    }
}

const exportedData = {};

filesToExport.forEach(({ name, file, varName }) => {
    const filePath = path.join(dataDir, file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = extractArray(content, varName);
        if (data) {
            exportedData[name] = data;
        }
    }
});

fs.writeFileSync(outputFile, JSON.stringify(exportedData, null, 2));
console.log(`Successfully exported data to ${outputFile}`);
