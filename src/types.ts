export interface EmojiInfo {
    emoji: string,
    description: string,
    category: string,
    aliases: string[],
    tags: string[],
    unicode_version: string,
    ios_version: string,
}

export type CopyType = 'emoji' | 'slug' | 'latex';
