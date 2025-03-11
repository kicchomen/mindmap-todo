# マインドマップTODOアプリケーション - ディレクトリ構造

## プロジェクトルート

```
mindmap-todo/
├── .cursor/                  # エディタ設定
├── .git/                     # Gitリポジトリ
├── .github/                  # GitHub関連設定
├── .gitignore                # Git除外設定ファイル
├── .windsurfrules            # Windsurf設定ファイル
├── README.md                 # プロジェクト概要
├── directorystructure.md     # ディレクトリ構造ドキュメント
├── docs/                     # プロジェクトドキュメント
├── index.html                # エントリーポイントHTML
├── node_modules/             # 依存パッケージ
├── package-lock.json         # パッケージロックファイル
├── package.json              # パッケージ設定
├── postcss.config.js         # PostCSS設定
├── public/                   # 静的ファイル
├── src/                      # ソースコード
├── tailwind.config.js        # Tailwind CSS設定
├── technologystack.md        # 技術スタック情報
├── tsconfig.json             # TypeScript設定
├── tsconfig.node.json        # Node用TypeScript設定
└── vite.config.ts            # Vite設定
```

## ソースコード構造 (src/)

```
src/
├── App/                      # アプリケーションコア
│   ├── MindMapEdge/          # エッジ（接続線）コンポーネント
│   │   └── index.tsx         # エッジ実装
│   ├── MindMapNode/          # ノードコンポーネント
│   │   ├── DragIcon.tsx      # ドラッグアイコン
│   │   └── index.tsx         # ノード実装
│   ├── index.tsx             # アプリメインコンポーネント
│   └── store.ts              # 状態管理
├── components/               # 共通コンポーネント
│   ├── layout/               # レイアウトコンポーネント
│   │   ├── Header.tsx        # ヘッダーコンポーネント
│   │   ├── NavigationBar.tsx # ナビゲーションバー
│   │   └── SidePanel.tsx     # サイドパネル
│   └── ui/                   # UI要素（現在は空）
├── index.css                 # グローバルCSS
├── main.tsx                  # アプリケーションエントリーポイント
└── vite-env.d.ts             # Vite環境型定義
```

## ドキュメント構造 (docs/)

```
docs/
├── README.md                 # ドキュメント概要
├── development-guide.md      # 開発者ガイド
├── initial.md                # 初期設計ドキュメント
├── roadmap.md                # 開発ロードマップ
├── specifications.md         # 機能仕様書
└── test-cases.md             # テストケース
```

## 主要コンポーネント概要

- **App/index.tsx**: マインドマップの主要機能とReactFlowの統合
- **App/store.ts**: マインドマップのデータと状態管理
- **App/MindMapNode**: マインドマップのノード表示と操作機能
- **App/MindMapEdge**: ノード間の接続線表示
- **components/layout/Header.tsx**: 検索機能を含むヘッダー
- **components/layout/NavigationBar.tsx**: 左側ナビゲーションバー
- **components/layout/SidePanel.tsx**: Todoツリーを表示するサイドパネル
