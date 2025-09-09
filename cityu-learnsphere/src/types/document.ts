export interface Document {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  isPublic: boolean;
  collaborators: string[];
  backlinks: string[]; // 反向链接
  metadata: {
    wordCount: number;
    readingTime: number;
    lastEditedBy: string;
  };
}

export interface DocumentFolder {
  id: string;
  name: string;
  parentId?: string;
  children: DocumentFolder[];
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface BiDirectionalLink {
  sourceId: string;
  targetId: string;
  sourceText: string;
  targetTitle: string;
  linkType: 'reference' | 'mention' | 'citation';
}

export interface DocumentState {
  documents: Document[];
  folders: DocumentFolder[];
  currentDocument: Document | null;
  isLoading: boolean;
  error: string | null;
  searchResults: Document[];
  recentDocuments: Document[];
}

export interface CreateDocumentData {
  title: string;
  content?: string;
  category: string;
  tags?: string[];
  folderId?: string;
}

export interface UpdateDocumentData {
  title?: string;
  content?: string;
  tags?: string[];
  category?: string;
}