// find-unused-dirs.js
// ---------------------------------------
// 「src 以下の .ts/.tsx ファイル」を調べて、
// import されていないディレクトリをざっくり検出するスクリプトです。
// ---------------------------------------
const fs = require('fs');
const path = require('path');

// すべての .ts/.tsx ファイルを再帰的に取得する関数
function collectTsFiles(dir) {
    let result = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            result = result.concat(collectTsFiles(full));
        } else if (entry.isFile() && (full.endsWith('.ts') || full.endsWith('.tsx'))) {
            // Windows や macOS のパス区切りを「/」に統一して扱う
            result.push(full.replace(/\\/g, '/'));
        }
    }
    return result;
}

// コード内の import パスをすべて集める関数
function collectImportPaths(files) {
    const importPaths = new Set();
    // import 文をキャプチャする正規表現
    const importRegex = /from\s+['"](.+?)['"]/g;
    for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        let match;
        while ((match = importRegex.exec(content))) {
            importPaths.add(match[1]);
        }
    }
    return importPaths;
}

function main() {
    // プロジェクトルートを基準にし、src フォルダを探索
    const root = process.cwd();
    const srcDir = path.join(root, 'src');

    // まず src ディレクトリが存在するかチェック
    if (!fs.existsSync(srcDir)) {
        console.error('Error: プロジェクト内に「src」フォルダが見つかりませんでした。');
        process.exit(1);
    }

    // (1) すべての .ts / .tsx ファイルを集める
    const allTsFiles = collectTsFiles(srcDir);

    // (2) それらのファイルの中から import されているパスを集める
    const importPaths = collectImportPaths(allTsFiles);

    // (3) 各ファイルの親ディレクトリをリスト化
    const allDirs = new Set(allTsFiles.map((f) => path.dirname(f)));

    console.log('--- 未参照かもしれないディレクトリ候補 ---');
    for (const dir of allDirs) {
        // src 以下の相対パスに変換 (例: src/features/auth なら "./features/auth")
        const relDir = './' + path.relative(srcDir, dir).replace(/\\/g, '/');

        // importPath の中に「relDir で始まるもの」があるかをざっくりチェック
        const isReferenced = [...importPaths].some((ip) => ip.startsWith(relDir));

        if (!isReferenced) {
            console.log(dir);
        }
    }
}

main();
