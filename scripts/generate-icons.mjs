import fs from 'node:fs';
import path from 'node:path';
import svgstore from 'svgstore';

const inputDir = path.resolve('src/assets/icons');
const outputFile = path.resolve('public/symbols.svg');

const sprites = svgstore();

const files = fs
    .readdirSync(inputDir)
    .filter((file) => file.endsWith('.svg'));

for (const file of files) {
    const filePath = path.join(inputDir, file);
    const name = path.basename(file, '.svg');

    let content = fs.readFileSync(filePath, 'utf8');

    content = content
        .replace(/<\?xml[^>]*>/g, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\s+/g, ' ')
        .replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"')
        .replace(/stroke="(?!none)[^"]*"/g, 'stroke="currentColor"')
        .replace(/\s+(fill|stroke)="none"/g, ' $1="none"')
        .trim();

    sprites.add(name, content);
}

fs.mkdirSync(path.dirname(outputFile), {
    recursive: true,
});

const output = sprites
    .toString()
    .replace(/\n/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ');

fs.writeFileSync(outputFile, output);

console.log(
    `Generated ${files.length} icons → public/symbols.svg`,
);