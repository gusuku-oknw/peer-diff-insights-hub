# Peer Diff Insights Hub

## プロジェクト概要
**Peer Diff Insights Hub** は、企業説明会用の PPTX 資料を学生がオンライン上でレビューし、企業側が差分プレビューと AI 要約を活用して効率的に品質改善を行える SaaS プロトタイプです。  
学生はスライドごとにコメントやフィードバックを投稿し、その情報が XML レベルで差分管理された後、企業側は Git ライクなブランチ機構と合わせて「誰が何を修正・提案したか」を可視化できます。さらに、OpenAI GPT-4 Turbo 経由で生成される要約やキーワード抽出を用いれば、企業は膨大なコメントを短時間で把握し、最終版の PPTX をダウンロードするワークフローが実現します。

- 学生にとっては：  
  - 実践的なレビュー経験を通じた学び  
  - コメント承認→報酬の仕組みでインセンティブを提供  
- 企業にとっては：  
  - 低コストかつ多人数による多様な視点でのレビュー  
  - 自動生成されたサマリやキーワードを使った効率的な意思決定  

---

## フォルダ構成と各ディレクトリの役割
```
peer-diff-insights-hub/
│
├─ public/
│   ├─ index.html           ← ビルド時にコピーされる静的 HTML テンプレート
│   ├─ favicon.ico          ← ファビコンなど
│   └─ assets/              ← ロゴやアイコン、OGP 画像などの静的リソース
│
├─ src/
│   ├─ main.tsx             ← React アプリのエントリポイント
│   ├─ App.tsx              ← ルーティング／レイアウトの土台
│   │
│   ├─ components/          ← 再利用可能な UI コンポーネント群
│   │   ├─ common/          ← ボタン、モーダル、入力フォームなど共通部品
│   │   ├─ dashboard/       ← ダッシュボード画面用のコンポーネント
│   │   ├─ slide-viewer/    ← スライドプレビュー／差分表示用コンポーネント
│   │   ├─ comment-panel/   ← コメント投稿・一覧表示用コンポーネント
│   │   └─ ai-summary/      ← AI 要約表示用コンポーネント（カードやグラフ）
│   │
│   ├─ pages/               ← ページ単位のコンテナコンポーネント
│   │   ├─ StudentDashboard.tsx   ← 学生向けダッシュボードページ
│   │   ├─ EnterpriseDashboard.tsx← 企業向けダッシュボードページ
│   │   ├─ ProjectDetail.tsx      ← プロジェクト詳細 & スライドレビュー画面
│   │   ├─ DiffPreview\.tsx        ← 企業側の差分プレビュー画面
│   │   ├─ AiReport.tsx           ← AI 要約レポート画面
│   │   └─ … (その他ログイン・認証ページ、404 ページ など)
│   │
│   ├─ hooks/               ← カスタムフック（データ取得、認証フロー、フォーム制御 など）
│   │   ├─ useAuth.ts        ← 認証関連の共通処理
│   │   ├─ useSupabaseClient.ts ← Supabase クライアント初期化
│   │   └─ useDiffLogic.ts   ← PPTX 差分取得ロジック用のフック
│   │
│   ├─ lib/                 ← 汎用ユーティリティ関数・API クライアント
│   │   ├─ api.ts           ← REST/Edge Function 呼び出しラッパー
│   │   ├─ dateUtils.ts      ← 日付整形ユーティリティ
│   │   └─ diffParser.ts     ← XML レベル差分 JSON への変換処理
│   │
│   ├─ styles/              ← TailwindCSS の設定やグローバル CSS、ユーティリティクラス
│   │   ├─ globals.css       ← リセット CSS やプロジェクト共通スタイル
│   │   └─ tailwind.css      ← Tailwind のインポートエントリ
│   │
│   ├─ types/               ← TypeScript 型定義（API レスポンス、DB スキーマ、画面用型 など）
│   │   ├─ Project.ts        ← プロジェクト情報型
│   │   ├─ Comment.ts        ← コメント情報型
│   │   ├─ Diff.ts           ← 差分 JSON の型定義
│   │   └─ AiSummary.ts      ← AI 要約結果の型定義
│   │
│   └─ index.css            ← グローバルに読み込む CSS（Tailwind 設定を反映）
│
├─ supabase/
│   ├─ .env                 ← 環境変数（Supabase URL、ANON-KEY など）
│   ├─ migrations/          ← データベーススキーマ管理用 SQL ファイル
│   ├─ seed/                ← 初期データ投入スクリプト（開発用ダミーデータなど）
│   └─ functions/           ← Supabase Edge Function（API 群）のソースコード
│       ├─ diffExtractor/   ← PPTX→XML→差分 JSON 生成 API
│       ├─ aiSummarizer/    ← コメント全体をまとめる AI 要約呼び出し API
│       └─ auth/            ← 認証・ユーザー管理関連の関数
│
├─ .gitignore
├─ package.json            ← 使用ライブラリ一覧、スクリプト定義
├─ tsconfig.json           ← TypeScript コンパイラ設定
├─ tailwind.config.ts      ← TailwindCSS カスタムテーマ・プラグイン設定
├─ vite.config.ts          ← Vite ビルド設定（環境変数読み込み、別名パス定義 など）
├─ postcss.config.js       ← Tailwind を PostCSS 経由で使うための設定
├─ eslint.config.js        ← ESLint 設定
└─ README.md               ← 本ドキュメント
````

---

## セットアップ方法

下記の手順でローカル環境を構築してください。OS は Windows/Mac/Linux を問わず、Node.js と npm（あるいは bun）が動作することが前提です。

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/gusuku-oknw/peer-diff-insights-hub.git
   cd peer-diff-insights-hub


2. **依存パッケージのインストール**
   Node.js（推奨：バージョン 16.x 以上）がインストールされている状態で、以下を実行します。

   ```bash
   npm install
   ```

   または bun を使う場合：

   ```bash
   bun install
   ```

3. **環境変数の設定（Supabase）**

    * `supabase/.env.example` を参考に、`supabase/.env` を作成します。
    * Supabase ダッシュボードから「プロジェクト URL」と「ANON-KEY（公開キー）」を取得し、以下のように設定してください：

      ```
      SUPABASE_URL=https://xxxxxx.supabase.co
      SUPABASE_ANON_KEY=pk.abcdefghijklmnopqrstuvwx1234567890
      ```
    * 必要に応じて、Edge Function をローカルでテストする場合は `supabase/functions/*.env` も同様に設定します。

4. **Supabase プロジェクト初期化（ローカル開発用）**

    * Supabase CLI をインストールしていない場合は、公式手順にしたがって導入してください。
    * 移行ファイルを実行し、テーブルを作成します。

      ```bash
      cd supabase
      supabase db push
      supabase db seed
      ```

      ※ 開発用にダミーデータを投入する場合は `seed/` 以下のスクリプトを実行します。

5. **開発サーバーの起動**
   プロジェクトルートに戻り、以下を実行するとローカルサーバーが立ち上がります：

   ```bash
   npm run dev
   ```

   または

   ```bash
   bun run dev
   ```

   デフォルトで `http://localhost:5173`（またはコンソールに表示されるポート）にアクセスすると画面が表示されます。

6. **Supabase Edge Function の起動（任意）**
   Edge Function をローカルで動かす場合、別ターミナルで以下を実行します：

   ```bash
   supabase functions start
   ```

   これにより、例えば `http://localhost:54321/functions/v1/diffExtractor` といったエンドポイントがローカルに現れます。

7. **ビルドとデプロイ（本番リリース）**

    * 本番環境向けに静的ファイルを生成する場合：

      ```bash
      npm run build
      ```
    * 出力された `dist/` ディレクトリ（もしくは設定に応じたディレクトリ）をサーバーや Vercel、Netlify に配置してください。
    * 環境変数（`SUPABASE_URL`、`SUPABASE_ANON_KEY`）を本番環境のホスティングサービスに設定し、Edge Function も適宜デプロイします。

---

## コーディング規約／ブランチ運用ルール

### コーディング規約

1. **言語・フォーマット**

    * フロントエンドは **TypeScript + React** を使用。`.tsx`／`.ts` ファイル名を遵守すること。
    * CSS は **Tailwind CSS** を基本とし、カスタムスタイルが必要な場合は `src/styles/` 以下に CSS モジュール（`.module.css`）で定義する。
    * **shadcn-ui** のコンポーネントを積極活用する。独自コンポーネントを作成する際は、既存の UI デザインと一貫性が保たれることを重視する。

2. **Lint／フォーマッター**

    * ESLint（`eslint.config.js`）と Prettier を導入済み。コミット前に自動でコードをフォーマット・Lint できるよう、以下のスクリプトを利用：

      ```bash
      npm run lint
      npm run format
      ```
    * `.eslintrc.js` のルールに従い、未使用の変数やフォーマット崩れがないように注意する。

3. **ディレクトリ配置**

    * 新規コンポーネントは必ず `src/components/` 以下に機能別サブフォルダを作成して追加する。共通的に使う UI 部品は `src/components/common/` に配置。
    * カスタムフックは `src/hooks/`、型定義は `src/types/`、ユーティリティ関数は `src/lib/` 以下で管理する。

4. **型定義**

    * API レスポンスや DB スキーマに対応した型は `src/types/` にまとめること。
    * 画面ロジック専用の型やユーティリティ型も同様に `src/types/` 下に置き、重複を避ける。

5. **コメント・ドキュメント**

    * 関数やコンポーネントの冒頭には JSDoc 形式で簡潔に説明を記載する。例：

      ```ts
      /**
       * プロジェクト一覧を取得するカスタムフック
       * @returns { projects: ProjectType[], isLoading: boolean }
       */
      ```
    * 特殊なロジックや工夫した点がある場合は、なぜそれが必要なのかをコメントで残す。

6. **コミットメッセージ**

    * サブジェクト行は 50 文字以内を目標とし、「動詞＋内容」で要点をまとめる。例：`Add: コメント投稿画面のバリデーション実装`
    * 詳細な説明が必要な場合は 72 文字区切りで本文を記述。
    * コミットタイプのプレフィックスは以下を推奨：

        * `Add:` 新機能の追加
        * `Fix:` バグ修正
        * `Update:` 既存機能の更新
        * `Refactor:` リファクタリング
        * `Docs:` ドキュメント更新
        * `Chore:` 雑務／設定変更など

### ブランチ運用ルール

1. **メインブランチ**

    * `main` ブランチは常にデプロイ可能な状態を維持する。直接コミットせず、Pull Request（PR）を介してのみマージする。

2. **開発ブランチ**

    * 開発中の作業は `develop` ブランチ上で行い、完了した機能は `develop` にマージする。
    * `develop` ブランチにマージされたコードは自動的にテスト／Lint が走るように CI を設定する。

3. **フィーチャーブランチ**

    * 新機能や機能改善は、以下の命名規則に従ったブランチを作成して作業する：

      ```
      feature/<ISSUE 番号>-<機能名>
      fix/<ISSUE 番号>-<バグ内容>
      refactor/<ISSUE 番号>-<改善内容>
      ```
    * 例：`feature/23-add-comment-ui`、`fix/42-diff-error-handling` など。

4. **Pull Request（PR）運用**

    * PR 作成時には以下をチェックリストとして記載：

        * 該当 Issue 番号をリンクしているか（例：`Closes #23`）
        * テストが通っているか
        * コードフォーマット／Lint に違反がないか
        * スクリーンショットや GIF などで UI 変更がわかる資料を添付（UI 関連の場合）
        * レビュアーに依頼したいポイントが明確に書かれているか
    * 2 名以上のレビュー承認が得られたら `develop`（もしくは `main`） へマージする。
    * マージ時はマージコミット（Merge Commit）ではなく、**Squash and Merge** を推奨し、履歴を簡潔に保つ。

5. **リリースブランチ／ホットフィックスブランチ**

    * 本番環境リリース直前には `release/<バージョン>` ブランチを作成し、最終確認や微調整を行う。
    * 緊急バグ修正は `hotfix/<バージョン>` ブランチを `main` ブランチから切り、修正後に `main` と `develop` にマージする。

---

## 今後の TODO

* CI/CD ワークフロー（GitHub Actions や Supabase Deploy）を整備
* README により詳細な API ドキュメントや ER 図を追記
* テストコード（Unit Test／Integration Test）を導入
* コーディング規約や ESLint 設定の微調整・強化

---
