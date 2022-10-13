import React from 'react';

import AppBar from '@mui/material/AppBar';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';

import { CopyType, EmojiInfo } from '../types';
import { convertSlug, groupBy } from '../utils';
import { useFetchText } from '../hooks/useFetch';
import { useSnackbar } from '../hooks/useSnackbar';
import { EmojiCard } from '../components/EmojiCard';
import { Backdrop, CircularProgress, TextField } from '@mui/material';
import { Intersection } from '../components/Intersection';

export interface EmojiListGroupProps {
    onHandleCopy: (emojiInfo: EmojiInfo) => void
    onGetCopyText: (emojiInfo: EmojiInfo) => string | null
    group: EmojiInfo[]
}

export const EmojiListGroup: React.FC<EmojiListGroupProps> = (props: EmojiListGroupProps) => {
    const groupName = props.group[0].category;
    const groupNameSlug = convertSlug(groupName);
    return <div key={groupName}>
        <a href={'#' + groupNameSlug} style={{ textDecoration: 'none', color: 'unset' }}><h1 id={groupNameSlug}>{groupName}</h1></a>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {props.group.map(e =>
                <EmojiCard
                    key={e.emoji}
                    emojiInfo={e}
                    onClick={props.onHandleCopy}
                    onGetCopyText={props.onGetCopyText}
                />
            )}
        </div>
    </div>;
};

export interface EmojiListProps {
    onHandleCopy: (emojiInfo: EmojiInfo) => void
    onGetCopyText: (emojiInfo: EmojiInfo) => string | null
    emojiList: EmojiInfo[]
}

export const EmojiList: React.FC<EmojiListProps> = (props: EmojiListProps) => {
    const emojiGroups: EmojiInfo[][] = groupBy(props.emojiList, t => t.category);
    return <div>
        {emojiGroups.map(group => {
            return <Intersection height={500} key={group[0].category}>
                <EmojiListGroup
                    onHandleCopy={props.onHandleCopy}
                    onGetCopyText={props.onGetCopyText}
                    group={group}
                />
            </Intersection>;
        })}
    </div>;
};

export const ListPage: React.FC = () => {
    const [emojiList, { loading }] = useFetchText('./data/emoji.json', (text) => JSON.parse(text) as EmojiInfo[]);
    const { pushSnackbar } = useSnackbar();
    const [copyType, setCopyType] = React.useState<CopyType>('emoji');
    const [query, setQuery] = React.useState<string>('');

    const emojiListFiltered = query.length > 0
        ? emojiList?.filter(e => e.description.toLowerCase().includes(query)) ?? []
        : emojiList;

    const getCopyText = React.useCallback((emojiInfo: EmojiInfo) => {
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
    }, [copyType]);

    const handleCopy = React.useCallback((emojiInfo: EmojiInfo) => {
        const text = getCopyText(emojiInfo);
        if (text) {
            pushSnackbar({ message: `copied "${text}"`, severity: 'success' });
            navigator.clipboard.writeText(text);
        } else {
            console.error('failed to get copy text');
        }
    }, [getCopyText]);

    const convertLaTeXEmojiFullname = React.useCallback((emojiInfo: EmojiInfo) => {
        return convertSlug(emojiInfo.description);
    }, []);

    return <>
        <AppBar position="sticky">
            <Toolbar>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Emoji List
                        </Typography>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            color={'info'}
                            // fullWidth
                            label={<><SearchIcon fontSize='small' />Search</>}
                            variant="outlined"
                            value={query}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
                            sx={{ m: 1 }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
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
                    </div>
                </div>
            </Toolbar>
        </AppBar>
        {loading &&
            <Backdrop open={true}>
                <CircularProgress />
            </Backdrop>}
        {!loading &&
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ margin: 10, maxWidth: 1500, width: '80vw' }}>
                    {React.useMemo(() => <EmojiList
                        onHandleCopy={handleCopy}
                        onGetCopyText={getCopyText}
                        emojiList={emojiListFiltered || []}
                    />, [handleCopy, getCopyText, emojiListFiltered])}
                    <p>
                        This site is powered by <a href='https://github.com/github/gemoji/blob/master/db/emoji.json'>GitHub emoji list</a>
                    </p>
                </div>
            </div>
        }
    </>;
};
