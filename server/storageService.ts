import fs from 'fs';
import path from 'path';

export interface StoredConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  language: string;
  preview: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    language?: string;
    image?: {
      mimeType: string;
      data: string;
      fileName?: string;
    };
    audioUrl?: string;
    isBookmarked?: boolean;
    provider?: string;
  }>;
}

// In-memory fallback in case of read-only environments (such as Vercel serverless)
let inMemoryConversations: StoredConversation[] | null = null;

// Determine storage path (prefer ./data, fallback to /tmp or in-memory)
function getStorageFilePath(): string {
  if (process.env.VERCEL) {
    return path.resolve('/tmp', 'solva-conversations.json');
  }
  return path.resolve(process.cwd(), 'data', 'conversations.json');
}

function getInitialSeed(): StoredConversation[] {
  return [
    {
      id: 'seed-conv-tamil',
      title: 'வணக்கம் SOLVA - அறிமுகம்',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 23).toISOString(),
      language: 'Tamil (தமிழ்)',
      preview: 'வணக்கம்! நான் SOLVA. தமிழ், ஆங்கிலம், இந்தி என பல மொழிகளில் பேச முடியும்...',
      messages: [
        {
          id: 'm1',
          role: 'user',
          content: 'வணக்கம், நீங்கள் யார்? உங்களுக்கு என்ன தெரியும்?',
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          language: 'Tamil (தமிழ்)',
        },
        {
          id: 'm2',
          role: 'assistant',
          content: 'வணக்கம்! நான் **SOLVA** — மனிதர்களுடன் இயல்பாக உரையாட உருவாக்கப்பட்ட பன்மொழி (Multilingual) மற்றும் பன்முக (Multimodal) AI உதவியாளர்.\n\nஎன்னால்:\n- தமிழ், Tanglish, ஆங்கிலம், இந்தி, தெலுங்கு, மலையாளம் மற்றும் கன்னடத்தில் பேச முடியும்.\n- புகைப்படங்களை பகுப்பாய்வு செய்து விளக்கமளிக்க முடியும்.\n- குரல் மூலமாக கேள்விகளை உள்வாங்கி பதிலளிக்க முடியும்.',
          timestamp: new Date(Date.now() - 3600000 * 23).toISOString(),
          language: 'Tamil (தமிழ்)',
          isBookmarked: true,
          provider: 'gemini-3.8-flash',
        },
      ],
    },
    {
      id: 'seed-conv-multimodal',
      title: 'Visual Scene & Document Analysis',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 7).toISOString(),
      language: 'English',
      preview: 'Explained architectural layout and detected multilingual signs in the captured photo...',
      messages: [
        {
          id: 'm3',
          role: 'user',
          content: 'Can you analyze this architecture image and read any Indic signs?',
          timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
          language: 'English',
        },
        {
          id: 'm4',
          role: 'assistant',
          content: 'I have analyzed the visual structures in the image.\n\nKey observations:\n1. **Style**: Contemporary Dravidian architectural influences mixed with modern glass facades.\n2. **Signage**: The bilingual sign board reads "நல்வரவு / Welcome" in clean typography.\n3. **Ambient Lighting**: High soft diffusion with purple and lavender dusk sky reflections.',
          timestamp: new Date(Date.now() - 3600000 * 7).toISOString(),
          language: 'English',
          isBookmarked: true,
          provider: 'gemini-3.8-flash',
        },
      ],
    },
    {
      id: 'seed-conv-tanglish',
      title: 'Tanglish Conversation - Travel Plan',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      language: 'Tanglish',
      preview: 'Ooty trip ku best time and travel tips...',
      messages: [
        {
          id: 'm5',
          role: 'user',
          content: 'SOLVA, Ooty ku weekend trip pogalamnu irukken. Epdi plan panlam?',
          timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
          language: 'Tanglish',
        },
        {
          id: 'm6',
          role: 'assistant',
          content: 'Super plan! Ooty ku weekend trip romba pleasant-ah irukkum.\n\n**Quick 2-day itinerary:**\n- **Day 1**: Morning Botanical Gardens, afternoon Pykara Lake boating & sunset at Doddabetta Peak.\n- **Day 2**: Nilgiri Mountain Railway (Toy train) experience, Tea Museum & Coonoor Sim\'s Park.\n\n*Tip:* Weather ipo chilly-ah irukkum, so warm jacket kandippa eduthutu ponga!',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          language: 'Tanglish',
          isBookmarked: false,
          provider: 'gemini-3.8-flash',
        },
      ],
    },
  ];
}

function ensureStorage(): string {
  const filePath = getStorageFilePath();
  const dirPath = path.dirname(filePath);

  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      const seed = getInitialSeed();
      fs.writeFileSync(filePath, JSON.stringify(seed, null, 2), 'utf-8');
      inMemoryConversations = seed;
    }
  } catch (err) {
    // If filesystem write fails, fallback to in-memory store
    if (!inMemoryConversations) {
      inMemoryConversations = getInitialSeed();
    }
  }
  return filePath;
}

export function getAllConversations(): StoredConversation[] {
  try {
    const filePath = ensureStorage();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(data);
      inMemoryConversations = parsed;
      return parsed;
    }
  } catch (err) {
    // fallback
  }
  if (!inMemoryConversations) {
    inMemoryConversations = getInitialSeed();
  }
  return inMemoryConversations;
}

export function saveConversation(conversation: StoredConversation): StoredConversation {
  const list = getAllConversations();
  const idx = list.findIndex((c) => c.id === conversation.id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...conversation, updatedAt: new Date().toISOString() };
  } else {
    list.unshift({ ...conversation, updatedAt: new Date().toISOString() });
  }

  inMemoryConversations = list;

  try {
    const filePath = ensureStorage();
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    // Safe fallback to inMemoryConversations
  }
  return conversation;
}

export function deleteConversation(id: string): boolean {
  const list = getAllConversations();
  const filtered = list.filter((c) => c.id !== id);
  inMemoryConversations = filtered;

  try {
    const filePath = ensureStorage();
    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), 'utf-8');
  } catch (err) {
    // Safe fallback
  }
  return true;
}

export function clearAllConversations(): boolean {
  inMemoryConversations = [];
  try {
    const filePath = ensureStorage();
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
  } catch (err) {
    // Safe fallback
  }
  return true;
}

export function toggleMessageBookmark(conversationId: string, messageId: string): boolean {
  const list = getAllConversations();
  const conv = list.find((c) => c.id === conversationId);
  if (!conv) return false;
  const msg = conv.messages.find((m) => m.id === messageId);
  if (!msg) return false;
  msg.isBookmarked = !msg.isBookmarked;
  inMemoryConversations = list;

  try {
    const filePath = ensureStorage();
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    // Safe fallback
  }
  return msg.isBookmarked;
}
