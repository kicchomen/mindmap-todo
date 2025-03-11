import { Edge, Node } from 'reactflow';
import { NodeData } from '../App/MindMapNode';

// LocalStorageのキー
const STORAGE_KEY = 'mindmap-todo-data';

// 保存するデータの型定義
export interface MindMapStorageData {
  nodes: Node<NodeData>[];
  edges: Edge[];
  lastSaved: number; // タイムスタンプ
}

/**
 * マインドマップデータをlocalStorageに保存する
 */
export const saveMindMapToStorage = (nodes: Node<NodeData>[], edges: Edge[]): void => {
  try {
    const data: MindMapStorageData = {
      nodes,
      edges,
      lastSaved: Date.now()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('マインドマップをlocalStorageに保存しました', new Date().toLocaleTimeString());
  } catch (error) {
    console.error('マインドマップの保存に失敗しました:', error);
  }
};

/**
 * localStorageからマインドマップデータを読み込む
 */
export const loadMindMapFromStorage = (): MindMapStorageData | null => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    
    if (!storedData) {
      return null;
    }
    
    const parsedData: MindMapStorageData = JSON.parse(storedData);
    console.log('マインドマップをlocalStorageから読み込みました', new Date(parsedData.lastSaved).toLocaleString());
    return parsedData;
  } catch (error) {
    console.error('マインドマップの読み込みに失敗しました:', error);
    return null;
  }
};

/**
 * localStorageからマインドマップデータを削除する
 */
export const clearMindMapFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('マインドマップのストレージデータをクリアしました');
  } catch (error) {
    console.error('マインドマップデータの削除に失敗しました:', error);
  }
};

/**
 * ストレージプロバイダーのインターフェース
 * 将来的なクラウドストレージ連携を見据えたインターフェース定義
 */
export interface StorageProvider {
  save(data: MindMapStorageData): Promise<void>;
  load(): Promise<MindMapStorageData | null>;
  clear(): Promise<void>;
}

/**
 * LocalStorage プロバイダーの実装
 */
export class LocalStorageProvider implements StorageProvider {
  async save(data: MindMapStorageData): Promise<void> {
    saveMindMapToStorage(data.nodes, data.edges);
  }

  async load(): Promise<MindMapStorageData | null> {
    return loadMindMapFromStorage();
  }

  async clear(): Promise<void> {
    clearMindMapFromStorage();
  }
}

// デフォルトのストレージプロバイダーを返す関数
// 将来的にはユーザー設定などに基づいて異なるプロバイダーを返すことができる
export const getStorageProvider = (): StorageProvider => {
  return new LocalStorageProvider();
};
