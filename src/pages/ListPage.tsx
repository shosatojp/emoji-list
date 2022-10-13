import React from 'react';

import AppBar from '@mui/material/AppBar';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { CopyType, EmojiInfo } from '../types';
import { groupBy } from '../utils';
import { useFetchText } from '../hooks/useFetch';
import { useSnackbar } from '../hooks/useSnackbar';
import { EmojiCard } from '../components/EmojiCard';
import { Backdrop, CircularProgress } from '@mui/material';

export const ListPage: React.FC = () => {
    const [emojiJson, { loading }] = useFetchText('/data/emoji.json');
    const emojiList: EmojiInfo[] = emojiJson ? JSON.parse(emojiJson) : [];
    const emojiGroups: EmojiInfo[][] = groupBy(emojiList, t => t.category);
    const { pushSnackbar } = useSnackbar();
    const [copyType, setCopyType] = React.useState<CopyType>('emoji');

    const getCopyText = (emojiInfo: EmojiInfo) => {
        switch (copyType) {
            case 'emoji':
                return emojiInfo.emoji;
            case 'slug':
                return convertSlug(emojiInfo.description);
            case 'latex':
                return `\\emoji{${convertLaTeXEmojiFullname(emojiInfo)}}`;
            default:
                return null;
        }
    };

    const handleCopy = (emojiInfo: EmojiInfo) => {
        const text = getCopyText(emojiInfo);
        if (text) {
            pushSnackbar({ message: `copied "${text}"`, severity: 'success' });
            navigator.clipboard.writeText(text);
        } else {
            console.error('failed to get copy text');
        }
    };

    const convertSlug = (src: string) => {
        return src.toLowerCase().replace(/[:\-&] ?/g, '').replace(/ +/g, '-');
    };

    const convertLaTeXEmojiFullname = (emojiInfo: EmojiInfo) => {
        return convertSlug(emojiInfo.description);
    };

    return <>
        <AppBar position="sticky">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Emoji List
                </Typography>
                <div style={{ flexGrow: 1 }}></div>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Copy Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        value={copyType}
                        label="copy type"
                        onChange={(event: SelectChangeEvent) => {
                            setCopyType(event.target.value as CopyType);
                        }}
                    >
                        <MenuItem value={'emoji'} title='Emoji' >Emoji (😀)</MenuItem>
                        <MenuItem value={'slug'}>Slug (<code>grinning-face</code>)</MenuItem>
                        <MenuItem value={'latex'}>LaTeX (<code>\emoji&#123;grinning-face&#125;)</code></MenuItem>
                    </Select>
                </FormControl>
            </Toolbar>
        </AppBar>
        {loading
            ? <Backdrop open={true}>
                <CircularProgress />
            </Backdrop>
            : emojiGroups.map(group => {
                const groupName = group[0].category;
                const groupNameSlug = convertSlug(groupName);
                return <div key={groupName} style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ margin: 10, maxWidth: 1500 }}>
                        <a href={'#' + groupNameSlug} style={{ textDecoration: 'none', color: 'unset' }}><h1 id={groupNameSlug}>{groupName}</h1></a>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {group.map(e =>
                                <EmojiCard
                                    key={e.emoji}
                                    emojiInfo={e}
                                    onClick={handleCopy}
                                    onGetCopyText={getCopyText}
                                />
                            )}
                        </div>
                    </div>
                </div>;
            })}

        <p>
            This site is powered by <a href='https://github.com/github/gemoji/blob/master/db/emoji.json'>GitHub emoji list</a>
        </p>
    </>;
};
