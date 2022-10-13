import React from 'react';

import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import CheckIcon from '@mui/icons-material/Check';

import { EmojiInfo } from '../types';

export interface EmojiCardProps {
    emojiInfo: EmojiInfo
    onClick: (emojiInfo: EmojiInfo) => void
    onGetCopyText: (emojiInfo: EmojiInfo) => string | null
}

export const EmojiCard: React.FC<EmojiCardProps> = (props: EmojiCardProps) => {
    const [showBadge, setShowBadge] = React.useState<boolean>(false);
    const [hovering, setHovering] = React.useState<boolean>(false);

    const handleCopy = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        props.onClick(props.emojiInfo);
        setShowBadge(true);
        event.stopPropagation();
    };

    React.useEffect(() => {
        if (showBadge) {
            setTimeout(() => {
                setShowBadge(false);
            }, 1000);
        }
    }, [showBadge]);

    const content =
        <div style={{ fontSize: 50, cursor: 'pointer' }} onClick={handleCopy}>
            {props.emojiInfo.emoji}
        </div>;

    return <div style={{ width: 70 }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
    >
        {showBadge && <Badge badgeContent={<CheckIcon />} color='success'>
            {content}
        </Badge>}
        {(!showBadge && hovering) &&
            <Tooltip
                title={<code style={{ fontSize: '1.5em' }}>{props.onGetCopyText(props.emojiInfo)}</code>}
                arrow
                PopperProps={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, -10],
                            },
                        },
                    ],
                }}
            >
                {content}
            </Tooltip>
        }
        {(!showBadge && !hovering) && content}
    </div>;
};
