# 開発ガイド

## プロジェクト構造

```
mindmap-todo/
├── src/
│   ├── App/                # メインアプリケーションロジック
│   │   ├── MindMapNode/    # ノードコンポーネント
│   │   ├── MindMapEdge/    # エッジコンポーネント
│   │   └── store.ts        # Zustandストア
│   ├── components/         # UIコンポーネント
│   │   ├── ui/             # 基本UI要素
│   │   └── layout/         # レイアウトコンポーネント
│   ├── hooks/              # カスタムフック
│   ├── lib/                # ユーティリティ
│   │   ├── api/            # API関連
│   │   └── utils/          # 共通関数
│   └── styles/             # スタイル定義
```

## コンポーネント概要

### App/index.tsx
メインアプリケーションのエントリーポイント。ReactFlowの設定と全体レイアウトを管理します。

### App/store.ts
Zustandを使用した状態管理ストア。ノード、エッジ、アプリケーション状態を管理します。

### App/MindMapNode/index.tsx
マインドマップのノードコンポーネント。ノードの表示、編集、折りたたみ機能を実装しています。

### App/MindMapEdge/index.tsx
ノード間の接続線（エッジ）コンポーネント。

### components/layout/Header.tsx
アプリケーションのヘッダーコンポーネント。アプリ名表示と検索機能を提供します。

### components/layout/SidePanel.tsx
サイドパネルコンポーネント。ノードのツリー構造を表示し、ノード選択機能を提供します。

### components/layout/NavigationBar.tsx
左側ナビゲーションバーコンポーネント。アカウント、プロジェクト一覧、ツリービューへのアクセスを提供します。

## 主要機能の実装詳細

### ノードの折りたたみ機能
`MindMapNode/index.tsx`内で実装されています。ノードの右側に表示される目のアイコンをクリックすると、そのノードの子孫ノードの表示/非表示を切り替えます。

```tsx
// 折りたたみ機能の実装例
const toggleVisibility = () => {
  const descendantIds = getDescendantIds(nodes, node.id);
  setNodesVisibility(descendantIds, !isVisible);
};
```

### 検索機能
`Header.tsx`で検索UIを提供し、`App/index.tsx`で検索ロジックを実装しています。検索結果に一致するノードはハイライト表示され、最初の一致ノードにビューが自動的にセンタリングされます。

```tsx
// 検索機能の実装例
const handleSearch = (query: string) => {
  if (!query) {
    setSearchHighlightedNodes([]);
    return;
  }
  
  const matchedNodes = nodes.filter(node => 
    node.data.label.toLowerCase().includes(query.toLowerCase())
  );
  
  setSearchHighlightedNodes(matchedNodes.map(node => node.id));
  
  if (matchedNodes.length > 0 && reactFlowInstance) {
    // 最初の一致ノードにセンタリング
    reactFlowInstance.setCenter(
      matchedNodes[0].position.x,
      matchedNodes[0].position.y,
      { duration: 800 }
    );
  }
};
```

### ナビゲーションバー
`NavigationBar.tsx`で実装されています。アイコンボタンとツールチップを使用して、直感的なナビゲーションを提供します。

```tsx
// ナビゲーションバーのボタン実装例
<Tooltip title="アカウント" placement="right">
  <button
    className={`p-2 rounded-lg mb-2 ${
      activeItem === 'account' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'
    }`}
    onClick={() => setActiveItem('account')}
  >
    <AccountCircleIcon />
  </button>
</Tooltip>
```

## 状態管理

アプリケーションの状態はZustandを使用して管理されています。主な状態には以下が含まれます：

- ノード（位置、ラベル、親子関係）
- エッジ（ノード間の接続）
- UI状態（アクティブなナビゲーションアイテム、検索結果など）

## スタイリング

スタイリングはTailwind CSSを使用しています。主なスタイリング原則：

- コンポーネントごとに一貫したデザイン
- レスポンシブなレイアウト
- 視覚的フィードバックの提供（ホバー効果、アクティブ状態など）
- アクセシビリティの考慮

## 今後の開発ガイドライン

1. **コンポーネントの責任分離**：各コンポーネントは単一の責任を持つように設計
2. **型安全性**：TypeScriptの厳格な型チェックを活用
3. **パフォーマンス最適化**：不要な再レンダリングを避ける
4. **テスト**：新機能には適切なテストを追加
5. **ドキュメント**：コードの変更に合わせてドキュメントを更新

## 開発フロー

1. 新機能の要件定義
2. 実装計画の作成
3. コーディングと単体テスト
4. コードレビュー
5. 統合テスト
6. ドキュメント更新
7. リリース
